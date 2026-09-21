import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaKeyboard, FaPlay, FaUndo } from 'react-icons/fa';
import { typingTexts } from '../../data/sampleData';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TypingTest = () => {
  const [difficulty, setDifficulty] = useState('Medium');
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, chars: 0, errors: 0 });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ipc_typing_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('ipc_typing_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    resetTest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      endTest();
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  const resetTest = () => {
    const availableTexts = typingTexts?.filter(t => t.difficulty === difficulty) || [{ text: 'The quick brown fox jumps over the lazy dog.' }];
    const randomText = availableTexts[Math.floor(Math.random() * availableTexts.length)].text;
    setText(randomText);
    setInput('');
    setTimeLeft(60);
    setIsActive(false);
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 0, chars: 0, errors: 0 });
    if (inputRef.current) inputRef.current.focus();
  };

  const endTest = () => {
    setIsActive(false);
    setIsFinished(true);
    
    // Calculate final stats
    const wordsTyped = input.length / 5;
    const minutes = (60 - timeLeft) / 60 || 1; // max 1 min
    const wpm = Math.round(wordsTyped / minutes);
    
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== text[i]) errors++;
    }
    
    const accuracy = input.length > 0 ? Math.round(((input.length - errors) / input.length) * 100) : 0;
    
    const finalStats = {
      wpm,
      accuracy,
      chars: input.length,
      errors,
      date: new Date().toLocaleDateString()
    };
    
    setStats(finalStats);
    setHistory([...history, finalStats]);
  };

  const handleInput = (e) => {
    if (isFinished) return;
    if (!isActive && e.target.value.length === 1) {
      setIsActive(true);
    }
    
    const val = e.target.value;
    setInput(val);
    
    // auto end if finished typing all text
    if (val.length >= text.length) {
      endTest();
    }
  };

  const getCharClass = (char, index) => {
    if (index >= input.length) return 'text-gray-400';
    if (char === input[index]) return 'text-green-500 bg-green-50';
    return 'text-red-500 bg-red-100';
  };

  // Chart Data
  const chartData = {
    labels: history.slice(-10).map((_, i) => `Attempt ${i + 1}`),
    datasets: [
      {
        label: 'WPM',
        data: history.slice(-10).map(h => h.wpm),
        borderColor: 'rgb(59, 130, 246)', // primary-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-5xl mx-auto space-y-6">
      
      <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3"><FaKeyboard /> Typing Speed Test</h1>
          <p className="text-gray-500 mt-1">Improve your typing speed for coding and interviews.</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-500"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isActive}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button 
            onClick={resetTest}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
          >
            <FaUndo /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 relative">
            
            {/* Live Stats Bar */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div className="text-2xl font-mono font-bold text-gray-800">{timeLeft}s</div>
              <div className="flex gap-6 text-sm font-semibold text-gray-600">
                <div>WPM: {isActive ? Math.round((input.length / 5) / ((60 - timeLeft) / 60 || 1/60)) : stats.wpm}</div>
                <div>Errors: {input.split('').filter((c, i) => c !== text[i]).length}</div>
              </div>
            </div>

            {/* Display Text */}
            <div 
              className="text-xl leading-loose font-mono mb-6 relative select-none cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {text.split('').map((char, index) => (
                <span key={index} className={`rounded-sm ${getCharClass(char, index)} ${index === input.length && isActive ? 'border-b-2 border-primary-500 animate-pulse' : ''}`}>
                  {char}
                </span>
              ))}
            </div>

            {/* Hidden Input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              disabled={isFinished}
              className="absolute opacity-0 w-0 h-0"
              autoFocus
            />

            {!isActive && !isFinished && input.length === 0 && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl backdrop-blur-sm z-10">
                <button 
                  onClick={() => inputRef.current?.focus()}
                  className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white text-xl font-bold rounded-full hover:bg-primary-700 shadow-lg transform transition hover:scale-105"
                >
                  <FaPlay /> Start Typing
                </button>
              </div>
            )}
            
            {isFinished && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl z-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Test Complete!</h2>
                <div className="flex gap-8 mb-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-primary-600">{stats.wpm}</div>
                    <div className="text-gray-500">WPM</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-accent-500">{stats.accuracy}%</div>
                    <div className="text-gray-500">Accuracy</div>
                  </div>
                </div>
                <button 
                  onClick={resetTest}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900"
                >
                  <FaUndo /> Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">Your Progress</h3>
            {history.length > 0 ? (
              <div className="h-48">
                <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Complete a test to see your progress chart.</p>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">Recent Tests</h3>
            <div className="space-y-3">
              {history.slice(-5).reverse().map((h, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                  <span className="text-gray-500">{h.date}</span>
                  <span className="font-bold text-gray-800">{h.wpm} WPM</span>
                </div>
              ))}
              {history.length === 0 && <p className="text-sm text-gray-500">No history yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingTest;
