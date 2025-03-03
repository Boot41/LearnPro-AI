import React from 'react';
import TopicCard from './TopicCard';

const LearningPathList = ({ 
  projectName, 
  topics, 
  onStartQuiz, 
  onStartMCQQuiz, 
  onContinueLearning, 
  onTakeAssessment 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Your Learning Path</h2>
        <p className="text-sm text-gray-500 mt-1">Complete these topics to master {projectName}</p>
      </div>
      <div className="divide-y divide-gray-200">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onStartQuiz={onStartQuiz}
            onStartMCQQuiz={onStartMCQQuiz}
            onContinueLearning={onContinueLearning}
            onTakeAssessment={onTakeAssessment}
          />
        ))}
      </div>
    </div>
  );
};

export default LearningPathList;
