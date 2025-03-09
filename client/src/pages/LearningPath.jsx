import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Calendar, PlusCircle, Toilet } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useLearningPath } from '../contexts/LearningPathContext';
import { useQuiz } from '../contexts/QuizContext';
import { getQuizByTopicName } from '../services/quizService';

const LearningPath = () => {
  const navigate = useNavigate();
  const { setQuizInfo } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubjectId, setLoadingSubjectId] = useState(null);
  const [firstIncompleteTopic, setFirstIncompleteTopic] = useState(null);
  const handleStartQuiz = (topicId) => {
    navigate(`/quiz/${topicId}`);
  };
  
  const handleContinueLearning = async () => {
    // Find the subject
    console.log(path)
    function findFirstIncompleteTopic(data) {
    for (const subject of data.subjects) {
        for (const topic of subject.topics) {
            if (!topic.is_completed) {
                topic.subject = {subject_name: subject.subject_name, assessment: subject.assessment};
                return topic;
            }
        }
    }
    return null; // Return null if no incomplete topic is found
    }
    const incomplete_topic = findFirstIncompleteTopic(path); 
    setFirstIncompleteTopic(incomplete_topic);
    console.log(incomplete_topic)
    if (!incomplete_topic) return;

    try {
      setIsLoading(true);
      setLoadingSubjectId(incomplete_topic.id);
      const quizData = await getQuizByTopicName(incomplete_topic.topic_name);
      console.log(incomplete_topic)
      quizData.subject = incomplete_topic.subject
      quizData.topic = incomplete_topic.topic_name
      console.log(quizData)

      setQuizInfo(quizData, incomplete_topic.id);
      navigate('/quiz');
    } catch (error) {
      console.error('Error fetching quiz:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
      setLoadingSubjectId(null);
    }
  };
  
  const handleTakeAssessment = (topicId) => {
    navigate(`/assessment/${topicId}`);
  };

  const { learningPath } = useLearningPath();
  
  // Check if learning path exists
  const hasLearningPath = learningPath && learningPath.learning_path;
  
  // Render message if no learning path exists
  if (!hasLearningPath) {
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
  }
  
  // Process the learning path data if it exists
  const path = JSON.parse(learningPath.learning_path);
  path.created_at = new Date(learningPath.created_at);
  path.progressPercentage = (learningPath.completed_topics/learningPath.total_topics) * 100;
  console.log(path)
  return (
    <div className="space-y-6">
      {/* Learning path overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Learning Path</h2>
            <p className="text-gray-500 mt-1">
              Project: {path.learning_path_name} • Generated on {format(path.created_at, 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${path.progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{Math.round(path.progressPercentage)}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {learningPath.completed_topics} of {learningPath.total_topics} topics completed
            </p>
          </div>
        </div>
      </div>
      
      {/* Learning path timeline */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Learning Timeline</h2>
            <p className="text-sm text-gray-500 mt-1">Estimated {path.total_estimated_hours} hours to complete</p>
          </div>

          <button
            onClick={() => handleContinueLearning()}
            disabled={isLoading || !firstIncompleteTopic}
            className={`px-4 py-2 w-36 text-sm font-medium text-white ${isLoading && loadingSubjectId === firstIncompleteTopic.id ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} rounded-md flex items-center justify-center`}
          >
            {isLoading && loadingSubjectId === firstIncompleteTopic.id ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : 'Take Next Quiz'}
          </button>
          {/* <button 
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Schedule Learning
          </button> */}
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline items */}
          <div className="divide-y divide-gray-100">
            {path.subjects.map((topic, index) => (
              <div key={topic.id} className="p-6 pl-16 relative">
                {topic.is_completed = topic.is_completed === 'true'}
                {topic.is_started = topic.is_started === 'true'}
                {/* Timeline marker */}
                <div className={`absolute left-6 top-8 w-4 h-4 rounded-full border-2 ${
                  topic.is_completed ? 'bg-green-500 border-green-500' :
                  topic.is_started ? 'bg-white border-indigo-500' :
                  'bg-white border-gray-300'
                }`}></div>
                
                {/* Topic content */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className='flex justify-between w-full'>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-md font-medium text-gray-900">{topic.subject_name}</h3>
                      <div className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        topic.is_completed ? 'bg-green-100 text-green-800' :
                        topic.is_started ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {topic.is_completed ? 'Completed' : 
                         topic.is_started ? 'In Progress' : 
                         'Not Started'}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Estimated {topic.estimated_hours} hours</span>
                    </div>
                    
                    {/* Subtopics */}
                    <div className="mt-3 space-y-1">
                      {topic.topics.map((subtopic, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          {subtopic.is_completed = subtopic.is_completed === 'true'}
                          {subtopic.is_completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div>
                          )}
                          <span className={subtopic.is_completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                            {subtopic.topic_name}
                          </span>
                        </div>
                      ))}
                    </div>
                    </div>
                    {/* Resources */}
                    <div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Official Documentation:</p>
                      <div className="mt-1 space-y-1">
                        {topic?.official_docs?.map(resource => (
                          <a 
                            key={resource.id}
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 block"
                          >
                            {topic.subject_name.slice(0, 20)}...
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                    {!topic.is_completed && (
                      <>
                        {/* <button
                          onClick={() => handleTakeAssessment(topic.id)}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                        >
                          Take Assessment
                        </button> */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
