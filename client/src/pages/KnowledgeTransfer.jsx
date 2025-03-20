import React, { useEffect, useState } from "react";
import { getGiveKt, getReceiveKt } from "../services/ktService";
import { useNavigate } from "react-router-dom";
import teachingIcon from "../assets/teaching.png";
import classIcon from "../assets/classroom.png";
import {
  getLKitTokenGiveKt,
  getLKitTokenTakeKt,
} from "../services/conversationService";
export const KnowledgeTransfer = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [giveKtInfo, setGiveKtInfo] = useState();
  const [takeKtInfo, setTakeKtInfo] = useState();
  useEffect(() => {
    async function getAssignedGiveKt() {
      try {
        const data = await getGiveKt();
        setGiveKtInfo(data);
        console.log("give kt", data);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAssignedTakeKt() {
      try {
        const data = await getReceiveKt();
        console.log("recieve kt", data);
        setTakeKtInfo(data);
      } catch (error) {
        console.log(error);
      }
    }

    getAssignedGiveKt();
    getAssignedTakeKt();
  }, []);
  const handleGiveKt = async () => {
    const livekit_creds = await getLKitTokenGiveKt();
    localStorage.setItem("livekit_creds", JSON.stringify(livekit_creds));
    console.log("handle give kt");

    navigate("/voice-ai");
  };
  const handleTakeKt = async () => {
    const livekit_creds = await getLKitTokenTakeKt();
    localStorage.setItem("livekit_creds", JSON.stringify(livekit_creds));
    console.log("handle take kt");
    navigate("/voice-ai");
  };

  return (
    <div className="flex flex-col items-center mt-5 space-y-10 h-[80vh]">
      <div className="bg-white rounded-lg w-[80%] shadow p-6">
        {giveKtInfo && Object.keys(giveKtInfo).length > 0 ? (
          <div className="flex items-start">
            <div className="flex-shrink-0 w-26 h-26 mt-2 rounded mr-8 flex items-center justify-center">
              <img src={teachingIcon} alt="Give Knowledge Transfer" />
            </div>

            <div className="flex-grow flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Give Knowledge Transfer
                </span>
                <div
                  className={`px-4 py-2 rounded-full ${
                    giveKtInfo?.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-400"
                  }`}
                >
                  {giveKtInfo?.status}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex mt-4 space-x-8">
                  <div>
                    <div>{giveKtInfo?.project_name}</div>
                    <span className="text-gray-500 text-xs">Project Name</span>
                  </div>
                  <div className="h-[4rem] w-[1px] bg-gray-300" />
                  <div>
                    <div>{giveKtInfo?.project_id}</div>
                    <span className="text-gray-500 text-xs">Project ID</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    disabled={giveKtInfo?.status === "Completed"}
                    onClick={handleGiveKt}
                    className={`px-4 h-10 self-end py-2 w-36 text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100 ${
                      isLoading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } rounded-md flex items-center justify-center`}
                  >
                    Give K.T
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>You do not have any assigned projects to knowledge transfer</div>
        )}
      </div>
      <div className="bg-white rounded-lg w-[80%] shadow p-6">
        {takeKtInfo && takeKtInfo?.length > 0 ? (
          <div className="flex items-start">
            {/* Left side: placeholder box for SVG */}
            <div className="flex-shrink-0 w-26 h-26 mt-3 rounded mr-8 flex items-center justify-center">
              <img src={classIcon} alt="Take Knowledge Transfer" />
            </div>

            {/* Right side: main content */}
            <div className="flex-grow flex flex-col">
              {/* Top row: Title & Status */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Take Knowledge Transfer
                </span>
                <div
                  className={`px-4 py-2 rounded-full ${
                    takeKtInfo?.[0]?.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-400"
                  }`}
                >
                  {takeKtInfo?.[0]?.status}
                </div>
              </div>

              {/* Middle row: Project info */}
              <div className="flex justify-between">
                <div className="flex mt-4 space-x-8">
                  <div>
                    <div>{takeKtInfo?.[0]?.project_name}</div>
                    <span className="text-gray-500 text-xs">Project Name</span>
                  </div>

                  <div className="h-[4rem] w-[1px] bg-gray-300" />

                  <div>
                    <div>{takeKtInfo?.[0]?.project_id}</div>
                    <span className="text-gray-500 text-xs">Project ID</span>
                  </div>
                </div>

                {/* Bottom row: Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    disabled={takeKtInfo?.[0]?.status === "Completed"}
                    onClick={handleTakeKt}
                    className={`px-4 h-10 self-end py-2 w-36 text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100 ${
                      isLoading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } rounded-md flex items-center justify-center`}
                  >
                    Take K.T
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            You do not have any assigned projects to receive knowledge transfer
          </div>
        )}
      </div>
    </div>
  );
};
export default KnowledgeTransfer;
