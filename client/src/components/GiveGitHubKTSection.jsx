import React, { useState } from "react";
import Modal from "./Modal";
import GitHubKTTable from "./GitHubKTTable";
import { PlusCircle } from "lucide-react";

const GiveGitHubKTSection = ({
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
  const [repoUrl, setRepoUrl] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || !repoUrl || !username) {
      setError("All fields are required");
      return;
    }
    
    const employeeId = parseInt(selectedEmployee);
    
    onSubmit({
      employee_id: employeeId,
      repo_url: repoUrl,
      username: username
    });
    
    // Reset form
    setSelectedEmployee("");
    setRepoUrl("");
    setUsername("");
    setError("");
    setShowModal(false);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg ">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Give GitHub KT
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-56"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Assign Give GitHub KT
        </button>
      </div>
      
      {giveKtInfo.length > 0 ? (
        <GitHubKTTable 
          ktInfo={giveKtInfo} 
          onDelete={onDelete} 
          isDeleting={isDeleting} 
          deletingId={deletingId} 
          tableType="give"
        />
      ) : (
        <div className="text-center py-4 text-gray-500">
          No GitHub KT sessions found. Add a new session using the button above.
        </div>
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setError("");
        }}
        title="Add GitHub KT"
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
              Employee
            </label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label
              htmlFor="repoUrl"
              className="block text-sm font-medium text-gray-700"
            >
              GitHub Repository URL
            </label>
            <input
              type="text"
              id="repoUrl"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              GitHub Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="github_username"
            />
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
              Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GiveGitHubKTSection;
