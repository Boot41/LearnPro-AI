import React from 'react';
import { Check } from 'lucide-react';

const TopicItem = ({ topic }) => {
  // Convert string 'true'/'false' to boolean if needed
  const isCompleted = topic.is_completed === 'true' || topic.is_completed === true;
  
  return (
    <div className="flex items-center text-sm">
      {isCompleted ? (
        <Check className="h-4 w-4 p-[2px] text-bold text-white bg-green-500 rounded-full   mr-2" />
      ) : (
        <div className="h-4 w-4 p-[2px] text-bold border border-gray-300 rounded-full mr-2"></div>
      )}
      <span className={isCompleted ? 'text-gray-500  line-through' : 'text-gray-700'}>
        {topic.topic_name}
      </span>
    </div>
  );
};

export default TopicItem;
