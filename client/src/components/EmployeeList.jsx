import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const EmployeeList = ({ employees, onAddEmployee, removeLearningPath }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const removeLearningPathHandler = async (employeeId) => {
    try {
      setIsDeleting(true);
      setDeletingId(employeeId);
      await removeLearningPath(employeeId);
    } catch (error) {
      console.error('Error deleting learning path:', error);
      alert('Failed to delete learning path. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden">
    <div className="flex justify-between items-center p-6 border-b">
      <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
      <button 
        onClick={onAddEmployee}
        className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-42"
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        Assign project 
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => {
            return (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{employee.email}</div>
              </td>
              <td className="px-0 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 w-48 ">{employee.assigned_projects[0]?.name}</div>
              </td>
              {employee.assigned_projects[0]?.name && (
              <td className="px-6 py-4  whitespace-nowrap flex space-x-2  items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${employee.progress}%` }}
                    ></div>
                  </div>
                <span className="text-xs text-gray-500">{Math.trunc(employee.progress)}%</span>
                <button 
                  onClick={() => removeLearningPathHandler(employee.id)}
                  disabled={isDeleting && deletingId === employee.id}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete learning path and unassign project"
                >
                  {isDeleting && deletingId === employee.id ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </td>
              )}
            </tr>
            )})}
        </tbody>
      </table>
    </div>
  </div>
)};

export default EmployeeList;
