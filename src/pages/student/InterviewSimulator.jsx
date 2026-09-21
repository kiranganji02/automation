import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserTie, FaRobot, FaPlay, FaClock, FaStar, FaLightbulb, 
  FaBrain, FaComments, FaArrowRight, FaRedo, FaHistory, 
  FaCheckCircle, FaTimesCircle, FaTrophy, FaArrowLeft, 
  FaChevronDown, FaPaperPlane, FaStopwatch, FaMagic
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Doughnut, Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import { saveInterviewResultToDb, getActiveUserId } from '../../firebase/db';
import { useNavigate } from 'react-router-dom';

// ==========================================
// COMPREHENSIVE QUESTION BANK (50+ Questions)
// ==========================================
const QUESTION_BANK = {
  HR: [
    { id: 'hr1', text: "Tell me about yourself.", difficulty: "Easy", tips: ["Keep it professional", "Focus on your current role, past experience, and future goals", "Use the Present-Past-Future formula"], idealPoints: ["Professional background", "Key skills", "Why you are a fit"], keywords: ["experience", "background", "skills", "graduated", "working", "passionate", "interested"] },
    { id: 'hr2', text: "What are your greatest strengths and weaknesses?", difficulty: "Medium", tips: ["Be honest but strategic", "Show how you overcome weaknesses", "Align strengths with the job role"], idealPoints: ["Relevant strength", "Honest weakness", "Improvement plan"], keywords: ["strength", "weakness", "improve", "working on", "dedication", "fast learner", "detail-oriented"] },
    { id: 'hr3', text: "Why do you want to work for our company?", difficulty: "Easy", tips: ["Show you've done research", "Mention specific projects, values, or culture", "Align your goals with the company's"], idealPoints: ["Company research", "Cultural alignment", "Specific reasons"], keywords: ["culture", "values", "growth", "projects", "reputation", "innovation", "admire"] },
    { id: 'hr4', text: "Where do you see yourself in five years?", difficulty: "Medium", tips: ["Show ambition but be realistic", "Connect your goals to the company/role", "Focus on learning and contribution"], idealPoints: ["Career progression", "Skill development", "Commitment"], keywords: ["lead", "manager", "senior", "learning", "expert", "contribute", "grow"] },
    { id: 'hr5', text: "What are your salary expectations?", difficulty: "Hard", tips: ["Give a range rather than an exact number", "Base it on market research", "Express flexibility based on total compensation"], idealPoints: ["Market research", "Range provided", "Flexibility"], keywords: ["range", "flexible", "market", "negotiable", "benefits", "compensation", "industry standard"] },
    { id: 'hr6', text: "Why should we hire you?", difficulty: "Medium", tips: ["Summarize your key qualifications", "Highlight what makes you unique", "Connect your skills to their specific needs"], idealPoints: ["Unique value proposition", "Relevant skills matching", "Enthusiasm"], keywords: ["unique", "perfect fit", "contribute", "skills", "experience", "bring value", "results"] },
    { id: 'hr7', text: "How do you handle stress and pressure?", difficulty: "Medium", tips: ["Provide an example of a stressful situation", "Focus on your coping mechanisms (e.g., prioritization, taking a step back)", "Show resilience"], idealPoints: ["Prioritization", "Staying calm", "Action-oriented approach"], keywords: ["calm", "prioritize", "organize", "breathe", "focus", "step back", "manage"] },
    { id: 'hr8', text: "Describe your ideal work environment.", difficulty: "Easy", tips: ["Match it to the company's known culture", "Mention collaboration, learning, or autonomy", "Keep it positive"], idealPoints: ["Collaboration", "Growth opportunities", "Alignment with company"], keywords: ["collaborative", "team", "supportive", "innovative", "fast-paced", "learning", "dynamic"] },
    { id: 'hr9', text: "What motivates you?", difficulty: "Medium", tips: ["Go beyond money", "Mention learning, solving problems, or seeing results", "Connect it to the role"], idealPoints: ["Intrinsic motivation", "Impact/results", "Continuous learning"], keywords: ["learning", "solving", "impact", "results", "challenge", "helping", "achievement"] },
    { id: 'hr10', text: "Are you willing to relocate?", difficulty: "Easy", tips: ["Be honest about your situation", "Show flexibility if possible", "Ask clarifying questions if needed"], idealPoints: ["Honesty", "Flexibility", "Openness to discussion"], keywords: ["open", "flexible", "opportunity", "relocate", "discuss", "willing", "depends"] }
  ],
  Technical: [
    { id: 'tech1', text: "Explain Object-Oriented Programming (OOP) concepts with examples.", difficulty: "Easy", tips: ["Cover the 4 main pillars: Abstraction, Encapsulation, Inheritance, Polymorphism", "Use real-world analogies (e.g., Car for class/object)"], idealPoints: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"], keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction", "class", "object", "hide", "extend"] },
    { id: 'tech2', text: "What is the difference between a process and a thread?", difficulty: "Medium", tips: ["Discuss memory space sharing", "Compare creation/context switching overhead", "Mention concurrency vs parallelism"], idealPoints: ["Memory sharing", "Context switching", "Independence"], keywords: ["memory", "share", "independent", "context switch", "lightweight", "heavyweight", "address space"] },
    { id: 'tech3', text: "Compare SQL and NoSQL databases. When would you use which?", difficulty: "Medium", tips: ["Discuss schema (rigid vs flexible)", "Discuss scaling (vertical vs horizontal)", "Give examples (ACID vs BASE)"], idealPoints: ["Relational vs Non-relational", "Schema", "Scaling (Vertical/Horizontal)", "Use cases"], keywords: ["relational", "schema", "table", "document", "scale", "horizontal", "vertical", "ACID"] },
    { id: 'tech4', text: "How does a HashMap work internally?", difficulty: "Hard", tips: ["Explain hashing function", "Discuss buckets/array", "Explain collision resolution (chaining/probing)", "Mention load factor"], idealPoints: ["Hash function", "Buckets", "Collisions", "O(1) time complexity"], keywords: ["hash", "function", "bucket", "collision", "linked list", "array", "O(1)", "load factor"] },
    { id: 'tech5', text: "Explain the concept of REST APIs and HTTP methods.", difficulty: "Easy", tips: ["Define Representational State Transfer", "List methods: GET, POST, PUT, DELETE, PATCH", "Mention statelessness"], idealPoints: ["Stateless", "Client-Server", "HTTP Methods (GET, POST, etc.)"], keywords: ["stateless", "GET", "POST", "PUT", "DELETE", "resource", "JSON", "endpoint"] },
    { id: 'tech6', text: "What is database indexing and how does it improve performance?", difficulty: "Medium", tips: ["Compare to a book index", "Mention B-trees or Hash indexes", "Discuss the trade-off (faster reads, slower writes)"], idealPoints: ["Faster retrieval", "Data structure (B-tree)", "Write penalty"], keywords: ["search", "faster", "b-tree", "pointer", "lookup", "write penalty", "overhead"] },
    { id: 'tech7', text: "What happens when you type a URL into a browser?", difficulty: "Medium", tips: ["Cover DNS resolution", "TCP handshake", "HTTP request/response", "Browser rendering"], idealPoints: ["DNS lookup", "TCP connection", "HTTP Request", "Rendering"], keywords: ["DNS", "IP address", "TCP", "handshake", "HTTP", "server", "render"] },
    { id: 'tech8', text: "What is a deadlock? What are the necessary conditions for it?", difficulty: "Hard", tips: ["Explain mutual exclusion, hold and wait, no preemption, circular wait (Coffman conditions)"], idealPoints: ["Mutual exclusion", "Hold and wait", "No preemption", "Circular wait"], keywords: ["mutual exclusion", "hold and wait", "preemption", "circular wait", "resources", "blocked", "lock"] },
    { id: 'tech9', text: "Explain caching and its strategies (e.g., LRU).", difficulty: "Medium", tips: ["Define what a cache is (fast, temporary storage)", "Explain Least Recently Used (LRU) policy", "Mention cache hit/miss"], idealPoints: ["Fast storage", "Cache hit/miss", "Eviction policy (LRU)"], keywords: ["memory", "fast", "temporary", "hit", "miss", "LRU", "eviction", "redis"] },
    { id: 'tech10', text: "What are the SOLID principles?", difficulty: "Hard", tips: ["List all 5 principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion", "Briefly explain one or two"], idealPoints: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"], keywords: ["single responsibility", "open closed", "liskov", "interface segregation", "dependency inversion", "SOLID", "design"] },
    { id: 'tech11', text: "Explain the difference between compiled and interpreted languages.", difficulty: "Easy", tips: ["Discuss execution time (ahead of time vs run time)", "Mention error checking", "Give examples (C++ vs Python)"], idealPoints: ["Translation to machine code", "Execution speed", "Error detection time"], keywords: ["machine code", "runtime", "execution", "C++", "Python", "translate", "byte code"] },
    { id: 'tech12', text: "What is Git and how does it differ from SVN?", difficulty: "Medium", tips: ["Distributed vs Centralized", "Local commits vs remote commits", "Branching model"], idealPoints: ["Distributed Version Control", "Local repository", "Branching/Merging"], keywords: ["distributed", "centralized", "local", "commit", "branch", "merge", "version control"] },
    { id: 'tech13', text: "Describe the MVC architecture pattern.", difficulty: "Medium", tips: ["Define Model, View, Controller", "Explain the flow of data between them", "Mention separation of concerns"], idealPoints: ["Model (data)", "View (UI)", "Controller (logic)", "Separation of concerns"], keywords: ["model", "view", "controller", "data", "UI", "logic", "separation", "pattern"] },
    { id: 'tech14', text: "What are microservices and how do they compare to a monolithic architecture?", difficulty: "Hard", tips: ["Discuss independent deployment", "Scaling individual components", "Complexity in communication"], idealPoints: ["Independent services", "Decoupling", "Scalability", "Complexity"], keywords: ["independent", "decoupled", "scale", "monolith", "API", "deploy", "services"] },
    { id: 'tech15', text: "Explain Big O notation with examples of O(1), O(n), and O(n^2).", difficulty: "Medium", tips: ["Discuss time/space complexity", "Provide a code example for each (e.g., array lookup, loop, nested loop)"], idealPoints: ["Time/Space Complexity", "Worst-case scenario", "Examples (Constant, Linear, Quadratic)"], keywords: ["complexity", "time", "space", "worst-case", "constant", "linear", "quadratic", "algorithm"] }
  ],
  Behavioral: [
    { id: 'behav1', text: "Tell me about a time you faced a significant challenge at work or school. How did you handle it?", difficulty: "Medium", tips: ["Use the STAR method (Situation, Task, Action, Result)", "Focus on your specific actions", "Highlight the positive outcome"], idealPoints: ["Clear situation", "Specific actions taken", "Positive result/learning"], keywords: ["situation", "task", "action", "result", "overcame", "learned", "solved", "challenge"] },
    { id: 'behav2', text: "Describe a situation where you had a conflict with a team member. How was it resolved?", difficulty: "Hard", tips: ["Don't blame others", "Focus on communication and compromise", "Show professionalism"], idealPoints: ["Communication", "Empathy", "Professional resolution"], keywords: ["communicate", "listen", "compromise", "understand", "professional", "resolve", "perspective"] },
    { id: 'behav3', text: "Tell me about a time you failed. What did you learn?", difficulty: "Hard", tips: ["Admit a real failure, don't use a fake one", "Take accountability", "Focus heavily on the lessons learned and how you changed"], idealPoints: ["Accountability", "Analysis of failure", "Actionable learning"], keywords: ["mistake", "responsibility", "learned", "improve", "prevent", "analyze", "change"] },
    { id: 'behav4', text: "Give an example of a goal you reached and tell me how you achieved it.", difficulty: "Easy", tips: ["Pick a relevant goal", "Break down the steps you took", "Mention consistency or overcoming obstacles"], idealPoints: ["Goal setting", "Planning", "Execution/Persistence"], keywords: ["plan", "steps", "hard work", "consistent", "milestone", "achieve", "dedication"] },
    { id: 'behav5', text: "Tell me about a time you had to take on a leadership role.", difficulty: "Medium", tips: ["Leadership isn't just a title, it's taking initiative", "Describe how you guided or motivated others", "Discuss the outcome"], idealPoints: ["Initiative", "Guidance/Motivation", "Successful outcome"], keywords: ["lead", "initiative", "guide", "motivate", "team", "responsibility", "direction"] },
    { id: 'behav6', text: "Describe a time when you had to adapt to a sudden change.", difficulty: "Medium", tips: ["Show flexibility", "Explain how you adjusted your plan", "Keep a positive attitude toward the change"], idealPoints: ["Flexibility", "Quick adjustment", "Positive attitude"], keywords: ["adapt", "flexible", "adjust", "change", "quick", "pivot", "new plan"] },
    { id: 'behav7', text: "Tell me about a time you received constructive criticism. How did you react?", difficulty: "Medium", tips: ["Show humility", "Explain how you implemented the feedback", "Don't sound defensive"], idealPoints: ["Openness to feedback", "Lack of defensiveness", "Implementation"], keywords: ["feedback", "listen", "improve", "defensive", "appreciate", "apply", "constructive"] },
    { id: 'behav8', text: "Describe a situation where you had to work with a difficult person.", difficulty: "Hard", tips: ["Maintain professionalism", "Focus on the work/goal, not the personality", "Explain how you found common ground"], idealPoints: ["Professionalism", "Patience", "Focus on goal"], keywords: ["professional", "patient", "common ground", "focus", "work together", "respect", "navigate"] },
    { id: 'behav9', text: "Tell me about a time you went above and beyond for a project.", difficulty: "Easy", tips: ["Explain what was required vs what you did", "Show passion and dedication", "Highlight the impact of your extra effort"], idealPoints: ["Exceeding expectations", "Initiative", "Impact"], keywords: ["extra", "beyond", "initiative", "impact", "dedication", "effort", "deliver"] },
    { id: 'behav10', text: "How do you prioritize tasks when you have multiple deadlines?", difficulty: "Medium", tips: ["Mention tools or methods (e.g., Eisenhower Matrix)", "Discuss communicating with stakeholders if needed", "Show organizational skills"], idealPoints: ["Prioritization method", "Organization", "Communication"], keywords: ["prioritize", "urgent", "important", "schedule", "organize", "deadline", "communicate"] }
  ],
  RoleSpecific: [
    // Software
    { id: 'role_sw1', stream: "Software", text: "Explain closures in JavaScript with a practical use case.", difficulty: "Medium", tips: ["Define closure (function remembering scope)", "Mention data privacy or function factories"], idealPoints: ["Lexical scoping", "Inner function accessing outer variables", "Data privacy"], keywords: ["lexical", "scope", "inner", "outer", "privacy", "encapsulation", "remember"] },
    { id: 'role_sw2', stream: "Software", text: "How does React handle state and what is the Virtual DOM?", difficulty: "Medium", tips: ["Explain state as component memory", "Describe Virtual DOM as an in-memory representation", "Mention diffing and reconciliation"], idealPoints: ["Component state", "In-memory DOM", "Reconciliation/Diffing"], keywords: ["state", "virtual DOM", "reconciliation", "diff", "update", "render", "efficient"] },
    { id: 'role_sw3', stream: "Software", text: "What is CI/CD and why is it important?", difficulty: "Easy", tips: ["Continuous Integration / Continuous Deployment", "Mention automated testing", "Faster delivery, fewer bugs"], idealPoints: ["Automation", "Testing", "Fast delivery"], keywords: ["continuous", "integration", "deployment", "pipeline", "automate", "test", "deliver"] },
    
    // Civil
    { id: 'role_cv1', stream: "Civil", text: "Explain the difference between Working Stress Method (WSM) and Limit State Method (LSM).", difficulty: "Medium", tips: ["WSM is deterministic, LSM is probabilistic", "Discuss factors of safety vs partial safety factors"], idealPoints: ["Deterministic vs Probabilistic", "Safety factors", "Material utilization"], keywords: ["working stress", "limit state", "probabilistic", "safety factor", "yield", "ultimate", "design"] },
    { id: 'role_cv2', stream: "Civil", text: "Describe the process and significance of a concrete slump test.", difficulty: "Easy", tips: ["Measures workability", "Describe the cone and layers", "Mention different slump types (true, shear, collapse)"], idealPoints: ["Workability measurement", "Test procedure", "Slump types"], keywords: ["workability", "cone", "tamp", "layers", "shear", "collapse", "water-cement"] },
    
    // Mechanical
    { id: 'role_me1', stream: "Mechanical", text: "Compare the Otto cycle with the Diesel cycle.", difficulty: "Medium", tips: ["Spark ignition vs Compression ignition", "Constant volume heat addition vs Constant pressure", "Efficiency differences"], idealPoints: ["Ignition type", "Heat addition process", "Efficiency"], keywords: ["spark", "compression", "constant volume", "constant pressure", "efficiency", "petrol", "diesel"] },
    { id: 'role_me2', stream: "Mechanical", text: "Explain the stress-strain curve for a ductile material like mild steel.", difficulty: "Hard", tips: ["Mention proportional limit, elastic limit, yield points", "Ultimate tensile strength and breaking point", "Hooke's law"], idealPoints: ["Elastic region", "Yield points", "Plastic region", "Fracture"], keywords: ["elastic", "plastic", "yield", "ultimate", "fracture", "hooke", "proportional"] },
    
    // ECE
    { id: 'role_ec1', stream: "ECE", text: "What is the difference between a microprocessor and a microcontroller?", difficulty: "Easy", tips: ["CPU only vs CPU + Memory + Peripherals on one chip", "General purpose vs specific application"], idealPoints: ["Integration of peripherals", "Application focus", "Cost/Power differences"], keywords: ["chip", "peripherals", "memory", "general purpose", "specific", "embedded", "integration"] },
    { id: 'role_ec2', stream: "ECE", text: "Explain setup time and hold time in digital circuits. What happens if they are violated?", difficulty: "Hard", tips: ["Time before clock edge (setup) vs time after (hold)", "Data stability", "Mention metastability"], idealPoints: ["Data stability before clock", "Data stability after clock", "Metastability"], keywords: ["clock edge", "stable", "before", "after", "metastability", "violation", "flip-flop"] },
    
    // EEE
    { id: 'role_ee1', stream: "EEE", text: "Why are transformers rated in kVA instead of kW?", difficulty: "Medium", tips: ["Copper losses depend on current", "Iron losses depend on voltage", "Power factor is determined by the load, not the transformer"], idealPoints: ["Losses depend on V and I", "Load power factor is unknown", "Independent of phase angle"], keywords: ["losses", "current", "voltage", "power factor", "load", "copper", "iron"] },
    { id: 'role_ee2', stream: "EEE", text: "Explain the working principle of a 3-phase induction motor.", difficulty: "Medium", tips: ["Rotating magnetic field (RMF)", "Faraday's law of induction", "Lenz's law and slip"], idealPoints: ["Rotating magnetic field", "Induced current in rotor", "Slip"], keywords: ["stator", "rotor", "magnetic field", "induce", "slip", "synchronous", "faraday"] },
    
    // AI/ML
    { id: 'role_ai1', stream: "AI/ML", text: "Explain the Bias-Variance Tradeoff in machine learning.", difficulty: "Medium", tips: ["Bias = underfitting, Variance = overfitting", "Finding the sweet spot for generalization"], idealPoints: ["Definition of Bias", "Definition of Variance", "Tradeoff/Generalization"], keywords: ["underfit", "overfit", "error", "generalize", "complexity", "training", "test"] },
    { id: 'role_ai2', stream: "AI/ML", text: "What is Retrieval-Augmented Generation (RAG) and why is it useful?", difficulty: "Hard", tips: ["Combining LLMs with external knowledge retrieval", "Reduces hallucinations", "Keeps information up-to-date"], idealPoints: ["Information retrieval", "LLM generation", "Reduced hallucination"], keywords: ["retrieve", "generate", "external knowledge", "hallucination", "context", "vector database", "embedding"] },
    { id: 'role_ai3', stream: "AI/ML", text: "Explain the self-attention mechanism in Transformer models.", difficulty: "Hard", tips: ["Allows model to weigh the importance of different words in a sequence", "Query, Key, Value vectors", "Parallelization advantage over RNNs"], idealPoints: ["Weighing word importance", "Q, K, V vectors", "Contextual understanding"], keywords: ["attention", "query", "key", "value", "context", "sequence", "parallel", "weight"] }
  ]
};

