import React, { useState } from "react";
import { Clock,FileText } from "lucide-react";
import TopicItem from "./TopicItem";

const SubjectItem = ({
  subject,
  handleTalkToAI,
  handleContinueLearning,
  isLoading,
}) => {
  // Convert string 'true'/'false' to boolean if needed
  const isCompleted =
    subject.is_completed === "true" || subject.is_completed === true;
  const isStarted =
    subject.is_started === "true" || subject.is_started === true;
  // const [isColapsed, setColapsed] = useState(!(subject.is_started === "true"));
  return (
    <div className="pl-6 rounded-lg  shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mx-8 overflow-hidden ml-18 relative md:flex-row md:items-start md:justify-between">

      {/* Subject content */}
      <div className="pt-3 border-gray-200">
        <div className="flex pb-3 items-center border-b-1 border-gray-200 mr-8  justify-between">
          <div className="">
            <div className="flex">
              <h3 className="text-md font-medium text-gray-900">
                {subject.subject_name}
              </h3>
              <div
                className={`ml-2 px-2 flex justify-center items-center  text-xs rounded-full ${
                  isCompleted
                    ? ""
                    : isStarted
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isCompleted
                  ? ""
                  : isStarted
                  ? "In Progress"
                  : "Not Started"}
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Estimated {subject.estimated_hours} hours</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {subject.is_completed == "true" ? (
              <div className="flex space-x-3 p-2 px-4 mr-4 bg-green-100 text-green-800 rounded-full ">
                Completed
              </div>
            ) : (
              <div className="flex space-x-3 pr-4">
                <button
                  disabled={subject.is_started=="false"}
                  onClick={handleTalkToAI}
                  className="px-4 py-[0.4rem] disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-400 disabled:cursor-not-allowed text-sm font-medium text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-md flex items-center justify-center"
                >
                  Learn Next Topic
                </button>
                <button
                  onClick={handleContinueLearning}
                  disabled={isLoading || subject.is_started==="false"}
                  className={`px-4 py-2 w-36 text-sm font-medium text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100 ${
                    isLoading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } rounded-md flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    "Take Next Quiz"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mb-4  ml-4 border-gray-200">
          <div className="mt-3 space-y-2 ">
            {subject.topics.map((topic, idx) => (
              <TopicItem key={idx} topic={topic} />
            ))}
          </div>
          {/* Resources */}
          <div>
            <div className="mt-4">
              <p className="text-sm flex font-medium text-gray-700">
               <FileText className="h-4 w-4 mr-1"/> Official Documentation:
              </p>
              <div className="mt-1 space-y-1">
                {subject?.official_docs?.map((resource, index) => (
                  <a
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 block"
                  >
                    {subject.subject_name.slice(0, 20)}...
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectItem;
