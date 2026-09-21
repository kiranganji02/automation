import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaDatabase, FaMobileAlt, FaBrain, FaCloud, FaServer, FaShieldAlt, FaPlus, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Mock stream data since we can't easily import if it doesn't exist yet
const streamData = [
  { id: 'cs', name: 'Computer Science', icon: <FaLaptopCode />, skills: [
    { name: 'Data Structures', relevance: 98, difficulty: 'Hard', time: '8 weeks' },
    { name: 'Algorithms', relevance: 95, difficulty: 'Hard', time: '8 weeks' },
    { name: 'System Design', relevance: 90, difficulty: 'Medium', time: '4 weeks' }
  ]},
  { id: 'web', name: 'Web Dev', icon: <FaLaptopCode />, skills: [
    { name: 'React.js', relevance: 95, difficulty: 'Medium', time: '6 weeks' },
    { name: 'Node.js', relevance: 90, difficulty: 'Medium', time: '6 weeks' },
    { name: 'CSS/Tailwind', relevance: 85, difficulty: 'Easy', time: '2 weeks' }
  ]},
  { id: 'data', name: 'Data Science', icon: <FaDatabase />, skills: [
    { name: 'Python', relevance: 95, difficulty: 'Medium', time: '4 weeks' },
    { name: 'Machine Learning', relevance: 90, difficulty: 'Hard', time: '10 weeks' },
    { name: 'SQL', relevance: 85, difficulty: 'Easy', time: '2 weeks' }
  ]}
];

const SkillSuggestions = () => {
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [mySkills, setMySkills] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ipc_skills');
    if (saved) setMySkills(JSON.parse(saved));
  }, []);

  const toggleStream = (id) => {
    setSelectedStreams(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const addSkill = (skill) => {
    if (!mySkills.some(s => s.name === skill.name)) {
      const newSkills = [...mySkills, { ...skill, addedAt: new Date().toISOString(), status: 'learning' }];
      setMySkills(newSkills);
      localStorage.setItem('ipc_skills', JSON.stringify(newSkills));
      toast.success(`Added ${skill.name} to your skills tracker!`);
    }
  };

  // Aggregate and deduplicate recommended skills
  const recommendedSkills = selectedStreams.flatMap(streamId => {
    const stream = streamData.find(s => s.id === streamId);
    return stream ? stream.skills.map(skill => ({...skill, category: stream.name})) : [];
  }).reduce((acc, current) => {
    const x = acc.find(item => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Skill Suggestions</h1>
        <p className="text-slate-500 mt-1">Select your interests to get personalized skill recommendations</p>
      </div>

      {/* Stream Selector */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Areas of Interest</h2>
        <div className="flex flex-wrap gap-3">
          {streamData.map(stream => (
            <button
              key={stream.id}
              onClick={() => toggleStream(stream.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                selectedStreams.includes(stream.id)
                  ? 'bg-primary-500 text-white border-primary-500 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {stream.icon} {stream.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {selectedStreams.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Recommended Learning Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedSkills.sort((a, b) => b.relevance - a.relevance).map((skill, idx) => {
              const isAdded = mySkills.some(s => s.name === skill.name);
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow card-hover flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-primary-500 tracking-wider">{skill.category}</span>
                      <h3 className="font-bold text-slate-800 text-lg">{skill.name}</h3>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                      {skill.relevance}% Match
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-xs text-slate-500 mt-2 mb-4">
                    <span><span className="font-medium text-slate-700">Diff:</span> {skill.difficulty}</span>
                    <span><span className="font-medium text-slate-700">Time:</span> {skill.time}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => addSkill(skill)}
                      disabled={isAdded}
                      className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        isAdded 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white'
                      }`}
                    >
                      {isAdded ? <><FaCheck /> Added to Tracker</> : <><FaPlus /> Add to My Skills</>}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center">
          <FaBrain className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">Select your interests</h3>
          <p className="text-slate-500 text-sm">Choose one or more streams above to see personalized skill recommendations.</p>
        </div>
      )}
    </motion.div>
  );
};

export default SkillSuggestions;
