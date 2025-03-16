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
import "@livekit/components-styles";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";
import { NoAgentNotification } from "./NoAgentNotification";
import { saveGivenKtTranscripts } from "../../services/ktService";
export default function LiveKitElement({connectionDetails,updateConnectionDetails}) {
  const [agentState, setAgentState] = useState("disconnected");
  const navigate = useNavigate();
  console.log(connectionDetails)
  const disconnectHandler = async () => {
    navigate("/learning-path")
    if (connectionDetails?.conversation_type=="bot_takes_kt_from_employee"){
      console.log("here we go")
      const give_kt_id = connectionDetails.give_kt_id
      const transcriptions = localStorage.getItem("recived_transcriptions")
      await saveGivenKtTranscripts(transcriptions,give_kt_id)
      if (!transcriptions){
        console.error("No transcriptions found")
        return 
      }

    }
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
        <VoiceAssistantControlBar  agentState={agentState} />
        <RoomAudioRenderer/>
        <NoAgentNotification state={agentState} />
      </LiveKitRoom>
    </div>
  );
}