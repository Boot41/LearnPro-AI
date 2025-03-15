import React from 'react';
import { PlusCircle } from "lucide-react";
import KTTable from './KTTable';
import AddEmployeeModal from './AddEmployeeModal';

const ReceiveKTSection = ({ 
  receiveKtInfo, 
  employees, 
  projects, 
  showModal, 
  setShowModal, 
  onSubmit,
  onDelete,
  isDeleting,
  deletingId 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <AddEmployeeModal
        employees={employees.filter(
          (emp) => !receiveKtInfo.some((kt) => kt.employee_email === emp.email)
        )}
        projects={projects.filter(
          (proj) => !receiveKtInfo.some((kt) => kt.project_id === proj.id)
        )}
        onClose={() => setShowModal(false)}
        onSubmit={onSubmit}
        show={showModal}
      />

      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Assigned Receive K.T. Projects
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-52"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Assign Receive K.T.
        </button>
      </div>

      <KTTable ktInfo={receiveKtInfo} onDelete={onDelete} isDeleting={isDeleting} deletingId={deletingId} tableType="receive" />
    </div>
  );
};

export default ReceiveKTSection;
