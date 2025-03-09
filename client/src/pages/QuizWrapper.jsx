import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useLearningPath } from '../contexts/LearningPathContext';
import { updateLearningPath } from '../services/learningPathService';
import Quiz from './Quiz';

const QuizWrapper = () => {
  const { quizData, topicId } = useQuiz();
  const navigate = useNavigate();
  const location = useLocation();
  const { learningPath, setLearningPath } = useLearningPath();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuizCompletion = async (results) => {
    const topicScores = results.topicScores;
    const score = Object.values(topicScores)[0].percentage;
    const threshold = quizData.subject.assessment.threshold * 100;
    console.log(quizData) 
    // Check if the user passed the quiz
    if (score >= threshold) {
      try {
        setIsUpdating(true);
        console.log("Quiz passed!");
        
        // Parse the current learning path
        const learningPathData = JSON.parse(learningPath.learning_path);
        const currentSubjectName = quizData.subject.subject_name;
        console.log(quizData)
        const currentTopicName = quizData.topic;
        
        // Find the subject and topic to update
        const subjectIndex = learningPathData.subjects.findIndex(
          subject => subject.subject_name === currentSubjectName
        );
        
        console.log(subjectIndex)
        if (subjectIndex !== -1) {
          const subject = learningPathData.subjects[subjectIndex];
          console.log(subject.topics)
          console.log(currentTopicName)
          const topicIndex = subject.topics.findIndex(
            topic => topic.topic_name === currentTopicName
          );
          
          if (topicIndex !== -1) {
            // Mark the topic as completed
            subject.topics[topicIndex].is_completed = "true";
            
            // Check if this is the last topic in the subject
            const allTopicsCompleted = subject.topics.every(topic => topic.is_completed==="true");
            
            if (allTopicsCompleted) {
              // Mark the subject as completed
              subject.is_completed = "true";
              // Update assessment status and score
              subject.assessment.status = "completed";
              subject.assessment.score = score / 100; // Convert percentage to decimal
            } else {
              // Mark the subject as started if not already
              subject.is_started = "true";
            }
            
            // Calculate total completed topics
            const completedTopics = learningPathData.subjects.reduce(
              (total, subject) => total + subject.topics.filter(topic => topic.is_completed==="true").length,
              0
            );
            
            // Calculate total topics
            const totalTopics = learningPathData.subjects.reduce(
              (total, subject) => total + subject.topics.length,
              0
            );
            console.log(totalTopics,completedTopics) 
            // Prepare the data for the API request
            const updateData = {
              learning_path: JSON.stringify(learningPathData),
              total_topics: totalTopics,
              completed_topics: completedTopics
            };
            
            // Call the API to update the learning path
            const updatedLearningPath = await updateLearningPath(updateData);
            
            // Update the context with the new learning path
            setLearningPath(updatedLearningPath);
            
            console.log("Learning path updated successfully!");
          }
        }
      } catch (error) {
        console.error("Error updating learning path:", error);
      } finally {
        setIsUpdating(false);
        navigate('/learning-path');
      }
    } else {
      console.log("Quiz failed. Score:", score, "Threshold:", threshold);
      navigate('/learning-path');
    }
  }
  useEffect(() => {
    // If we have state from navigation, use it to set quiz data
    if (location.state?.quizData) {
      // No need to set in context as it's already passed directly to Quiz
    } else if (!quizData) {
      // If no quiz data in context or location state, redirect to learning path
      navigate('/learning-path');
    }
  }, [quizData, navigate, location.state]);

  // If we have location state, use that directly
  if (location.state?.quizData) {
    return <Quiz quizData={location.state.quizData} onComplete={handleQuizCompletion}  topicId={location.state.topicId} />;
  }

  // Otherwise use data from context
  if (quizData) {
    return <Quiz quizData={quizData} onComplete={handleQuizCompletion} topicId={topicId} />;
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading quiz...</h2>
      </div>
    </div>
  );
};

export default QuizWrapper;
