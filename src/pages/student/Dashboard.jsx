import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaFileAlt, FaBriefcase, FaExchangeAlt, FaCalendarAlt, FaUserTie, 
  FaTachometerAlt, FaRocket, FaLightbulb, FaArrowRight, FaCheckCircle, FaClock, 
  FaCode, FaBrain, FaComments, FaTrophy, FaStar, FaChartBar, FaGraduationCap, FaCalculator
} from 'react-icons/fa';
import { Doughnut, Bar, Radar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, 
  BarElement, RadialLinearScale, PointElement, LineElement, Filler
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [data, setData] = useState({
    resumeScore: 0,
    skillMatch: 0,
    interviewScore: 0,
    prepProgress: 0,
    readinessScore: 0,
    readinessGrade: 'D',
    recentActivity: [],
    interviewHistory: [],
    categoryScores: {},
    modulesCompleted: 0,
  });

  useEffect(() => {
    try {
      // Fetch data from localStorage
      const resumeAnalysis = JSON.parse(localStorage.getItem('ipc_resume_analysis') || 'null');
      const skillGap = JSON.parse(localStorage.getItem('ipc_skill_gap') || 'null');
      const interviewHistory = JSON.parse(localStorage.getItem('ipc_interview_history') || '[]');
      const prepProgress = JSON.parse(localStorage.getItem('ipc_prep_progress') || 'null');
      const prepPlan = JSON.parse(localStorage.getItem('ipc_prep_plan') || 'null');
      const jdAnalysis = JSON.parse(localStorage.getItem('ipc_jd_analysis') || 'null');
      const jdData = JSON.parse(localStorage.getItem('ipc_jd_data') || 'null');
      const profileData = JSON.parse(localStorage.getItem('ipc_profile') || 'null');

      // Extract Scores
      const rScore = resumeAnalysis?.scores?.overall || resumeAnalysis?.score || 0;
      const sMatch = skillGap?.score || 0;
      
      let iScore = 0;
      if (interviewHistory.length > 0) {
        iScore = Math.round(interviewHistory.reduce((acc, curr) => acc + (curr.score || curr.overallScore || 0), 0) / interviewHistory.length);
      }

      let pProg = 0;
      if (prepProgress) {
        pProg = prepProgress.progressPercent || 0;
      } else if (prepPlan) {
        const plan = prepPlan.plan || [];
        const total = plan.reduce((acc, u) => acc + (u.tasks?.length || 0), 0);
        const done = plan.reduce((acc, u) => acc + (u.tasks?.filter(t => t.completed)?.length || 0), 0);
        pProg = total > 0 ? Math.round((done / total) * 100) : 0;
      }

      // Calculate Readiness Score (Weighted)
      const resumeWeight = 0.15;
      const technicalWeight = 0.25;
      const aptitudeWeight = 0.20;
      const commWeight = 0.15;
      const interviewWeight = 0.25;

      const aptitudeScore = pProg > 0 ? Math.min(100, pProg + 20) : 40;
      const commScore = iScore > 0 ? Math.min(100, iScore + 10) : 30;
      
      const readiness = Math.round(
        (rScore * resumeWeight) + 
        (sMatch * technicalWeight) + 
        (aptitudeScore * aptitudeWeight) + 
        (commScore * commWeight) + 
        (iScore * interviewWeight)
      );

      let grade = 'D';
      if (readiness >= 80) grade = 'A';
      else if (readiness >= 65) grade = 'B';
      else if (readiness >= 50) grade = 'C';

      // Count completed modules
      let modulesCompleted = 0;
      if (resumeAnalysis) modulesCompleted++;
      if (jdAnalysis || jdData) modulesCompleted++;
      if (skillGap) modulesCompleted++;
      if (prepPlan || prepProgress) modulesCompleted++;
      if (interviewHistory.length > 0 || localStorage.getItem('ipc_interview_simulator_history')) modulesCompleted++;
      if (localStorage.getItem('ipc_coding_assessment_history')) modulesCompleted++;
      if (localStorage.getItem('ipc_aptitude_history')) modulesCompleted++;
      if (localStorage.getItem('ipc_career_recommendations')) modulesCompleted++;

      // Category scores for bar chart
      const categoryScores = {
        'Resume': rScore,
        'Technical': sMatch || 50,
        'Aptitude': aptitudeScore,
        'Communication': commScore,
        'Interview': iScore || 40,
      };

      // Build Activity Feed
      const activities = [];
      if (resumeAnalysis) {
        activities.push({ 
          icon: <FaFileAlt className="text-blue-500" />, 
          title: 'Resume Analyzed', 
          date: resumeAnalysis.timestamp || new Date().toISOString(), 
          result: `Score: ${rScore}%`,
          color: 'blue'
        });
      }
      if (jdAnalysis || jdData) {
        activities.push({ 
          icon: <FaBriefcase className="text-purple-500" />, 
          title: `JD Analyzed: ${jdAnalysis?.role || jdData?.role || 'Role'}`, 
          date: jdAnalysis?.timestamp || jdData?.timestamp || new Date().toISOString(), 
          result: `Level: ${jdAnalysis?.experienceLevel || jdData?.experienceLevel || 'N/A'}`,
          color: 'purple'
        });
      }
      if (skillGap) {
        activities.push({ 
          icon: <FaExchangeAlt className="text-orange-500" />, 
          title: 'Skill Gap Analysis Complete', 
          date: skillGap.timestamp || new Date().toISOString(), 
          result: `Match: ${skillGap.score || 0}% | ${skillGap.missingSkills?.length || 0} gaps`,
          color: 'orange'
        });
      }
      if (interviewHistory.length > 0) {
        interviewHistory.slice(0, 3).forEach(int => {
          activities.push({ 
            icon: <FaUserTie className="text-green-500" />, 
            title: `Mock Interview: ${int.type || int.role || 'Practice'}`, 
            date: int.date || new Date().toISOString(), 
            result: `Score: ${int.score || int.overallScore || 0}%`,
            color: 'green'
          });
        });
      }
      
      activities.sort((a, b) => new Date(b.date) - new Date(a.date));

      setData({
        resumeScore: rScore,
        skillMatch: sMatch,
        interviewScore: iScore,
        prepProgress: pProg,
        readinessScore: readiness,
        readinessGrade: grade,
        recentActivity: activities.slice(0, 6),
        interviewHistory,
        categoryScores,
        modulesCompleted,
        studentName: profileData?.name || user?.name || 'Student',
        targetRole: profileData?.targetRole || '',
        college: profileData?.college || '',
        degree: profileData?.degree || '',
      });
    } catch (e) {
      console.error('Dashboard data loading error:', e);
    }
  }, []);

  // Readiness Gauge Colors
  let readinessColor = '#ef4444';
  let readinessLightColor = '#fca5a5';
  if (data.readinessScore > 40 && data.readinessScore <= 60) { readinessColor = '#f97316'; readinessLightColor = '#fdba74'; }
  if (data.readinessScore > 60 && data.readinessScore <= 80) { readinessColor = '#3b82f6'; readinessLightColor = '#93c5fd'; }
  if (data.readinessScore > 80) { readinessColor = '#22c55e'; readinessLightColor = '#86efac'; }

  const gaugeData = {
    labels: ['Readiness', 'Gap'],
    datasets: [{
      data: [data.readinessScore, 100 - data.readinessScore],
      backgroundColor: [readinessColor, '#f1f5f9'],
      borderWidth: 0,
      cutout: '78%',
      circumference: 180,
      rotation: 270,
    }]
  };

  const radarData = {
    labels: ['DSA', 'Web Dev', 'Aptitude', 'Communication', 'Domain'],
    datasets: [{
      label: 'Skill Profile',
      data: [
        data.prepProgress || 55, 
        data.skillMatch || 60, 
        data.prepProgress ? Math.min(100, data.prepProgress + 15) : 50, 
        data.interviewScore || 45, 
        data.resumeScore || 50
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointRadius: 4,
    }],
  };

  const historyLabels = data.interviewHistory.length > 0 
    ? data.interviewHistory.map((_, i) => `Mock ${i + 1}`).slice(-6) 
    : ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'];
  
  const historyScores = data.interviewHistory.length > 0
    ? data.interviewHistory.map(h => h.score || h.overallScore || 0).slice(-6)
    : [42, 55, 60, 68, 75];

  const trendData = {
    labels: historyLabels,
    datasets: [{
      label: 'Performance Trend',
      data: historyScores,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#8b5cf6',
    }]
  };

  const barData = {
    labels: Object.keys(data.categoryScores),
    datasets: [{
      label: 'Score (%)',
      data: Object.values(data.categoryScores),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
      borderRadius: 8,
      barThickness: 40,
    }]
  };

  const moduleCompletionData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [data.modulesCompleted, Math.max(0, 10 - data.modulesCompleted)],
      backgroundColor: ['#22c55e', '#f1f5f9'],
      borderWidth: 0,
      cutout: '70%',
    }]
  };

  const modules = [
    { name: 'Resume Analyzer', desc: 'Upload & analyze your resume for ATS compatibility', icon: <FaFileAlt />, path: '/student/resume-analyzer', color: 'bg-blue-50 text-blue-600', check: 'ipc_resume_analysis' },
    { name: 'Career Recommendation', desc: 'AI-driven job role recommendations based on your skills', icon: <FaBriefcase />, path: '/student/career-recommendation', color: 'bg-cyan-50 text-cyan-600', check: 'ipc_career_recommendations' },
    { name: 'Job Analyzer', desc: 'Extract requirements from job descriptions', icon: <FaBriefcase />, path: '/student/job-analyzer', color: 'bg-purple-50 text-purple-600', check: 'ipc_jd_analysis' },
    { name: 'Skill Gap', desc: 'Identify missing skills & get action plan', icon: <FaExchangeAlt />, path: '/student/skill-gap', color: 'bg-orange-50 text-orange-600', check: 'ipc_skill_gap' },
    { name: 'AI Interview Simulator', desc: 'HR, technical, behavioral & role-specific mock rounds', icon: <FaBrain />, path: '/student/interview-simulator', color: 'bg-indigo-50 text-indigo-600', check: 'ipc_interview_simulator_history' },
    { name: 'Interview Evaluation', desc: 'Deep analytics on communication, correctness & confidence', icon: <FaChartBar />, path: '/student/interview-evaluation', color: 'bg-violet-50 text-violet-600', check: 'ipc_interview_history' },
    { name: 'Coding Assessment', desc: 'Role-specific coding, MCQs, SQL problems & debugging', icon: <FaCode />, path: '/student/coding-assessment', color: 'bg-emerald-50 text-emerald-600', check: 'ipc_coding_assessment_history' },
    { name: 'Aptitude Preparation', desc: 'Quantitative, logical reasoning & verbal practice', icon: <FaCalculator />, path: '/student/aptitude-prep', color: 'bg-amber-50 text-amber-600', check: 'ipc_aptitude_history' },
    { name: 'Prep Plan', desc: 'Personalized day-wise preparation roadmap', icon: <FaCalendarAlt />, path: '/student/prep-plan', color: 'bg-teal-50 text-teal-600', check: 'ipc_prep_plan' },
    { name: 'Mock Test', desc: 'Aptitude, technical & verbal assessments', icon: <FaGraduationCap />, path: '/student/mock-test', color: 'bg-rose-50 text-rose-600', check: 'ipc_mock_test_scores' },
  ];

  const getModuleStatus = (checkKey) => {
    try {
      const val = localStorage.getItem(checkKey);
      if (!val) return 'Not Started';
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return 'Completed';
      if (parsed && typeof parsed === 'object') return 'Completed';
      return 'Not Started';
    } catch { return 'Not Started'; }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text pb-1">Performance Dashboard</h1>
          <p className="text-slate-500">
            Welcome back, <span className="font-semibold text-slate-700">{data.studentName || user?.name || 'Student'}</span>
            {data.targetRole && <span> • Aspiring <span className="text-primary-600 font-medium">{data.targetRole}</span></span>}
            {data.college && <span> • <span className="text-slate-600">{data.degree ? `${data.degree}, ` : ''}{data.college}</span></span>}
          </p>
        </div>
        <button 
          onClick={() => navigate('/student/prep-plan')} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm font-medium"
        >
          <FaRocket /> Continue Preparation
        </button>
      </div>

      {/* Hero: Readiness Score + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Readiness Gauge */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500"></div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaTachometerAlt className="text-primary-500" /> Placement Readiness
          </h3>
          <div className="w-44 h-44 relative flex items-center justify-center">
            <Doughnut 
              data={gaugeData} 
              options={{ 
                rotation: -90, 
                circumference: 180, 
                maintainAspectRatio: false, 
                plugins: { tooltip: { enabled: false }, legend: { display: false } } 
              }} 
            />
            <div className="absolute bottom-4 flex flex-col items-center">
              <span className="text-4xl font-black" style={{ color: readinessColor }}>{data.readinessScore}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              data.readinessGrade === 'A' ? 'bg-green-100 text-green-700' :
              data.readinessGrade === 'B' ? 'bg-blue-100 text-blue-700' :
              data.readinessGrade === 'C' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              Grade {data.readinessGrade}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {data.readinessScore >= 80 ? 'Placement Ready!' : data.readinessScore >= 60 ? 'On Track' : data.readinessScore >= 40 ? 'Needs Work' : 'Getting Started'}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Resume Score" value={data.resumeScore ? `${data.resumeScore}%` : 'N/A'} icon={<FaFileAlt />} color="text-blue-500" bg="bg-blue-50" />
          <StatCard title="Skill Match" value={data.skillMatch ? `${data.skillMatch}%` : 'N/A'} icon={<FaCode />} color="text-orange-500" bg="bg-orange-50" />
          <StatCard title="Interview Avg" value={data.interviewScore ? `${data.interviewScore}%` : 'N/A'} icon={<FaComments />} color="text-green-500" bg="bg-green-50" />
          <StatCard title="Prep Progress" value={`${data.prepProgress}%`} icon={<FaTrophy />} color="text-purple-500" bg="bg-purple-50" />
        </div>
      </div>

      {/* Module Navigation + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaBrain className="text-accent-500" /> Assessment Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {modules.map((mod, idx) => {
              const status = getModuleStatus(mod.check);
              return (
                <motion.div 
                  whileHover={{ y: -4 }} 
                  key={idx} 
                  onClick={() => navigate(mod.path)} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 cursor-pointer transition-all hover:shadow-md group flex flex-col h-full"
                >
                  <div className={`w-10 h-10 rounded-xl ${mod.color} flex items-center justify-center text-lg mb-3`}>
                    {mod.icon}
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{mod.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4 flex-grow">{mod.desc}</p>
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      status === 'Completed' ? 'text-green-600' : 
                      status === 'In Progress' ? 'text-blue-600' : 'text-slate-400'
                    }`}>
                      {status === 'Completed' && <FaCheckCircle className="inline mr-1" />}
                      {status}
                    </span>
                    <FaArrowRight className="text-slate-300 group-hover:text-primary-500 transition-colors text-sm" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <FaClock className="text-primary-500" /> Recent Activity
          </h3>
          
          {data.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-700 text-sm truncate">{act.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-primary-600 font-medium">{act.result}</span>
                      <time className="text-[10px] text-slate-400">{new Date(act.date).toLocaleDateString()}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-slate-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaStar className="text-slate-300 text-xl" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No activity yet</p>
              <p className="text-slate-400 text-xs mt-1">Start by analyzing your resume</p>
              <button onClick={() => navigate('/student/resume-analyzer')} className="mt-3 text-primary-600 text-sm font-medium hover:underline">
                Get Started →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Performance Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-primary-500" /> Interview Performance Trend
          </h3>
          <div className="h-56">
            <Line 
              data={trendData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { y: { min: 0, max: 100, ticks: { stepSize: 25 } } },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaCode className="text-accent-500" /> Skill Distribution
          </h3>
          <div className="h-56 flex justify-center">
            <Radar 
              data={radarData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 25 }, pointLabels: { font: { size: 11 } } } },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaChartBar className="text-orange-500" /> Category-wise Scores
          </h3>
          <div className="h-56">
            <Bar 
              data={barData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { y: { min: 0, max: 100, ticks: { stepSize: 25 } } },
                plugins: { legend: { display: false } },
                indexAxis: 'x',
              }} 
            />
          </div>
        </div>

        {/* Module Completion */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Module Completion
          </h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-40 h-40">
              <Doughnut 
                data={moduleCompletionData} 
                options={{ 
                  plugins: { tooltip: { enabled: false }, legend: { display: false } },
                  cutout: '70%',
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{data.modulesCompleted}</span>
                <span className="text-xs text-slate-400 font-bold">of 6</span>
              </div>
            </div>
            <div className="space-y-2">
              {modules.map((mod, i) => {
                const status = getModuleStatus(mod.check);
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {status === 'Completed' ? (
                      <FaCheckCircle className="text-green-500 text-xs" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-slate-300" />
                    )}
                    <span className={status === 'Completed' ? 'text-slate-700 font-medium' : 'text-slate-400'}>{mod.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Recommendation Banner */}
      <div className="bg-gradient-to-r from-primary-900 to-indigo-900 rounded-2xl shadow-md p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white/20 p-4 rounded-xl shrink-0">
            <FaLightbulb className="text-4xl text-yellow-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Smart Recommendation</h3>
            <p className="text-indigo-100 mb-4">
              {data.readinessScore === 0
                ? "Welcome! Start your placement journey by uploading your resume to the Resume Analyzer. This will kickstart the entire pipeline."
                : data.readinessScore < 40 
                  ? "Your readiness score needs improvement. Start with the Resume Analyzer, then analyze a target job description to identify skill gaps."
                  : data.readinessScore < 60 
                    ? "Good progress! Focus on closing skill gaps identified in your analysis. Create a structured prep plan and start daily practice."
                    : data.readinessScore < 80
                      ? "You're on track! Sharpen your interview skills with mock interviews and focus on areas with the lowest scores."
                      : "Excellent preparation! You're placement-ready. Keep practicing mock interviews to maintain your edge. Consider exploring different role types."}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (data.readinessScore === 0) navigate('/student/resume-analyzer');
                  else if (data.readinessScore < 40) navigate('/student/skill-gap');
                  else if (data.readinessScore < 60) navigate('/student/prep-plan');
                  else navigate('/student/mock-interview');
                }} 
                className="bg-white text-primary-900 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-slate-100 transition"
              >
                Take Action →
              </button>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-3">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center text-lg`}>
        {icon}
      </div>
      {value !== 'N/A' && value !== '0%' && (
        <span className="text-xs font-bold px-2 py-1 rounded-md bg-green-50 text-green-600">
          Active
        </span>
      )}
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default Dashboard;
