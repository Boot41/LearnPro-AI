import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LearningPathProvider } from "./contexts/LearningPathContext";
import { QuizProvider } from "./contexts/QuizContext";
import AssignKT from "./pages/AssignKT";
import AssignGitHubKT from "./pages/AssignGitHubKT";
import KnowledgeTransfer from "./pages/KnowledgeTransfer";
import GitHubKnowledgeTransfer from "./pages/GitHubKnowledgeTransfer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import QuizWrapper from "./pages/QuizWrapper";
import LearningPath from "./pages/LearningPath";
import SkillAssessment from "./pages/SkillAssessment";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import VoiceBot from "./pages/VoiceBot";
import ProjectOverview from "./pages/ProjectOverview";

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <LearningPathProvider>
        <QuizProvider>
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
            <Route
              path="/assign_kt"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AssignKT />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assign_github_kt"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AssignGitHubKT />
                </ProtectedRoute>
              }
            />
            {/* Employee Routes */}
            <Route 
              path="/knowledge_transfer"
              element={
                <ProtectedRoute requiredRole="employee">
                  <KnowledgeTransfer />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/github_knowledge_transfer"
              element={
                <ProtectedRoute requiredRole="employee">
                  <GitHubKnowledgeTransfer />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/project_overview"
              element={
                <ProtectedRoute requiredRole="employee">
                  <ProjectOverview />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/voice-ai"
              element={
                <ProtectedRoute requiredRole={"employee"}>
                  <VoiceBot/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/"
              element={
                <ProtectedRoute requiredRole="employee">
                  <QuizWrapper />
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

            {/* Information Pages - Accessible to any authenticated user */}
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              }
            />

            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </QuizProvider>
      </LearningPathProvider>
    </AuthProvider>
  );
}

export default App;
