import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null);
  const [topicId, setTopicId] = useState(null);

  const setQuizInfo = (data, id) => {
    setQuizData(data);
    setTopicId(id);
  };

  const clearQuizInfo = () => {
    setQuizData(null);
    setTopicId(null);
  };

  return (
    <QuizContext.Provider value={{ quizData, topicId, setQuizInfo, clearQuizInfo }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
