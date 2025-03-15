import React from 'react';
import { Trash2 } from "lucide-react";

const KTTable = ({ ktInfo, onDelete, isDeleting, deletingId, tableType }) => {
  const deleteHandler = (kt) => {
    console.log(kt)
    if (tableType === "give") {
      onDelete(kt.project_id);
    } else {
      onDelete(kt.take_kt_id);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-4 border-b-1 border-gray-200">
        <div className="px-6 py-3 col-span-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Project ID
        </div>
        <div className="px-0 py-3 col-span-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Project
        </div>
        <div className="px-6 py-3 col-span-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Employee Email
        </div>
        <div className="px-6 py-3 col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </div>
      </div>
      <div className="bg-white text-md divide-y divide-gray-200 flex flex-col">
        {ktInfo.map((kt) => (
          <div key={kt.project_id} className="grid grid-cols-4">
            <div className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {kt.project_id}
              </div>
            </div>
            <div className=" py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{kt.project_name}</div>
            </div>
            <div className="py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500 w-48 ">
                {kt.employee_email}
              </div>
            </div>
            <div className="px-6 py-4 items-center justify-center flex space-x-2 ">
              <span
                className={`px-2 text-sm rounded-full border-2 ${
                  kt.status === "Completed"
                    ? "bg-green-200 border-green-500"
                    : kt.status === "Pending"
                      ? "bg-yellow-200 border-yellow-500"
                      : "bg-red-200 border-red-500"
                }`}
              >
                {kt?.status}
              </span>
              {onDelete && (
                <button
                  onClick={()=> deleteHandler(kt)}
                  disabled={isDeleting && deletingId === kt.project_id}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete learning path and unassign project"
                >
                  {isDeleting && deletingId === kt.project_id ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KTTable;
