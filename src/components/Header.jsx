import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FaBell, FaSignOutAlt, FaUser, FaChevronDown, FaFileAlt, FaBriefcase, FaExchangeAlt, FaCalendarAlt, FaUserTie, FaTachometerAlt, FaRocket } from 'react-icons/fa';
import { toast } from 'react-toastify';

const navItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { path: '/student/resume-analyzer', label: 'Resume Analyzer', icon: FaFileAlt },
  { path: '/student/job-analyzer', label: 'Job Analyzer', icon: FaBriefcase },
  { path: '/student/skill-gap', label: 'Skill Gap', icon: FaExchangeAlt },
  { path: '/student/prep-plan', label: 'Prep Plan', icon: FaCalendarAlt },
  { path: '/student/mock-interview', label: 'Mock Interview', icon: FaUserTie },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = [
    { id: 1, text: "🎯 Upload your resume to get started!", time: "Now" },
    { id: 2, text: "📚 Analyze a job description to find skill gaps", time: "Tip" },
    { id: 3, text: "🔥 Complete all 6 modules for full readiness!", time: "Goal" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-dark-100 sticky top-0 z-30">
      {/* Top bar */}
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
        {/* Left: Logo and title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
            <FaRocket className="text-white text-sm" />
          </div>
          <div>
            <h1 className="text-base font-bold text-dark-800 leading-tight">
              <span className="gradient-text">Placement Coach</span>
            </h1>
            <p className="text-[10px] text-dark-400 leading-tight">AI-Powered Preparation</p>
          </div>
        </div>

        {/* Center: Navigation (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-dark-500 hover:bg-dark-50 hover:text-dark-700'
                  }`}
              >
                <item.icon className={`text-xs ${isActive ? 'text-primary-600' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Notifications and Profile */}
        <div className="flex items-center gap-2">
          {/* Mobile nav toggle */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="lg:hidden p-2 hover:bg-dark-50 rounded-xl transition-colors text-dark-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-dark-50 rounded-xl transition-colors"
            >
              <FaBell className="text-dark-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-dark-100 overflow-hidden z-50">
                <div className="p-3 border-b border-dark-100">
                  <h3 className="font-semibold text-dark-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-dark-50 cursor-pointer border-b border-dark-50">
                      <p className="text-sm text-dark-700">{n.text}</p>
                      <p className="text-xs text-dark-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-dark-50 rounded-xl transition-colors"
            >
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'}
                alt="avatar"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <FaChevronDown className="text-xs text-dark-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-dark-100 overflow-hidden z-50">
                <div className="p-3 border-b border-dark-100">
                  <p className="font-medium text-dark-800 text-sm">{user?.name}</p>
                  <p className="text-xs text-dark-400">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { navigate('/student/profile'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark-600 hover:bg-dark-50 rounded-xl transition-colors"
                  >
                    <FaUser className="text-xs" /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <FaSignOutAlt className="text-xs" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileNav && (
        <div className="lg:hidden border-t border-dark-100 bg-white px-4 py-2">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setShowMobileNav(false); }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all
                    ${isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-dark-500 hover:bg-dark-50'
                    }`}
                >
                  <item.icon className={`text-lg ${isActive ? 'text-primary-600' : ''}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
