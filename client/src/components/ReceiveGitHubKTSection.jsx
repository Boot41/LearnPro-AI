import React, { useState } from "react";
import Modal from "./Modal";
import GitHubKTTable from "./GitHubKTTable";
import { PlusCircle } from "lucide-react";

const ReceiveGitHubKTSection = ({
  receiveKtInfo,
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
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedReceivingEmployee, setSelectedReceivingEmployee] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || !selectedReceivingEmployee) {
      setError("All fields are required");
      return;
    }
    
    onSubmit({
      give_kt_new_id: parseInt(selectedEmployee),
      email: selectedReceivingEmployee,
    });
    
    // Reset form
    setSelectedEmployee("");
    setSelectedReceivingEmployee("");
    setError("");
    setShowModal(false);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg ">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Receive GitHub KT
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-56"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Assign Receive GitHub KT
        </button>
      </div>
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Take GitHub KT</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          Assign GitHub KT
        </button>
      </div> */}
      
      {receiveKtInfo.length > 0 ? (
        <GitHubKTTable 
          ktInfo={receiveKtInfo} 
          onDelete={onDelete} 
          isDeleting={isDeleting} 
          deletingId={deletingId} 
          tableType="take"
        />
      ) : (
        <div className="text-center py-4 text-gray-500">
          No GitHub Take KT sessions found. Assign a new session using the button above.
        </div>
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setError("");
        }}
        title="Assign GitHub KT"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div>
            <label
              htmlFor="employee"
              className="block text-sm font-medium text-gray-700"
            >
              Employee Giving KT
            </label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select an employee</option>
              {giveKtInfo.map((ktInfo) => (
                <option key={ktInfo.give_kt_new_id} value={ktInfo.give_kt_new_id}>
                  {ktInfo.employee_email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label
              htmlFor="commit"
              className="block text-sm font-medium text-gray-700"
            >
              Employee Receiving KT
            </label>
            <select
              id="commit"
              value={selectedReceivingEmployee}
              onChange={(e) => setSelectedReceivingEmployee(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select an employee to receive KT</option>
              {employees
                .filter(employee => {
                  // Filter out the employee who is giving KT (the one selected in the first dropdown)
                  const selectedKtInfo = giveKtInfo.find(kt => kt.give_kt_new_id === parseInt(selectedEmployee));
                  return !selectedKtInfo || selectedKtInfo.employee_email !== employee.email;
                })
                .map((employee) => (
                  <option key={employee.id} value={employee.email}>
                    {employee.email}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setError("");
              }}
              className="mr-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Assign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReceiveGitHubKTSection;
