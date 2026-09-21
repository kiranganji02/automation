import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, FaClock, FaCheckCircle, FaRocket, FaChartLine, 
  FaCode, FaBook, FaBrain, FaClipboard, FaTrophy, FaArrowRight, 
  FaCopy, FaLightbulb, FaGraduationCap, FaExternalLinkAlt 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const roles = [
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

const durations = [
  { label: "1 week", days: 7, type: "daily" },
  { label: "2 weeks", days: 14, type: "daily" },
  { label: "1 month", days: 30, type: "weekly" },
  { label: "2 months", days: 60, type: "weekly" },
  { label: "3 months", days: 90, type: "weekly" }
];

const hours = [2, 4, 6, 8];

const allFocusAreas = [
  "Core Technical Subjects", "Drafting & Software Tools", "System & Project Design", 
  "Aptitude & Problem Solving", "Communication & HR", "Portfolio & Projects", "Mock Interviews"
];

const getRoleStream = (roleName = "") => {
  const r = roleName.toLowerCase();
  if (r.includes("civil") || r.includes("structural") || r.includes("bim") || r.includes("site") || r.includes("survey")) return "civil";
  if (r.includes("mechanical") || r.includes("cad") || r.includes("thermal") || r.includes("hvac") || r.includes("production")) return "mech";
  if (r.includes("embedded") || r.includes("vlsi") || r.includes("telecom") || r.includes("rf") || r.includes("firmware") || r.includes("iot")) return "ece";
  if (r.includes("electrical") || r.includes("automation") || r.includes("plc") || r.includes("power")) return "eee";
  if (r.includes("ai") || r.includes("ml") || r.includes("data") || r.includes("vision")) return "aiml";
  return "cs";
};

const generatePlanData = (role, durationDays, type, dailyHours, focusAreas) => {
  const plan = [];
  const stream = getRoleStream(role);
  
  const phase1Days = Math.ceil(durationDays * 0.3);
  const phase2Days = Math.ceil(durationDays * 0.4);
  const phase3Days = durationDays - phase1Days - phase2Days;

  const createUnit = (id, title, phase, isMilestone, icon) => ({
    id, title, phase, isMilestone, icon, completed: false, tasks: []
  });

  const getPhaseTasks = (phase, focus) => {
    if (phase === 1) {
      if (stream === "civil") {
        return [
          { text: "Review Concrete Technology (IS 456) and Material properties", resource: { title: "NPTEL Civil", url: "https://nptel.ac.in/courses/105102012" } },
          { text: "AutoCAD 2D Drafting: Foundation layout and Column grid lines", resource: { title: "AutoCAD Tutorial", url: "https://www.youtube.com/results?search_query=autocad+civil+tutorial" } },
          { text: "Structural Mechanics: Shear Force & Bending Moment Diagrams", resource: { title: "Structure Free", url: "https://www.youtube.com/@structurefree" } },
          { text: "Quantitative & Technical Aptitude for Campus Placements", resource: { title: "IndiaBix Civil", url: "https://www.indiabix.com/civil-engineering/questions-and-answers/" } }
        ];
      }
      if (stream === "mech") {
        return [
          { text: "Review Thermodynamics Laws & Heat Transfer Cycles", resource: { title: "Learn Engineering", url: "https://www.youtube.com/@Lesics" } },
          { text: "SolidWorks / CATIA 3D Part Modeling & Sketch Constraints", resource: { title: "CAD CAM Tutorial", url: "https://www.youtube.com/@CADCAMTutorial" } },
          { text: "Strength of Materials: Stress-Strain Curve & Mohr's Circle", resource: { title: "NPTEL SOM", url: "https://nptel.ac.in/courses/112107146" } },
          { text: "Mechanical Engineering Technical Aptitude Questions", resource: { title: "IndiaBix Mech", url: "https://www.indiabix.com/mechanical-engineering/questions-and-answers/" } }
        ];
      }
      if (stream === "ece") {
        return [
          { text: "Digital Electronics: Logic Gates, Flip-Flops & K-Maps", resource: { title: "All About Electronics", url: "https://www.youtube.com/@AllAboutElectronics" } },
          { text: "Embedded C: Bitwise Operations, Pointers & Registers", resource: { title: "GeeksforGeeks Embedded", url: "https://www.geeksforgeeks.org/embedded-c/" } },
          { text: "Microcontroller Architecture: ARM Cortex & 8051 pinout", resource: { title: "NPTEL Microcontrollers", url: "https://nptel.ac.in/courses/108102045" } },
          { text: "Core ECE Aptitude and Circuit Analysis Problems", resource: { title: "IndiaBix ECE", url: "https://www.indiabix.com/electronics-and-communication-engineering/questions-and-answers/" } }
        ];
      }
      if (stream === "eee") {
        return [
          { text: "Electrical Network Theorems (Thevenin, Norton, Superposition)", resource: { title: "Engineering Mindset", url: "https://www.youtube.com/@TheEngineeringMindset" } },
          { text: "Electrical Machines: DC Motors, Induction Motors & Transformers", resource: { title: "NPTEL Machines", url: "https://nptel.ac.in/courses/108105017" } },
          { text: "Control Systems Basics: Transfer Functions & Bode Plots", resource: { title: "Control Systems Tutorial", url: "https://www.youtube.com/results?search_query=control+systems+bode+plot" } },
          { text: "Electrical Engineering Technical Aptitude Practice", resource: { title: "IndiaBix EEE", url: "https://www.indiabix.com/electrical-engineering/questions-and-answers/" } }
        ];
      }
      if (stream === "aiml") {
        return [
          { text: "Math for ML: Linear Algebra, Eigenvalues, Calculus & Probability", resource: { title: "3Blue1Brown Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" } },
          { text: "Python for Data Science: Vectorized NumPy & Pandas Operations", resource: { title: "Kaggle Python", url: "https://www.kaggle.com/learn/python" } },
          { text: "Classical ML Algorithms: Regression, Decision Trees & Random Forests", resource: { title: "StatQuest ML", url: "https://www.youtube.com/@joshstarmer" } },
          { text: "Data Analysis & Aptitude Practice Problems", resource: { title: "HackerRank Python", url: "https://www.hackerrank.com/domains/python" } }
        ];
      }
      // CS default
      return [
        { text: "Complete foundational concepts review (Arrays, Strings)", resource: { title: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/" } },
        { text: "Build basic HTML/CSS/JS frontend components", resource: { title: "MDN Web Docs", url: "https://developer.mozilla.org/" } },
        { text: "Review SQL Joins, Indexing and Database Normalization", resource: { title: "SQL Tutorial", url: "https://www.w3schools.com/sql/" } },
        { text: "Solve 5 Easy problems on LeetCode / GeeksforGeeks", resource: { title: "LeetCode", url: "https://leetcode.com/problemset/all/" } }
      ];
    }

    if (phase === 2) {
      if (stream === "civil") {
        return [
          { text: "STAAD.Pro / ETABS 3D Frame Modeling & Load Assignment (IS 875)", resource: { title: "STAAD Tutorial", url: "https://www.youtube.com/results?search_query=staad+pro+building+design" } },
          { text: "Bar Bending Schedule (BBS) & Quantity Estimation preparation", resource: { title: "Civil Guruji BBS", url: "https://www.youtube.com/results?search_query=bar+bending+schedule+civil" } },
          { text: "Geotechnical Soil Bearing Capacity & Foundation Design", resource: { title: "NPTEL Soil Mechanics", url: "https://nptel.ac.in/courses/105101083" } },
          { text: "Revit BIM Architecture & Structural Coordination", resource: { title: "Autodesk Revit", url: "https://www.autodesk.com/products/revit" } }
        ];
      }
      if (stream === "mech") {
        return [
          { text: "ANSYS Structural & Thermal Finite Element Analysis (FEA)", resource: { title: "ANSYS Tutorial", url: "https://www.youtube.com/results?search_query=ansys+fea+tutorial" } },
          { text: "GD&T (ASME Y14.5) Application to Manufacturing Drawings", resource: { title: "GD&T Basics", url: "https://www.youtube.com/results?search_query=gdt+asme+y14.5" } },
          { text: "CNC G-Code / M-Code Programming & CAM Toolpath Simulation", resource: { title: "CNC Machining Guide", url: "https://www.youtube.com/results?search_query=cnc+programming+g+code" } },
          { text: "HVAC Cooling Load Calculations or Vehicle Dynamics Modeling", resource: { title: "Engineering Toolbox", url: "https://www.engineeringtoolbox.com/" } }
        ];
      }
      if (stream === "ece") {
        return [
          { text: "Verilog / VHDL FSM Design & Vivado Simulation", resource: { title: "NPTEL VLSI", url: "https://nptel.ac.in/courses/117106092" } },
          { text: "FreeRTOS Tasks, Mutexes & Queue Management on STM32", resource: { title: "FreeRTOS Tutorial", url: "https://www.freertos.org/" } },
          { text: "Communication Protocols: UART, SPI, I2C, CAN Bus Interfacing", resource: { title: "SparkFun Protocol Guides", url: "https://learn.sparkfun.com/" } },
          { text: "PCB Schematic & Layout in KiCad with Design Rule Checks", resource: { title: "KiCad PCB Tutorial", url: "https://www.kicad.org/" } }
        ];
      }
      if (stream === "eee") {
        return [
          { text: "PLC Ladder Logic & SCADA System Programming (Siemens/Rockwell)", resource: { title: "PLC Programming Tutorial", url: "https://www.youtube.com/results?search_query=plc+ladder+logic+siemens" } },
          { text: "Power Electronics: Inverters, Converters & Electric Drives", resource: { title: "NPTEL Power Electronics", url: "https://nptel.ac.in/courses/108102145" } },
          { text: "MATLAB/Simulink Modeling of Solar PV / Grid Power Systems", resource: { title: "MATLAB Simulink", url: "https://www.mathworks.com/products/simulink.html" } },
          { text: "Switchgear & Substation Protective Relays Coordination", resource: { title: "Electrical Engineering Portal", url: "https://electrical-engineering-portal.com/" } }
        ];
      }
      if (stream === "aiml") {
        return [
          { text: "Deep Learning with PyTorch: CNNs, Loss Optimization & Backprop", resource: { title: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" } },
          { text: "Natural Language Processing: Transformers, Attention & HuggingFace", resource: { title: "Hugging Face Course", url: "https://huggingface.co/course/chapter1/1" } },
          { text: "Computer Vision: Object Detection with YOLOv8 & OpenCV", resource: { title: "OpenCV Python", url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html" } },
          { text: "MLOps: MLflow Experiment Tracking, Docker & FastAPI Deployment", resource: { title: "Made With ML", url: "https://madewithml.com/" } }
        ];
      }
      // CS default
      return [
        { text: "Solve Medium/Hard problems (Trees, Graphs, DP)", resource: { title: "LeetCode", url: "https://leetcode.com/" } },
        { text: "Build a full-stack REST API with authentication", resource: { title: "FreeCodeCamp", url: "https://www.freecodecamp.org/" } },
        { text: "Study System Design Basics (Load Balancing, Caching, Sharding)", resource: { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" } },
        { text: "Complete database query optimization & Indexing exercises", resource: { title: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql" } }
      ];
    }

    // Phase 3: Final Placement / Interview Phase
    return [
      { text: `Complete 2 Mock Interviews for ${role}`, resource: { title: "Practice Mock Interview", url: "/student/mock-interview" } },
      { text: "Practice STAR method responses for Behavioral and HR rounds", resource: { title: "STAR Method Guide", url: "https://www.themuse.com/advice/star-interview-method" } },
      { text: "Review Core Engineering IS / Industry Standards and Past Questions", resource: null },
      { text: "Polish Capstone Project Drawings / GitHub Repository & Resume", resource: { title: "Resume Builder", url: "/student/resume-analyzer" } }
    ];
  };

  const addTasksToUnit = (unit, phase, focusAreas) => {
    const tasks = getPhaseTasks(phase, focusAreas);
    unit.tasks = tasks.map((t, idx) => ({ 
      id: `${unit.id}-t${idx}`, 
      text: t.text, 
      resource: t.resource,
      completed: false, 
      hours: Math.floor(dailyHours / tasks.length) || 1 
    }));
  };

  if (type === 'daily') {
    for (let i = 1; i <= durationDays; i++) {
      let phase = 1;
      if (i > phase1Days && i <= phase1Days + phase2Days) phase = 2;
      if (i > phase1Days + phase2Days) phase = 3;
      
      const isMilestone = i === phase1Days || i === phase1Days + phase2Days || i === durationDays;
      const unit = createUnit(`d${i}`, `Day ${i}`, phase, isMilestone, phase === 1 ? 'book' : phase === 2 ? 'code' : 'rocket');
      addTasksToUnit(unit, phase, focusAreas);
      plan.push(unit);
    }
  } else {
    const totalWeeks = Math.ceil(durationDays / 7);
    const p1Weeks = Math.ceil(phase1Days / 7);
    const p2Weeks = Math.ceil(phase2Days / 7);
    for (let i = 1; i <= totalWeeks; i++) {
      let phase = 1;
      if (i > p1Weeks && i <= p1Weeks + p2Weeks) phase = 2;
      if (i > p1Weeks + p2Weeks) phase = 3;
      
      const isMilestone = i === p1Weeks || i === p1Weeks + p2Weeks || i === totalWeeks;
      const unit = createUnit(`w${i}`, `Week ${i}`, phase, isMilestone, phase === 1 ? 'book' : phase === 2 ? 'code' : 'rocket');
      addTasksToUnit(unit, phase, focusAreas);
      plan.push(unit);
    }
  }
  
  return plan;
};

const PrepPlan = () => {
  const [config, setConfig] = useState({
    role: "Software Developer",
    duration: durations[0],
    hours: 4,
    focusAreas: []
  });
  
  const [plan, setPlan] = useState(null);
  const [detectedGaps, setDetectedGaps] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      let matchedGaps = [];
      let detectedCount = 0;
      
      const storedGaps = localStorage.getItem('ipc_skill_gap');
      if (storedGaps) {
        const parsedGaps = JSON.parse(storedGaps);
        let missing = [];
        if (parsedGaps.missingSkills) missing = [...missing, ...parsedGaps.missingSkills];
        if (parsedGaps.categories) missing = [...missing, ...parsedGaps.categories];
        if (parsedGaps.gaps) missing = [...missing, ...parsedGaps.gaps];
        
        detectedCount = missing.length;
        if (detectedCount > 0) {
            matchedGaps = allFocusAreas.filter(area => 
                missing.some(g => typeof g === 'string' && (g.toLowerCase().includes(area.toLowerCase()) || area.toLowerCase().includes(g.toLowerCase())))
            );
            if (matchedGaps.length === 0) matchedGaps = [allFocusAreas[0], allFocusAreas[1]];
        }
      }

      let detectedRole = config.role;
      const storedJD = localStorage.getItem('ipc_jd_analysis');
      if (storedJD) {
          const parsedJD = JSON.parse(storedJD);
          if (parsedJD.roleTitle) {
              detectedRole = parsedJD.roleTitle;
              if (!roles.includes(detectedRole)) {
                  roles.push(detectedRole); 
              }
          }
      }

      if (matchedGaps.length > 0 || detectedRole !== config.role) {
          setConfig(prev => ({ 
              ...prev, 
              focusAreas: matchedGaps.length > 0 ? Array.from(new Set([...prev.focusAreas, ...matchedGaps])) : prev.focusAreas,
              role: detectedRole 
          }));
          setDetectedGaps({ count: detectedCount || matchedGaps.length, focusAreas: matchedGaps });
      }

      const storedStreak = localStorage.getItem('ipc_streak_data');
      if (storedStreak) {
          setStreak(JSON.parse(storedStreak).count || 0);
      }

      const savedPlan = localStorage.getItem('ipc_prep_plan');
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan);
        setPlan(parsed.plan);
        if (parsed.config) setConfig(parsed.config);
      }
    } catch (e) {
      console.error("Error loading data from localStorage", e);
    }
  }, []);

  const syncProgress = (currentPlan, currentStreak) => {
    if (!currentPlan) return;
    const tTasks = currentPlan.reduce((acc, unit) => acc + unit.tasks.length, 0);
    const cTasks = currentPlan.reduce((acc, unit) => acc + unit.tasks.filter(t => t.completed).length, 0);
    const pPercent = tTasks === 0 ? 0 : Math.round((cTasks / tTasks) * 100);
    
    let currPhase = 1;
    const firstUncompleted = currentPlan.find(u => !u.completed);
    if (firstUncompleted) currPhase = firstUncompleted.phase;
    else if (currentPlan.length > 0) currPhase = 3;

    localStorage.setItem('ipc_prep_progress', JSON.stringify({
        totalTasks: tTasks,
        completedTasks: cTasks,
        progressPercent: pPercent,
        currentPhase: currPhase,
        streak: currentStreak
    }));
  };

  const handleGeneratePlan = () => {
    if (config.focusAreas.length === 0) {
      toast.error("Please select at least one focus area.");
      return;
    }
    const newPlan = generatePlanData(config.role, config.duration.days, config.duration.type, config.hours, config.focusAreas);
    setPlan(newPlan);
    
    localStorage.setItem('ipc_prep_plan', JSON.stringify({
      config,
      plan: newPlan,
      streak: streak
    }));
    
    syncProgress(newPlan, streak);
    toast.success("Preparation plan generated successfully!");
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const storedStreak = localStorage.getItem('ipc_streak_data');
    let streakCount = 1;
    if (storedStreak) {
        const parsed = JSON.parse(storedStreak);
        if (parsed.lastDate === today) {
            streakCount = parsed.count; 
        } else {
            const lastDate = new Date(parsed.lastDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate.toDateString() === yesterday.toDateString()) {
                streakCount = parsed.count + 1;
            } else {
                streakCount = 1;
            }
        }
    }
    localStorage.setItem('ipc_streak_data', JSON.stringify({ count: streakCount, lastDate: today }));
    setStreak(streakCount);
    return streakCount;
  };

  const toggleTaskCompletion = (unitId, taskId) => {
    if (!plan) return;
    let newlyCompleted = false;
    const updatedPlan = plan.map(unit => {
      if (unit.id === unitId) {
        const updatedTasks = unit.tasks.map(task => {
          if (task.id === taskId) {
            if (!task.completed) newlyCompleted = true;
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        const allCompleted = updatedTasks.every(t => t.completed);
        return { ...unit, tasks: updatedTasks, completed: allCompleted };
      }
      return unit;
    });
    setPlan(updatedPlan);
    
    let currentStreak = streak;
    if (newlyCompleted) {
       currentStreak = updateStreak();
    }

    localStorage.setItem('ipc_prep_plan', JSON.stringify({
      config,
      plan: updatedPlan,
      streak: currentStreak
    }));

    syncProgress(updatedPlan, currentStreak);
  };

  const copyPlanToClipboard = () => {
    if (!plan) return;
    let text = `Personalized Preparation Plan for ${config.role}\nDuration: ${config.duration.label} | ${config.hours} hrs/day\n\n`;
    plan.forEach(unit => {
      text += `${unit.title} (Phase ${unit.phase}):\n`;
      unit.tasks.forEach(task => {
        text += `  [${task.completed ? 'x' : ' '}] ${task.text} (${task.hours} hrs)\n`;
      });
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    toast.success("Plan copied to clipboard!");
  };

  const handleFocusAreaToggle = (area) => {
    setConfig(prev => {
      const isSelected = prev.focusAreas.includes(area);
      const newAreas = isSelected 
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: newAreas };
    });
  };

  const totalTasks = plan ? plan.reduce((acc, unit) => acc + unit.tasks.length, 0) : 0;
  const completedTasks = plan ? plan.reduce((acc, unit) => acc + unit.tasks.filter(t => t.completed).length, 0) : 0;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const phaseProgress = (phase) => {
    if (!plan) return 0;
    const phaseUnits = plan.filter(u => u.phase === phase);
    const pTotal = phaseUnits.reduce((acc, u) => acc + u.tasks.length, 0);
    const pComp = phaseUnits.reduce((acc, u) => acc + u.tasks.filter(t => t.completed).length, 0);
    return pTotal === 0 ? 0 : Math.round((pComp / pTotal) * 100);
  };

  const renderIcon = (type, phase) => {
    const colorClass = phase === 1 ? "text-blue-500" : phase === 2 ? "text-purple-500" : "text-green-500";
    if (type === 'book') return <FaBook className={`w-5 h-5 ${colorClass}`} />;
    if (type === 'code') return <FaCode className={`w-5 h-5 ${colorClass}`} />;
    return <FaRocket className={`w-5 h-5 ${colorClass}`} />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
          <FaGraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Personalized Preparation Plan</h1>
          <p className="text-slate-500">Structured roadmap tailored to your target role and schedule.</p>
        </div>
      </div>

      {detectedGaps && detectedGaps.count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <FaLightbulb className="text-amber-500 w-5 h-5 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800">Skill Gaps Detected!</h4>
            <p className="text-sm text-amber-700">We detected {detectedGaps.count} skill gap{detectedGaps.count !== 1 ? 's' : ''} and recommend focusing on {detectedGaps.focusAreas.join(", ")}.</p>
          </div>
        </div>
      )}

      {/* Configuration Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FaCalendarAlt className="text-primary-500" /> Plan Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Target Role</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none"
              value={config.role}
              onChange={(e) => setConfig({...config, role: e.target.value})}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Duration</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none"
              value={config.duration.label}
              onChange={(e) => setConfig({...config, duration: durations.find(d => d.label === e.target.value)})}
            >
              {durations.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Daily Study Hours</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none"
              value={config.hours}
              onChange={(e) => setConfig({...config, hours: parseInt(e.target.value)})}
            >
              {hours.map(h => <option key={h} value={h}>{h} Hours</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <label className="text-sm font-semibold text-slate-700">Focus Areas</label>
          <div className="flex flex-wrap gap-3">
            {allFocusAreas.map(area => (
              <button
                key={area}
                onClick={() => handleFocusAreaToggle(area)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  config.focusAreas.includes(area)
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGeneratePlan}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-2"
        >
          <FaBrain /> Generate Personalized Plan
        </button>
      </div>

      {/* Generated Plan Section */}
      <AnimatePresence>
        {plan && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="space-y-6"
          >
            {/* Progress Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Overall Progress</p>
                    <h3 className="text-2xl font-bold text-slate-800">{progressPercent}%</h3>
                  </div>
                  <div className="text-sm text-slate-500">{completedTasks} / {totalTasks} Tasks</div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl">
                  <FaChartLine />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Current Streak</p>
                  <h3 className="text-2xl font-bold text-slate-800">{streak} Days</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex justify-center items-center">
                <button onClick={copyPlanToClipboard} className="flex flex-col items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
                  <FaCopy className="w-6 h-6" />
                  <span className="font-semibold text-sm">Export Plan</span>
                </button>
              </div>
            </div>

            {/* Phase Progress Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { phase: 1, name: "Phase 1: Foundation", color: "blue", desc: "Core concepts & basics" },
                { phase: 2, name: "Phase 2: Skill Building", color: "purple", desc: "Advanced topics & projects" },
                { phase: 3, name: "Phase 3: Interview Prep", color: "green", desc: "Mocks, resume & specific prep" }
              ].map(p => (
                <div key={p.phase} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-semibold text-${p.color}-600`}>{p.name}</h4>
                    <span className="text-sm font-bold text-slate-700">{phaseProgress(p.phase)}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{p.desc}</p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${phaseProgress(p.phase)}%` }}
                      className={`h-full bg-${p.color}-500`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">
              <div className="absolute left-8 md:left-12 top-6 bottom-6 w-0.5 bg-slate-200"></div>
              
              <div className="space-y-8 relative">
                {plan.map((unit, index) => {
                  const isPhase1 = unit.phase === 1;
                  const isPhase2 = unit.phase === 2;
                  const dotColor = isPhase1 ? 'bg-blue-500' : isPhase2 ? 'bg-purple-500' : 'bg-green-500';
                  const dotBorder = isPhase1 ? 'border-blue-200' : isPhase2 ? 'border-purple-200' : 'border-green-200';
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={unit.id} 
                      className="relative pl-12 md:pl-20"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute left-0 md:left-4 top-4 w-4 h-4 rounded-full ${dotColor} border-4 ${dotBorder} z-10 transform -translate-x-1/2`}></div>
                      
                      {unit.isMilestone && (
                        <div className="absolute left-0 md:left-4 top-4 w-6 h-6 rounded-full bg-yellow-400 z-0 transform -translate-x-1/2 animate-ping opacity-75"></div>
                      )}

                      <div className={`bg-white rounded-xl border ${unit.completed ? 'border-green-300 bg-green-50/30' : 'border-slate-200'} shadow-sm overflow-hidden`}>
                        {/* Unit Header */}
                        <div className={`px-5 py-3 border-b ${unit.completed ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-slate-50'} flex justify-between items-center`}>
                          <div className="flex items-center gap-3">
                            {renderIcon(unit.icon, unit.phase)}
                            <h4 className="font-bold text-slate-800">{unit.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${isPhase1 ? 'bg-blue-100 text-blue-700' : isPhase2 ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                              Phase {unit.phase}
                            </span>
                          </div>
                          {unit.isMilestone && <FaTrophy className="text-yellow-500 w-5 h-5" />}
                        </div>
                        
                        {/* Unit Tasks */}
                        <div className="p-4 space-y-3">
                          {unit.tasks.map(task => (
                            <div key={task.id} className="flex items-start gap-3">
                              <button 
                                onClick={() => toggleTaskCompletion(unit.id, task.id)}
                                className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                  task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-primary-500'
                                }`}
                              >
                                {task.completed && <FaCheckCircle className="w-3 h-3" />}
                              </button>
                              <div className="flex-1">
                                <p className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                  {task.text}
                                </p>
                                {task.resource && (
                                  <a href={task.resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-xs text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-md">
                                    <FaExternalLinkAlt className="w-3 h-3" /> {task.resource.title}
                                  </a>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                <FaClock /> {task.hours}h
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PrepPlan;
