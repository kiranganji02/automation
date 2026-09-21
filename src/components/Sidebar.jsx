import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome, FaListUl, FaChartLine, FaUser, FaCode, FaFileAlt,
  FaSearch, FaYoutube, FaKeyboard, FaRobot, FaLightbulb,
  FaTrophy, FaFire, FaComments, FaClipboardCheck, FaUserTie,
  FaRocket, FaTimes, FaGraduationCap, FaBrain, FaBriefcase,
  FaChartBar, FaCalculator
} from 'react-icons/fa';

const studentMenuItems = [
  { path: '/student/dashboard', icon: FaHome, label: 'Dashboard' },
  { path: '/student/todo', icon: FaListUl, label: 'To-Do List' },
  { path: '/student/skills-tracker', icon: FaChartLine, label: 'Skills Tracker' },
  { path: '/student/profile', icon: FaUser, label: 'Profile' },
  { path: '/student/coding-practice', icon: FaCode, label: 'Coding Practice' },
  { path: '/student/resume', icon: FaFileAlt, label: 'Resume Builder' },
  { path: '/student/resume-analyzer', icon: FaSearch, label: 'Resume Analyzer' },
  { path: '/student/youtube-videos', icon: FaYoutube, label: 'YouTube Videos' },
  { path: '/student/typing-test', icon: FaKeyboard, label: 'Typing Test' },
  { path: '/student/chatbot', icon: FaRobot, label: 'AI Chatbot' },
  { path: '/student/skill-suggestions', icon: FaLightbulb, label: 'Skill Suggestions' },
  { path: '/student/achievements', icon: FaTrophy, label: 'Achievements' },
  { path: '/student/trending-streams', icon: FaFire, label: 'Trending Streams' },
  { path: '/student/communication-practice', icon: FaComments, label: 'Communication' },
  { path: '/student/mock-test', icon: FaClipboardCheck, label: 'Mock Test' },
  { path: '/student/mock-interview', icon: FaUserTie, label: 'Mock Interview' },
  
  // New Features (6-10)
  { path: '/student/interview-simulator', icon: FaBrain, label: 'AI Interview Simulator' },
  { path: '/student/interview-evaluation', icon: FaChartBar, label: 'Interview Evaluation' },
  { path: '/student/coding-assessment', icon: FaCode, label: 'Coding Assessment' },
  { path: '/student/aptitude-prep', icon: FaCalculator, label: 'Aptitude Prep' },
  { path: '/student/career-recommendation', icon: FaBriefcase, label: 'Career Recommendation' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        className={`fixed top-0 left-0 h-full bg-white border-r border-dark-100 z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 lg:w-64`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
              <FaRocket className="text-white text-sm" />
            </div>
            <div>
              <h2 className="font-bold text-dark-800 text-sm leading-tight">Placement</h2>
              <h2 className="font-bold gradient-text text-sm leading-tight">Coach</h2>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-dark-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-dark-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 h-[calc(100vh-80px)]">
          <div className="px-3 space-y-1">
            {studentMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-dark-500 hover:bg-dark-50 hover:text-dark-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`text-base flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`} />
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
