import React from 'react';
import { PlusCircle } from 'lucide-react';

const EmployeeList = ({ employees, onAddEmployee }) => {
  console.log(employees)
  return (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="flex justify-between items-center p-6 border-b">
      <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
      <button 
        onClick={onAddEmployee}
        className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-42"
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        Add Employee
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{employee.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{employee.assigned_projects[0]?.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-center items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${employee.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{Math.trunc(employee.progress)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)};

export default EmployeeList;
