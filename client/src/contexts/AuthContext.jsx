import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserLearningPath, loginUser, getSkillAssessmentQuiz } from '../services';
import { registerUser } from '../services/authService';
import { setAuthToken } from '../utils/auth';

// Create context
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLearningPath, setHasLearningPath] = useState(false);
  const [quiz, setQuiz] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    console.log("AuthProvider - Initial Mount");
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Also restore learning path status from localStorage
      const storedHasLearningPath = localStorage.getItem('hasLearningPath');
      setHasLearningPath(storedHasLearningPath === 'true');
      
      checkLearningPathAndQuiz();
    }
    setIsLoading(false);
  }, []);

  // Function to check learning path and get quiz if needed
  const checkLearningPathAndQuiz = async () => {
    console.log("AuthProvider - Checking learning path and quiz");
    if (!user || user.role !== 'employee') return;

    try {
      console.log("Fetching learning path for user:", user.id);
      const learningPathResponse = await getUserLearningPath(user.id);
      const hasPath = !!learningPathResponse?.learning_path;
      console.log("Learning path response:", { hasPath, response: learningPathResponse });
      
      setHasLearningPath(hasPath);
      localStorage.setItem('hasLearningPath', JSON.stringify(hasPath));

      if (!hasPath && user.project?.id) {
        console.log("No learning path found, fetching quiz for project:", user.project.id);
        try {
          const quizData = await getSkillAssessmentQuiz(user.project.id);
          console.log("Quiz data received:", quizData);
          setQuiz(quizData);
        } catch (quizError) {
          console.error('Error fetching skill assessment quiz:', quizError);
          setQuiz(null);
        }
      } else {
        setQuiz(null);
      }
    } catch (error) {
      console.log("Error response from learning path check:", error);
      // Check if this is a 404 "No learning path found" error
      if (error.message?.includes('404') || error.message?.includes('No learning path found')) {
        console.log("404 or No learning path found error detected");
        setHasLearningPath(false);
        localStorage.setItem('hasLearningPath', 'false');
        
        // Try to get quiz if learning path check fails
        if (user.project?.id) {
          try {
            console.log("Fetching quiz after 404 error");
            const quizData = await getSkillAssessmentQuiz(user.project.id);
            console.log("Quiz data received after 404:", quizData);
            setQuiz(quizData);
          } catch (quizError) {
            console.error('Error fetching skill assessment quiz:', quizError);
            setQuiz(null);
          }
        }
      } else {
        console.error('Error checking learning path:', error);
        setHasLearningPath(false);
        localStorage.setItem('hasLearningPath', 'false');
      }
    }
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login for:", email);
      // Use the authService to login
      const response = await loginUser(email, password);
      
      if (!response || response.error) {
        setIsLoading(false);
        throw new Error(response?.error || 'Invalid credentials');
      }
      
      // Transform the response to match our User interface
      const userData = {
        id: response.id.toString(),
        name: response.user?.first_name && response.user?.last_name
          ? `${response.user.first_name} ${response.user.last_name}`.trim()
          : email.split('@')[0], // Use part before @ as name if no first/last name
        email: email,
        role: response.user_type === 'admin' ? 'admin' : 'employee',
      };
      setAuthToken(response.access_token); 
      console.log("Login successful, user data:", userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); 
      // Check learning path and quiz for employee users
      // if (userData.role === 'employee') {
      //   await checkLearningPathAndQuiz();
      // }      
      setIsLoading(false);
      return userData
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Register function
  const register = async (name, email, password, role) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting registration for:", email);
      const response = await registerUser(email, password, name, role);
      
      if (!response || response.error) {
        setIsLoading(false);
        throw new Error(response?.error || 'Registration failed');
      }
       
      // After successful registration, log the user in
      await login(email, password);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setHasLearningPath(false);
    setQuiz(null);
    localStorage.removeItem('user');
    localStorage.removeItem('hasLearningPath');
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasLearningPath,
    quiz,
    login,
    register,
    logout,
    checkLearningPathAndQuiz
  };

  console.log("AuthProvider - Current State:", {
    isAuthenticated: !!user,
    hasLearningPath,
    hasQuiz: !!quiz,
    isLoading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};