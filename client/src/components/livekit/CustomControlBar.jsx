import React, { useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { Mic, MicOff, Video, VideoOff, ScreenShare, ScreenShareOff, PhoneOff } from "lucide-react";
import { MediaDeviceMenu } from "@livekit/components-react";
import { Track } from "livekit-client";
import { TrackToggle } from "@livekit/components-react";
import { usePersistentUserChoices } from "@livekit/components-react";

const CustomControlBar = ({show_quite_quit, saveTranscripts}) => {

  const {
    saveAudioInputEnabled,
    saveAudioInputDeviceId,
  } = usePersistentUserChoices({ preventSave: false });

  const microphoneOnChange = React.useCallback(
    (enabled, isUserInitiated) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );
  const variation = 'verbose';
  const showIcon = React.useMemo(
    () => variation === 'minimal' || variation === 'verbose',
    [variation],
  );
  const showText = React.useMemo(
    () => variation === 'textOnly' || variation === 'verbose',
    [variation],
  );

  const room = useRoomContext();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);


  const leaveQuietly = () => {
    // Disconnect without any API call
    room.disconnect();
  };

  const endCall = async () => {
    try {
      // Call your API endpoint before disconnecting
      await saveTranscripts();
      room.disconnect();
    } catch (error) {
      console.error("Failed to notify server:", error);
    }
  };

  return (
    <div className=" flex items-center space-x-4 relative w-fit bottom-4 left-1/2 transform  -translate-x-1/2 bg-zinc-800 rounded-xl p-3 shadow-lg">
      <div className="lk-button-group w-[12rem]">
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon={showIcon}
            onChange={microphoneOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
          >
            {showText && 'Microphone'}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) =>
                saveAudioInputDeviceId(deviceId ?? 'default')
              }
            />
          </div>
        </div>
    {show_quite_quit && (
      <button className="flex justify-center items-center w-[12rem] gap-2 hover:bg-zinc-700 rounded-2xl p-2 px-4" onClick={leaveQuietly}>
        <PhoneOff className="text-gray-400" /> <span>Leave Quietly</span>
      </button>
    )} 
      <button className="flex justify-center items-center w-[12rem] gap-2 hover:bg-zinc-700 rounded-2xl p-2 px-4" onClick={endCall}>
        <PhoneOff className="text-red-500" /> <span>End Call</span>
      </button>
    </div>
  );
};

export default CustomControlBar;







// import { MediaDeviceMenu } from "@livekit/components-react";
// import { DisconnectButton } from "@livekit/components-react";
// import { TrackToggle } from "@livekit/components-react";
// import { useLocalParticipant, useLocalParticipantPermissions, usePersistentUserChoices } from "@livekit/components-react";
// import { mergeProps } from "@livekit/components-react";
// import { BarVisualizer } from '@livekit/components-react';

// export function VoiceAssistantControlBar({
//   controls,
//   saveUserChoices = true,
//   onDeviceError,
//   ...props
// }) {
//   const visibleControls = { leave: true, microphone: true, ...controls };

//   const localPermissions = useLocalParticipantPermissions();
//   const { microphoneTrack, localParticipant } = useLocalParticipant();

//   const micTrackRef = React.useMemo(() => {
//     return {
//       participant: localParticipant,
//       source: Track.Source.Microphone,
//       publication: microphoneTrack,
//     };
//   }, [localParticipant, microphoneTrack]);

//   if (!localPermissions) {
//     visibleControls.microphone = false;
//   } else {
//     visibleControls.microphone ??= localPermissions.canPublish;
//   }

//   const htmlProps = mergeProps({ className: 'lk-agent-control-bar' }, props);

//   const { saveAudioInputEnabled, saveAudioInputDeviceId } = usePersistentUserChoices({
//     preventSave: !saveUserChoices,
//   });

//   const microphoneOnChange = React.useCallback(
//     (enabled, isUserInitiated) => {
//       if (isUserInitiated) {
//         saveAudioInputEnabled(enabled);
//       }
//     },
//     [saveAudioInputEnabled],
//   );

//   return (
//     <div {...htmlProps}>
//       {visibleControls.microphone && (
//         <div className="lk-button-group">
//           <TrackToggle
//             source={Track.Source.Microphone}
//             showIcon={true}
//             onChange={microphoneOnChange}
//             onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
//           >
//             <BarVisualizer trackRef={micTrackRef} barCount={7} options={{ minHeight: 5 }} />
//           </TrackToggle>
//           <div className="lk-button-group-menu">
//             <MediaDeviceMenu
//               kind="audioinput"
//               onActiveDeviceChange={(_kind, deviceId) =>
//                 saveAudioInputDeviceId(deviceId ?? 'default')
//               }
//             />
//           </div>
//         </div>
//       )}

//       {visibleControls.leave && <DisconnectButton>{'Disconnect'}</DisconnectButton>}
//       <StartMediaButton />
//     </div>
//   );
// }