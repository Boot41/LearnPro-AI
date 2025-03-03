import React from 'react';
import { replace, useNavigate } from 'react-router-dom';

// Import smaller components
import ProgressOverview from '../components/dashboard/ProgressOverview';
import LearningPathList from '../components/dashboard/LearningPathList';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import ResourcesList from '../components/dashboard/ResourcesList';

// Mock data
const learningPathData = {
  project: 'Web Development',
  progress: 45,
  nextAssessment: new Date(Date.now() + 86400000 * 2), // 2 days from now
  topics: [
    { id: '1', name: 'JavaScript Fundamentals', progress: 100, status: 'completed' },
    { id: '2', name: 'React Basics', progress: 75, status: 'in-progress' },
    { id: '3', name: 'State Management', progress: 0, status: 'not-started' },
    { id: '4', name: 'API Integration', progress: 0, status: 'not-started' },
  ],
  upcomingSessions: [
    { id: '1', topic: 'React Basics', date: new Date(Date.now() + 86400000), duration: 60 },
    { id: '2', topic: 'State Management', date: new Date(Date.now() + 86400000 * 3), duration: 90 },
  ],
  resources: [
    { id: '1', title: 'React Documentation', url: 'https://reactjs.org/docs/getting-started.html', topic: 'React Basics' },
    { id: '2', title: 'JavaScript MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', topic: 'JavaScript Fundamentals' },
  ],
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  
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
  
  return (
    <div className="space-y-6">
      {/* Progress overview */}
      <ProgressOverview 
        project={learningPathData.project}
        progress={learningPathData.progress}
        nextAssessment={learningPathData.nextAssessment}
      />
      
      {/* Learning path topics */}
      <LearningPathList 
        projectName={learningPathData.project}
        topics={learningPathData.topics}
        onStartQuiz={handleStartQuiz}
        onStartMCQQuiz={handleStartMCQQuiz}
        onContinueLearning={handleContinueLearning}
        onTakeAssessment={handleTakeAssessment}
      />
      
      {/* Upcoming learning sessions and Resources grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingSessions sessions={learningPathData.upcomingSessions} />
        <ResourcesList resources={learningPathData.resources} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;