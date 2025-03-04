import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import smaller components
import ProgressOverview from '../components/dashboard/ProgressOverview';
import LearningPathList from '../components/dashboard/LearningPathList';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import ResourcesList from '../components/dashboard/ResourcesList';

// Import services
import { getActiveLearningPath, getResourcesByPathId, getUpcomingSessions } from '../services';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState(null);
  const [resources, setResources] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Get active learning path
        const path = await getActiveLearningPath();
        setLearningPath(path);
        
        // Get resources for this path
        const pathResources = await getResourcesByPathId(path.projectId);
        setResources(pathResources);
        
        // Get upcoming sessions
        const upcomingSessions = await getUpcomingSessions();
        setSessions(upcomingSessions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleStartQuiz = (topicId) => {
    navigate(`/quiz/${topicId}`);
  };
  
  const handleStartMCQQuiz = (topicId) => {
    navigate(`/quiz-mcq/${topicId}`);
  };
  
  const handleContinueLearning = (topicId) => {
    // In a real app, this would navigate to the learning content
    console.log(`Continue learning for topic ${topicId}`);
  };
  
  const handleTakeAssessment = (topicId) => {
    navigate(`/assessment/${topicId}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Progress overview */}
      {learningPath && (
        <ProgressOverview 
          project={learningPath.project}
          progress={learningPath.progress}
          nextAssessment={learningPath.nextAssessment}
        />
      )}
      
      {/* Learning path topics */}
      {learningPath && (
        <LearningPathList 
          projectName={learningPath.project}
          topics={learningPath.topics}
          onStartQuiz={handleStartQuiz}
          onStartMCQQuiz={handleStartMCQQuiz}
          onContinueLearning={handleContinueLearning}
          onTakeAssessment={handleTakeAssessment}
        />
      )}
      
      {/* Upcoming learning sessions and Resources grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingSessions sessions={sessions} />
        <ResourcesList resources={resources} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;