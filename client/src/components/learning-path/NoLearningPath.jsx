import React from 'react';
import { BookOpen } from 'lucide-react';

const NoLearningPath = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <BookOpen className="h-16 w-16 text-indigo-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Learning Path Available</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            You don't have a learning path assigned yet. Please contact your administrator 
            to set up a personalized learning journey for you.
          </p>
          <div className="mt-2 p-4 bg-indigo-50 rounded-lg border border-indigo-100 max-w-md text-left">
            <h3 className="font-medium text-indigo-700 mb-2">What is a Learning Path?</h3>
            <p className="text-gray-600 text-sm">
              A learning path is a customized sequence of topics and resources designed 
              to help you develop specific skills and knowledge in a structured way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoLearningPath;
