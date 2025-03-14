import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  getKtStatus,
  removeAssignedGiveKt,
  assignGiveKt,
} from "../services/ktService";
import { getEmployees } from "../services/employeeService";
import { getProjects } from "../services/projectService";
import AddEmployeeModal from "../components/AddEmployeeModal";

const AssignKT = () => {
  const [showAddGiveKtModal, setShowAddGiveKtModal] = useState(false);
  const [showAddReceiveKtModal, setShowAddReceiveKtModal] = useState(false);
  const [ktStatus, setKtStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
        console.log(data);
      } catch (err) {
        setError("Failed to fetch employees");
      }
    };
    fetchEmployees();
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        console.log(data);
      } catch (err) {
        setError("Failed to fetch projects");
      }
    };
    fetchProjects();
    const fetchKtStatus = async () => {
      try {
        const data = await getKtStatus();
        setKtStatus(data);
        console.log(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employees");
        setLoading(false);
      }
    };
    fetchKtStatus();
  }, []);

  const removeAssignedProject = async (projectId) => {
    try {
      setIsDeleting(true);
      setDeletingId(projectId);
      await removeAssignedGiveKt(projectId);
      const data = await getKtStatus();
      setKtStatus(data);
    } catch (error) {
      console.error("Error deleting assigned project:", error);
      alert("Failed to delete assigned project. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleAddGiveKt = async (employeeData) => {
    try {
      // console.log(employeeData)
      await assignGiveKt(employeeData);
      const data = await getKtStatus();
      setKtStatus(data);
    } catch (err) {
      setError("Failed to assign KT");
    }
  };
  const handleAddReceiveKt = async (employeeData) => {
    try {
      // console.log(employeeData)
      await assignReceiveKt(employeeData);
      const data = await getKtStatus();
      setKtStatus(data);
    } catch (err) {
      setError("Failed to assign KT");
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <AddEmployeeModal
          employees={employees.filter(
            (emp) => !ktStatus.some((kt) => kt.employee_email === emp.email)
          )}
          projects={projects.filter(
            (proj) => !ktStatus.some((kt) => kt.project_id === proj.id)
          )}
          onClose={() => setShowAddGiveKtModal(false)}
          onSubmit={handleAddGiveKt}
          show={showAddGiveKtModal}
        />

        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Assigned Give K.T. Projects
          </h2>
          <button
            onClick={() => {
              console.log("ran");
              setShowAddEmployeeModal(true);
            }}
            className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-52"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Assign Give K.T.
          </button>
        </div>
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
          {ktStatus.map((kt) => {
            return (
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
                      kt.status == "Completed"
                        ? "bg-green-200 border-green-500"
                        : "bg-red-200 border-red-500"
                    }`}
                  >
                    {kt?.status}
                  </span>
                  <button
                    onClick={() => removeAssignedProject(kt.project_id)}
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
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <AddEmployeeModal 
        employees={employees.filter(emp => 
          !ktStatus.some(kt => kt.employee_email === emp.email)
        )} 
        projects={projects.filter(proj => 
          !ktStatus.some(kt => kt.project_id === proj.id)
        )} 
        onClose={() => setShowAddReceiveKtModal(false)} 
        onSubmit={handleAddReceiveKt} 
        show={showAddReceiveKtModal}
      />
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Employees to Receive K.T.
        </h2>
        <button
          onClick={() => {console.log("ran"); setShowAddReceiveKtModal(true)}}
          className="flex items-center justify-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-52"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Assign Receive K.T.
        </button>
      </div>
      <div className="grid grid-cols-4 border-b-1 border-gray-200">
        <div className="px-6 py-3 col-span-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Project Id
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
        {ktStatus.map((kt) => {
          return (
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
                    kt.status == "Completed"
                      ? "bg-green-200 border-green-500"
                      : kt.status == "Pending"
                      ? "bg-red-200 border-red-500"
                      : "bg-yellow-200 border-yellow-500"
                  }`}
                >
                  {kt?.status}
                </span>
                <button
                  onClick={() => removeAssignedProject(kt.project_id)}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};
export default AssignKT;
