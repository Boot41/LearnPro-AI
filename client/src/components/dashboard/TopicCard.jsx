import React from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

const TopicCard = ({ 
  topic, 
  onStartQuiz, 
  onStartMCQQuiz, 
  onContinueLearning, 
  onTakeAssessment 
}) => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-start">
          <div className={`p-2 rounded-full ${
            topic.status === 'completed' ? 'bg-green-100 text-green-600' :
            topic.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {topic.status === 'completed' ? (
              <CheckCircle className="h-5 w-5" />
            ) : topic.status === 'in-progress' ? (
              <Clock className="h-5 w-5" />
            ) : (
              <BookOpen className="h-5 w-5" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-md font-medium text-gray-900">{topic.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {topic.status === 'completed' ? 'Completed' : 
               topic.status === 'in-progress' ? 'In Progress' : 
               'Not Started'}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:space-x-3">
          {topic.status === 'not-started' && (
            <>
              <button
                onClick={() => onStartQuiz(topic.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 mb-2 md:mb-0"
              >
                Start Quiz
              </button>
              <button
                onClick={() => onStartMCQQuiz(topic.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Start MCQ Quiz
              </button>
            </>
          )}
          {topic.status === 'in-progress' && (
            <>
              <button
                onClick={() => onContinueLearning(topic.id)}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 mb-2 md:mb-0"
              >
                Continue Learning
              </button>
              <button
                onClick={() => onTakeAssessment(topic.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 mb-2 md:mb-0"
              >
                Take Assessment
              </button>
              <button
                onClick={() => onStartMCQQuiz(topic.id)}
                className="mt-2 md:mt-0 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Take MCQ Quiz
              </button>
            </>
          )}
          {topic.status === 'completed' && (
            <>
              <button
                onClick={() => onTakeAssessment(topic.id)}
                className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200 mb-2 md:mb-0"
              >
                Review
              </button>
              <button
                onClick={() => onStartMCQQuiz(topic.id)}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-100 rounded-md hover:bg-purple-200"
              >
                Practice MCQs
              </button>
            </>
          )}
        </div>
      </div>
      {topic.status !== 'not-started' && (
        <div className="mt-4 ml-11">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${topic.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'}`}
              style={{ width: `${topic.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCard;
