import React, { useState, useEffect } from 'react';
import StatsOverview from '../components/StatsOverview';
import ProjectChart from '../components/ProjectChart';
import EmployeeList from '../components/EmployeeList';
import ProjectList from '../components/ProjectList';
import AddProjectModal from '../components/AddProjectModal';
import AddEmployeeModal from '../components/AddEmployeeModal';

// Mock data
const employeeData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', progress: 75, project: 'Web Development' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', progress: 45, project: 'Mobile App' },
  { id: '3', name: 'Robert Johnson', email: 'robert@example.com', progress: 90, project: 'Data Analysis' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', progress: 30, project: 'Web Development' },
  { id: '5', name: 'Michael Wilson', email: 'michael@example.com', progress: 60, project: 'Mobile App' },
];

const projectData = [
  { id: '1', name: 'Web Development', employees: 2, completionRate: 52.5 },
  { id: '2', name: 'Mobile App', employees: 2, completionRate: 52.5 },
  { id: '3', name: 'Data Analysis', employees: 1, completionRate: 90 },
];

const chartData = [
  { name: 'Web Dev', completion: 52.5 },
  { name: 'Mobile App', completion: 52.5 },
  { name: 'Data Analysis', completion: 90 },
];

const AdminDashboard = () => {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projectRefreshKey, setProjectRefreshKey] = useState(0);

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

  const handleAddProject = (projectData) => {
    console.log('New Project:', projectData);
    setShowAddProjectModal(false);
  };

  const handleAddEmployee = (employeeData) => {
    console.log('New Employee:', employeeData);
    setShowAddEmployeeModal(false);
  };

  const handleProjectAdded = () => {
    // Increment the refresh key to trigger a re-fetch
    setProjectRefreshKey(prev => prev + 1);
  };

  return (
    <div className={"space-y-6"}>
      <StatsOverview 
        employeeCount={employeeData.length}
        projectCount={projectData.length}
        averageCompletion={Math.round(projectData.reduce((acc, curr) => acc + curr.completionRate, 0) / projectData.length)}
      />

      <ProjectChart data={chartData} />

      <EmployeeList 
        employees={employeeData} 
        onAddEmployee={() => setShowAddEmployeeModal(true)} 
      />

      <ProjectList 
        projects={projectData} 
        onAddProject={() => setShowAddProjectModal(true)} 
        refreshTrigger={projectRefreshKey}
      />

      <AddProjectModal
        show={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSubmit={handleAddProject}
        onProjectAdded={handleProjectAdded}
      />

      <AddEmployeeModal
        projects={projectData}
        show={showAddEmployeeModal}
        onClose={() => setShowAddEmployeeModal(false)}
        onSubmit={handleAddEmployee}
      />
    </div>
  );
};

export default AdminDashboard;