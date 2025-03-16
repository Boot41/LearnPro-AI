import React from "react";
import SubjectItem from "./SubjectItem";
import { getConversationToken } from "../../services/conversationService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
const LearningTimeline = ({
  path,
  isLoading,
  loadingSubjectId,
  handleContinueLearning,
}) => {
  const navigate = useNavigate();

  const { user } = useAuth()
  const handleTalkToAI = async () => {
    const email = user.email;
    // console.log(user,email)
    const livekit_creds = await getConversationToken(email);
    localStorage.setItem('livekit_creds', JSON.stringify(livekit_creds));
    navigate('/voice-ai');
  };
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-300 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Learning Timeline
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Estimated {path.total_estimated_hours} hours to complete
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline items */}
        <div className="flex flex-col space-y-2 my-4 mb-8">
          <div className="absolute mt-8 left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          {path.subjects.map((subject, index) =>{
            console.log(subject)
            return (
            <div className="" id={index}>
              <div
                className={`relative left-[25px] top-8 w-4 h-4 rounded-full border-2 ${
                  subject.is_completed == 'true'
                    ? "bg-green-500 border-green-500"
                    : subject.is_started == 'true'
                    ? "bg-white border-indigo-500"
                    : "bg-white border-gray-300"
                }`}
              ></div>
              <SubjectItem
                key={subject.id || index}
                subject={subject}
                handleTalkToAI={handleTalkToAI}
                handleContinueLearning={handleContinueLearning}
                isLoading={isLoading}
                loadingSubjectId={loadingSubjectId}
              />
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default LearningTimeline;
