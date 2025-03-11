import React, { useState, useEffect } from 'react';
import StatsOverview from '../components/StatsOverview';
import ProjectChart from '../components/ProjectChart';
import EmployeeList from '../components/EmployeeList';
import ProjectList from '../components/ProjectList';
import AddProjectModal from '../components/AddProjectModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import { getEmployees, assignProjectToEmployee } from '../services/employeeService';
import { createProject } from '../services/projectService';
import { getProjects, getProjectCompletionStats } from '../services/projectService';
import { deleteLearningPathAndUnassignProject } from '../services/employeeService';

const AdminDashboard = () => {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [projectStats, setProjectStats] = useState([]);
  const [averageCompletion, setAverageCompletion] = useState(0);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employees');
        setLoading(false);
      }
    };
    
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjectData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch projects');
        setLoading(false);
      }
    };
    
    const fetchProjectStats = async () => {
      try {
        const stats = await getProjectCompletionStats();
        setProjectStats(stats);
        
        // Calculate average completion across all projects
        if (stats.length > 0) {
          const totalCompletion = stats.reduce((sum, project) => sum + project.completionRate, 0);
          setAverageCompletion(Math.round(totalCompletion / stats.length));
        }
      } catch (err) {
        console.error('Failed to fetch project stats:', err);
        // Don't set error state here to avoid blocking the entire dashboard
      }
    };

    fetchEmployees();
    fetchProjects();
    fetchProjectStats();
  }, []);

  useEffect(() => {
    if (showAddEmployeeModal || showAddProjectModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showAddProjectModal, showAddEmployeeModal]);

  const handleDeleteLearningPath = async (employeeId) => {
    try {
      await deleteLearningPathAndUnassignProject(employeeId);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error deleting learning path:', error);
      alert('Failed to delete learning path. Please try again.');
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const newProject = {
        project_name: projectData.projectName,
        project_description: projectData.projectDescription,
        subjects: projectData.subjects.map(subject => ({
            subject_name: subject.subject_name,
            topics: subject.topics.filter(topic => topic.trim() !== '')
          }))
        };
        
        await createProject(newProject);
        const data = await getProjects(); 
        setProjectData(data);

      } catch (err) {
        setError(err.message || 'Failed to create project');
      }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      await assignProjectToEmployee(employeeData.email, employeeData.project_id);
      setShowAddEmployeeModal(false);
      
      // Refresh employee list
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      throw new Error(err.message || 'Failed to add employee');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }



  return (
    <div className={"space-y-6"}>
      <StatsOverview 
        employeeCount={employees.length}
        projectCount={projectData.length}
        averageCompletion={averageCompletion}
      />

      <ProjectChart data={projectStats.length > 0 ? projectStats : projectData} />

      <EmployeeList 
        employees={employees} 
        removeLearningPath={handleDeleteLearningPath}
        onAddEmployee={() => setShowAddEmployeeModal(true)} 
      />

      <ProjectList 
        loading={loading}
        projects={projectData}
        error={error}
        onAddProject={() => setShowAddProjectModal(true)} 
      />

      <AddProjectModal
        show={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSubmit={handleAddProject}
      />

      <AddEmployeeModal
        projects={projectData}
        employees={employees}
        show={showAddEmployeeModal}
        onClose={() => setShowAddEmployeeModal(false)}
        onSubmit={handleAddEmployee}
      />
    </div>
  );
};

export default AdminDashboard;