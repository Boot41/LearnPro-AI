import React from 'react';
import { HelpCircle } from 'lucide-react';

const QuizNotFound = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <HelpCircle className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Quiz not found</h2>
        <p className="text-gray-500 mt-2">The requested quiz could not be loaded.</p>
      </div>
    </div>
  );
};

export default QuizNotFound;
