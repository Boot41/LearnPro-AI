import React from 'react';
import { ArrowRight } from 'lucide-react';

const QuizActions = ({ 
  isAnswerSubmitted, 
  selectedOption, 
  onSubmitAnswer, 
  onNextQuestion, 
  isLastQuestion 
}) => {
  return (
    <div className="flex justify-between items-center">
      {!isAnswerSubmitted ? (
        <button
          onClick={onSubmitAnswer}
          disabled={!selectedOption}
          className={`px-6 py-2 rounded-md ${
            selectedOption
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={onNextQuestion}
          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {!isLastQuestion ? 'Next Question' : 'Finish Quiz'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      )}
    </div>
  );
};

export default QuizActions;
