import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Quiz from './pages/Quiz';
import QuizMCQ from './pages/QuizMCQ';
import LearningPath from './pages/LearningPath';
import Assessment from './pages/Assessment';
import SkillAssessment from './pages/SkillAssessment';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          {/* Admin Routes */}
          <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Employee Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:topicId" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz-mcq/:topicId" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <QuizMCQ />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learning-path" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <LearningPath />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessment/:topicId" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <Assessment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skill-assessment/:projectId" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <SkillAssessment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skill-assessment" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <SkillAssessment />
                </ProtectedRoute>
              } 
            />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
    </AuthProvider>
  );
}

export default App;
