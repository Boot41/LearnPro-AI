import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import smaller components
import ProgressOverview from '../components/dashboard/ProgressOverview';
import LearningPathList from '../components/dashboard/LearningPathList';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import ResourcesList from '../components/dashboard/ResourcesList';

// Import services
import { getActiveLearningPath, getResourcesByPathId, getUpcomingSessions } from '../services';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, hasLearningPath, quiz, checkLearningPathAndQuiz } = useAuth();
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState(null);
  const [resources, setResources] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("Dashboard Effect - Auth State:", {
      hasLearningPath,
      hasQuiz: !!quiz,
      userProject: user?.project,
      loading
    });

    const loadDashboard = async () => {
      try {
        // If we don't have a learning path and no quiz, try to check again
        if (!hasLearningPath && !quiz && user?.project?.id) {
          console.log("No learning path or quiz, checking again...");
          await checkLearningPathAndQuiz();
          return;
        }

        // If we don't have a learning path but have a quiz, redirect to skill assessment
        if (!hasLearningPath && quiz) {
          console.log("No learning path but has quiz, redirecting to assessment...");
          navigate('/skill-assessment', { 
            state: { 
              message: "You need to complete a skill assessment before accessing your learning path.",
              projectId: user?.project?.id
            },
            replace: true
          });
          return;
        }
      
        // Continue with normal dashboard data loading if we have a learning path
        if (hasLearningPath) {
          console.log("Has learning path, loading dashboard data...");
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
            setError("Failed to load dashboard data. Please try again later.");
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error in loadDashboard:", error);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };
    
    loadDashboard();
  }, [navigate, user, hasLearningPath, quiz, checkLearningPathAndQuiz]);
  
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
  
  // Show error message if there was a problem loading data
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <h2 className="font-semibold text-lg mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
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