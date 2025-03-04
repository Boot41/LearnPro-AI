import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

const QuizActions = ({ 
  isAnswerSubmitted, 
  hasSelectedOption, 
  onSubmitAnswer, 
  onNextQuestion, 
  onFinishQuiz, 
  isLastQuestion 
}) => {
  return (
    <div className="flex justify-end mt-6">
      {!isAnswerSubmitted ? (
        <button
          onClick={onSubmitAnswer}
          disabled={!hasSelectedOption}
          className={`px-6 py-2 flex items-center rounded-md ${
            hasSelectedOption 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Check className="h-5 w-5 mr-2" />
          Submit Answer
        </button>
      ) : (
        <button
          onClick={isLastQuestion ? onFinishQuiz : onNextQuestion}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default QuizActions;
