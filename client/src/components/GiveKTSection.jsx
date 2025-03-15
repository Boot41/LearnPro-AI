import React from 'react';
import { PlusCircle } from "lucide-react";
import KTTable from './KTTable';
import AddEmployeeModal from './AddEmployeeModal';

const GiveKTSection = ({ 
  giveKtInfo, 
  employees, 
  projects, 
  showModal, 
  setShowModal, 
  onSubmit,
  isDeleting,
  deletingId,
  onDelete 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <AddEmployeeModal
        employees={employees.filter(
          (emp) => !giveKtInfo.some((kt) => kt.employee_email === emp.email)
        )}
        projects={projects.filter(
          (proj) => !giveKtInfo.some((kt) => kt.project_id === proj.id)
        )}
        onClose={() => setShowModal(false)}
        onSubmit={onSubmit}
        show={showModal}
      />

      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Assigned Give K.T. Projects
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-52"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Assign Give K.T.
        </button>
      </div>

      <KTTable 
        ktInfo={giveKtInfo}
        onDelete={onDelete}
        isDeleting={isDeleting}
        deletingId={deletingId}
        tableType="give"
      />
    </div>
  );
};

export default GiveKTSection;
