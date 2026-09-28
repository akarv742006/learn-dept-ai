import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';

// Public Pages
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PricingPage } from './pages/PricingPage';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentConcepts } from './pages/StudentConcepts';
import { StudentLearningDebt } from './pages/StudentLearningDebt';
import { StudentLearningPath } from './pages/StudentLearningPath';
import { StudentAssessments, StudentQuiz } from './pages/StudentAssessments';
import { StudentAnalytics } from './pages/StudentAnalytics';
import { StudentAIAssistant } from './pages/StudentAIAssistant';
import { StudentNotifications, StudentProfile, StudentSettings } from './pages/StudentNotifications';

// Teacher Pages
import { TeacherDashboard } from './pages/TeacherDashboard';
import { TeacherStudents } from './pages/TeacherStudents';
import { TeacherStudentDetail } from './pages/TeacherStudentDetail';
import { TeacherLearningGaps } from './pages/TeacherLearningGaps';
import { TeacherInterventions } from './pages/TeacherInterventions';
import {
  TeacherConcepts,
  TeacherAssessments,
  TeacherLearningPaths,
  TeacherReports,
  TeacherAnalytics,
  TeacherNotifications,
  TeacherSettings,
} from './pages/TeacherConcepts';

// Parent Pages
import { ParentDashboard } from './pages/ParentDashboard';
import { ParentProgress, ParentLearningDebt, ParentNotifications, ParentProfile } from './pages/ParentProgress';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import {
  AdminUsers,
  AdminStudents,
  AdminTeachers,
  AdminClasses,
  AdminSubjects,
  AdminAssessments,
  AdminReports,
  AdminSettings,
} from './pages/AdminUsers';
import { AdminAITestPage } from './pages/AdminAITestPage';
import { AdminDatabaseStatusPage } from './pages/AdminDatabaseStatusPage';
import { AdminRevenuePage } from './pages/AdminRevenuePage';
import { AdminRevenueForecastPage } from './pages/AdminRevenueForecastPage';
import { AdminSubscriptionPage } from './pages/AdminSubscriptionPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={<LandingPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Student Protected Routes */}
            <Route path="/student" element={<AppLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="concepts" element={<StudentConcepts />} />
              <Route path="learning-debt" element={<StudentLearningDebt />} />
              <Route path="learning-path" element={<StudentLearningPath />} />
              <Route path="assessments" element={<StudentAssessments />} />
              <Route path="quiz" element={<StudentQuiz />} />
              <Route path="analytics" element={<StudentAnalytics />} />
              <Route path="ai-assistant" element={<StudentAIAssistant />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* Teacher Protected Routes */}
            <Route path="/teacher" element={<AppLayout />}>
              <Route index element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="students" element={<TeacherStudents />} />
              <Route path="student/:id" element={<TeacherStudentDetail />} />
              <Route path="concepts" element={<TeacherConcepts />} />
              <Route path="learning-gaps" element={<TeacherLearningGaps />} />
              <Route path="interventions" element={<TeacherInterventions />} />
              <Route path="assessments" element={<TeacherAssessments />} />
              <Route path="learning-paths" element={<TeacherLearningPaths />} />
              <Route path="reports" element={<TeacherReports />} />
              <Route path="analytics" element={<TeacherAnalytics />} />
              <Route path="notifications" element={<TeacherNotifications />} />
              <Route path="settings" element={<TeacherSettings />} />
            </Route>

            {/* Parent Protected Routes */}
            <Route path="/parent" element={<AppLayout />}>
              <Route index element={<Navigate to="/parent/dashboard" replace />} />
              <Route path="dashboard" element={<ParentDashboard />} />
              <Route path="progress" element={<ParentProgress />} />
              <Route path="learning-debt" element={<ParentLearningDebt />} />
              <Route path="notifications" element={<ParentNotifications />} />
              <Route path="profile" element={<ParentProfile />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AppLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="assessments" element={<AdminAssessments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="revenue" element={<AdminRevenuePage />} />
              <Route path="revenue/forecast" element={<AdminRevenueForecastPage />} />
              <Route path="subscription" element={<AdminSubscriptionPage />} />
              <Route path="subscriptions" element={<AdminSubscriptionPage />} />
              <Route path="analytics" element={<AdminRevenuePage />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="ai-test" element={<AdminAITestPage />} />
              <Route path="database-status" element={<AdminDatabaseStatusPage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
