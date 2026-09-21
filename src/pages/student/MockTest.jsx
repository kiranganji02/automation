import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaFlag, FaCheck, FaTimes, FaListUl } from 'react-icons/fa';
import { mockTestQuestions } from '../../data/sampleData';
import { toast } from 'react-toastify';

const MockTest = () => {
  const [status, setStatus] = useState('setup'); // setup, active, review
  const [category, setCategory] = useState('Aptitude');
  const [duration, setDuration] = useState(10);
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(null);

  useEffect(() => {
    let timer;
    if (status === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (status === 'active' && timeLeft === 0) {
      submitTest();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const startTest = () => {
    const qList = mockTestQuestions?.filter(q => q.category === category) || [];
    if (qList.length === 0) {
      toast.error('No questions available for this category.');
      return;
    }
    setQuestions(qList);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeLeft(duration * 60);
    setStatus('active');
  };

  const submitTest = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    
    const finalScore = {
      total: questions.length,
      correct,
      wrong: Object.keys(answers).length - correct,
      unanswered: questions.length - Object.keys(answers).length,
      timeTaken: (duration * 60) - timeLeft,
      category,
      date: new Date().toISOString()
    };
    
    setScore(finalScore);
    setStatus('review');
    
    const history = JSON.parse(localStorage.getItem('ipc_test_scores') || '[]');
    localStorage.setItem('ipc_test_scores', JSON.stringify([...history, finalScore]));
    toast.success('Test submitted successfully!');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (optionIdx) => {
    if (status !== 'active') return;
    setAnswers({ ...answers, [currentIndex]: optionIdx });
  };

  const toggleFlag = () => {
    setFlagged({ ...flagged, [currentIndex]: !flagged[currentIndex] });
  };

  if (status === 'setup') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold gradient-text mb-6 text-center">Mock Test Setup</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <select 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Aptitude">Aptitude</option>
                <option value="Technical">Technical</option>
                <option value="Verbal">Verbal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Duration (minutes)</label>
              <select 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={10}>10 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>

            <button 
              onClick={startTest}
              className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Start Test
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (status === 'review') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold gradient-text mb-4 text-center">Test Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">{score.correct} / {score.total}</div>
              <div className="text-gray-500 text-sm">Score</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{score.correct}</div>
              <div className="text-gray-500 text-sm">Correct</div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{score.wrong}</div>
              <div className="text-gray-500 text-sm">Wrong</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">{formatTime(score.timeTaken)}</div>
              <div className="text-gray-500 text-sm">Time Taken</div>
            </div>
          </div>
          <button 
            onClick={() => setStatus('setup')}
            className="w-full bg-primary-100 text-primary-700 font-bold py-3 rounded-xl hover:bg-primary-200 transition-colors"
          >
            Take Another Test
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{idx + 1}. {q.question}</h3>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  let optClass = "p-3 rounded-lg border ";
                  if (oIdx === q.correctAnswer) optClass += "bg-green-100 border-green-500 text-green-800";
                  else if (oIdx === answers[idx]) optClass += "bg-red-100 border-red-500 text-red-800";
                  else optClass += "bg-gray-50 border-gray-200";

                  return (
                    <div key={oIdx} className={optClass}>
                      {opt}
                      {oIdx === q.correctAnswer && <FaCheck className="inline ml-2 text-green-600" />}
                      {oIdx === answers[idx] && oIdx !== q.correctAnswer && <FaTimes className="inline ml-2 text-red-600" />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-[calc(100vh-100px)] p-6 gap-6">
      {/* Question Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{category} Test</h2>
          <div className="flex items-center gap-2 text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg">
            <FaClock className={timeLeft < 60 ? "text-red-500" : "text-gray-600"} />
            <span className={timeLeft < 60 ? "text-red-500" : "text-gray-800"}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Question {currentIndex + 1} of {questions.length}</h3>
            <button 
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${flagged[currentIndex] ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <FaFlag /> {flagged[currentIndex] ? 'Flagged' : 'Flag for review'}
            </button>
          </div>

          <p className="text-lg text-gray-700 mb-8">{currentQ.question}</p>

          <div className="space-y-3 flex-1">
            {currentQ.options.map((opt, idx) => (
              <label 
                key={idx} 
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[currentIndex] === idx ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
              >
                <input 
                  type="radio" 
                  name="option" 
                  checked={answers[currentIndex] === idx}
                  onChange={() => handleOptionSelect(idx)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">{opt}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button 
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-6 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Palette Area */}
      <div className="w-72 bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FaListUl /> Question Palette</h3>
        
        <div className="grid grid-cols-4 gap-2 mb-8 flex-1 content-start">
          {questions.map((_, idx) => {
            let bgColor = "bg-gray-100 text-gray-600";
            if (currentIndex === idx) bgColor = "bg-blue-100 text-blue-700 border-2 border-blue-500";
            else if (answers[idx] !== undefined) bgColor = "bg-green-100 text-green-700";
            if (flagged[idx]) bgColor += " ring-2 ring-yellow-400 ring-offset-1";

            return (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-12 h-12 rounded-lg font-semibold flex items-center justify-center ${bgColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 rounded"></div> Answered</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-100 rounded"></div> Unanswered</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-100 ring-2 ring-yellow-400 rounded"></div> Flagged</div>
        </div>

        <button 
          onClick={submitTest}
          className="w-full bg-accent-500 text-white font-bold py-3 rounded-xl hover:bg-accent-600 transition-colors shadow-md"
        >
          Submit Test
        </button>
      </div>
    </motion.div>
  );
};

export default MockTest;
