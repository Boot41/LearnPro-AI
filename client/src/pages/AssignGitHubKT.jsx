import React, { useState, useEffect } from "react";
import {
  getGiveGitHubKt,
  removeGitHubKt,
  saveGitHubCommits,
  getTakeGitHubKt,
  assignTakeGitHubKt,
  deleteTakeGitHubKt
} from "../services/gitHubKtService";
import { getEmployees } from "../services/employeeService";
import { getProjects } from "../services/projectService";
import GiveGitHubKTSection from "../components/GiveGitHubKTSection";
import ReceiveGitHubKTSection from "../components/ReceiveGitHubKTSection";

const AssignGitHubKT = () => {
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

    const fetchGiveGitHubKt = async () => {
      try {
        const giveKt = await getGiveGitHubKt();
        setGiveKtInfo(giveKt);
        console.log(giveKt);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch GitHub KT sessions");
        setLoading(false);
      }
    };

    const fetchReceiveGitHubKt = async () => {
      try {
        const receiveKt = await getTakeGitHubKt();
        setReceiveKtInfo(receiveKt);
      } catch (err) {
        setError("Failed to fetch GitHub Take KT sessions");
      }
    };

    fetchEmployees();
    fetchProjects();
    fetchGiveGitHubKt();
    fetchReceiveGitHubKt();
  }, []);

  const removeGitHubKtSession = async (commitId) => {
    try {
      setIsDeleting(true);
      setDeletingId(commitId);
      await removeGitHubKt(commitId);
      const data = await getGiveGitHubKt();
      setGiveKtInfo(data);
    } catch (error) {
      console.error("Error deleting GitHub KT session:", error);
      alert("Failed to delete GitHub KT session. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const removeAssignedReceiveGitHubKt = async (takeKtId) => {
    try {
      setIsDeleting(true);
      setDeletingId(takeKtId);
      await deleteTakeGitHubKt(takeKtId);
      const data = await getTakeGitHubKt();
      setReceiveKtInfo(data);
    } catch (error) {
      console.error("Error deleting GitHub Take KT session:", error);
      alert("Failed to delete GitHub Take KT session. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleAddGiveGitHubKt = async (commitData) => {
    try {
      await saveGitHubCommits(commitData);
      const giveKt = await getGiveGitHubKt();
      setGiveKtInfo(giveKt);
    } catch (err) {
      setError("Failed to save GitHub commits");
    }
  };

  const handleAddReceiveGitHubKt = async (takeKtData) => {
    try {
      await assignTakeGitHubKt(takeKtData);
      const receiveKtInfo = await getTakeGitHubKt();
      setReceiveKtInfo(receiveKtInfo);
    } catch (err) {
      setError("Failed to assign GitHub Take KT");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col space-y-8">
      <GiveGitHubKTSection
        giveKtInfo={giveKtInfo}
        employees={employees}
        projects={projects}
        showModal={showAddGiveKtModal}
        setShowModal={setShowAddGiveKtModal}
        onSubmit={handleAddGiveGitHubKt}
        isDeleting={isDeleting}
        deletingId={deletingId}
        onDelete={removeGitHubKtSession}
      />

      <ReceiveGitHubKTSection
        receiveKtInfo={receiveKtInfo}
        giveKtInfo={giveKtInfo}
        employees={employees}
        projects={projects}
        showModal={showAddReceiveKtModal}
        onDelete={removeAssignedReceiveGitHubKt}
        setShowModal={setShowAddReceiveKtModal}
        onSubmit={handleAddReceiveGitHubKt}
        isDeleting={isDeleting}
        deletingId={deletingId}
      />
    </div>
  );
};

export default AssignGitHubKT;
