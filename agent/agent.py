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

    # perform an api call to get the information about what we had our last conversation on

    metadata = participant.metadata
    # print("before parsing -------------------------",metadata)
    metadata = json.loads(metadata)
    # print("after parsing -------------------------",metadata)
    # subject = metadata.get("subject")
    # topic = metadata.get("topic")
    print("user_metadata",metadata)
    subject_name = metadata.get("subject").get("subject_name")
    topic_name = metadata.get("topic_name")
    print("subject -------------------------",subject_name)
    print("topic -------------------------",topic_name)
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            f"""You are a voice assistant created for helping students with topics they are struggling with. Your interface with users will be voice. 
            You should use short and concise responses, and avoiding usage of unpronouncable punctuation. 
            The current subject is {subject_name} and the current topic is {topic_name}.
            After explaining the current topic to the user ask them if they want to create an assignment for themselves.
            If the user says yes, ask them to confirm by saying "yes, create an assignment" or "no, I don't want to create an assignment".
            Strictly provide answers to the question regarding this context only if user asks anything else just say "I can't provide you any information on that".
            """
        ),
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
            model="llama3-8b-8192"
        ),
        tts=deepgram.TTS(
            model= "aura-asteria-en"
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

    await agent.say("Hey, how can I help you today?", allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )