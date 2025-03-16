import React, { useEffect, useState } from "react";
import { getGiveKt, getReceiveKt } from "../services/ktService";
import { useNavigate } from "react-router-dom";
import { getLKitTokenGiveKt,getLKitTokenTakeKt } from "../services/conversationService";
export const KnowledgeTransfer = () => {
  const navigate = useNavigate()
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
    const livekit_creds = await getLKitTokenGiveKt()
    localStorage.setItem("livekit_creds",JSON.stringify(livekit_creds))
    console.log("handle give kt");

    navigate("/voice-ai")
  };
  const handleTakeKt = async () => {
    livekit_creds = await getLKitTokenTakeKt()
    localStorage.setItem("livekit_creds",livekit_creds)
    console.log("handle take kt");
    navigate("/voice-ai")
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        {giveKtInfo ? (
          <div>
            <span>Give Knowledge Transfer</span>
            <div className="grid grid-cols-4 place-items-start md:items-center md:justify-between">
              <div className="mt-4 md:mt-0">{giveKtInfo.project_name}</div>
              <div className="mt-4 md:mt-0">{giveKtInfo.project_id}</div>
              <div className="mt-4 md:mt-0">{giveKtInfo.status}</div>
              <button
                disabled={giveKtInfo.status == "Completed"}
                onClick={handleGiveKt}
                className={`px-4 py-2 w-36 place-self-end text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } rounded-md flex items-center justify-center`}
              >
                Give K.T
              </button>
            </div>
          </div>
        ) : (
          <div>You do not have any assigned projects to knowledge transfer</div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {takeKtInfo ? (
          <div>
            <span>Take Knowledge Transfer</span>
            <div className="grid grid-cols-4 place-items-start md:items-center md:justify-between">
              <div className="mt-4 md:mt-0">{takeKtInfo[0].project_name}</div>
              <div className="mt-4 md:mt-0">{takeKtInfo[0].project_id}</div>
              <div className="mt-4 md:mt-0">{takeKtInfo[0].status}</div>
              <button
                disabled={takeKtInfo[0].status == "Completed"}
                onClick={handleTakeKt}
                className={`px-4 place-self-end py-2 w-36 text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } rounded-md flex items-center justify-center`}
              >
                Take K.T
              </button>
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
