import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaBriefcase, 
  FaCode, 
  FaDatabase, 
  FaCloud, 
  FaUsers, 
  FaChartBar, 
  FaLightbulb, 
  FaClipboardList, 
  FaArrowRight, 
  FaStar, 
  FaFire, 
  FaGraduationCap,
  FaFileAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaGift,
  FaCog
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const jobRoles = [
  // Computer Science & IT
  "Software Developer", "Full Stack Developer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Cloud Engineer", "QA Engineer",
  // AI & Data Science
  "AI / ML Engineer", "Data Scientist", "Data Analyst", "Computer Vision Engineer",
  // Civil Engineering
  "Structural Design Engineer", "Civil Site Engineer", "BIM Engineer", "Quantity Surveying / Estimation Engineer",
  // Mechanical Engineering
  "Mechanical Design Engineer", "CAD / CAM Engineer", "Thermal & HVAC Engineer", "Production / Quality Engineer",
  // Electronics & Communication (ECE)
  "Embedded Systems Engineer", "VLSI Design Engineer", "IoT & Firmware Engineer", "Telecom / RF Engineer",
  // Electrical & Electronics (EEE)
  "Electrical Systems Engineer", "Industrial Automation Engineer (PLC/SCADA)", "Power Systems Engineer"
];

const sampleJDs = [
  {
    stream: "CS / IT",
    title: "Software Developer (Full Stack)",
    text: "We are hiring a Full Stack Software Developer to design and implement cloud-native web applications. Requirements: Proven experience with JavaScript, TypeScript, React, and Node.js or Python. Experience with relational databases like PostgreSQL and MySQL, and NoSQL like MongoDB. Hands-on experience with Docker, Git, CI/CD pipelines, and AWS cloud deployment. Strong understanding of REST APIs, data structures, and algorithms. Bachelor's degree in Computer Science or related engineering. We offer flexible hybrid work, health insurance, and continuous learning allowances."
  },
  {
    stream: "AI & ML",
    title: "AI / Machine Learning Engineer",
    text: "Seeking an AI/ML Engineer to develop and deploy cutting-edge deep learning models. Responsibilities: Design end-to-end ML and LLM pipelines, fine-tune transformer models, and optimize inference performance. Requirements: Strong proficiency in Python, PyTorch, TensorFlow, Scikit-learn, and OpenCV. Familiarity with Natural Language Processing (NLP), Computer Vision, and Generative AI (RAG, LangChain). Experience with Docker, FastAPI, and MLflow for MLOps. Degree in Artificial Intelligence, Computer Science, or Mathematics."
  },
  {
    stream: "Civil",
    title: "Structural Design Engineer (Civil)",
    text: "Larsen & Toubro is seeking a Structural Design Engineer for high-rise residential and commercial projects. Responsibilities: Prepare structural designs, load calculations, and reinforcement details in accordance with IS 456, IS 800, and IS 1893 seismic codes. Requirements: B.Tech/M.Tech in Civil Engineering. High proficiency in STAAD.Pro, ETABS, AutoCAD, and Revit BIM. Knowledge of concrete technology, foundation engineering, and bar bending schedules. Strong communication and on-site coordination skills."
  },
  {
    stream: "Mechanical",
    title: "Mechanical Design Engineer (CAD/CAE)",
    text: "Tata Motors is looking for a Mechanical Design Engineer to work on Electric Vehicle (EV) chassis and powertrain packaging. Responsibilities: 3D CAD modeling of sheet metal and cast components in SolidWorks and CATIA. Perform structural finite element analysis (FEA) and thermal simulations in ANSYS. Apply GD&T standards (ASME Y14.5) to manufacturing drawings. Requirements: Degree in Mechanical Engineering. Experience in SolidWorks, ANSYS, GD&T, manufacturing processes, and CNC machining."
  },
  {
    stream: "ECE",
    title: "Embedded Systems & IoT Engineer",
    text: "Bosch is hiring an Embedded Systems Engineer to develop automotive firmware and IoT telematics solutions. Responsibilities: Design and program bare-metal and RTOS firmware in Embedded C for ARM Cortex-M microcontrollers. Interface sensors via I2C, SPI, UART, and CAN Bus protocols. Requirements: Degree in Electronics & Communication (ECE) or Electrical Engineering. Proficient in Embedded C, Microcontrollers (STM32, ARM), Keil/STM32CubeIDE, KiCad PCB design, and FreeRTOS."
  },
  {
    stream: "EEE",
    title: "Electrical & Automation Engineer",
    text: "Siemens is recruiting an Electrical & Automation Engineer for industrial automation and power distribution projects. Responsibilities: Develop and commission PLC ladder logic and SCADA graphical interfaces. Perform electrical load calculations, single-line diagrams (SLD), and switchgear protection sizing. Requirements: B.Tech in Electrical and Electronics Engineering (EEE). Hands-on experience with PLC (Siemens TIA Portal / Rockwell), SCADA, variable frequency drives (VFD), MATLAB/Simulink, and motor controls."
  }
];

