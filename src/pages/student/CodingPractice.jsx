import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { codingProblems } from '../../data/sampleData';

const CodingPractice = () => {
  const [problems] = useState(codingProblems || []);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [solved, setSolved] = useState(() => {
    const saved = localStorage.getItem('ipc_solved');
    return saved ? JSON.parse(saved) : [];
  });
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  useEffect(() => {
    localStorage.setItem('ipc_solved', JSON.stringify(solved));
  }, [solved]);

  useEffect(() => {
    if (problems.length > 0 && !selectedProblem) {
      setSelectedProblem(problems[0]);
    }
  }, [problems, selectedProblem]);

  useEffect(() => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode?.[language] || '// Write your code here\n');
      setTestResults(null);
    }
  }, [selectedProblem, language]);

  const filteredProblems = problems.filter(p => {
    const diffMatch = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const catMatch = categoryFilter === 'All' || p.category === categoryFilter;
    return diffMatch && catMatch;
  });

  const handleRun = () => {
    if (!selectedProblem) return;
    
    if (language === 'JavaScript') {
      try {
        const results = selectedProblem.testCases?.map((tc, index) => {
          let pass = false;
          let actualOutput = null;
          try {
            // eslint-disable-next-line no-new-func
            const fn = new Function(`
              ${code}
              return ${selectedProblem.functionName}(...${JSON.stringify(tc.input)});
            `);
            actualOutput = fn();
            pass = JSON.stringify(actualOutput) === JSON.stringify(tc.expectedOutput);
          } catch (e) {
            actualOutput = e.toString();
          }
          return { ...tc, pass, actualOutput, index };
        });
        
        setTestResults(results || []);
        
        const allPassed = results && results.length > 0 && results.every(r => r.pass);
        if (allPassed) {
          toast.success("All test cases passed!");
          if (!solved.includes(selectedProblem.id)) {
            setSolved([...solved, selectedProblem.id]);
          }
        } else {
          toast.error("Some test cases failed.");
        }
      } catch (err) {
        toast.error("Error in code: " + err.message);
      }
    } else {
      toast.info(`Execution for ${language} is simulated. Assume passed.`);
      if (!solved.includes(selectedProblem.id)) {
        setSolved([...solved, selectedProblem.id]);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-[calc(100vh-120px)] gap-6 p-6">
      {/* Sidebar */}
      <div className="w-1/3 max-w-sm bg-white rounded-2xl shadow-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4 gradient-text">Coding Practice</h2>
        <div className="flex flex-col gap-2 mb-4">
          <select 
            className="p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select 
            className="p-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredProblems.map(p => (
            <div 
              key={p.id} 
              onClick={() => setSelectedProblem(p)}
              className={`p-3 rounded-xl cursor-pointer transition-all card-hover ${selectedProblem?.id === p.id ? 'bg-primary-50 border-primary-500 border' : 'hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{p.title}</span>
                {solved.includes(p.id) && <FaCheckCircle className="text-accent-500" />}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                p.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {p.difficulty}
              </span>
            </div>
          ))}
          {filteredProblems.length === 0 && (
            <div className="text-center text-gray-500 mt-4">No problems found.</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {selectedProblem ? (
          <>
            {/* Problem Desc */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{selectedProblem.title}</h1>
                <div className="space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    selectedProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedProblem.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">{selectedProblem.category}</span>
                </div>
              </div>
              <div className="prose max-w-none text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: selectedProblem.description }} />
              
              <h3 className="text-lg font-semibold mb-2">Examples:</h3>
              <div className="space-y-4">
                {selectedProblem.examples?.map((ex, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg border">
                    <p><strong>Input:</strong> {JSON.stringify(ex.input)}</p>
                    <p><strong>Output:</strong> {JSON.stringify(ex.output)}</p>
                    {ex.explanation && <p className="mt-2 text-sm text-gray-600"><strong>Explanation:</strong> {ex.explanation}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="bg-white rounded-2xl shadow-lg p-4 h-1/2 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <select 
                  className="p-2 border rounded-lg bg-gray-50"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                </select>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRun}
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Run Tests
                  </button>
                  <button 
                    onClick={handleRun}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FaPlay /> Submit
                  </button>
                </div>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-slate-900 text-green-400 font-mono p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none w-full whitespace-pre"
                spellCheck="false"
              />

              {/* Results */}
              {testResults && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 overflow-y-auto max-h-40">
                  <h4 className="font-semibold mb-2">Test Results:</h4>
                  {testResults.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      {r.pass ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
                      <span className="text-sm">
                        Test Case {i + 1}: {r.pass ? 'Passed' : `Failed (Expected ${JSON.stringify(r.expectedOutput)}, Got ${JSON.stringify(r.actualOutput)})`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center text-gray-500">
            Select a problem to begin.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CodingPractice;
