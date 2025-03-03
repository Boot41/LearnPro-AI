import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, Clock } from 'lucide-react';

// Mock assessment data
const assessments = {
  '1': {
    topicName: 'JavaScript Fundamentals',
    timeLimit: 15, // minutes
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'What is the output of: console.log(typeof null)?',
        options: [
          { id: 'a', text: '"null"' },
          { id: 'b', text: '"object"' },
          { id: 'c', text: '"undefined"' },
          { id: 'd', text: '"boolean"' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '2',
        question: 'Which method removes the last element from an array and returns it?',
        options: [
          { id: 'a', text: 'shift()' },
          { id: 'b', text: 'unshift()' },
          { id: 'c', text: 'pop()' },
          { id: 'd', text: 'push()' }
        ],
        correctAnswer: 'c'
      },
      {
        id: '3',
        question: 'What is the correct way to create a function in JavaScript?',
        options: [
          { id: 'a', text: 'function = myFunction() {}' },
          { id: 'b', text: 'function:myFunction() {}' },
          { id: 'c', text: 'function myFunction() {}' },
          { id: 'd', text: 'create myFunction() {}' }
        ],
        correctAnswer: 'c'
      },
      {
        id: '4',
        question: 'Which operator is used for strict equality comparison?',
        options: [
          { id: 'a', text: '==' },
          { id: 'b', text: '===' },
          { id: 'c', text: '!=' },
          { id: 'd', text: '!==' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '5',
        question: 'What does the "this" keyword refer to in JavaScript?',
        options: [
          { id: 'a', text: 'The current function' },
          { id: 'b', text: 'The global object' },
          { id: 'c', text: 'The object that owns the executing code' },
          { id: 'd', text: 'The parent object' }
        ],
        correctAnswer: 'c'
      }
    ]
  },
  '2': {
    topicName: 'React Basics',
    timeLimit: 20, // minutes
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'What is the correct way to update state in a React component?',
        options: [
          { id: 'a', text: 'this.state.count = this.state.count + 1' },
          { id: 'b', text: 'this.setState({ count: this.state.count + 1 })' },
          { id: 'c', text: 'this.state = { count: this.state.count + 1 }' },
          { id: 'd', text: 'state.count = state.count + 1' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '2',
        question: 'Which hook would you use to perform side effects in a function component?',
        options: [
          { id: 'a', text: 'useState' },
          { id: 'b', text: 'useEffect' },
          { id: 'c', text: 'useContext' },
          { id: 'd', text: 'useReducer' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '3',
        question: 'What is the purpose of keys in React lists?',
        options: [
          { id: 'a', text: 'To style list items differently' },
          { id: 'b', text: 'To access list items from the parent component' },
          { id: 'c', text: 'To help React identify which items have changed, are added, or are removed' },
          { id: 'd', text: 'To encrypt the list data for security' }
        ],
        correctAnswer: 'c'
      },
      {
        id: '4',
        question: 'What is the correct lifecycle method to use for API calls in class components?',
        options: [
          { id: 'a', text: 'componentWillMount' },
          { id: 'b', text: 'componentDidMount' },
          { id: 'c', text: 'componentWillUpdate' },
          { id: 'd', text: 'componentDidUpdate' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '5',
        question: 'How do you pass data from a parent to a child component in React?',
        options: [
          { id: 'a', text: 'Using state' },
          { id: 'b', text: 'Using props' },
          { id: 'c', text: 'Using context' },
          { id: 'd', text: 'Using Redux' }
        ],
        correctAnswer: 'b'
      }
    ]
  }
};

const Assessment = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [currentAssessmentData, setCurrentAssessmentData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    if (topicId && assessments[topicId]) {
      const assessmentData = assessments[topicId];
      setCurrentAssessmentData(assessmentData);
      setTimeRemaining(assessmentData.timeLimit * 60); // Convert minutes to seconds
    } else {
      // Handle invalid topic ID
      navigate('/dashboard');
    }
  }, [topicId, navigate]);
  
  // Timer effect
  useEffect(() => {
    if (!currentAssessmentData || assessmentCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }
  )
}
export default Assessment
