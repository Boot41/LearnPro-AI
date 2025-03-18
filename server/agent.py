import asyncio
import logging
import os
import json
from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
    metrics,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import deepgram, openai, silero
from ChatbotContext import SubjectContext, KTRecieveContext, KTGiveContext
from utils.voice_bot_utils import get_kt_info_for_user

load_dotenv()
logger = logging.getLogger("voice-assistant")
load_dotenv(dotenv_path=".env")

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):

    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # wait for the first participant to connect
    participant = await ctx.wait_for_participant()

    metadata = participant.metadata
    metadata = json.loads(metadata)

    bot_type = metadata["bot_type"]
    greeting = ""
    if bot_type == "subject":
        context = SubjectContext(metadata)
        greeting = "Hey, how can I help you today?"
    elif bot_type == "kt_recieve":
        context = KTRecieveContext(metadata)
        greeting = "Hey, We will be conducting a in depth knowledge transfer today. Let me know when you want to start."
    elif bot_type == "kt_give":
        greeting = "Hey, We will be conducting a in depth knowledge transfer today. Let me know when you want to start."
        context = KTGiveContext(metadata)
    initial_context_prompt = await context.get_initial_context()
    initial_ctx = llm.ChatContext().append(
        role="system",
        text= initial_context_prompt,
    )
    logger.info(f"metadata : {metadata}")
    logger.info(f"starting voice assistant for participant {participant.identity}")

    dg_model = "nova-3-general"
    if participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP:
        # use a model optimized for telephony
        dg_model = "nova-2-phonecall"

    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(model=dg_model),
        llm = openai.LLM.with_groq(
            model="gemma2-9b-it"
        ),
        tts=deepgram.TTS(
            model= "aura-zeus-en"
        ),
        chat_ctx=initial_ctx,
    )

    agent.start(ctx.room, participant)

    usage_collector = metrics.UsageCollector()

    @agent.on("metrics_collected")
    def _on_metrics_collected(mtrcs: metrics.AgentMetrics):
        metrics.log_metrics(mtrcs)
        usage_collector.collect(mtrcs)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: ${summary}")

    ctx.add_shutdown_callback(log_usage)

    # listen to incoming chat messages, only required if you'd like the agent to
    # answer incoming messages from Chat
    chat = rtc.ChatManager(ctx.room)

    async def answer_from_text(txt: str):
        chat_ctx = agent.chat_ctx.copy()
        chat_ctx.append(role="user", text=txt)
        stream = agent.llm.chat(chat_ctx=chat_ctx)
        await agent.say(stream)

    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if msg.message:
            asyncio.create_task(answer_from_text(msg.message))

    await agent.say(greeting, allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )