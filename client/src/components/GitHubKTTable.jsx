import React from 'react';
import { Trash2 } from "lucide-react";

const GitHubKTTable = ({ ktInfo, onDelete, isDeleting, deletingId, tableType }) => {
  const deleteHandler = (kt) => {
    if (tableType === "give") {
      console.log(kt.give_kt_new_id)
      onDelete(kt.give_kt_new_id);
    } else {
      onDelete(kt.take_kt_id);
    }
  };

  return (
    <div>
      <div className={`grid ${tableType === "take" ? "grid-cols-4" : "grid-cols-4"} text-center  border-b-1 border-gray-200`}>
        <div className="px-6 py-3 col-span-1  text-xs font-medium text-gray-500 uppercase tracking-wider">
          GitHub Username
        </div>
        <div className="px-0 py-3 col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Repository URL
        </div>
        <div className="px-6 py-3 col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Employee Email
        </div>
        {tableType === "take" && (
          <div className="px-6 py-3 col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </div>
        )}
        {tableType !== "take" && (
          <div className="px-6 py-3 col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </div>
        )}
      </div>
      
      <div className="bg-white text-md divide-y divide-gray-200 flex flex-col text-center">
        {ktInfo.map((kt) => (
          <div key={tableType === "give" ? kt.github_commit_id : kt.take_kt_id} className={`grid ${tableType === "take" ? "grid-cols-4" : "grid-cols-4"}`}>
            <div className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {kt.username}
              </div>
            </div>
            <div className="py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{kt.repo_url}</div>
            </div>
            <div className="py-4 mx-auto px-6 whitespace-nowrap">
              <div className="text-sm text-gray-500 w-48">
                {kt.employee_email}
              </div>
            </div>
            
            {tableType === "take" && (
              <>
                <div className="px-6 py-4 items-center justify-center flex space-x-2">
                  <span
                    className={`px-2 text-sm rounded-full border-2 ${
                      kt.status === "Completed"
                        ? "bg-green-200 border-green-500"
                        : kt.status === "Pending"
                          ? "bg-yellow-200 border-yellow-500"
                          : "bg-red-200 border-red-500"
                    }`}
                  >
                    {kt.status}
                  </span>
                  {onDelete && (
                    <button
                      onClick={() => deleteHandler(kt)}
                      disabled={isDeleting && deletingId === kt.take_kt_id}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                      title="Delete GitHub KT assignment"
                    >
                      {isDeleting && deletingId === kt.take_kt_id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
            
            {tableType !== "take" && (
              <div className="px-6 py-4 items-center justify-center flex space-x-2">
                {onDelete && (
                  <button
                    onClick={() => deleteHandler(kt)}
                    disabled={isDeleting && deletingId === kt.github_commit_id}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    title="Delete GitHub KT"
                  >
                    {isDeleting && deletingId === kt.github_commit_id ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHubKTTable;
