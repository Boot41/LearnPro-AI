import React, { useState, useEffect } from "react";
import {
  getGiveKt,
  removeAssignedGiveKt,
  assignGiveKt,
  getReceiveKt,
  assignReceiveKt,
  deleteReceiveKt 
} from "../services/ktService";
import { getEmployees } from "../services/employeeService";
import { getProjects } from "../services/projectService";
import GiveKTSection from "../components/GiveKTSection";
import ReceiveKTSection from "../components/ReceiveKTSection";

const AssignKT = () => {
  const [showAddGiveKtModal, setShowAddGiveKtModal] = useState(false);
  const [showAddReceiveKtModal, setShowAddReceiveKtModal] = useState(false);
  const [receiveKtInfo, setReceiveKtInfo] = useState([]);
  const [giveKtInfo, setGiveKtInfo] = useState([]);
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
      } catch (err) {
        setError("Failed to fetch employees");
      }
    };

    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError("Failed to fetch projects");
      }
    };

    const fetchGiveKt = async () => {
      try {
        const giveKt = await getGiveKt();
        setGiveKtInfo(giveKt);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employees");
        setLoading(false);
      }
    };

    const fetchReceiveKt = async () => {
      try {
        const receiveKt = await getReceiveKt();
        console.log(receiveKt)
        setReceiveKtInfo(receiveKt);
      } catch (err) {
        setError("Failed to fetch receive KT");
      }
    };

    fetchEmployees();
    fetchProjects();
    fetchGiveKt();
    fetchReceiveKt();
  }, []);

  const removeAssignedProject = async (projectId) => {
    try {
      setIsDeleting(true);
      console.log(projectId)
      setDeletingId(projectId);
      await removeAssignedGiveKt(projectId);
      const data = await getGiveKt();
      setGiveKtInfo(data);
    } catch (error) {
      console.error("Error deleting assigned project:", error);
      alert("Failed to delete assigned project. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const removeAssignedReceiveProjectKt = async (take_kt_id) => {
    try {
      setIsDeleting(true);
      console.log(take_kt_id)
      setDeletingId(take_kt_id);
      await deleteReceiveKt(take_kt_id);
      const data = await getReceiveKt();
      setReceiveKtInfo(data);
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
      await assignGiveKt(employeeData);
      const giveKt = await getGiveKt();
      setGiveKtInfo(giveKt);
    } catch (err) {
      setError("Failed to assign KT");
    }
  };

  const handleAddReceiveKt = async (employeeData) => {
    try {
      await assignReceiveKt(employeeData);
      const receiveKtInfo = await getReceiveKt();
      setReceiveKtInfo(receiveKtInfo);
    } catch (err) {
      setError("Failed to assign KT");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col space-y-8">
      <GiveKTSection
        tableType="give"
        giveKtInfo={giveKtInfo}
        employees={employees}
        projects={projects}
        showModal={showAddGiveKtModal}
        setShowModal={setShowAddGiveKtModal}
        onSubmit={handleAddGiveKt}
        isDeleting={isDeleting}
        deletingId={deletingId}
        onDelete={removeAssignedProject}
      />

      <ReceiveKTSection
        tableType="receive"
        receiveKtInfo={receiveKtInfo}
        employees={employees}
        projects={projects}
        showModal={showAddReceiveKtModal}
        onDelete={removeAssignedReceiveProjectKt}
        setShowModal={setShowAddReceiveKtModal}
        onSubmit={handleAddReceiveKt}
        isDeleting={isDeleting}
        deletingId={deletingId}
      />
    </div>
  );
};

export default AssignKT;
