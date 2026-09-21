import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

import Login from './components/Login';
import StudentLayout from './components/StudentLayout';

// Core 6 Modules
import Dashboard from './pages/student/Dashboard';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import JobAnalyzer from './pages/student/JobAnalyzer';
import SkillGap from './pages/student/SkillGap';
import PrepPlan from './pages/student/PrepPlan';
import MockInterview from './pages/student/MockInterview';

// Additional Pages
import TodoList from './pages/student/TodoList';
import SkillsTracker from './pages/student/SkillsTracker';
import Profile from './pages/student/Profile';
import CodingPractice from './pages/student/CodingPractice';
import Resume from './pages/student/Resume';
import YouTubeVideos from './pages/student/YouTubeVideos';
import TypingTest from './pages/student/TypingTest';
import Chatbot from './pages/student/Chatbot';
import SkillSuggestions from './pages/student/SkillSuggestions';
import Achievements from './pages/student/Achievements';
import TrendingStreams from './pages/student/TrendingStreams';
import CommunicationPractice from './pages/student/CommunicationPractice';
import MockTest from './pages/student/MockTest';

// New Feature Pages (Features 6-10)
import InterviewSimulator from './pages/student/InterviewSimulator';
import InterviewEvaluation from './pages/student/InterviewEvaluation';
import CodingAssessment from './pages/student/CodingAssessment';
import AptitudePrep from './pages/student/AptitudePrep';
import CareerRecommendation from './pages/student/CareerRecommendation';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Core 6 Modules */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="job-analyzer" element={<JobAnalyzer />} />
            <Route path="skill-gap" element={<SkillGap />} />
            <Route path="prep-plan" element={<PrepPlan />} />
            <Route path="mock-interview" element={<MockInterview />} />

            {/* Additional Pages */}
            <Route path="todo" element={<TodoList />} />
            <Route path="skills-tracker" element={<SkillsTracker />} />
            <Route path="profile" element={<Profile />} />
            <Route path="coding-practice" element={<CodingPractice />} />
            <Route path="resume" element={<Resume />} />
            <Route path="youtube-videos" element={<YouTubeVideos />} />
            <Route path="typing-test" element={<TypingTest />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="skill-suggestions" element={<SkillSuggestions />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="trending-streams" element={<TrendingStreams />} />
            <Route path="communication-practice" element={<CommunicationPractice />} />
            <Route path="mock-test" element={<MockTest />} />

            {/* New Features (6-10) */}
            <Route path="interview-simulator" element={<InterviewSimulator />} />
            <Route path="interview-evaluation" element={<InterviewEvaluation />} />
            <Route path="coding-assessment" element={<CodingAssessment />} />
            <Route path="aptitude-prep" element={<AptitudePrep />} />
            <Route path="career-recommendation" element={<CareerRecommendation />} />
          </Route>

          {/* HR Routes */}
          <Route path="/hr">
            <Route path="dashboard" element={<HRDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
