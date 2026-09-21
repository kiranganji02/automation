import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaExchangeAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, 
  FaChartBar, FaArrowRight, FaCode, FaComments, FaBrain, 
  FaCertificate, FaLaptopCode, FaBookOpen, FaDownload, FaVideo, FaGraduationCap
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CircularProgress = ({ value, label }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = 'text-red-500';
  if (value >= 75) color = 'text-green-500';
  else if (value >= 50) color = 'text-yellow-500';

  return (
    <div className="flex flex-col items-center justify-center relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
        <circle
          className="text-slate-200"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{Math.round(value)}%</span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

const categoryIcons = {
  Technical: <FaLaptopCode className="text-blue-500" />,
  Languages: <FaCode className="text-purple-500" />,
  Aptitude: <FaBrain className="text-pink-500" />,
  Communication: <FaComments className="text-green-500" />,
  Domain: <FaBookOpen className="text-orange-500" />,
  Certifications: <FaCertificate className="text-yellow-500" />
};

export default function SkillGap() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input');

  useEffect(() => {
    // 1. Auto-Load from Previous Modules
    const savedGap = localStorage.getItem('ipc_skill_gap');
    if (savedGap) {
      try {
        setResults(JSON.parse(savedGap));
        setActiveTab('results');
      } catch (e) {
        console.error("Failed to parse saved skill gap data");
      }
    }

    let loadedResumeSkills = [];
    let loadedJobSkills = [];

    // Parse resume data & profile data
    try {
      const resumeAnalysis = JSON.parse(localStorage.getItem('ipc_resume_analysis') || '{}');
      const resumeData = JSON.parse(localStorage.getItem('ipc_resume_data') || '{}');
      const profileData = JSON.parse(localStorage.getItem('ipc_profile') || '{}');
      const rawResume = localStorage.getItem('ipc_resume') || '';
      
      if (resumeAnalysis.skills && Array.isArray(resumeAnalysis.skills)) {
        loadedResumeSkills = [...loadedResumeSkills, ...resumeAnalysis.skills];
      }
      if (resumeAnalysis.keywords?.detected && Array.isArray(resumeAnalysis.keywords.detected)) {
        loadedResumeSkills = [...loadedResumeSkills, ...resumeAnalysis.keywords.detected];
      }
      if (resumeData.skills && Array.isArray(resumeData.skills)) {
        loadedResumeSkills = [...loadedResumeSkills, ...resumeData.skills];
      }
      if (profileData.skills && Array.isArray(profileData.skills)) {
        loadedResumeSkills = [...loadedResumeSkills, ...profileData.skills];
      }
      if (profileData.programmingLanguages && Array.isArray(profileData.programmingLanguages)) {
        loadedResumeSkills = [...loadedResumeSkills, ...profileData.programmingLanguages];
      }
      if (profileData.frameworksLibraries && Array.isArray(profileData.frameworksLibraries)) {
        loadedResumeSkills = [...loadedResumeSkills, ...profileData.frameworksLibraries];
      }
      if (profileData.toolsPlatforms && Array.isArray(profileData.toolsPlatforms)) {
        loadedResumeSkills = [...loadedResumeSkills, ...profileData.toolsPlatforms];
      }
      if (rawResume) {
        setResumeText(prev => prev ? prev : rawResume);
      }
    } catch(e) {}

    // Parse JD data
    try {
      const jdAnalysis = JSON.parse(localStorage.getItem('ipc_jd_analysis') || '{}');
      const jdData = JSON.parse(localStorage.getItem('ipc_jd_data') || '{}');
      
      const extractSkillsFromObj = (skillsObj) => {
        if (!skillsObj) return [];
        if (Array.isArray(skillsObj)) return skillsObj;
        if (typeof skillsObj === 'object') {
          return Object.values(skillsObj).flat().filter(Boolean);
        }
        return [];
      };

      if (jdAnalysis.requiredSkills && Array.isArray(jdAnalysis.requiredSkills)) {
        loadedJobSkills = [...loadedJobSkills, ...jdAnalysis.requiredSkills];
      }
      if (jdAnalysis.preferredSkills && Array.isArray(jdAnalysis.preferredSkills)) {
        loadedJobSkills = [...loadedJobSkills, ...jdAnalysis.preferredSkills];
      }
      if (jdData.skills) {
        loadedJobSkills = [...loadedJobSkills, ...extractSkillsFromObj(jdData.skills)];
      }
      if (jdAnalysis.skills) {
        loadedJobSkills = [...loadedJobSkills, ...extractSkillsFromObj(jdAnalysis.skills)];
      }
      if (jdData.responsibilities && Array.isArray(jdData.responsibilities)) {
        loadedJobSkills = [...loadedJobSkills, ...jdData.responsibilities.slice(0, 3)];
      }
    } catch(e) {}

    const uniqueResumeSkills = [...new Set(loadedResumeSkills.map(s => s.trim()))].filter(Boolean).join(', ');
    const uniqueJobSkills = [...new Set(loadedJobSkills.map(s => s.trim()))].filter(Boolean).join(', ');

    if (uniqueResumeSkills) {
      setResumeText(prev => prev ? `${uniqueResumeSkills}\n\n${prev}` : uniqueResumeSkills);
    }
    if (uniqueJobSkills) {
      setJobText(prev => prev ? `${uniqueJobSkills}\n\n${prev}` : uniqueJobSkills);
    }
  }, []);

  const analyzeGaps = () => {
    if (!resumeText.trim() || !jobText.trim()) {
      toast.error('Please provide both Resume and Job Description inputs.');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const extractSkills = (text) => text.toLowerCase().split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 2);
      
      const rSkills = extractSkills(resumeText);
      const jSkills = extractSkills(jobText);
      
      const matchingSkills = [];
      const missingSkills = [];
      const partialSkills = [];

      jSkills.forEach(js => {
        const isMatch = rSkills.some(rs => rs.includes(js) || js.includes(rs));
        const isPartial = rSkills.some(rs => {
            const wordsJs = js.split(' ');
            return wordsJs.some(w => rs.includes(w)) && w.length > 3;
        });
        
        if (isMatch) {
          if (!matchingSkills.includes(js)) matchingSkills.push(js);
        } else if (isPartial) {
          if (!partialSkills.includes(js)) partialSkills.push(js);
        } else {
          if (!missingSkills.includes(js)) missingSkills.push(js);
        }
      });
      
      const totalReq = matchingSkills.length + partialSkills.length + missingSkills.length || 1;
      const score = Math.round(((matchingSkills.length + (partialSkills.length * 0.5)) / totalReq) * 100) || 0;

      // 2. Smart Gap Categories
      const getAverageScore = (key, defaultVal) => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(data) && data.length > 0) {
            return Math.round(data.reduce((acc, curr) => acc + (curr.score || 0), 0) / data.length);
          } else if (data && data.score) {
            return data.score;
          }
        } catch(e) {}
        return defaultVal;
      };

      const mockTestScore = getAverageScore('ipc_mock_test_scores', Math.floor(Math.random() * 40 + 40));
      const interviewScore = getAverageScore('ipc_interview_history', Math.floor(Math.random() * 40 + 40));

      const techScore = Math.round((matchingSkills.length / (totalReq || 1)) * 100);
      const langScore = Math.round(((matchingSkills.length * 1.2) / (totalReq || 1)) * 100);
      
      const generateCategory = (name, type, currentLevel, requiredLevel, missingRef) => {
          let severity = 'Minor';
          if (requiredLevel - currentLevel > 30) severity = 'Critical';
          else if (requiredLevel - currentLevel > 15) severity = 'Moderate';

          return {
              name,
              currentLevel: Math.min(100, Math.max(0, currentLevel)),
              requiredLevel: Math.min(100, requiredLevel),
              severity,
              skillsToLearn: missingRef.slice(0, 3).map(s => `${s} fundamentals`).concat([`Advanced ${type}`])
          }
      };

      const isCoreEngSkill = (s) => /autocad|revit|staad|etabs|solidworks|catia|ansys|plc|scada|embedded|microcontroller|power|transformer|concrete|surveying/i.test(s);

      const categories = [
          generateCategory('Technical & Core Skills', 'tools & frameworks', techScore, 85, missingSkills),
          generateCategory('Programming / Engineering Tools', 'computational & drafting tools', langScore, 80, missingSkills.reverse()),
          generateCategory('Aptitude & Problem Solving', 'analytical thinking & quantitative ability', mockTestScore, 75, ['Numerical Aptitude', 'Logical Reasoning']),
          generateCategory('Communication & Soft Skills', 'professional presentation & teamwork', interviewScore, 80, ['Technical Presentation', 'Active Listening']),
          generateCategory('Domain Knowledge', 'industry standards & specifications', techScore + 10, 80, missingSkills),
          generateCategory('Professional Certifications', 'industry-recognized credentials', 35, 70, ['Domain Professional Certification', 'Project Management'])
      ];
      
      // 3. Multi-Stream Learning Resources
      const actionItems = missingSkills.slice(0, 5).map((skill, i) => {
          const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
          const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
          const times = ['2-4 hours', '1 week', '2 weeks', '1 month'];
          const time = times[Math.floor(Math.random() * times.length)];
          const isCore = isCoreEngSkill(skill);
          
          return {
              id: i,
              skill: skill,
              action: `Master ${skill.toUpperCase()} core principles & applications`,
              time: time,
              difficulty: diff,
              priority: i === 0 ? 'High' : (i < 3 ? 'Medium' : 'Low'),
              videoLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial full course')}`,
              courseName: isCore ? `NPTEL / Engineering Hub: ${skill}` : `FreeCodeCamp / Docs: ${skill}`,
              courseLink: isCore 
                ? `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' nptel lecture course')}`
                : `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`
          };
      });

      // 5. Save results to localStorage
      const newResults = {
        score,
        matchingSkills,
        missingSkills,
        partialSkills,
        categories,
        actionItems,
        gaps: categories.filter(c => c.severity === 'Critical' || c.severity === 'Moderate').map(c => c.name),
        timestamp: new Date().toISOString()
      };

      setResults(newResults);
      localStorage.setItem('ipc_skill_gap', JSON.stringify(newResults));
      setIsAnalyzing(false);
      setActiveTab('results');
      toast.success('Analysis completed successfully!');
      
    }, 1500);
  };

  // 4. Export functionality
  const downloadReport = () => {
    if (!results) return;

    let report = `SKILL GAP ANALYSIS REPORT\n`;
    report += `Date: ${new Date(results.timestamp).toLocaleString()}\n`;
    report += `Overall Match Score: ${results.score}%\n\n`;
    
    report += `MATCHING SKILLS:\n`;
    report += results.matchingSkills.length > 0 ? results.matchingSkills.join(', ') : 'None identified';
    report += `\n\n`;

    report += `MISSING SKILLS (GAPS):\n`;
    report += results.missingSkills.length > 0 ? results.missingSkills.join(', ') : 'None identified';
    report += `\n\n`;

    report += `CATEGORY BREAKDOWN:\n`;
    results.categories.forEach(cat => {
      report += `- ${cat.name}: Current ${cat.currentLevel}% | Required ${cat.requiredLevel}% | Gap: ${cat.severity}\n`;
    });
    report += `\n`;

    report += `RECOMMENDED ACTION PLAN:\n`;
    results.actionItems.forEach(item => {
      report += `- ${item.skill.toUpperCase()}: ${item.time} (${item.difficulty})\n`;
      report += `  Video: ${item.videoLink}\n`;
      report += `  Course: ${item.courseLink}\n`;
    });

    navigator.clipboard.writeText(report).then(() => {
      toast.success('Report copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy report.');
    });
  };

  const chartData = results ? {
    labels: results.categories.map(c => c.name.split(' ')[0]),
    datasets: [
      {
        label: 'Current Proficiency',
        data: results.categories.map(c => c.currentLevel),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Required Level',
        data: results.categories.map(c => c.requiredLevel),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  } : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Skill Gap Analysis</h1>
          <p className="text-slate-500 mt-1">Match your resume against job requirements to identify gaps</p>
        </div>
        
        {results && (
          <div className="flex items-center gap-3">
            <button 
              onClick={downloadReport}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <FaDownload /> Export Report
            </button>
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
              <button 
                onClick={() => setActiveTab('input')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'input' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Input Data
              </button>
              <button 
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'results' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Analysis Results
              </button>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'input' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                <FaBookOpen />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Your Resume Skills</h2>
            </div>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content, skills, or experience here..."
              className="w-full flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-700 leading-relaxed"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600 shadow-inner">
                <FaLaptopCode />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Job Requirements</h2>
            </div>
            <textarea 
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the job description or required skills here..."
              className="w-full flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-500/50 text-slate-700 leading-relaxed"
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-2 mb-8">
            <button 
              onClick={analyzeGaps}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Gaps...
                </>
              ) : (
                <>
                  <FaExchangeAlt />
                  Run Match Analysis
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'results' && results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          
          {/* Top Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-6">Overall Match Score</h3>
              <CircularProgress value={results.score} label="Profile Fit" />
              <p className="text-slate-500 mt-6 text-sm px-4">
                Your profile is a <strong className={results.score >= 75 ? 'text-green-600' : results.score >= 50 ? 'text-yellow-600' : 'text-red-600'}>{results.score >= 75 ? 'strong' : results.score >= 50 ? 'moderate' : 'weak'}</strong> match for this role based on the required skills and experience.
              </p>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <FaChartBar className="text-primary-500" /> Skill Proficiency Comparison
              </h3>
              <div className="h-72">
                <Bar 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: true, max: 100 }
                    },
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Skill Tag Lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50/50 rounded-2xl border border-green-100 p-6">
              <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-4">
                <FaCheckCircle className="text-green-500 text-lg" /> Matching Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.matchingSkills.length > 0 ? results.matchingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-medium shadow-sm">
                    {skill}
                  </span>
                )) : <span className="text-sm text-green-700">None found</span>}
              </div>
            </div>
            
            <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6">
              <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-4">
                <FaExclamationTriangle className="text-amber-500 text-lg" /> Partial Matches
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.partialSkills.length > 0 ? results.partialSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium shadow-sm">
                    {skill}
                  </span>
                )) : <span className="text-sm text-amber-700">None found</span>}
              </div>
            </div>

            <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6">
              <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-lg" /> Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.length > 0 ? results.missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium shadow-sm">
                    {skill}
                  </span>
                )) : <span className="text-sm text-red-700">None found</span>}
              </div>
            </div>
          </div>

          {/* Detailed Categories */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               Category-wise Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.categories.map((cat, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                        {categoryIcons[cat.name.split(' ')[0]] || <FaBrain className="text-primary-500"/>}
                      </div>
                      <h4 className="font-semibold text-slate-800 leading-tight">{cat.name}</h4>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                      cat.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                      cat.severity === 'Moderate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {cat.severity} Gap
                    </span>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                        <span>Current Proficiency</span>
                        <span>{cat.currentLevel}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${cat.currentLevel}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                        <span>Required Level</span>
                        <span>{cat.requiredLevel}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${cat.requiredLevel}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-1">
                      <FaArrowRight className="text-accent-500" /> Focus Areas
                    </p>
                    <ul className="text-sm text-slate-700 space-y-2">
                      {cat.skillsToLearn.length > 0 ? cat.skillsToLearn.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-1.5 flex-shrink-0"></span>
                          <span className="leading-tight capitalize">{skill}</span>
                        </li>
                      )) : <li className="text-slate-500">No major focus areas.</li>}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items - Learning Resources */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
              <FaGraduationCap className="text-accent-400 text-3xl" />
              Learning Resources & Action Plan
            </h3>
            
            <div className="space-y-4 relative z-10">
              {results.actionItems.length > 0 ? results.actionItems.map((item, idx) => (
                <div key={item.id} className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md rounded-xl p-5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-grow">
                    <div className="w-10 h-10 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center font-bold text-lg flex-shrink-0 border border-accent-500/30">
                      {idx + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-slate-100 text-lg capitalize">{item.action}</p>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${
                          item.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          item.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                          <FaBookOpen className="text-slate-500" /> Est. Time: {item.time}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                          <FaBrain className="text-slate-500" /> Difficulty: {item.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <a 
                      href={item.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      <FaVideo /> Watch Video
                    </a>
                    <a 
                      href={item.courseLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/40 text-primary-300 border border-primary-500/30 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      <FaLaptopCode /> Free Course
                    </a>
                  </div>
                </div>
              )) : (
                <div className="text-slate-400 text-center py-6">
                  Great job! You have no critical missing skills.
                </div>
              )}
            </div>
          </div>

        </motion.div>
      )}
    </motion.div>
  );
}
