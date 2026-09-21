import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FaPlus, FaCheckCircle, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

const SkillsTracker = () => {
  const [skills, setSkills] = useState({
    'Programming': [
      { name: 'Python', progress: 80, level: 'Advanced' },
      { name: 'Java', progress: 60, level: 'Intermediate' }
    ],
    'DSA': [
      { name: 'Arrays & Strings', progress: 90, level: 'Advanced' },
      { name: 'Trees & Graphs', progress: 40, level: 'Intermediate' }
    ],
    'Web Development': [
      { name: 'React', progress: 75, level: 'Advanced' },
      { name: 'Node.js', progress: 30, level: 'Beginner' }
    ],
    'Database': [
      { name: 'SQL', progress: 85, level: 'Advanced' },
      { name: 'MongoDB', progress: 50, level: 'Intermediate' }
    ],
    'Soft Skills': [
      { name: 'Communication', progress: 70, level: 'Advanced' },
      { name: 'Interview Prep', progress: 45, level: 'Intermediate' }
    ]
  });

  const [newSkill, setNewSkill] = useState({ category: 'Programming', name: '', progress: 0, level: 'Beginner' });

  useEffect(() => {
    const saved = localStorage.getItem('ipc_skills');
    if (saved) {
      setSkills(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ipc_skills', JSON.stringify(skills));
  }, [skills]);

  const handleUpdateProgress = (category, index, newProgress) => {
    const updatedSkills = { ...skills };
    const p = parseInt(newProgress);
    updatedSkills[category][index].progress = p;
    
    // Auto-update level based on progress
    if (p < 30) updatedSkills[category][index].level = 'Beginner';
    else if (p < 70) updatedSkills[category][index].level = 'Intermediate';
    else if (p < 90) updatedSkills[category][index].level = 'Advanced';
    else updatedSkills[category][index].level = 'Expert';

    setSkills(updatedSkills);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    
    const updatedSkills = { ...skills };
    updatedSkills[newSkill.category].push({
      name: newSkill.name,
      progress: parseInt(newSkill.progress),
      level: newSkill.level
    });
    
    setSkills(updatedSkills);
    setNewSkill({ category: 'Programming', name: '', progress: 0, level: 'Beginner' });
    toast.success('Skill added successfully!');
  };

  // Calculate overall progress
  const allSkills = Object.values(skills).flat();
  const overallProgress = allSkills.length > 0 
    ? Math.round(allSkills.reduce((acc, curr) => acc + curr.progress, 0) / allSkills.length)
    : 0;

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-slate-100 text-slate-600';
      case 'Intermediate': return 'bg-blue-100 text-blue-600';
      case 'Advanced': return 'bg-emerald-100 text-emerald-600';
      case 'Expert': return 'bg-amber-100 text-amber-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Overall Mastery',
        data: [20, 35, 45, 52, 60, overallProgress],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [overallProgress, 100 - overallProgress],
      backgroundColor: ['#10b981', '#f1f5f9'],
      borderWidth: 0,
    }]
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Skills Tracker</h1>
          <p className="text-slate-500 mt-2">Track your mastery across different placement domains</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="w-16 h-16">
            <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { tooltip: { enabled: false } } }} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Overall Mastery</p>
            <p className="text-2xl font-bold text-slate-800">{overallProgress}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(skills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{category}</h2>
              <div className="space-y-5">
                {categorySkills.length > 0 ? categorySkills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700">{skill.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{skill.progress}%</span>
                    </div>
                    <div className="relative pt-1">
                      <input 
                        type="range" min="0" max="100" 
                        value={skill.progress} 
                        onChange={(e) => handleUpdateProgress(category, index, e.target.value)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${skill.progress}%, #e2e8f0 ${skill.progress}%, #e2e8f0 100%)`
                        }}
                      />
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 italic">No skills added in this category yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><FaPlus className="text-blue-500" /> Add New Skill</h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                >
                  {Object.keys(skills).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Skill Name</label>
                <input 
                  type="text" required placeholder="e.g. Dynamic Programming"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Initial Progress ({newSkill.progress}%)</label>
                <input 
                  type="range" min="0" max="100" 
                  value={newSkill.progress} onChange={e => setNewSkill({...newSkill, progress: e.target.value})}
                  className="w-full accent-blue-600"
                />
              </div>
              <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                Add Skill
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><FaStar className="text-amber-500" /> Mastery Trend</h2>
            <div className="h-48">
              <Line data={lineChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsTracker;
