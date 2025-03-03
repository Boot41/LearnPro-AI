import React from 'react';
import { format } from 'date-fns';

const ProgressOverview = ({ project, progress, nextAssessment }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Learning Progress</h2>
          <p className="text-gray-500 mt-1">Project: {project}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center">
            <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Next assessment: {format(nextAssessment, 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
