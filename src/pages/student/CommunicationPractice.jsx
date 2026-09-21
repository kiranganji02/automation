import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaPen, FaStop, FaPlay, FaSave, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';

const communicationTopics = [
  "Tell me about yourself.",
  "Describe a challenging project you worked on and how you overcame the obstacles.",
  "Where do you see yourself in 5 years?",
  "Why should we hire you over other candidates?",
  "Explain a complex technical concept to a non-technical person."
];

const CommunicationPractice = () => {
  const [mode, setMode] = useState('speaking'); // 'speaking' or 'writing'
  const [currentTopic, setCurrentTopic] = useState(communicationTopics[0]);
  
  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showEval, setShowEval] = useState(false);
  
  // Writing state
  const [text, setText] = useState('');
  
  // History
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ipc_comm_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Eval Form
  const [evalScores, setEvalScores] = useState({ clarity: 3, confidence: 3, content: 3, grammar: 3 });

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    localStorage.setItem('ipc_comm_history', JSON.stringify(history));
  }, [history]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setShowEval(true);
    } else {
      setIsRecording(true);
      setTimer(0);
      setShowEval(false);
    }
  };

  const saveEvaluation = () => {
    const newEntry = {
      id: Date.now(),
      mode: 'speaking',
      topic: currentTopic,
      duration: timer,
      scores: evalScores,
      date: new Date().toISOString()
    };
    setHistory([newEntry, ...history]);
    setShowEval(false);
    toast.success("Practice session saved!");
  };

  const saveWriting = () => {
    if (!text.trim()) {
      toast.error("Please write something first.");
      return;
    }
    const wordCount = text.trim().split(/\s+/).length;
    const newEntry = {
      id: Date.now(),
      mode: 'writing',
      topic: currentTopic,
      content: text,
      wordCount,
      date: new Date().toISOString()
    };
    setHistory([newEntry, ...history]);
    setText('');
    toast.success("Writing practice saved!");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getRandomTopic = () => {
    const rand = communicationTopics[Math.floor(Math.random() * communicationTopics.length)];
    setCurrentTopic(rand);
    setText('');
    setShowEval(false);
    setTimer(0);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Communication Practice</h1>
          <p className="text-slate-500 mt-1">Improve your verbal and written communication skills</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setMode('speaking')} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'speaking' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <FaMicrophone /> Speaking
          </button>
          <button 
            onClick={() => setMode('writing')} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'writing' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <FaPen /> Writing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Practice Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-primary-500 uppercase tracking-wider block mb-2">Current Prompt</span>
                <h2 className="text-xl font-medium text-slate-800">{currentTopic}</h2>
              </div>
              <button onClick={getRandomTopic} className="text-sm text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-full transition-colors whitespace-nowrap">
                New Prompt
              </button>
            </div>

            {mode === 'speaking' ? (
              <div className="flex flex-col items-center py-8">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner transition-all ${isRecording ? 'bg-red-50 text-red-500 animate-pulse border-4 border-red-200' : 'bg-slate-50 text-slate-400 border-4 border-slate-100'}`}>
                  {isRecording ? <FaMicrophone /> : <FaMicrophone />}
                </div>
                <div className="text-3xl font-mono font-light text-slate-700 mb-8">{formatTime(timer)}</div>
                <button 
                  onClick={toggleRecording}
                  className={`px-8 py-3 rounded-full font-medium text-white flex items-center gap-2 shadow-md transition-transform hover:scale-105 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'}`}
                >
                  {isRecording ? <><FaStop /> Stop Recording</> : <><FaPlay /> Start Practice</>}
                </button>
                <p className="text-xs text-slate-400 mt-4 max-w-sm text-center">
                  Note: This is a simulated environment. Speak out loud as if you are in a real interview. Evaluate yourself honestly afterwards.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-[300px]">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your answer here..."
                  className="flex-1 w-full border border-slate-200 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none mb-4 bg-slate-50"
                ></textarea>
                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium text-slate-500 flex gap-4">
                    <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
                    <span>Chars: {text.length}</span>
                  </div>
                  <button 
                    onClick={saveWriting}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <FaSave /> Save Answer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Self Evaluation Form (Speaking) */}
          {showEval && mode === 'speaking' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Self Evaluation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {Object.keys(evalScores).map(criterion => (
                  <div key={criterion}>
                    <label className="flex justify-between text-sm font-medium text-slate-700 capitalize mb-2">
                      <span>{criterion}</span>
                      <span className="text-primary-600">{evalScores[criterion]}/5</span>
                    </label>
                    <input 
                      type="range" min="1" max="5" 
                      value={evalScores[criterion]} 
                      onChange={(e) => setEvalScores({...evalScores, [criterion]: parseInt(e.target.value)})}
                      className="w-full accent-primary-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={saveEvaluation} className="bg-primary-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                  Save Evaluation
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-6">
            <FaHistory className="text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">Practice History</h3>
          </div>
          
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No practice history yet. Start a session!</p>
            ) : (
              history.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.mode === 'speaking' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {item.mode}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 line-clamp-2 mb-2">{item.topic}</p>
                  
                  {item.mode === 'speaking' ? (
                    <div className="text-xs text-slate-500">
                      Duration: {formatTime(item.duration)} | Avg Score: {((item.scores.clarity + item.scores.confidence + item.scores.content + item.scores.grammar) / 4).toFixed(1)}/5
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Words: {item.wordCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunicationPractice;
