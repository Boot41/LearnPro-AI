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
export default function LiveKitElement({connectionDetails,updateConnectionDetails}) {
  const [agentState, setAgentState] = useState("disconnected");
  const navigate = useNavigate();
  console.log(connectionDetails)
  const disconnectHandler = async () => {
    navigate("/learning-path")
    updateConnectionDetails(undefined);
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