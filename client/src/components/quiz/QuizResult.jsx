import React from 'react';
import { CheckCircle, XCircle, Award, RotateCcw, Home } from 'lucide-react';

const QuizResult = ({ results, onRetry, onBackToDashboard }) => {
  const { 
    score, 
    correctCount, 
    totalQuestions, 
    passed, 
    passingScore, 
    topicName,
    detailedResults 
  } = results;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
          passed ? 'bg-green-100' : 'bg-red-100'
        } mb-4`}>
          {passed ? (
            <Award className={`h-8 w-8 text-green-600`} />
          ) : (
            <XCircle className={`h-8 w-8 text-red-600`} />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          {passed ? 'Congratulations!' : 'Better Luck Next Time'}
        </h1>
        
        <p className="text-gray-600 mt-2">
          {passed 
            ? `You passed the ${topicName} quiz with a score of ${score}%.` 
            : `You didn't pass the ${topicName} quiz. The passing score is ${passingScore}%.`}
        </p>
      </div>
      
      {/* Score overview */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600">{score}%</div>
            <div className="text-sm text-gray-500">Your Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600">{correctCount}</div>
            <div className="text-sm text-gray-500">Correct Answers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600">{passingScore}%</div>
            <div className="text-sm text-gray-500">Passing Score</div>
          </div>
        </div>
      </div>
      
      {/* Details of answers */}
      {detailedResults && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Question Details</h2>
          <div className="space-y-4">
            {detailedResults.map((item) => (
              <div 
                key={item.questionId} 
                className={`p-4 rounded-lg border ${
                  item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {item.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{item.question}</p>
                    {!item.isCorrect && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-500">
                          Your answer: {item.userAnswer ? detailedResults.find(q => q.questionId === item.questionId)?.options?.find(o => o.id === item.userAnswer)?.text || 'None'  : 'None'}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Correct answer: {item.correctAnswer ? detailedResults.find(q => q.questionId === item.questionId)?.options?.find(o => o.id === item.correctAnswer)?.text || 'Unknown' : 'Unknown'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          onClick={onRetry}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Retry Quiz
        </button>
        <button
          onClick={onBackToDashboard}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
