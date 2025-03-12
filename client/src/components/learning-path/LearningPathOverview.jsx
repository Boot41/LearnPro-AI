import React from 'react';
import { format } from 'date-fns';

const LearningPathOverview = ({ path, completedTopics, totalTopics }) => {
  const progressPercentage = (completedTopics / totalTopics) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Learning Path</h2>
          <p className="text-gray-500 mt-1">
            Project: {path.learning_path_name} • Generated on {format(path.created_at, 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center">
            <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {completedTopics} of {totalTopics} topics completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningPathOverview;