const dictionaries = {
  programming: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'swift', 'kotlin', 'typescript', 'rust', 'scala', 'r', 'matlab', 'dart', 'c', 'sql', 'embedded c', 'verilog', 'vhdl'],
  frameworks: ['react', 'angular', 'vue', 'django', 'spring', 'flask', 'node.js', 'express', 'next.js', 'bootstrap', 'tailwind', 'pytorch', 'tensorflow', 'scikit-learn', 'keras', 'opencv', 'fastapi', 'freertos'],
  databases: ['mysql', 'postgresql', 'mongodb', 'oracle', 'redis', 'cassandra', 'elasticsearch', 'dynamodb', 'sqlite', 'mariadb', 'firebase'],
  cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'git', 'ci/cd', 'linux', 'github', 'ansible'],
  coreEngineering: [
    'autocad', 'solidworks', 'catia', 'staad.pro', 'etabs', 'revit', 'ansys',
    'matlab', 'simulink', 'plc', 'scada', 'embedded systems', 'microcontrollers',
    'arm cortex', '8051', 'arduino', 'raspberry pi', 'pcb design', 'kicad',
    'gd&t', 'cnc machining', 'hvac', 'thermodynamics', 'fluid mechanics',
    'strength of materials', 'concrete technology', 'structural analysis',
    'surveying', 'total station', 'estimation & costing', 'bim', 'is 456',
    'power systems', 'electrical machines', 'power electronics', 'switchgear', 'transformers', 'vfd'
  ],
  softSkills: ['communication', 'leadership', 'teamwork', 'team player', 'problem-solving', 'analytical', 'agile', 'scrum', 'collaboration', 'collaborative', 'time management', 'adaptable', 'mentoring', 'critical thinking', 'detail', 'coordination'],
  qualifications: ['bachelor', 'b.tech', 'b.e', 'bs', 'bsc', 'master', 'ms', 'm.tech', 'phd', 'computer science', 'civil engineering', 'mechanical engineering', 'electronics', 'electrical', 'engineering', 'degree'],
  experience: {
    entry: ['entry level', '0-2 years', 'junior', 'fresher', 'graduate', 'intern', 'trainee'],
    mid: ['2-5 years', '2+ years', '3+ years', 'mid-level', 'intermediate'],
    senior: ['5+ years', '7+ years', 'senior', 'lead', 'principal', 'manager', 'architect']
  },
  culture: ['fast-paced', 'innovative', 'inclusive', 'diversity', 'startup', 'work-life balance', 'mentor', 'growth mindset', 'continuous learning', 'dynamic'],
  workMode: ['remote', 'hybrid', 'on-site', 'onsite', 'work from home', 'wfh', 'in-office'],
  benefits: ['health insurance', '401k', 'pf', 'provident fund', 'bonus', 'equity', 'stock options', 'esop', 'paid time off', 'pto', 'flexible hours', 'gym', 'relocation', 'allowance'],
  responsibilitiesKeywords: ['design', 'develop', 'build', 'maintain', 'collaborate', 'lead', 'manage', 'troubleshoot', 'test', 'deploy', 'optimize', 'ensure', 'participate', 'create', 'analyzing', 'interpreting', 'supervise', 'inspect', 'calculate', 'model', 'commission']
};

