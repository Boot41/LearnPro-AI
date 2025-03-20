import React, { useEffect, useState } from "react";
import { getGiveGitHubKt, getTakeGitHubKt, } from "../services/gitHubKtService";
import { getLKitTokenGiveGitHubKt, getLKitTokenTakeGitHubKt } from "../services/conversationService";
import { useNavigate } from "react-router-dom";
import classroom from "../assets/classroom.png"; 
import teachingIcon from "../assets/teaching.png";

export const GitHubKnowledgeTransfer = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [giveKtInfo, setGiveKtInfo] = useState([]);
  const [takeKtInfo, setTakeKtInfo] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const giveKtData = await getGiveGitHubKt();
        const takeKtData = await getTakeGitHubKt();
        
        console.log("give kt", giveKtData);
        console.log("take kt", takeKtData);
        
        setGiveKtInfo(giveKtData);
        setTakeKtInfo(takeKtData);

      } catch (error) {
        console.error("Error fetching KT data:", error);
        setError("Failed to load Knowledge Transfer data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleTakeGitHubKt = async () => {
    const livekit_creds = await getLKitTokenTakeGitHubKt();
    localStorage.setItem("livekit_creds", JSON.stringify(livekit_creds));
    console.log("handle take github kt");
    navigate("/voice-ai");
  };

  const handleGiveGitHubKt = async () => {
    const livekit_creds = await getLKitTokenGiveGitHubKt();
    localStorage.setItem("livekit_creds", JSON.stringify(livekit_creds));
    console.log("handle give github kt");
    navigate("/voice-ai");
  };


  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  
  return (
    <div className="flex flex-col items-center mt-5 space-y-10 h-[80vh]">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-[80%]">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg w-[80%] shadow p-6">
        {giveKtInfo.length > 0 ? (
          <div className="flex items-start">
            <div className="flex-shrink-0 w-26 h-26 mt-2 rounded mr-8 flex items-center justify-center">
              <img src={teachingIcon} alt="Give GitHub Knowledge Transfer" className="w-20 h-20" />
            </div>

            <div className="flex-grow flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Give GitHub Knowledge Transfer
                </span>
                <div
                  className={`px-4 py-2 rounded-full ${
                    giveKtInfo[0]?.has_kt_info 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {giveKtInfo[0]?.has_kt_info ? "KT Info Provided" : "Pending KT Info"}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex mt-4 space-x-8">
                  <div>
                    <div className="truncate max-w-xs">{giveKtInfo[0]?.repo_url}</div>
                    <span className="text-gray-500 text-xs">Repository</span>
                  </div>
                  <div className="h-[4rem] w-[1px] bg-gray-300" />
                  <div>
                    <div>{giveKtInfo[0]?.username}</div>
                    <span className="text-gray-500 text-xs">GitHub Username</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleGiveGitHubKt()}
                    className={`px-4 h-10 self-end py-2 w-36 text-sm font-medium text-white 
                      bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center justify-center`}
                  >
                    {giveKtInfo[0]?.has_kt_info ? "Update KT Info" : "Add KT Info"}
                  </button>
                </div>
              </div>
              
              {/* {giveKtInfo.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Other Assigned Commits</h3>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={giveKtInfo[0]?.github_commit_id || ""}
                    onChange={(e) => {
                      const selected = giveKtInfo.find(kt => kt.github_commit_id === e.target.value);
                      setSelectedGiveKt(selected);
                    }}
                  >
                    {giveKtInfo.map((kt) => (
                      <option key={kt.github_commit_id} value={kt.github_commit_id}>
                        {kt.repo_url} ({kt.has_kt_info ? "Completed" : "Pending"})
                      </option>
                    ))}
                  </select>
                </div>
              )} */}
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <p className="text-gray-500 ">
              You don't have any GitHub commits assigned for knowledge transfer.
            </p>
          </div>
        )}
      </div>
      
      {/* Take GitHub KT Section */}
      <div className="bg-white rounded-lg w-[80%] shadow p-6">
        {takeKtInfo.length > 0 ? (
          <div className="flex items-start">
            <div className="flex-shrink-0 w-26 h-26 mt-2 rounded mr-8 flex items-center justify-center">
              <img src={classroom} alt="Take GitHub Knowledge Transfer" className="w-20 h-20" />
            </div>

            <div className="flex-grow flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Take GitHub Knowledge Transfer
                </span>
                <div
                  className={`px-4 py-2 rounded-full ${
                    takeKtInfo[0]?.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-400"
                  }`}
                >
                  {takeKtInfo[0]?.status}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex mt-4 space-x-8">
                  <div>
                    <div className="truncate max-w-xs">{takeKtInfo[0]?.repo_url}</div>
                    <span className="text-gray-500 text-xs">Repository</span>
                  </div>
                  <div className="h-[4rem] w-[1px] bg-gray-300" />
                  <div>
                    <div>{takeKtInfo[0]?.username}</div>
                    <span className="text-gray-500 text-xs">Taking KT from</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleTakeGitHubKt()}
                      className={`px-4 h-10 self-end py-2 w-36 text-sm font-medium text-white 
                        bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center justify-center`}
                    >
                      Take KT
                    </button>
                </div>
              </div>
              
              {takeKtInfo.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Other Assigned Commits</h3>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={takeKtInfo[0]?.take_kt_id || ""}
                    onChange={(e) => {
                      const selected = takeKtInfo.find(kt => kt.take_kt_id === parseInt(e.target.value));
                      setSelectedTakeKt(selected);
                    }}
                  >
                    {takeKtInfo.map((kt) => (
                      <option key={kt.take_kt_id} value={kt.take_kt_id}>
                        {kt.repo_url} ({kt.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <p className="text-gray-500 ">
              No GitHub KT sessions have been assigned to you yet.
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default GitHubKnowledgeTransfer;
