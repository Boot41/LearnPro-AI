import React from 'react';
import SubjectItem from './SubjectItem';

const LearningTimeline = ({ 
  path, 
  isLoading, 
  loadingSubjectId, 
  firstIncompleteTopic, 
  handleContinueLearning 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Learning Timeline</h2>
          <p className="text-sm text-gray-500 mt-1">Estimated {path.total_estimated_hours} hours to complete</p>
        </div>

        <button
          onClick={handleContinueLearning}
          disabled={isLoading}
          className={`px-4 py-2 w-36 text-sm font-medium text-white ${
            isLoading ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } rounded-md flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </>
          ) : 'Take Next Quiz'}
        </button>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline items */}
        <div className="divide-y divide-gray-100">
          {path.subjects.map((subject, index) => (
            <SubjectItem key={subject.id || index} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningTimeline;
