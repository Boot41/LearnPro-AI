/**
 * LiveKitElement component integrates with LiveKit to provide a voice assistant interface.
 * 
 * Props:
 * - connectionDetails: Object containing connection details like participantToken and serverUrl.
 * - updateConnectionDetails: Function to update the connection details, typically used to disconnect.
 * 
 * The component renders a LiveKitRoom with various child components for audio rendering,
 * voice assistant control, and notifications. It manages the agent's state and handles
 * disconnections through provided handlers.
 */
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import CustomControlBar from "./CustomControlBar";
import { ControlBar } from "@livekit/components-react";
import "@livekit/components-styles";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";
import { NoAgentNotification } from "./NoAgentNotification";
import { saveGivenKtTranscripts } from "../../services/ktService";
export default function LiveKitElement({connectionDetails,updateConnectionDetails}) {
  const [agentState, setAgentState] = useState("disconnected");
  const navigate = useNavigate();

  const saveTranscripts = async () => {
    console.log("save transcripts")
    // if (connectionDetails?.conversation_type=="bot_takes_kt_from_employee"){
    //   const give_kt_id = connectionDetails.give_kt_id
    //   const transcriptions = JSON.parse(localStorage.getItem("recived_transcriptions"))
    //   const parsed_transcripts = transcriptions.map((transcipt)=>{
    //     return transcipt.text
    //   })
    //   await saveGivenKtTranscripts(parsed_transcripts,give_kt_id)
    //   if (!transcriptions){
    //     console.error("No transcriptions found")
    //     return 
    //   }

    // }
    updateConnectionDetails(undefined);
  }

  const disconnectHandler = async () => {
    navigate("/knowledge_transfer")
    updateConnectionDetails(undefined);
    // check the type of conversation (give kt or take kt or subject_learning)
    // if the conversation is give kt pull transcriptions from the local storage and request the backend to digest and update the kt_info

  };
  return (
    <div
      data-lk-theme="default"
      className="h-full grid content-center bg-[var(--lk-bg)]"
    >
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        onDisconnected={disconnectHandler}
        className="grid grid-rows-[2fr_1fr] items-center"
      >
        <SimpleVoiceAssistant onStateChange={setAgentState} />
        <CustomControlBar show_quite_quit={connectionDetails?.conversation_type==="bot_takes_kt_from_employee"} saveTranscripts={saveTranscripts} agentState={agentState} />
        <RoomAudioRenderer/>
        <NoAgentNotification state={agentState} />
      </LiveKitRoom>
    </div>
  );
}