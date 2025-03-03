import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const learningPathData = {
  project: 'Web Development',
  progress: 45,
  nextAssessment: new Date(Date.now() + 86400000 * 2), // 2 days from now
  topics: [
    { id: '1', name: 'JavaScript Fundamentals', progress: 100, status: 'completed' },
    { id: '2', name: 'React Basics', progress: 75, status: 'in-progress' },
    { id: '3', name: 'State Management', progress: 0, status: 'not-started' },
    { id: '4', name: 'API Integration', progress: 0, status: 'not-started' },
  ],
  upcomingSessions: [
    { id: '1', topic: 'React Basics', date: new Date(Date.now() + 86400000), duration: 60 },
    { id: '2', topic: 'State Management', date: new Date(Date.now() + 86400000 * 3), duration: 90 },
  ],
  resources: [
    { id: '1', title: 'React Documentation', url: 'https://reactjs.org/docs/getting-started.html', topic: 'React Basics' },
    { id: '2', title: 'JavaScript MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', topic: 'JavaScript Fundamentals' },
  ],
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  
  const handleStartQuiz = (topicId) => {
    navigate(`/quiz/${topicId}`);
  };
  
  const handleStartMCQQuiz = (topicId) => {
    navigate(`/quiz-mcq/${topicId}`);
  };
  
  const handleContinueLearning = (topicId) => {
    // In a real app, this would navigate to the learning content
    console.log(`Continue learning for topic ${topicId}`);
  };
  
  const handleTakeAssessment = (topicId) => {
    navigate(`/assessment/${topicId}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Progress overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Learning Progress</h2>
            <p className="text-gray-500 mt-1">Project: {learningPathData.project}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${learningPathData.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{learningPathData.progress}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Next assessment: {format(learningPathData.nextAssessment, 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Learning path topics */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Learning Path</h2>
          <p className="text-sm text-gray-500 mt-1">Complete these topics to master {learningPathData.project}</p>
        </div>
        <div className="divide-y divide-gray-200">
          {learningPathData.topics.map((topic) => (
            <div key={topic.id} className="p-6">
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
                        onClick={() => handleStartQuiz(topic.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 mb-2 md:mb-0"
                      >
                        Start Quiz
                      </button>
                      <button
                        onClick={() => handleStartMCQQuiz(topic.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                      >
                        Start MCQ Quiz
                      </button>
                    </>
                  )}
                  {topic.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() => handleContinueLearning(topic.id)}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 mb-2 md:mb-0"
                      >
                        Continue Learning
                      </button>
                      <button
                        onClick={() => handleTakeAssessment(topic.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 mb-2 md:mb-0"
                      >
                        Take Assessment
                      </button>
                      <button
                        onClick={() => handleStartMCQQuiz(topic.id)}
                        className="mt-2 md:mt-0 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                      >
                        Take MCQ Quiz
                      </button>
                    </>
                  )}
                  {topic.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleTakeAssessment(topic.id)}
                        className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200 mb-2 md:mb-0"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleStartMCQQuiz(topic.id)}
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
          ))}
        </div>
      </div>
      
      {/* Upcoming learning sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Learning Sessions</h2>
          </div>
          <div className="p-6">
            {learningPathData.upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {learningPathData.upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-start">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-md font-medium text-gray-900">{session.topic}</h3>
                      <p className="text-sm text-gray-500">
                        {format(session.date, 'MMM dd, yyyy')} • {session.duration} minutes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming sessions scheduled.</p>
            )}
          </div>
        </div>
        
        {/* Learning resources */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Official Documentation</h2>
          </div>
          <div className="p-6">
            {learningPathData.resources.length > 0 ? (
              <div className="space-y-4">
                {learningPathData.resources.map((resource) => (
                  <div key={resource.id} className="flex items-start">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-md font-medium text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.topic}</p>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 inline-block"
                      >
                        View Documentation
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No resources available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;