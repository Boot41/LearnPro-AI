import { useVoiceAssistant, BarVisualizer } from "@livekit/components-react";
import { useEffect, useState} from "react";

import { 
  RoomEvent, 
} from "livekit-client";
import { useMaybeRoomContext } from "@livekit/components-react";

export default function SimpleVoiceAssistant(props) {
  const { state, audioTrack } = useVoiceAssistant();
  const room = useMaybeRoomContext();
  const [transcriptions, setTranscriptions] = useState({});

//   useEffect(() => {
//   console.log(room)
//   if (!room) {
//     return;
//   }

//   const updateTranscriptions = (
//     segments,
//     participant,
//     publication
//   ) => {
//     setTranscriptions((prev) => {
//       const newTranscriptions = { ...prev };
//       for (const segment of segments) {
//         newTranscriptions[segment.id] = segment;
//       }
//       return newTranscriptions;
//     });
//   };

//   room.on(RoomEvent.TranscriptionReceived, updateTranscriptions);
//   return () => {
//     room.off(RoomEvent.TranscriptionReceived, updateTranscriptions);
//   };
//   }, [room]);

//   useEffect(() => {
//     console.log(transcriptions) 
//     const recived_transcriptions = Object.values(transcriptions)?.map((transcription) => {
//       console.log(transcription)
//       transcription = transcription?.text?.replace(/[^a-zA-Z0-9]/g, '');
//       return transcription?.toLowerCase()
//     })
//     console.log(recived_transcriptions)
//     localStorage.setItem('recived_transcriptions', JSON.stringify(recived_transcriptions))
//   },[transcriptions])

  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);
  return (
    <div className="h-[300px] max-w-[90vw] mx-auto">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}
