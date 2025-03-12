import React from 'react';
import { CheckCircle } from 'lucide-react';

const TopicItem = ({ topic }) => {
  // Convert string 'true'/'false' to boolean if needed
  const isCompleted = topic.is_completed === 'true' || topic.is_completed === true;
  
  return (
    <div className="flex items-center text-sm">
      {isCompleted ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div>
      )}
      <span className={isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}>
        {topic.topic_name}
      </span>
    </div>
  );
};

export default TopicItem;