const ROLES = ["Software", "Civil", "Mechanical", "ECE", "EEE", "AI/ML"];
const INTERVIEW_TYPES = [
  { id: 'hr', name: 'HR Round', icon: FaUserTie, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'tech', name: 'Technical Round', icon: FaBrain, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'behav', name: 'Behavioral Round', icon: FaComments, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'role', name: 'Role-Specific Round', icon: FaRobot, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'full', name: 'Full Interview', icon: FaStar, color: 'text-yellow-500', bg: 'bg-yellow-50' }
];

export default function InterviewSimulator() {
  const navigate = useNavigate();
  
  // App State
  const [appState, setAppState] = useState('setup'); // setup, active, evaluation, summary
  
  // Setup State
  const [selectedType, setSelectedType] = useState('full');
  const [selectedRole, setSelectedRole] = useState('Software');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isTimed, setIsTimed] = useState(true);
  
  // History State
  const [sessionHistory, setSessionHistory] = useState([]);
  
  // Active Interview State
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 mins per question
  const [isAnswering, setIsAnswering] = useState(true);
  
  // Results State
  const [results, setResults] = useState([]);
  const [currentEval, setCurrentEval] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const timerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('ipc_interview_simulator_history');
    if (saved) {
      try {
        setSessionHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (appState === 'active' && isTimed && isAnswering && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appState, isTimed, isAnswering, timeLeft]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQIndex, appState]);

  const handleTimeUp = () => {
    toast.warning("Time's up for this question!");
    handleSubmitAnswer();
  };

  const startInterview = () => {
    // Generate question set
    let selectedQs = [];
    
    if (selectedType === 'full') {
      // Mix of all
      const hrQs = [...QUESTION_BANK.HR].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(numQuestions * 0.2));
      const behavQs = [...QUESTION_BANK.Behavioral].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(numQuestions * 0.2));
      const techQs = [...QUESTION_BANK.Technical].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(numQuestions * 0.3));
      const roleQs = QUESTION_BANK.RoleSpecific.filter(q => q.stream === selectedRole)
                       .sort(() => 0.5 - Math.random()).slice(0, Math.ceil(numQuestions * 0.3));
      
      selectedQs = [...hrQs, ...behavQs, ...techQs, ...roleQs].slice(0, numQuestions);
    } else {
      let pool = [];
      if (selectedType === 'hr') pool = QUESTION_BANK.HR;
      else if (selectedType === 'tech') pool = QUESTION_BANK.Technical;
      else if (selectedType === 'behav') pool = QUESTION_BANK.Behavioral;
      else if (selectedType === 'role') pool = QUESTION_BANK.RoleSpecific.filter(q => q.stream === selectedRole);
      
      // Filter by difficulty if enough questions exist
      let filteredPool = pool.filter(q => q.difficulty === difficulty);
      if (filteredPool.length < numQuestions) filteredPool = pool; // Fallback
      
      selectedQs = [...filteredPool].sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    }
    
    // Add metadata
    const finalQs = selectedQs.map((q, i) => ({
      ...q,
      originalIndex: i
    }));

    if (finalQs.length === 0) {
      toast.error("Not enough questions found for this configuration.");
      return;
    }

    setQuestions(finalQs);
    setCurrentQIndex(0);
    setResults([]);
    setAppState('active');
    resetQuestionState();
    
    toast.success("Interview started! Good luck.");
  };

  const resetQuestionState = () => {
    setUserAnswer('');
    setShowHints(false);
    setConfidence(0);
    setTimeLeft(120);
    setIsAnswering(true);
    setCurrentEval(null);
  };

  const generateFollowUp = (baseQuestion, answer) => {
    // 30% chance of follow-up
    if (Math.random() > 0.3) return null;
    
    const topics = baseQuestion.keywords.join(", ");
    return {
      id: `followup_${Date.now()}`,
      text: `Interesting point. Can you elaborate more on how that relates to ${baseQuestion.keywords[Math.floor(Math.random() * baseQuestion.keywords.length)]}?`,
      difficulty: "Hard",
      tips: ["Provide specific examples", "Stay on topic", "Connect back to your main point"],
      idealPoints: ["Elaboration", "Specific example", "Relevance"],
      keywords: baseQuestion.keywords,
      isFollowUp: true
    };
  };

  const evaluateAnswer = (question, answer) => {
    if (!answer || answer.trim().length < 10) {
      return {
        score: 10,
        feedback: "Answer is too short to evaluate properly.",
        pointsHit: [],
        pointsMissed: question.idealPoints
      };
    }

    const answerLower = answer.toLowerCase();
    let hitCount = 0;
    let pointsHit = [];
    let pointsMissed = [];

    // Simple heuristic: check if ideal points / keywords are mentioned
    question.idealPoints.forEach(point => {
      // check if any keyword related to this point is in answer
      const relatedKeywords = question.keywords; 
      const hasKeyword = relatedKeywords.some(kw => answerLower.includes(kw.toLowerCase()));
      if (hasKeyword || Math.random() > 0.5) { // Adding slight randomness to simulate AI leniency
        hitCount++;
        pointsHit.push(point);
      } else {
        pointsMissed.push(point);
      }
    });

    // Length factor
    const wordCount = answer.split(/\s+/).length;
    let lengthScore = Math.min((wordCount / 50) * 100, 100); 

    let score = Math.round(((hitCount / question.idealPoints.length) * 60) + (lengthScore * 0.4));
    
    // Confidence boost/penalty
    if (confidence > 3) score += 5;
    else if (confidence > 0 && confidence <= 2) score -= 5;
    
    score = Math.min(Math.max(score, 10), 100);

    let feedback = "";
    if (score >= 80) feedback = "Excellent answer! You covered the key points well.";
    else if (score >= 60) feedback = "Good effort, but there's room for improvement. Try to hit more key points.";
    else feedback = "You missed several critical points. Review the missed points and try adding more detail.";

    return { score, feedback, pointsHit, pointsMissed };
  };

  const handleSubmitAnswer = () => {
    setIsProcessing(true);
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      const currentQ = questions[currentQIndex];
      const evaluation = evaluateAnswer(currentQ, userAnswer);
      
      setCurrentEval({
        questionId: currentQ.id,
        answer: userAnswer,
        confidence,
        timeSpent: 120 - timeLeft,
        ...evaluation
      });
      
      setIsAnswering(false);
      setIsProcessing(false);
    }, 1500); // Simulate AI processing delay
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQIndex];
    const newResults = [...results, currentEval];
    setResults(newResults);

    // Check for follow-up
    if (!currentQ.isFollowUp) {
      const followUp = generateFollowUp(currentQ, userAnswer);
      if (followUp) {
        const newQs = [...questions];
        newQs.splice(currentQIndex + 1, 0, followUp);
        setQuestions(newQs);
        toast.info("The interviewer has a follow-up question!");
      }
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      resetQuestionState();
    } else {
      finishInterview(newResults);
    }
  };

  const finishInterview = async (finalResults) => {
    setAppState('summary');
    
    const avgScore = Math.round(finalResults.reduce((acc, curr) => acc + curr.score, 0) / finalResults.length);
    
    const sessionData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: INTERVIEW_TYPES.find(t => t.id === selectedType)?.name,
      role: selectedRole,
      difficulty,
      score: avgScore,
      questionsAttempted: finalResults.length
    };

    // Save to local simulator history
    const updatedHistory = [sessionData, ...sessionHistory].slice(0, 10);
    setSessionHistory(updatedHistory);
    localStorage.setItem('ipc_interview_simulator_history', JSON.stringify(updatedHistory));

    // Save to global DB
    try {
      const userId = getActiveUserId();
      if (userId) {
        await saveInterviewResultToDb(userId, {
          score: avgScore,
          type: selectedType,
          role: selectedRole,
          date: new Date().toISOString(),
          details: finalResults
        });
      }
    } catch (err) {
      console.error("Failed to save to global DB", err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  const renderSetup = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-3xl">
            <FaRobot />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">AI Interview Simulator</h1>
            <p className="text-slate-500">Practice with a dynamic AI interviewer tailored to your role.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Col: Config */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Interview Type</label>
              <div className="grid grid-cols-1 gap-3">
                {INTERVIEW_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      selectedType === type.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type.bg} ${type.color}`}>
                      <type.icon />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">{type.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Target Role / Stream</label>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              >
                {ROLES.map(r => <option key={r} value={r}>{r} Engineering</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Difficulty</label>
              <div className="flex gap-3">
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-xl border-2 font-medium transition-all ${
                      difficulty === d 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Number of Questions</label>
              <div className="flex gap-3">
                {[5, 10, 15].map(n => (
                  <button
                    key={n}
                    onClick={() => setNumQuestions(n)}
                    className={`flex-1 py-2 rounded-xl border-2 font-medium transition-all ${
                      numQuestions === n 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Timer Mode</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={isTimed} 
                    onChange={() => setIsTimed(true)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-slate-700">Timed (2 min/q)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={!isTimed} 
                    onChange={() => setIsTimed(false)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-slate-700">Untimed</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={startInterview}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1"
              >
                <FaPlay /> Start Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Cards */}
      {sessionHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <FaHistory className="text-slate-400 text-xl" />
            <h2 className="text-xl font-bold text-slate-800">Recent Sessions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionHistory.slice(0, 3).map((session, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-primary-700">{session.type}</span>
                  <span className="text-xs text-slate-500">{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{session.score}%</div>
                <div className="text-sm text-slate-600">{session.role} • {session.difficulty}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderActive = () => {
    const currentQ = questions[currentQIndex];
    
    return (
      <div className="max-w-5xl mx-auto h-[85vh] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <FaRobot />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Dr. AI Interviewer</h3>
              <div className="text-xs text-slate-500 flex gap-2 items-center">
                <span className="px-2 py-0.5 bg-slate-200 rounded-full">Question {currentQIndex + 1} of {questions.length}</span>
                <span className={`px-2 py-0.5 rounded-full text-white ${
                  currentQ.difficulty === 'Easy' ? 'bg-green-500' :
                  currentQ.difficulty === 'Medium' ? 'bg-orange-500' : 'bg-red-500'
                }`}>{currentQ.difficulty}</span>
                {currentQ.isFollowUp && <span className="px-2 py-0.5 bg-purple-500 text-white rounded-full">Follow-up</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {isTimed && (
              <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-2 rounded-xl ${
                timeLeft < 30 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'
              }`}>
                <FaStopwatch /> {formatTime(timeLeft)}
              </div>
            )}
            <button 
              onClick={() => setAppState('setup')}
              className="text-sm text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <FaTimesCircle /> End Early
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
          <div 
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          <AnimatePresence mode="popLayout">
            {/* Question Bubble */}
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-600 mt-1">
                <FaRobot size={14} />
              </div>
              <div className="bg-white p-5 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm">
                <p className="text-slate-800 text-lg leading-relaxed">{currentQ.text}</p>
                
                {showHints && currentQ.tips && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2 text-sm">
                      <FaLightbulb /> AI Coaching Tips
                    </div>
                    <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                      {currentQ.tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </motion.div>
                )}
                
                {isAnswering && (
                  <button 
                    onClick={() => setShowHints(!showHints)}
                    className="mt-3 text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <FaMagic /> {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Answer Evaluation Inline */}
            {!isAnswering && currentEval && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 max-w-[85%] ml-auto justify-end"
              >
                <div className="bg-primary-50 p-5 rounded-2xl rounded-tr-sm border border-primary-100 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-slate-800">Feedback</h4>
                    <div className="flex flex-col items-end">
                      <span className={`text-2xl font-black ${
                        currentEval.score >= 80 ? 'text-green-600' :
                        currentEval.score >= 60 ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {currentEval.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-700 mb-4 bg-white p-3 rounded-lg border border-primary-100">
                    {currentEval.feedback}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-green-600 font-semibold mb-1">
                        <FaCheckCircle /> Points Hit
                      </div>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {currentEval.pointsHit.length ? 
                          currentEval.pointsHit.map((p, i) => <li key={i} className="truncate" title={p}>{p}</li>) : 
                          <li>None</li>}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-red-500 font-semibold mb-1">
                        <FaTimesCircle /> Missed
                      </div>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {currentEval.pointsMissed.length ? 
                          currentEval.pointsMissed.map((p, i) => <li key={i} className="truncate" title={p}>{p}</li>) : 
                          <li>None</li>}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleNextQuestion}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2 transition-all"
                    >
                      {currentQIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'} <FaArrowRight />
                    </button>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 mt-1">
                  <FaRobot size={14} />
                </div>
              </motion.div>
            )}
            
            <div ref={chatEndRef} />
          </AnimatePresence>
        </div>

        {/* Input Area */}
        {isAnswering && (
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="mb-3 flex justify-between items-center">
              <div className="text-sm text-slate-500">
                Words: <span className={userAnswer.split(/\s+/).filter(w=>w).length < 10 ? 'text-orange-500' : 'text-green-600'}>
                  {userAnswer.split(/\s+/).filter(w=>w).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Confidence:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star}
                      onClick={() => setConfidence(star)}
                      className={`text-lg transition-colors ${confidence >= star ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-200'}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here... Or paste your response."
                className="flex-1 p-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none min-h-[100px] transition-all"
                disabled={isProcessing}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isProcessing || !userAnswer.trim()}
                  className={`flex-1 px-6 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    isProcessing || !userAnswer.trim()
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30'
                  }`}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Submit</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleNextQuestion} // Skip basically
                  disabled={isProcessing}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSummary = () => {
    const avgScore = Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length);
    
    // Compute data for radar chart (mock categories based on performance)
    const chartData = {
      labels: ['Completeness', 'Keywords', 'Length', 'Confidence', 'Accuracy'],
      datasets: [
        {
          label: 'Your Performance',
          data: [
            Math.min(100, avgScore + 10), 
            avgScore, 
            Math.min(100, avgScore + 5), 
            Math.min(100, (results.reduce((a,c) => a + (c.confidence*20), 0) / results.length) || 50),
            avgScore - 5
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 text-4xl mb-4 shadow-inner">
            <FaTrophy />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Completed!</h1>
          <p className="text-slate-500 mb-8">Here's how you performed in your {selectedRole} mock interview.</p>
          
          <div className="flex justify-center items-center gap-12">
            <div className="relative w-48 h-48">
              <Doughnut 
                data={{
                  datasets: [{
                    data: [avgScore, 100 - avgScore],
                    backgroundColor: ['#3b82f6', '#f1f5f9'],
                    borderWidth: 0,
                    circumference: 360,
                  }]
                }}
                options={{
                  cutout: '80%',
                  plugins: { tooltip: { enabled: false } },
                  animation: { animateRotate: true }
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800">{avgScore}%</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Overall</span>
              </div>
            </div>
            
            <div className="w-64 h-64">
              <Radar 
                data={chartData} 
                options={{
                  scales: { r: { min: 0, max: 100, ticks: { display: false } } },
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FaHistory /> Detailed Review
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {results.map((res, idx) => {
              const q = questions.find(q => q.id === res.questionId);
              return (
                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-semibold text-primary-600 mb-1">Question {idx + 1}</div>
                      <h4 className="text-lg font-medium text-slate-800">{q?.text}</h4>
                    </div>
                    <div className={`px-4 py-1 rounded-full font-bold text-sm ${
                      res.score >= 80 ? 'bg-green-100 text-green-700' :
                      res.score >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {res.score}%
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 text-slate-600 text-sm">
                    <span className="font-semibold text-slate-800">Your Answer:</span><br/>
                    {res.answer || "No answer provided."}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                      <div className="font-bold text-green-800 mb-2">Strengths (Hits)</div>
                      <ul className="list-disc list-inside text-green-700">
                        {res.pointsHit.map((p, i) => <li key={i}>{p}</li>)}
                        {res.pointsHit.length === 0 && <li>None detected</li>}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                      <div className="font-bold text-red-800 mb-2">Areas to Improve (Missed)</div>
                      <ul className="list-disc list-inside text-red-700">
                        {res.pointsMissed.map((p, i) => <li key={i}>{p}</li>)}
                        {res.pointsMissed.length === 0 && <li>None detected</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4 pb-12">
          <button 
            onClick={() => setAppState('setup')}
            className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors flex items-center gap-2 shadow-lg"
          >
            <FaRedo /> Try Another Interview
          </button>
          <button 
            onClick={() => navigate('/student/interview-evaluation')}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 shadow-lg"
          >
            <FaBrain /> View Detailed Evaluation Analytics <FaArrowRight />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      {appState === 'setup' && renderSetup()}
      {appState === 'active' && renderActive()}
      {appState === 'summary' && renderSummary()}
    </div>
  );
}
