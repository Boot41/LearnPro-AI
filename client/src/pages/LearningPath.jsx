import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Calendar, PlusCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

// Mock learning path data
const learningPathData = {
  project: 'Web Development',
  generatedOn: new Date(),
  estimatedHours: 24,
  topics: [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      status: 'completed',
      estimatedHours: 6,
      resources: [
        { id: '1', title: 'JavaScript MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
        { id: '2', title: 'JavaScript.info', url: 'https://javascript.info/' }
      ],
      subtopics: [
        { name: 'Variables and Data Types', completed: true },
        { name: 'Functions and Scope', completed: true },
        { name: 'Arrays and Objects', completed: true },
        { name: 'Asynchronous JavaScript', completed: true }
      ]
    },
    {
      id: '2',
      name: 'React Basics',
      status: 'in-progress',
      estimatedHours: 8,
      resources: [
        { id: '1', title: 'React Documentation', url: 'https://reactjs.org/docs/getting-started.html' },
        { id: '2', title: 'React Hooks Reference', url: 'https://reactjs.org/docs/hooks-reference.html' }
      ],
      subtopics: [
        { name: 'JSX and Components', completed: true },
        { name: 'Props and State', completed: true },
        { name: 'Hooks', completed: false },
        { name: 'Component Lifecycle', completed: false }
      ]
    },
    {
      id: '3',
      name: 'State Management',
      status: 'not-started',
      estimatedHours: 5,
      resources: [
        { id: '1', title: 'Redux Documentation', url: 'https://redux.js.org/introduction/getting-started' },
        { id: '2', title: 'Context API', url: 'https://reactjs.org/docs/context.html' }
      ],
      subtopics: [
        { name: 'Redux Basics', completed: false },
        { name: 'Context API', completed: false },
        { name: 'State Management Patterns', completed: false }
      ]
    },
    {
      id: '4',
      name: 'API Integration',
      status: 'not-started',
      estimatedHours: 5,
      resources: [
        { id: '1', title: 'Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' },
        { id: '2', title: 'Axios Documentation', url: 'https://axios-http.com/docs/intro' }
      ],
      subtopics: [
        { name: 'RESTful APIs', completed: false },
        { name: 'Fetch and Axios', completed: false },
        { name: 'Error Handling', completed: false },
        { name: 'Authentication', completed: false }
      ]
    }
  ],
  schedule: [
    { date: addDays(new Date(), 1), topics: ['React Basics'], hours: 2 },
    { date: addDays(new Date(), 2), topics: ['React Basics'], hours: 2 },
    { date: addDays(new Date(), 3), topics: ['State Management'], hours: 2 },
    { date: addDays(new Date(), 4), topics: ['State Management'], hours: 2 },
    { date: addDays(new Date(), 5), topics: ['API Integration'], hours: 2 }
  ]
};

const LearningPath = () => {
  const navigate = useNavigate();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  const completedHours = learningPathData.topics
    .filter(topic => topic.status === 'completed')
    .reduce((acc, topic) => acc + topic.estimatedHours, 0);
  
  const inProgressHours = learningPathData.topics
    .filter(topic => topic.status === 'in-progress')
    .reduce((acc, topic) => acc + topic.estimatedHours, 0);
  
  const progressPercentage = (completedHours / learningPathData.estimatedHours) * 100;
  
  const handleStartQuiz = (topicId) => {
    navigate(`/quiz/${topicId}`);
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
      {/* Learning path overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Learning Path</h2>
            <p className="text-gray-500 mt-1">
              Project: {learningPathData.project} • Generated on {format(learningPathData.generatedOn, 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {completedHours} of {learningPathData.estimatedHours} hours completed
            </p>
          </div>
        </div>
      </div>
      
      {/* Learning path timeline */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Learning Timeline</h2>
            <p className="text-sm text-gray-500 mt-1">Estimated {learningPathData.estimatedHours} hours to complete</p>
          </div>
          <button 
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Schedule Learning
          </button>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline items */}
          <div className="divide-y divide-gray-100">
            {learningPathData.topics.map((topic, index) => (
              <div key={topic.id} className="p-6 pl-16 relative">
                {/* Timeline marker */}
                <div className={`absolute left-6 top-8 w-4 h-4 rounded-full border-2 ${
                  topic.status === 'completed' ? 'bg-green-500 border-green-500' :
                  topic.status === 'in-progress' ? 'bg-white border-indigo-500' :
                  'bg-white border-gray-300'
                }`}></div>
                
                {/* Topic content */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-md font-medium text-gray-900">{topic.name}</h3>
                      <div className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        topic.status === 'completed' ? 'bg-green-100 text-green-800' :
                        topic.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {topic.status === 'completed' ? 'Completed' : 
                         topic.status === 'in-progress' ? 'In Progress' : 
                         'Not Started'}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Estimated {topic.estimatedHours} hours</span>
                    </div>
                    
                    {/* Subtopics */}
                    <div className="mt-3 space-y-1">
                      {topic.subtopics.map((subtopic, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          {subtopic.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div>
                          )}
                          <span className={subtopic.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                            {subtopic.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Resources */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Official Documentation:</p>
                      <div className="mt-1 space-y-1">
                        {topic.resources.map(resource => (
                          <a 
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 block"
                          >
                            {resource.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                    {topic.status === 'not-started' && (
                      <button
                        onClick={() => handleStartQuiz(topic.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        Start Quiz
                      </button>
                    )}
                    {topic.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => handleContinueLearning(topic.id)}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                        >
                          Continue Learning
                        </button>
                        <button
                          onClick={() => handleTakeAssessment(topic.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                          Take Assessment
                        </button>
                      </>
                    )}
                    {topic.status === 'completed' && (
                      <button
                        onClick={() => handleTakeAssessment(topic.id)}
                        className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Calendar schedule */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Learning Sessions</h3>
              <button onClick={() => setShowCalendarModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                LearnPro AI will schedule dedicated learning time on your calendar. 
                You can customize your preferences below.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Learning Days
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <button
                      key={index}
                      className={`py-2 text-sm font-medium rounded-md ${
                        index < 5 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Learning Time
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="1">1 hour per day</option>
                  <option value="2" selected>2 hours per day</option>
                  <option value="3">3 hours per day</option>
                  <option value="4">4 hours per day</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time of Day
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="afternoon" selected>Afternoon (1:00 PM - 5:00 PM)</option>
                  <option value="evening">Evening (6:00 PM - 9:00 PM)</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Schedule Preview</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {learningPathData.schedule.map((day, index) => (
                  <div key={index} className="flex items-start">
                    <div className="min-w-[100px] text-sm font-medium text-gray-700">
                      {format(day.date, 'EEE, MMM d')}
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-md p-2">
                      <div className="text-sm font-medium text-indigo-700">
                        {day.topics.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.hours} hours • 1:00 PM - 3:00 PM
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule on Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPath;
