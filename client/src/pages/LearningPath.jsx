import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearningPath } from '../contexts/LearningPathContext';
import { useQuiz } from '../contexts/QuizContext';
import { getQuizByTopicName } from '../services/quizService';

// Import components
import NoLearningPath from '../components/learning-path/NoLearningPath';
import LearningPathOverview from '../components/learning-path/LearningPathOverview';
import LearningTimeline from '../components/learning-path/LearningTimeline';

const LearningPath = () => {
  const navigate = useNavigate();
  const { setQuizInfo } = useQuiz();
  const { learningPath, skillAssessment } = useLearningPath();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubjectId, setLoadingSubjectId] = useState(null);
  const [firstIncompleteTopic, setFirstIncompleteTopic] = useState(null);
  const [pathData, setPathData] = useState(null);

  // Process the learning path data when it changes
  useEffect(() => {
    if (learningPath && learningPath.learning_path) {
      const parsedPath = JSON.parse(learningPath.learning_path);
      parsedPath.created_at = new Date(learningPath.created_at);
      setPathData(parsedPath);
      
      // Find first incomplete topic
      findFirstIncompleteTopic(parsedPath);
    }
  }, [learningPath]);

  // Function to find the first incomplete topic
  const findFirstIncompleteTopic = (data) => {
    if (!data || !data.subjects) return null;
    
    for (const subject of data.subjects) {
      for (const topic of subject.topics) {
        const isCompleted = topic.is_completed === 'true' || topic.is_completed === true;
        if (!isCompleted) {
          topic.subject = {
            subject_name: subject.subject_name, 
            assessment: subject.assessment
          };
          setFirstIncompleteTopic(topic);
          return;
        }
      }
    }
    setFirstIncompleteTopic(null);
  };

  // Handle continue learning button click
  const handleContinueLearning = async () => {
    if (!firstIncompleteTopic) return;

    try {
      setIsLoading(true);
      setLoadingSubjectId(firstIncompleteTopic.id);
      
      const quizData = await getQuizByTopicName(firstIncompleteTopic.topic_name);
      quizData.subject = firstIncompleteTopic.subject;
      quizData.topic = firstIncompleteTopic.topic_name;

      setQuizInfo(quizData, firstIncompleteTopic.id);
      navigate('/quiz');
    } catch (error) {
      console.error('Error fetching quiz:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
      setLoadingSubjectId(null);
    }
  };
  
  // Check if learning path exists
  const hasLearningPath = learningPath && learningPath.learning_path;
  const hasSkillAssessment = skillAssessment;
  
  // Render message if no learning path exists
  useEffect(() => { 
    if (!hasLearningPath) {
      if (hasSkillAssessment) {
      navigate("/skill-assessment");
    }
    else {
      return <NoLearningPath />;
    }
    }
  }, [hasLearningPath, hasSkillAssessment]);
  
  // If path data is not yet processed, show loading
  if (!pathData) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Learning path overview */}
      <LearningPathOverview 
        path={pathData} 
        completedTopics={learningPath.completed_topics} 
        totalTopics={learningPath.total_topics} 
      />
      
      {/* Learning path timeline */}
      <LearningTimeline 
        path={pathData}
        isLoading={isLoading}
        loadingSubjectId={loadingSubjectId}
        firstIncompleteTopic={firstIncompleteTopic}
        handleContinueLearning={handleContinueLearning}
      />
    </div>
  );
};

export default LearningPath;
