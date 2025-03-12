import React from 'react';
import { Clock } from 'lucide-react';
import TopicItem from './TopicItem';

const SubjectItem = ({ subject }) => {
  // Convert string 'true'/'false' to boolean if needed
  const isCompleted = subject.is_completed === 'true' || subject.is_completed === true;
  const isStarted = subject.is_started === 'true' || subject.is_started === true;

  return (
    <div className="p-6 pl-16 relative">
      {/* Timeline marker */}
      <div className={`absolute left-6 top-8 w-4 h-4 rounded-full border-2 ${
        isCompleted ? 'bg-green-500 border-green-500' :
        isStarted ? 'bg-white border-indigo-500' :
        'bg-white border-gray-300'
      }`}></div>
      
      {/* Subject content */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className='flex justify-between w-full'>
          <div>
            <div className="flex items-center">
              <h3 className="text-md font-medium text-gray-900">{subject.subject_name}</h3>
              <div className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                isCompleted ? 'bg-green-100 text-green-800' :
                isStarted ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {isCompleted ? 'Completed' : 
                 isStarted ? 'In Progress' : 
                 'Not Started'}
              </div>
            </div>
            
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Estimated {subject.estimated_hours} hours</span>
            </div>
            
            {/* Topics */}
            <div className="mt-3 space-y-1">
              {subject.topics.map((topic, idx) => (
                <TopicItem key={idx} topic={topic} />
              ))}
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Official Documentation:</p>
              <div className="mt-1 space-y-1">
                {subject?.official_docs?.map((resource, index) => (
                  <a 
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 block"
                  >
                    {subject.subject_name.slice(0, 20)}...
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectItem;