const extractSkills = (text, dict) => {
  const lowerText = text.toLowerCase();
  return dict.filter(item => {
    const regex = new RegExp(`\\b${item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(lowerText);
  });
};

const extractSentencesWithKeywords = (text, keywords) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const matched = sentences.filter(sentence => 
    keywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(sentence))
  ).map(s => s.trim());
  return [...new Set(matched)].slice(0, 5); // Return top 5 unique
};

const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedRole, setSelectedRole] = useState(jobRoles[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [resumeSkills, setResumeSkills] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ipc_jd_data');
    if (saved) {
      try {
        setAnalysisResult(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved analysis', e);
      }
    }

    // Load Resume Data
    const resumeAnalysis = localStorage.getItem('ipc_resume_analysis');
    const resumeData = localStorage.getItem('ipc_resume_data');
    const profileData = localStorage.getItem('ipc_profile');
    
    let allResumeSkills = [];
    if (resumeAnalysis) {
      try {
        const parsed = JSON.parse(resumeAnalysis);
        if (parsed.skills && Array.isArray(parsed.skills)) {
          allResumeSkills = [...allResumeSkills, ...parsed.skills.map(s => s.toLowerCase())];
        }
        if (parsed.keywords?.detected && Array.isArray(parsed.keywords.detected)) {
          allResumeSkills = [...allResumeSkills, ...parsed.keywords.detected.map(s => s.toLowerCase())];
        }
      } catch(e) {}
    }
    
    if (resumeData) {
      try {
        const parsed = JSON.parse(resumeData);
        if (Array.isArray(parsed.skills)) {
          allResumeSkills = [...allResumeSkills, ...parsed.skills.map(s => s.toLowerCase())];
        } else if (typeof parsed.skills === 'string') {
          allResumeSkills = [...allResumeSkills, ...parsed.skills.split(',').map(s => s.trim().toLowerCase())];
        }
      } catch(e) {}
    }

    if (profileData) {
      try {
        const parsed = JSON.parse(profileData);
        ['skills', 'programmingLanguages', 'frameworksLibraries', 'toolsPlatforms'].forEach(field => {
          if (Array.isArray(parsed[field])) {
            allResumeSkills = [...allResumeSkills, ...parsed[field].map(s => s.toLowerCase())];
          }
        });
      } catch(e) {}
    }
    
    setResumeSkills([...new Set(allResumeSkills.filter(Boolean))]);
  }, []);

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const lowerJD = jobDescription.toLowerCase();
      
      const extractedProgramming = extractSkills(jobDescription, dictionaries.programming);
      const extractedFrameworks = extractSkills(jobDescription, dictionaries.frameworks);
      const extractedDatabases = extractSkills(jobDescription, dictionaries.databases);
      const extractedCloud = extractSkills(jobDescription, dictionaries.cloud);
      const extractedCoreEng = extractSkills(jobDescription, dictionaries.coreEngineering);
      const extractedSoft = extractSkills(jobDescription, dictionaries.softSkills);
      const extractedQuals = extractSkills(jobDescription, dictionaries.qualifications);
      const extractedCulture = extractSkills(jobDescription, dictionaries.culture);
      const extractedMode = extractSkills(jobDescription, dictionaries.workMode);
      const extractedBenefits = extractSkills(jobDescription, dictionaries.benefits);
      const extractedResponsibilities = extractSentencesWithKeywords(jobDescription, dictionaries.responsibilitiesKeywords);

      let expLevel = 'Entry Level';
      if (dictionaries.experience.senior.some(k => lowerJD.includes(k))) expLevel = 'Senior Level';
      else if (dictionaries.experience.mid.some(k => lowerJD.includes(k))) expLevel = 'Mid Level';

      // Salary Intelligence
      let salaryRange = '$50k - $80k (₹5L - ₹15L)';
      if (expLevel === 'Senior Level') salaryRange = '$120k - $180k (₹30L - ₹50L+)';
      else if (expLevel === 'Mid Level') salaryRange = '$80k - $120k (₹15L - ₹30L)';

      const allJDSkills = [...new Set([...extractedProgramming, ...extractedFrameworks, ...extractedDatabases, ...extractedCloud, ...extractedCoreEng, ...extractedSoft])];
      
      // Match Engine
      let matchingSkills = [];
      let missingSkills = [];
      let partialSkills = [];

      allJDSkills.forEach(jdSkill => {
        const jdSkillLower = jdSkill.toLowerCase();
        if (resumeSkills.includes(jdSkillLower)) {
          matchingSkills.push(jdSkill);
        } else {
          // Check for partial matches or related skills
          if (jdSkillLower === 'react' && resumeSkills.includes('javascript')) {
            partialSkills.push(jdSkill);
          } else if (jdSkillLower === 'staad.pro' && resumeSkills.includes('autocad')) {
            partialSkills.push(jdSkill);
          } else if (jdSkillLower === 'ansys' && resumeSkills.includes('solidworks')) {
            partialSkills.push(jdSkill);
          } else {
            missingSkills.push(jdSkill);
          }
        }
      });

      const matchScore = allJDSkills.length > 0 ? Math.round((matchingSkills.length / allJDSkills.length) * 100) : 0;

      const result = {
        role: selectedRole,
        timestamp: new Date().toISOString(),
        skills: {
          programming: extractedProgramming,
          frameworks: extractedFrameworks,
          databases: extractedDatabases,
          cloud: extractedCloud,
          coreEngineering: extractedCoreEng,
          soft: extractedSoft
        },
        qualifications: extractedQuals,
        experienceLevel: expLevel,
        culture: extractedCulture,
        workMode: extractedMode.length > 0 ? extractedMode[0] : 'Not specified',
        benefits: extractedBenefits,
        responsibilities: extractedResponsibilities,
        matchScore: matchScore,
        matchingSkills: matchingSkills,
        missingSkills: missingSkills,
        partialSkills: partialSkills,
        insights: {
          difficulty: expLevel === 'Senior Level' ? 'High' : expLevel === 'Mid Level' ? 'Medium' : 'Moderate',
          salaryRange: salaryRange,
          demand: 'High Growth', 
          focus: extractedCoreEng.length > 0 ? 'Core Domain & Design Engineering' : extractedCloud.length > 0 ? 'Cloud Technologies & System Design' : 'Core Technical Competencies'
        },
        suggestions: [
          ...(extractedCoreEng.slice(0, 2).map(s => `Gain hands-on proficiency in ${s.toUpperCase()}`)),
          ...(extractedProgramming.slice(0, 2).map(s => `Master advanced concepts in ${s.toUpperCase()}`)),
          ...(extractedFrameworks.slice(0, 1).map(s => `Build a portfolio project using ${s.toUpperCase()}`)),
          ...(extractedDatabases.length > 0 ? [`Review query and data management for ${extractedDatabases[0].toUpperCase()}`] : [])
        ]
      };

      setAnalysisResult(result);
      localStorage.setItem('ipc_jd_data', JSON.stringify(result));
      localStorage.setItem('ipc_jd_analysis', JSON.stringify(result));
      setIsAnalyzing(false);
      toast.success('Job Description analyzed successfully!');
    }, 1500);
  };

  const loadSample = (sample) => {
    setJobDescription(sample.text);
    setSelectedRole(sample.title);
    toast.info(`Loaded sample: ${sample.title}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <FaSearch className="text-primary-600" /> Job Description Analyzer
          </h1>
          <p className="text-slate-500 mt-2">
            Paste a job description to extract required skills, insights, and get a resume match score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <FaFileAlt className="text-primary-500" /> Input Job Details
            </h2>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {jobRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Paste Job Description</label>
            <textarea
              className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-slate-700"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 self-center mr-1">Try Sample JD:</span>
            {sampleJDs.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => loadSample(sample)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5"
              >
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-primary-100 text-primary-700 rounded">{sample.stream}</span>
                <span>{sample.title.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Description...
              </>
            ) : (
              <>
                <FaSearch /> Analyze Job Description
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {analysisResult ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Match Engine Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FaChartBar size={100} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-primary-500" /> Resume Match Engine
                  </h3>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={analysisResult.matchScore >= 70 ? "text-green-500" : analysisResult.matchScore >= 40 ? "text-yellow-500" : "text-red-500"}
                          strokeDasharray={`${analysisResult.matchScore}, 100`}
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-xl font-bold text-slate-700">
                        {analysisResult.matchScore}%
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">Matching Skills</span>
                        <span className="text-green-600 font-bold">{analysisResult.matchingSkills.length}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(analysisResult.matchingSkills.length / (analysisResult.matchingSkills.length + analysisResult.missingSkills.length || 1)) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">Missing Skills</span>
                        <span className="text-red-600 font-bold">{analysisResult.missingSkills.length}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(analysisResult.missingSkills.length / (analysisResult.matchingSkills.length + analysisResult.missingSkills.length || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.matchingSkills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-1">
                          <FaCheckCircle className="text-green-500" /> You Have These Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matchingSkills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200 capitalize">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {analysisResult.partialSkills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-1">
                          <FaExclamationCircle className="text-yellow-500" /> Partial Matches
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.partialSkills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs font-medium border border-yellow-200 capitalize">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.missingSkills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-1">
                          <FaTimesCircle className="text-red-500" /> Missing / To Learn
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingSkills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-200 capitalize">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insights Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                      <FaBriefcase />
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Level</p>
                    <p className="text-sm font-bold text-slate-800">{analysisResult.experienceLevel}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col items-center justify-center text-center col-span-1 lg:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                      <FaChartBar />
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Est. Salary (USD & LPA)</p>
                    <p className="text-sm font-bold text-slate-800">{analysisResult.insights.salaryRange}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                      <FaMapMarkerAlt />
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Work Mode</p>
                    <p className="text-sm font-bold text-slate-800 capitalize">{analysisResult.workMode}</p>
                  </div>
                </div>

                {/* Extracted Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FaClipboardList className="text-primary-500" /> Extracted Requirements & Details
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Responsibilities */}
                    {analysisResult.responsibilities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                          <FaBriefcase className="text-slate-400" /> Key Responsibilities
                        </p>
                        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                          {analysisResult.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Programming */}
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <FaCode className="text-slate-400" /> Programming Languages
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills.programming.length > 0 ? (
                          analysisResult.skills.programming.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm capitalize border border-blue-100">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400 italic">None specifically mentioned</span>
                        )}
                      </div>
                    </div>

                    {/* Frameworks & Databases */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                          <FaStar className="text-slate-400" /> Frameworks & Tools
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.skills.frameworks.length > 0 ? (
                            analysisResult.skills.frameworks.map(skill => (
                              <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm capitalize border border-indigo-100">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400 italic">None mentioned</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                          <FaDatabase className="text-slate-400" /> Databases
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.skills.databases.length > 0 ? (
                            analysisResult.skills.databases.map(skill => (
                              <span key={skill} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-sm capitalize border border-teal-100">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400 italic">None mentioned</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cloud & DevOps */}
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <FaCloud className="text-slate-400" /> Cloud & DevOps
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills.cloud.length > 0 ? (
                          analysisResult.skills.cloud.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm capitalize border border-purple-100">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400 italic">None mentioned</span>
                        )}
                      </div>
                    </div>

                    {/* Core Engineering & Domain Tools */}
                    {analysisResult.skills.coreEngineering && analysisResult.skills.coreEngineering.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                          <FaCog className="text-slate-400" /> Core Engineering & Domain Tools
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.skills.coreEngineering.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm capitalize border border-amber-200 font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Soft Skills & Quals */}
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <FaUsers className="text-slate-400" /> Soft Skills & Qualifications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills.soft.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm capitalize border border-orange-100">
                            {skill}
                          </span>
                        ))}
                        {analysisResult.qualifications.map(qual => (
                          <span key={qual} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-sm capitalize border border-rose-100 flex items-center gap-1">
                            <FaGraduationCap /> {qual}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Culture & Benefits */}
                    {(analysisResult.culture.length > 0 || analysisResult.benefits.length > 0) && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                          <FaGift className="text-slate-400" /> Culture & Benefits
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.culture.map(c => (
                            <span key={c} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-lg text-sm capitalize border border-pink-100">
                              {c}
                            </span>
                          ))}
                          {analysisResult.benefits.map(b => (
                            <span key={b} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm capitalize border border-emerald-100">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preparation Suggestions */}
                <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-sm border border-primary-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FaLightbulb className="text-accent-500" /> Preparation Plan
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.suggestions.length > 0 ? (
                      analysisResult.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <div className="mt-1 text-primary-500"><FaArrowRight size={14} /></div>
                          <p className="text-slate-700">{suggestion}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-600">Review general data structures and algorithms for {selectedRole}.</p>
                    )}
                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <div className="mt-1 text-primary-500"><FaArrowRight size={14} /></div>
                      <p className="text-slate-700">Focus heavily on: <strong>{analysisResult.insights.focus}</strong></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300"
              >
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <FaSearch size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-700">No Analysis Yet</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                  Paste a job description and click analyze to extract key requirements, check your resume match, and get a preparation plan.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default JobAnalyzer;
