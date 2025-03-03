import React from 'react';
import { Clock } from 'lucide-react';

const QuizTimer = ({ timeRemaining }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex items-center text-gray-600">
      <Clock className="h-5 w-5 mr-1" />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default QuizTimer;
