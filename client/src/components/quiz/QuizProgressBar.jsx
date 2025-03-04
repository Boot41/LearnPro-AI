import React from 'react';

const QuizProgressBar = ({ current, total }) => {
  // Calculate progress percentage
  const progressPercentage = (current / total) * 100;
  
  return (
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Question {current + 1} of {total}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
    </div>
  );
};

export default QuizProgressBar;
