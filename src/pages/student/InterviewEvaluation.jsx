import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Radar, Line } from 'react-chartjs-2';
import { 
  FaChartLine, FaChartPie, FaListAlt, FaChevronDown, FaChevronUp, 
  FaCheckCircle, FaTimesCircle, FaTrophy, FaLightbulb, FaBullseye,
  FaArrowUp, FaArrowDown, FaPlay, FaRegClock, FaStar, FaHistory
} from 'react-icons/fa';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Filler
);

// Helper function to calculate grade based on score
const getGrade = (score) => {
  if (score >= 90) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-500' };
  if (score >= 80) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-500' };
  if (score >= 70) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-500' };
  if (score >= 60) return { grade: 'D', color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-500' };
  return { grade: 'F', color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-500' };
};

export default function InterviewEvaluation() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const history1 = JSON.parse(localStorage.getItem('ipc_interview_history') || '[]');
        const history2 = JSON.parse(localStorage.getItem('ipc_interview_simulator_history') || '[]');
        
        // Merge and sort by date descending
        const combined = [...history1, ...history2]
          .filter(item => item && item.date && item.questions && item.questions.length > 0)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Format dates if they are strings
        const formatted = combined.map(session => ({
          ...session,
          date: new Date(session.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          // Ensure overall score exists
          overallScore: session.overallScore || Math.round(session.questions.reduce((acc, q) => acc + (q.score || 0), 0) / (session.questions.length || 1)),
          // Ensure round type exists
          type: session.type || 'General'
        }));

        setInterviews(formatted);
      } catch (err) {
        console.error("Failed to load interview history", err);
        toast.error("Failed to load interview history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Compute Analytics
  const analytics = useMemo(() => {
    if (!interviews.length) return null;

    const totalInterviews = interviews.length;
    const scores = interviews.map(i => i.overallScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalInterviews);
    const bestScore = Math.max(...scores);
    
    // Trend (last vs prev)
    let trend = 0;
    if (scores.length >= 2) {
      trend = scores[0] - scores[1]; // Since sorted descending
    }

    // Radar metrics (averages across all questions in all interviews)
    let totalRel = 0, totalCom = 0, totalDep = 0, totalConf = 0, totalComp = 0, totalStar = 0;
    let qCount = 0;

    // Bar metrics (avg by type)
    const typeScores = {};
    const typeCounts = {};

    interviews.forEach(session => {
      // Type aggregations
      const t = session.type || 'Unknown';
      if (!typeScores[t]) { typeScores[t] = 0; typeCounts[t] = 0; }
      typeScores[t] += session.overallScore;
      typeCounts[t] += 1;

      // Radar aggregations
      session.questions.forEach(q => {
        const metrics = q.metrics || {};
        totalRel += metrics.relevance || q.score || 0;
        totalCom += metrics.communication || q.score || 0;
        totalDep += metrics.depth || q.score || 0;
        totalConf += metrics.confidence || q.score || 0;
        totalComp += metrics.completeness || q.score || 0;
        totalStar += metrics.starMethod || q.score || 0;
        qCount++;
      });
    });

    // Averages
    const avgRel = qCount ? Math.round(totalRel / qCount) : 0;
    const avgCom = qCount ? Math.round(totalCom / qCount) : 0;
    const avgDep = qCount ? Math.round(totalDep / qCount) : 0;
    const avgConf = qCount ? Math.round(totalConf / qCount) : 0;
    const avgComp = qCount ? Math.round(totalComp / qCount) : 0;
    const avgStar = qCount ? Math.round(totalStar / qCount) : 0;

    const radarData = [avgRel, avgCom, avgDep, avgConf, avgComp, avgStar];

    // Identify strengths and weaknesses
    const metricsMap = {
      'Relevance': avgRel,
      'Communication': avgCom,
      'Technical Depth': avgDep,
      'Confidence': avgConf,
      'Completeness': avgComp,
      'STAR Method': avgStar
    };
    const sortedMetrics = Object.entries(metricsMap).sort((a, b) => b[1] - a[1]);
    const strengths = sortedMetrics.slice(0, 3).map(m => m[0]);
    const weaknesses = sortedMetrics.slice(-3).reverse().map(m => m[0]);

    // Format Bar Data
    const barLabels = Object.keys(typeScores);
    const barData = barLabels.map(l => Math.round(typeScores[l] / typeCounts[l]));

    // Format Line Data (Chronological, last 10)
    const recentInterviews = [...interviews].slice(0, 10).reverse();
    const lineLabels = recentInterviews.map((_, i) => `Session ${i + 1}`);
    const lineData = recentInterviews.map(i => i.overallScore);

    return {
      totalInterviews,
      avgScore,
      bestScore,
      trend,
      radarData,
      barLabels,
      barData,
      lineLabels,
      lineData,
      strengths,
      weaknesses
    };
  }, [interviews]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-12 px-4 text-center"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <FaHistory className="text-4xl text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">No Interview Data Yet</h2>
          <p className="text-slate-600 mb-8 max-w-md">
            Complete a mock interview to see your detailed performance analytics, round-wise breakdown, and personalized improvement insights here.
          </p>
          <button 
            onClick={() => navigate('/student/interview-simulator')}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition shadow-sm flex items-center gap-2"
          >
            <FaPlay /> Start Mock Interview
          </button>
        </div>
      </motion.div>
    );
  }

  const { avgScore, grade, color } = getGrade(analytics.avgScore);

  // Charts Config
  const doughnutData = {
    labels: ['Score', 'Remaining'],
    datasets: [{
      data: [analytics.avgScore, 100 - analytics.avgScore],
      backgroundColor: [
        analytics.avgScore >= 80 ? '#22c55e' : analytics.avgScore >= 60 ? '#eab308' : '#ef4444',
        '#f1f5f9'
      ],
      borderWidth: 0,
      cutout: '75%',
      circumference: 270,
      rotation: 225,
    }]
  };

  const radarChartData = {
    labels: ['Relevance', 'Communication', 'Tech Depth', 'Confidence', 'Completeness', 'STAR Method'],
    datasets: [{
      label: 'Average Score',
      data: analytics.radarData,
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(99, 102, 241, 1)',
    }]
  };

  const barChartData = {
    labels: analytics.barLabels,
    datasets: [{
      label: 'Average Score by Type',
      data: analytics.barData,
      backgroundColor: 'rgba(56, 189, 248, 0.8)',
      borderRadius: 6,
    }]
  };

  const lineChartData = {
    labels: analytics.lineLabels,
    datasets: [{
      label: 'Overall Score',
      data: analytics.lineData,
      borderColor: 'rgba(16, 185, 129, 1)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(16, 185, 129, 1)',
    }]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 gradient-text">Interview Evaluation Dashboard</h1>
          <p className="text-slate-600">Detailed analytics and round-wise feedback for all your past mock interviews.</p>
        </div>
        <button 
          onClick={() => navigate('/student/interview-simulator')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition shadow-sm flex items-center gap-2"
        >
          <FaPlay className="text-sm" /> New Practice
        </button>
      </div>

      {/* OVERVIEW DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gauge Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative card-hover">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 w-full text-left">Readiness Score</h3>
          <div className="w-48 h-48 relative">
            <Doughnut data={doughnutData} options={{ plugins: { tooltip: { enabled: false } }, maintainAspectRatio: false }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-4xl font-bold text-slate-800">{analytics.avgScore}</span>
              <span className="text-sm text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-500">Overall Grade:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${color} ${getGrade(analytics.avgScore).bg}`}>
              {getGrade(analytics.avgScore).grade}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center card-hover">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FaListAlt className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Interviews</p>
                <p className="text-2xl font-bold text-slate-800">{analytics.totalInterviews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center card-hover">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <FaTrophy className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Best Score</p>
                <p className="text-2xl font-bold text-slate-800">{analytics.bestScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center card-hover">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${analytics.trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {analytics.trend >= 0 ? <FaArrowUp className="text-xl" /> : <FaArrowDown className="text-xl" />}
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Recent Trend</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-slate-800">
                    {Math.abs(analytics.trend)}%
                  </p>
                  <span className="text-sm text-slate-500">{analytics.trend >= 0 ? 'improvement' : 'decline'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 card-hover">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <FaBullseye className="text-primary-500" /> Skill Breakdown
          </h3>
          <div className="h-64">
            <Radar data={radarChartData} options={{ maintainAspectRatio: false, scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } } }} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 card-hover">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <FaChartPie className="text-accent-500" /> Scores by Round Type
          </h3>
          <div className="h-64">
            <Bar data={barChartData} options={{ maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 card-hover">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-green-500" /> Progress Over Time
          </h3>
          <div className="h-64">
            <Line data={lineChartData} options={{ maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }} />
          </div>
        </div>
      </div>

      {/* IMPROVEMENT INSIGHTS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" /> AI Improvement Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <FaCheckCircle /> Top Strengths
            </h4>
            <ul className="space-y-2">
              {analytics.strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                  <span className="mt-1">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <FaTimesCircle /> Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {analytics.weaknesses.map((s, i) => (
                <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                  <span className="mt-1">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 lg:col-span-2">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FaStar /> Recommended Focus for Next Session
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Based on your recent performance, we recommend focusing on <strong>{analytics.weaknesses[0]}</strong>. 
              Try to practice more <em>{analytics.barLabels.sort((a,b) => analytics.barData[analytics.barLabels.indexOf(a)] - analytics.barData[analytics.barLabels.indexOf(b)])[0]}</em> rounds. 
              Remember to structure your answers using the STAR method (Situation, Task, Action, Result) to improve clarity and completeness.
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED ROUND-WISE ANALYSIS */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">Session History</h3>
        
        <div className="space-y-4">
          {interviews.map((session, index) => {
            const isExpanded = expandedSession === index;
            const sGrade = getGrade(session.overallScore);
            
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200">
                {/* Session Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => setExpandedSession(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${sGrade.bg} ${sGrade.color} ${sGrade.border} border`}>
                      {sGrade.grade}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{session.type} Interview</h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><FaRegClock /> {session.date}</span>
                        {session.role && <span>• Role: {session.role}</span>}
                        <span>• {session.questions.length} Questions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Overall Score</p>
                      <p className="text-xl font-bold text-slate-800">{session.overallScore}%</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 transition p-2">
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Session Details (Questions) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-200 bg-slate-50"
                    >
                      <div className="p-4 sm:p-6 space-y-4">
                        <h5 className="font-semibold text-slate-700 mb-2">Question Breakdown</h5>
                        
                        {session.questions.map((q, qIndex) => {
                          const qExpanded = expandedQuestion === `${index}-${qIndex}`;
                          const qScore = q.score || 0;
                          const qG = getGrade(qScore);

                          return (
                            <div key={qIndex} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                              <div 
                                className="p-4 cursor-pointer hover:bg-slate-50 flex justify-between items-start gap-4"
                                onClick={() => setExpandedQuestion(qExpanded ? null : `${index}-${qIndex}`)}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Q{qIndex + 1}</span>
                                    <h6 className="font-medium text-slate-800 line-clamp-1">{q.question}</h6>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${qG.bg} ${qG.color}`}>{qScore}%</span>
                                  {qExpanded ? <FaChevronUp className="text-slate-400 text-sm" /> : <FaChevronDown className="text-slate-400 text-sm" />}
                                </div>
                              </div>

                              <AnimatePresence>
                                {qExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100 px-4 py-4"
                                  >
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                      {/* Left Col: Q & A */}
                                      <div className="lg:col-span-2 space-y-4">
                                        <div>
                                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Question</span>
                                          <p className="text-slate-800 mt-1 font-medium">{q.question}</p>
                                        </div>
                                        <div>
                                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Answer</span>
                                          <p className="text-slate-700 mt-1 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                                            {q.answer || <span className="text-slate-400 italic">No answer recorded</span>}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Feedback</span>
                                          <p className="text-slate-700 mt-1 text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                            {q.feedback || "Good attempt. Elaborate more on specific technical details and outcomes."}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Right Col: Metrics & Ideal Points */}
                                      <div className="space-y-6">
                                        <div>
                                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Metrics</span>
                                          <div className="space-y-3">
                                            {Object.entries(q.metrics || {
                                              Relevance: qScore, Communication: qScore, Depth: qScore, Confidence: qScore
                                            }).map(([key, val]) => (
                                              <div key={key}>
                                                <div className="flex justify-between text-xs mb-1">
                                                  <span className="text-slate-600 capitalize">{key}</span>
                                                  <span className="font-medium text-slate-800">{val}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                  <div 
                                                    className={`h-1.5 rounded-full ${val >= 80 ? 'bg-green-500' : val >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${val}%` }}
                                                  ></div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {q.idealPoints && (
                                          <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Ideal Answer Elements</span>
                                            <ul className="space-y-2">
                                              {q.idealPoints.map((point, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                  {point.hit ? (
                                                    <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                                                  ) : (
                                                    <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                                                  )}
                                                  <span className={point.hit ? 'text-slate-700' : 'text-slate-500 line-through'}>{point.text}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
