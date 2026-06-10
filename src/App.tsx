import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { ReactNode } from "react";

import Login from "@/pages/Login/Login";
import Layout from "@/components/Layout/Layout";

import AdminDashboard from "@/pages/admin/Dashboard";
import WeakPoints from "@/pages/admin/WeakPoints";
import TrainingOverview from "@/pages/admin/TrainingOverview";

import ExamManagement from "@/pages/nursing/ExamManagement";
import QuestionBankManagement from "@/pages/nursing/QuestionBankManagement";
import MakeupManagement from "@/pages/nursing/MakeupManagement";
import ScoreManagement from "@/pages/nursing/ScoreManagement";

import TeacherReviewList from "@/pages/teacher/ReviewList";
import ReviewPage from "@/pages/teacher/ReviewPage";
import TeacherScores from "@/pages/teacher/TeacherScores";

import StudentExams from "@/pages/student/StudentExams";
import ExamPage from "@/pages/student/ExamPage";
import StudentScores from "@/pages/student/StudentScores";
import TrainingProfile from "@/pages/student/TrainingProfile";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function LayoutRoute({ children }: { children: ReactNode }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LayoutRoute>
                <AdminDashboard />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/weak-points"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LayoutRoute>
                <WeakPoints />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/training"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LayoutRoute>
                <TrainingOverview />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/nursing/exams"
          element={
            <ProtectedRoute allowedRoles={["nursing"]}>
              <LayoutRoute>
                <ExamManagement />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nursing/questions"
          element={
            <ProtectedRoute allowedRoles={["nursing"]}>
              <LayoutRoute>
                <QuestionBankManagement />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nursing/makeup"
          element={
            <ProtectedRoute allowedRoles={["nursing"]}>
              <LayoutRoute>
                <MakeupManagement />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nursing/scores"
          element={
            <ProtectedRoute allowedRoles={["nursing"]}>
              <LayoutRoute>
                <ScoreManagement />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/teacher/review"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LayoutRoute>
                <TeacherReviewList />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/review/:examId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LayoutRoute>
                <ReviewPage />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/scores"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LayoutRoute>
                <TeacherScores />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/exams"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <LayoutRoute>
                <StudentExams />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exam/:examId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/scores"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <LayoutRoute>
                <StudentScores />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <LayoutRoute>
                <TrainingProfile />
              </LayoutRoute>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
