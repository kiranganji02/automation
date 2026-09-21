import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUpload, FaSearch, FaCheckCircle, FaExclamationTriangle, FaTimesCircle,
  FaChartLine, FaPaste, FaFileAlt, FaCloudUploadAlt, FaStar, FaLightbulb,
  FaSpinner, FaBriefcase, FaListUl, FaDownload, FaRedo
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// ── Skill Dictionaries ──────────────────────────────────────────────
const SKILLS = {
  Programming: [
    'Python', 'Java', 'JavaScript', 'C++', 'C#', 'C', 'TypeScript', 'Go',
    'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'MATLAB', 'Dart', 'Scala',
    'Perl', 'Shell', 'Bash'
  ],
  Frameworks: [
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask',
    'Spring Boot', 'Spring', 'Laravel', 'Next.js', 'Nuxt', 'Svelte',
    'ASP.NET', '.NET', 'Ruby on Rails', 'FastAPI', 'NestJS', 'Flutter',
    'React Native', 'Bootstrap', 'Tailwind', 'jQuery'
  ],
  Databases: [
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite',
    'Cassandra', 'DynamoDB', 'Firebase', 'Elasticsearch', 'MariaDB',
    'Neo4j', 'CouchDB'
  ],
  CloudAndDevOps: [
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins',
    'CI/CD', 'Heroku', 'Vercel', 'Netlify', 'Cloudflare', 'Ansible',
    'Nginx', 'Apache', 'Linux'
  ],
  DataScienceAndAIML: [
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas',
    'NumPy', 'Scikit-learn', 'NLP', 'Computer Vision', 'OpenCV', 'Keras',
    'HuggingFace', 'LLMs', 'Generative AI', 'MLOps', 'LangChain', 'Data Analysis',
    'Power BI', 'Tableau', 'RAG'
  ],
  CivilEngineering: [
    'AutoCAD', 'Revit', 'STAAD.Pro', 'ETABS', 'Structural Analysis',
    'Concrete Technology', 'Geotechnical Engineering', 'Surveying',
    'Total Station', 'Estimation & Costing', 'Primavera', 'MS Project',
    'BIM', 'Highway Engineering', 'GIS', 'Hydrology', 'Building Codes',
    'IS 456', 'Construction Management'
  ],
  MechanicalEngineering: [
    'SolidWorks', 'CATIA', 'ANSYS', 'Thermodynamics', 'Fluid Mechanics',
    'Strength of Materials', 'GD&T', 'CNC Machining', 'Heat Transfer',
    'Finite Element Analysis', 'FEA', 'Machine Design', 'HVAC',
    'Manufacturing Processes', 'Mechatronics', 'Robotics', 'CAD/CAM'
  ],
  ECE_Electronics: [
    'Embedded Systems', 'Embedded C', 'VLSI', 'Verilog', 'VHDL',
    'Microcontrollers', 'ARM Cortex', '8051', 'Arduino', 'Raspberry Pi',
    'PCB Design', 'KiCad', 'Eagle', 'Digital Signal Processing', 'DSP',
    'FPGA', 'IoT', 'Communication Systems', 'RF Engineering', 'Wireless 5G'
  ],
  EEE_Electrical: [
    'Power Systems', 'Electrical Machines', 'Power Electronics', 'Control Systems',
    'Simulink', 'PLC', 'SCADA', 'Circuit Analysis', 'Renewable Energy',
    'Switchgear & Protection', 'High Voltage', 'Transformers', 'Electric Drives',
    'Smart Grid', 'Substation Engineering'
  ],
  Tools: [
    'Git', 'GitHub', 'GitLab', 'Jira', 'Trello', 'Figma',
    'Postman', 'VS Code', 'IntelliJ', 'Webpack', 'Vite', 'NPM'
  ],
  SoftSkills: [
    'Agile', 'Scrum', 'Leadership', 'Communication', 'Teamwork',
    'Problem Solving', 'Critical Thinking', 'Time Management', 'Mentoring'
  ]
};

const ALL_SKILLS = Object.values(SKILLS).flat();

const ACTION_VERBS = [
  'developed', 'designed', 'implemented', 'managed', 'led', 'created', 'built',
  'optimized', 'spearheaded', 'achieved', 'improved', 'increased', 'reduced',
  'orchestrated', 'delivered', 'collaborated', 'integrated', 'streamlined',
  'architected', 'deployed', 'automated', 'launched', 'refactored', 'tested',
  'mentored', 'published', 'resolved', 'configured', 'migrated', 'analyzed',
  'constructed', 'modeled', 'simulated', 'fabricated', 'inspected', 'surveyed',
  'commissioned', 'estimated', 'calibrated', 'supervised'
];

const SECTION_KEYWORDS = {
  education: ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'b.tech', 'b.e', 'cgpa', 'gpa', 'school', 'academic'],
  experience: ['experience', 'work experience', 'internship', 'intern', 'employment', 'site experience', 'industrial training', 'work history'],
  projects: ['projects', 'personal projects', 'academic projects', 'capstone project', 'portfolio', 'key projects'],
  skills: ['skills', 'technical skills', 'software skills', 'tools', 'tech stack', 'competencies', 'proficiencies'],
  certifications: ['certifications', 'certificates', 'courses', 'training', 'licenses'],
  achievements: ['achievements', 'awards', 'honors', 'accomplishments', 'recognition']
};

const CAREER_ROLES = [
  // Computer Science & IT
  { stream: 'CS / IT', title: 'Software Developer', match: ['java', 'python', 'javascript', 'c++', 'react', 'node.js', 'git', 'sql', 'typescript', 'spring'] },
  { stream: 'CS / IT', title: 'Full Stack Developer', match: ['react', 'node.js', 'javascript', 'mongodb', 'sql', 'docker', 'git', 'typescript', 'express', 'next.js'] },
  { stream: 'CS / IT', title: 'Frontend Developer', match: ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript', 'figma', 'tailwind'] },
  { stream: 'CS / IT', title: 'Backend Developer', match: ['node.js', 'python', 'java', 'sql', 'mongodb', 'express', 'docker', 'aws', 'spring boot', 'go'] },
  { stream: 'CS / IT', title: 'Cloud & DevOps Engineer', match: ['aws', 'azure', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'linux', 'terraform', 'ansible', 'git'] },
  
  // AI & Data Science
  { stream: 'AIML', title: 'AI / ML Engineer', match: ['python', 'machine learning', 'tensorflow', 'pytorch', 'deep learning', 'nlp', 'scikit-learn', 'pandas', 'numpy', 'opencv'] },
  { stream: 'AIML', title: 'Data Scientist / Analyst', match: ['python', 'sql', 'r', 'excel', 'power bi', 'tableau', 'data analysis', 'pandas', 'statistics', 'machine learning'] },
  
  // Civil Engineering
  { stream: 'Civil', title: 'Structural Design Engineer', match: ['autocad', 'staad.pro', 'etabs', 'structural analysis', 'concrete technology', 'revit', 'is 456', 'bim'] },
  { stream: 'Civil', title: 'Civil Site Engineer', match: ['surveying', 'total station', 'concrete technology', 'estimation & costing', 'construction management', 'autocad', 'site'] },
  { stream: 'Civil', title: 'BIM / Estimation Engineer', match: ['revit', 'bim', 'autocad', 'primavera', 'ms project', 'estimation & costing', 'quantity surveying'] },
  
  // Mechanical Engineering
  { stream: 'Mechanical', title: 'Mechanical Design Engineer', match: ['solidworks', 'catia', 'autocad', 'ansys', 'gd&t', 'strength of materials', 'machine design', 'fea'] },
  { stream: 'Mechanical', title: 'Thermal / HVAC Engineer', match: ['thermodynamics', 'heat transfer', 'fluid mechanics', 'hvac', 'ansys', 'energy', 'refrigeration'] },
  { stream: 'Mechanical', title: 'Production / Quality Engineer', match: ['manufacturing processes', 'cnc machining', 'gd&t', 'quality', 'cad/cam', 'inspection', 'solidworks'] },
  
  // Electronics & Communication (ECE)
  { stream: 'ECE', title: 'Embedded Systems Engineer', match: ['embedded systems', 'embedded c', 'microcontrollers', 'arm', '8051', 'arduino', 'rtos', 'iot', 'pcb design'] },
  { stream: 'ECE', title: 'VLSI / Chip Design Engineer', match: ['vlsi', 'verilog', 'vhdl', 'digital electronics', 'fpga', 'systemverilog', 'asic', 'cmos'] },
  { stream: 'ECE', title: 'IoT & Firmware Engineer', match: ['iot', 'embedded c', 'raspberry pi', 'arduino', 'wireless', 'sensors', 'pcb design', 'python'] },
  
  // Electrical & Electronics (EEE)
  { stream: 'EEE', title: 'Electrical Systems Engineer', match: ['power systems', 'electrical machines', 'transformers', 'switchgear & protection', 'matlab', 'simulink', 'circuit analysis'] },
  { stream: 'EEE', title: 'Industrial Automation Engineer', match: ['plc', 'scada', 'control systems', 'power electronics', 'automation', 'electric drives', 'sensors'] }
];

// ── SAMPLE resumes for all engineering streams ───────────────────────
const SAMPLE_RESUMES = {
  'Computer Science': `John Doe
johndoe@email.com | +91-9876543210 | linkedin.com/in/johndoe | github.com/johndoe

EDUCATION
B.Tech in Computer Science and Engineering | XYZ University, 2020 - 2024 | CGPA: 8.5/10

TECHNICAL SKILLS
Languages: Java, Python, JavaScript, TypeScript, C++
Frameworks: React, Node.js, Express, Spring Boot, Next.js
Databases: MySQL, MongoDB, PostgreSQL, Redis
Tools: Git, Docker, AWS, Jenkins, Postman, Linux, Jira
Others: REST APIs, Agile, Scrum, CI/CD, Data Structures, Algorithms

EXPERIENCE
Software Engineering Intern — TechCorp Solutions (May 2023 – Aug 2023)
• Developed a REST API using Node.js and Express, improving data retrieval speed by 30%
• Collaborated with a team of 5 engineers to redesign the frontend using React
• Implemented automated testing with Jest, achieving 90% code coverage
• Optimized database queries reducing response time by 40%

PROJECTS
E-Commerce Platform (MERN Stack)
• Built a full-stack web application using MongoDB, Express, React, and Node.js
• Implemented Stripe payment gateway resulting in 100+ successful transactions
• Deployed on AWS EC2 with Docker containerization and CI/CD pipeline

AI Chat Application (Python, Flask, React)
• Developed a real-time chat application with AI-powered responses using OpenAI API
• Integrated WebSocket for live messaging with less than 100ms latency
• Achieved 500+ active users within the first month of launch

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate
• Meta Front-End Developer Certificate`,

  'Civil Engineering': `Aarav Sharma
aarav.civil@email.com | +91-9812345678 | linkedin.com/in/aarav-civil

EDUCATION
B.Tech in Civil Engineering | National Institute of Technology, 2020 - 2024 | CGPA: 8.6/10

TECHNICAL SKILLS
Software & Tools: AutoCAD 2D/3D, Revit, STAAD.Pro, ETABS, MS Project, Primavera, GIS
Core Competencies: Structural Analysis, Concrete Technology, IS 456, IS 800, Estimation & Costing, Soil Mechanics, Geotechnical Engineering, Total Station, Surveying, Construction Management, BIM

EXPERIENCE
Civil Engineering Intern — L&T Construction (June 2023 – August 2023)
• Supervised on-site construction of G+12 residential tower, ensuring compliance with IS 456 structural codes
• Conducted concrete slump test and cube compressive strength tests for M25 and M30 grades
• Prepared Bar Bending Schedules (BBS) and verified steel reinforcement placements, cutting wastage by 12%
• Assisted in surveying alignments using Total Station with sub-centimeter accuracy

PROJECTS
Design and Structural Analysis of Multi-Storey Commercial Building (STAAD.Pro, AutoCAD)
• Modeled a G+8 commercial building subjected to dead, live, and seismic loads in STAAD.Pro
• Performed static and dynamic response analysis in STAAD.Pro and generated reinforcement drawings in AutoCAD
• Optimized column sizing and rebar distribution, reducing total structural concrete volume by 8%

Sustainable Concrete Mix Design with Fly Ash Replacement
• Conducted laboratory experimental research replacing 25% ordinary Portland cement with industrial fly ash
• Evaluated 28-day compressive strengths, achieving 32 MPa with 20% lower carbon footprint

CERTIFICATIONS
• Professional Certification in STAAD.Pro & ETABS (Bentley Institute)
• Autodesk Certified Professional: Revit for Structural BIM Design`,

  'Mechanical Engineering': `Rohan Verma
rohan.mech@email.com | +91-9876123450 | linkedin.com/in/rohan-verma-mech

EDUCATION
B.Tech in Mechanical Engineering | College of Engineering, 2020 - 2024 | CGPA: 8.4/10

TECHNICAL SKILLS
CAD/CAE Software: SolidWorks, CATIA, ANSYS FEA, AutoCAD, MATLAB
Core Competencies: Thermodynamics, Heat Transfer, Fluid Mechanics, Strength of Materials, GD&T, Machine Design, CNC Machining, Manufacturing Processes, HVAC, Mechatronics, Finite Element Analysis

EXPERIENCE
Mechanical Design Intern — Tata Motors PVBU (May 2023 – July 2023)
• Modeled sheet metal brackets and chassis components in SolidWorks for EV battery packaging
• Performed structural FEA in ANSYS to analyze stress concentrations, factor of safety, and vibration resonance
• Applied Geometric Dimensioning and Tolerancing (GD&T) on 40+ manufacturing drawings
• Collaborated with tool room engineers to resolve CNC machining tolerances, reducing prototyping rework by 18%

PROJECTS
Design & Optimization of Formula Student Racecar Suspension (SolidWorks, ANSYS)
• Designed double-wishbone suspension system optimizing camber, caster, and roll center kinematics in SolidWorks
• Conducted transient dynamic FEA simulations in ANSYS under 3G bump loads; minimized weight by 15% using AL 7075-T6
• Successfully fabricated components via 4-axis CNC milling and validated deflection within 5% of FEA

Design of Automated Solar-Powered Refrigeration Cycle for Rural Vaccine Transport
• Performed thermodynamic cycle analysis and component sizing for a portable vapor-compression refrigeration unit
• Calculated cooling load, refrigerant selection (R134a), and compressor COP under varying ambient temperatures

CERTIFICATIONS
• CSWA (Certified SolidWorks Associate in Mechanical Design)
• ANSYS Mechanical Structural FEA Professional`,

  'Electronics & Communication': `Priya Nair
priya.ece@email.com | +91-9988776655 | linkedin.com/in/priya-ece | github.com/priya-embedded

EDUCATION
B.Tech in Electronics and Communication Engineering | State Engineering College, 2020 - 2024 | CGPA: 8.8/10

TECHNICAL SKILLS
Hardware & Architecture: ARM Cortex, STM32, 8051, Arduino, Raspberry Pi, FPGA
Languages & Protocols: Embedded C, C++, Verilog, VHDL, Python, UART, I2C, SPI, CAN Bus, BLE, MQTT
Tools & EDA: Keil uVision, STM32CubeIDE, KiCad PCB Design, MATLAB, Wireshark
Core Disciplines: Embedded Systems, VLSI, Digital Signal Processing, DSP, Digital Electronics, IoT

EXPERIENCE
Embedded Systems Intern — Bosch Global Software (Jan 2024 – June 2024)
• Developed firmware in Embedded C on STM32 microcontroller for automotive sensor data acquisition over CAN bus
• Implemented FreeRTOS multitasking with mutexes and queues for real-time temperature and pressure monitoring
• Configured hardware timers, DMA, and ADC peripherals, cutting CPU overhead by 25%
• Validated protocol packets and timing constraints using oscilloscope and logic analyzer

PROJECTS
Smart IoT Industrial Gateway with FreeRTOS & MQTT (ESP32, Embedded C)
• Built an industrial IoT telemetry gateway reading Modbus sensors and publishing encrypted telemetry via MQTT
• Designed dual-layer PCB schematic and layout in KiCad with ground planes and EMI decoupling capacitors
• Programmed FreeRTOS tasks with watchdog timer, extending battery operation to 72+ hours

16-Bit RISC Processor Core Design in Verilog HDL (Vivado, FPGA)
• Designed and simulated a 5-stage pipelined 16-bit RISC processor with hazard detection in Verilog
• Synthesized and implemented design on Xilinx Artix-7 FPGA; achieved max operating frequency of 100 MHz

CERTIFICATIONS
• Arm Certified Engineer: Microcontroller Software Fundamentals
• VLSI Design & Verilog HDL Specialization`,

  'Electrical & Electronics': `Vikram Patel
vikram.eee@email.com | +91-9876501234 | linkedin.com/in/vikram-eee

EDUCATION
B.Tech in Electrical and Electronics Engineering | VJTI Mumbai, 2020 - 2024 | CGPA: 8.5/10

TECHNICAL SKILLS
Software & Tools: MATLAB / Simulink, AutoCAD Electrical, Siemens TIA Portal, Proteus
Core Competencies: Power Systems, Electrical Machines, Power Electronics, Control Systems, PLC, SCADA, Renewable Energy, Switchgear & Protection, Electric Drives, Smart Grid, Transformers

EXPERIENCE
Electrical Engineering Intern — Siemens Industrial Automation (June 2023 – Aug 2023)
• Programmed Siemens S7-1200 PLC using Ladder Logic for automated bottling conveyor line
• Configured WinCC SCADA screen with real-time alarming, trending, and motor speed control via VFD
• Performed load flow and fault calculation studies for 33kV substation feeder
• Assisted in testing vacuum circuit breakers (VCB) and protective overcurrent relays

PROJECTS
Grid-Tied Solar Photovoltaic Inverter with MPPT in MATLAB/Simulink
• Modeled a 10 kW grid-connected three-phase solar inverter using P&O MPPT algorithm in Simulink
• Implemented closed-loop dq-axis current control with SPWM, maintaining THD under 3% conforming to IEEE 519
• Analyzed reactive power compensation and power factor correction under fluctuating irradiance

IoT-Based Transformer Health Monitoring System
• Built real-time transformer diagnostic system monitoring oil temperature, voltage fluctuations, and load current with Arduino
• Generated automated alerts on threshold violation, preventing coil thermal breakdown

CERTIFICATIONS
• Certified Automation Engineer (PLC, SCADA & VFDs) — Siemens Academy
• Renewable Energy & Microgrids Professional Certificate`,

  'AI & Machine Learning': `Sneha Reddy
sneha.aiml@email.com | +91-9765432109 | linkedin.com/in/sneha-aiml | github.com/sneha-ai

EDUCATION
B.Tech in Artificial Intelligence & Data Science | PES University, 2020 - 2024 | CGPA: 9.1/10

TECHNICAL SKILLS
Languages & Frameworks: Python, SQL, C++, PyTorch, TensorFlow, Scikit-learn, HuggingFace, OpenCV
AI/ML Disciplines: Machine Learning, Deep Learning, NLP, Computer Vision, Generative AI, LLMs, MLOps, RAG, LangChain, Transformers, Data Analysis, Pandas, NumPy
Tools: Git, Docker, MLflow, FastAPI, Weights & Biases, AWS, Linux

EXPERIENCE
Machine Learning Research Intern — AI Labs (June 2023 – Dec 2023)
• Developed an automated document summarization pipeline using fine-tuned LLaMA-2 model
• Built a semantic search and Retrieval-Augmented Generation (RAG) system with LangChain and vector database
• Containerized inference pipeline using FastAPI and Docker, reducing average p95 response latency by 60%
• Tracked model experiments, hyperparameter tuning, and dataset versions using MLflow

PROJECTS
Medical Imaging Detection using Vision Transformers (PyTorch, OpenCV)
• Trained a Vision Transformer (ViT) on 25,000+ chest X-ray images to classify pulmonary conditions
• Implemented Grad-CAM visualization for model explainability and clinical validation; achieved 94.2% test accuracy

Real-Time Multi-Object Tracking & Counting for Traffic Surveillance
• Implemented YOLOv8 and ByteTrack pipeline in Python and OpenCV for vehicle detection from CCTV footage
• Deployed model on edge device with TensorRT optimization running at 28 FPS real-time

CERTIFICATIONS
• Deep Learning Specialization (DeepLearning.AI by Andrew Ng)
• AWS Certified Machine Learning – Specialty`
};

// ── Component ───────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const [inputMode, setInputMode] = useState('paste');
  const [resumeText, setResumeText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedSampleStream, setSelectedSampleStream] = useState('Computer Science');

  // Load previous analysis on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ipc_resume_analysis');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Re-attach icon references (can't serialize functions)
        if (parsed && parsed.sections) {
          parsed.sections = parsed.sections.map(s => ({
            ...s,
            quality: {
              ...s.quality,
              icon: s.quality.status === 'Strong' ? FaCheckCircle
                : s.quality.status === 'Weak' ? FaExclamationTriangle
                : FaTimesCircle
            }
          }));
        }
        if (parsed && parsed.feedback) {
          parsed.feedback = parsed.feedback.map(f => ({
            ...f,
            icon: f.priority === 'High' ? FaExclamationTriangle
              : f.priority === 'Medium' ? FaLightbulb
              : FaStar
          }));
        }
        setAnalysisResult(parsed);
      }
    } catch (e) {
      console.error('Failed to parse saved analysis', e);
    }
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────

  const handleLoadSaved = () => {
    const saved = localStorage.getItem('ipc_resume');
    if (saved) {
      setResumeText(saved);
      setInputMode('paste');
      toast.success('Saved resume loaded!');
    } else {
      toast.info('No saved resume found. Try a sample resume below!');
    }
  };

  const handleLoadSample = (streamKey = selectedSampleStream) => {
    const sample = SAMPLE_RESUMES[streamKey] || SAMPLE_RESUMES['Computer Science'];
    setResumeText(sample);
    setSelectedSampleStream(streamKey);
    setInputMode('paste');
    toast.success(`Loaded ${streamKey} sample resume!`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setSelectedFile(file);
      setIsExtracting(true);
      toast.info('Extracting text from PDF…');

      try {
        // Dynamic import of pdf.js from CDN
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
              resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setResumeText(fullText.trim());
        setIsExtracting(false);
        toast.success('PDF text extracted successfully!');
      } catch (err) {
        console.error('PDF extraction error:', err);
        setIsExtracting(false);
        // Fallback — let user paste manually
        toast.error('Could not extract PDF text. Please paste your resume text instead.');
      }
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.txt')) {
      setSelectedFile(file);
      // For .txt files, read directly
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        setResumeText(text);
        toast.success('Text file loaded!');
      } else {
        toast.info('DOCX extraction is limited in the browser. Please paste your resume text for best results.');
      }
    } else {
      toast.error('Please upload a PDF, DOCX, or TXT file.');
    }
  };

  // ── Analysis Engine ───────────────────────────────────────────────

  const performAnalysis = () => {
    if (!resumeText.trim()) {
      toast.error('Please provide your resume text first.');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      try {
        const text = resumeText;
        const textLower = text.toLowerCase();
        const words = textLower.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        // ── 1. Contact Info ──
        const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
        const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(text);
        const hasLinkedIn = /linkedin\.com/i.test(text);
        const hasGithub = /github\.com/i.test(text);
        const hasPortfolio = /portfolio|website|\.com\/|\.io\//i.test(text);

        // ── 2. Section Detection ──
        const sectionExists = (keywords) => keywords.some(kw => textLower.includes(kw));

        const hasEducation = sectionExists(SECTION_KEYWORDS.education);
        const hasExperience = sectionExists(SECTION_KEYWORDS.experience);
        const hasProjects = sectionExists(SECTION_KEYWORDS.projects);
        const hasSkills = sectionExists(SECTION_KEYWORDS.skills);
        const hasCertifications = sectionExists(SECTION_KEYWORDS.certifications);
        const hasAchievements = sectionExists(SECTION_KEYWORDS.achievements);

        // ── 3. Skills Detection ──
        const detectedSkills = ALL_SKILLS.filter(skill => {
          const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp('\\b' + escapedSkill + '\\b', 'i');
          return regex.test(text);
        });

        // Also check for common abbreviations
        const extraDetections = [];
        if (/\bhtml\b/i.test(text)) extraDetections.push('HTML');
        if (/\bcss\b/i.test(text)) extraDetections.push('CSS');
        if (/\brest\s*api/i.test(text)) extraDetections.push('REST API');
        if (/\bgraphql\b/i.test(text)) extraDetections.push('GraphQL');
        if (/\bredux\b/i.test(text)) extraDetections.push('Redux');
        if (/\bselenium\b/i.test(text)) extraDetections.push('Selenium');
        if (/\bexcel\b/i.test(text)) extraDetections.push('Excel');

        const allDetected = [...new Set([...detectedSkills, ...extraDetections])];

        const suggestedSkills = ALL_SKILLS
          .filter(s => !allDetected.map(d => d.toLowerCase()).includes(s.toLowerCase()))
          .slice(0, 8);

        // ── 4. Action Verbs & Quantification ──
        let actionVerbCount = 0;
        const usedVerbs = [];
        ACTION_VERBS.forEach(verb => {
          const regex = new RegExp('\\b' + verb + '\\b', 'gi');
          const matches = text.match(regex);
          if (matches) {
            actionVerbCount += matches.length;
            usedVerbs.push(verb);
          }
        });

        const quantMatches = text.match(/\b\d+[%+]|\$[\d,]+|\b\d+x\b|\b\d+\s*(users|transactions|contributors|participants|stars)/gi) || [];
        const quantCount = quantMatches.length;

        // ── 5. Scoring ──

        // Content Score (0-100)
        let contentScore = 0;
        if (wordCount >= 250 && wordCount <= 800) contentScore += 20;
        else if (wordCount > 100) contentScore += 10;
        else contentScore += 5;
        if (hasEducation) contentScore += 15;
        if (hasExperience) contentScore += 25;
        if (hasProjects) contentScore += 20;
        if (hasSkills) contentScore += 15;
        if (hasCertifications) contentScore += 5;
        contentScore = Math.min(100, contentScore);

        // Format Score (0-100)
        let formatScore = 0;
        if (hasEmail) formatScore += 20;
        if (hasPhone) formatScore += 20;
        if (hasLinkedIn) formatScore += 20;
        if (hasGithub) formatScore += 20;
        if (hasPortfolio) formatScore += 10;
        // Section ordering bonus
        const sectionCount = [hasEducation, hasExperience, hasProjects, hasSkills].filter(Boolean).length;
        formatScore += sectionCount * 3;
        formatScore = Math.min(100, formatScore);

        // Impact Score (0-100)
        let impactScore = 0;
        impactScore += Math.min(50, actionVerbCount * 5);
        impactScore += Math.min(50, quantCount * 12);
        impactScore = Math.min(100, impactScore);

        // ATS Score (0-100)
        let atsScore = 0;
        atsScore += Math.min(40, allDetected.length * 3);
        atsScore += Math.min(20, sectionCount * 5);
        atsScore += hasEmail ? 10 : 0;
        atsScore += hasPhone ? 10 : 0;
        atsScore += actionVerbCount >= 5 ? 10 : actionVerbCount * 2;
        atsScore += quantCount >= 3 ? 10 : quantCount * 3;
        atsScore = Math.min(100, atsScore);

        // Overall
        const overallScore = Math.round(
          (contentScore * 0.25) + (formatScore * 0.20) + (atsScore * 0.30) + (impactScore * 0.25)
        );

        // ── 6. Section Quality ──
        const makeSectionQuality = (exists, name) => {
          if (!exists) return {
            status: 'Missing', color: 'text-red-500', bg: 'bg-red-50',
            icon: FaTimesCircle, message: 'Not found in resume'
          };
          // Check if section has enough content (heuristic)
          const idx = SECTION_KEYWORDS[name]?.findIndex(kw => textLower.includes(kw));
          if (idx !== undefined && idx >= 0) {
            return {
              status: 'Strong', color: 'text-green-500', bg: 'bg-green-50',
              icon: FaCheckCircle, message: 'Section detected'
            };
          }
          return {
            status: 'Weak', color: 'text-orange-500', bg: 'bg-orange-50',
            icon: FaExclamationTriangle, message: 'Needs more detail'
          };
        };

        const sections = [
          { name: 'Contact Info', quality: (hasEmail && hasPhone) ? { status: 'Strong', color: 'text-green-500', bg: 'bg-green-50', icon: FaCheckCircle, message: `Email${hasLinkedIn ? ', LinkedIn' : ''}${hasGithub ? ', GitHub' : ''} found` } : { status: hasEmail || hasPhone ? 'Weak' : 'Missing', color: hasEmail || hasPhone ? 'text-orange-500' : 'text-red-500', bg: hasEmail || hasPhone ? 'bg-orange-50' : 'bg-red-50', icon: hasEmail || hasPhone ? FaExclamationTriangle : FaTimesCircle, message: hasEmail || hasPhone ? 'Add email AND phone' : 'No contact info found' } },
          { name: 'Education', quality: makeSectionQuality(hasEducation, 'education') },
          { name: 'Technical Skills', quality: makeSectionQuality(hasSkills, 'skills') },
          { name: 'Experience', quality: makeSectionQuality(hasExperience, 'experience') },
          { name: 'Projects', quality: makeSectionQuality(hasProjects, 'projects') },
          { name: 'Certifications', quality: makeSectionQuality(hasCertifications, 'certifications') },
        ];

        // ── 7. Feedback ──
        const feedback = [];
        if (!hasEmail) feedback.push({ priority: 'High', msg: 'Add your email address to the resume.', icon: FaExclamationTriangle });
        if (!hasPhone) feedback.push({ priority: 'High', msg: 'Add your phone number for recruiters to reach you.', icon: FaExclamationTriangle });
        if (!hasLinkedIn) feedback.push({ priority: 'High', msg: 'Add a LinkedIn profile link — recruiters check this first.', icon: FaExclamationTriangle });
        if (!hasGithub) feedback.push({ priority: 'Medium', msg: 'Add a GitHub link to showcase your code and projects.', icon: FaLightbulb });
        if (!hasExperience) feedback.push({ priority: 'High', msg: 'Add an Experience / Internship section — this is critical for ATS.', icon: FaExclamationTriangle });
        if (!hasProjects) feedback.push({ priority: 'High', msg: 'Add a Projects section to demonstrate practical skills.', icon: FaExclamationTriangle });
        if (actionVerbCount < 8) feedback.push({ priority: 'Medium', msg: `Use more action verbs (found ${actionVerbCount}, aim for 10+). Examples: developed, implemented, optimized.`, icon: FaLightbulb });
        if (quantCount < 3) feedback.push({ priority: 'High', msg: `Quantify achievements with numbers (found ${quantCount}). Example: "improved speed by 30%".`, icon: FaStar });
        if (wordCount < 200) feedback.push({ priority: 'Medium', msg: `Resume seems short (${wordCount} words). Aim for 300-600 words.`, icon: FaExclamationTriangle });
        if (wordCount > 800) feedback.push({ priority: 'Low', msg: `Resume may be too long (${wordCount} words). Keep it to 1-2 pages.`, icon: FaLightbulb });
        if (allDetected.length < 5) feedback.push({ priority: 'High', msg: `Only ${allDetected.length} technical skills detected. Add more to improve ATS match.`, icon: FaExclamationTriangle });
        if (!hasCertifications) feedback.push({ priority: 'Low', msg: 'Consider adding relevant certifications (AWS, Google, etc.).', icon: FaLightbulb });

        // ── 8. Career Role Recommendations ──
        const recommendedRoles = CAREER_ROLES.map(role => {
          const hits = role.match.filter(kw => textLower.includes(kw));
          const pct = Math.round((hits.length / role.match.length) * 100);
          return { title: role.title, matchPct: pct, matchedSkills: hits };
        })
          .filter(r => r.matchPct > 0)
          .sort((a, b) => b.matchPct - a.matchPct)
          .slice(0, 4);

        // ── Build result ──
        const result = {
          scores: { overall: overallScore, content: contentScore, format: formatScore, ats: atsScore, impact: impactScore },
          sections,
          keywords: { detected: allDetected, missing: suggestedSkills },
          feedback,
          stats: { wordCount, actionVerbCount, quantCount, skillCount: allDetected.length },
          roles: recommendedRoles,
          timestamp: new Date().toISOString()
        };

        setAnalysisResult(result);

        // Save for other modules
        localStorage.setItem('ipc_resume_analysis', JSON.stringify(result));
        localStorage.setItem('ipc_resume', text);
        localStorage.setItem('ipc_resume_data', JSON.stringify({
          skills: allDetected,
          education: hasEducation ? 'Detected' : '',
          experience: hasExperience ? 'Detected' : '',
          projects: hasProjects ? 'Detected' : '',
          certifications: hasCertifications ? 'Detected' : '',
          text: text
        }));

        setIsAnalyzing(false);
        toast.success('Resume analysis complete! 🎉');
      } catch (err) {
        console.error('Analysis error:', err);
        setIsAnalyzing(false);
        toast.error('Something went wrong during analysis.');
      }
    }, 1500);
  };

  const handleReset = () => {
    setResumeText('');
    setSelectedFile(null);
    setAnalysisResult(null);
    localStorage.removeItem('ipc_resume_analysis');
    localStorage.removeItem('ipc_resume');
    localStorage.removeItem('ipc_resume_data');
    toast.info('Reset complete.');
  };

  // ── Chart helpers ─────────────────────────────────────────────────
  const makeDonut = (score, color) => ({
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [color, '#f1f5f9'],
      borderWidth: 0,
      cutout: '78%'
    }]
  });

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { tooltip: { enabled: false }, legend: { display: false } }
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 pb-20"
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <FaSearch className="text-primary-600" /> Resume Analyzer
          </h1>
          <p className="text-slate-500 mt-1">
            Upload or paste your resume to get ATS score, section analysis, skill detection &amp; career recommendations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Stream Sample Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <span className="text-xs text-slate-500 font-medium">Branch:</span>
            <select
              value={selectedSampleStream}
              onChange={(e) => {
                setSelectedSampleStream(e.target.value);
                handleLoadSample(e.target.value);
              }}
              className="bg-transparent text-xs font-bold text-primary-700 outline-none cursor-pointer py-1"
            >
              {Object.keys(SAMPLE_RESUMES).map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <button onClick={() => handleLoadSample(selectedSampleStream)}
            className="flex items-center gap-1.5 bg-accent-50 border border-accent-200 text-accent-700 px-3 py-2 rounded-xl hover:bg-accent-100 transition shadow-sm font-medium text-xs">
            <FaDownload /> Load {selectedSampleStream.split(' ')[0]} Sample
          </button>
          <button onClick={handleLoadSaved}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition shadow-sm font-medium text-xs">
            <FaFileAlt className="text-primary-500" /> Load Saved
          </button>
          {analysisResult && (
            <button onClick={handleReset}
              className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl hover:bg-red-100 transition shadow-sm font-medium text-xs">
              <FaRedo /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Input Area ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button onClick={() => setInputMode('paste')}
            className={`flex-1 py-4 text-center font-semibold transition-colors flex justify-center items-center gap-2 ${inputMode === 'paste' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/30' : 'text-slate-500 hover:bg-slate-50'}`}>
            <FaPaste /> Paste Text
          </button>
          <button onClick={() => setInputMode('upload')}
            className={`flex-1 py-4 text-center font-semibold transition-colors flex justify-center items-center gap-2 ${inputMode === 'upload' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/30' : 'text-slate-500 hover:bg-slate-50'}`}>
            <FaUpload /> Upload File
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {inputMode === 'paste' ? (
              <motion.div key="paste" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here… Or click 'Load Sample' to try a demo resume."
                  className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none bg-slate-50 text-slate-700 leading-relaxed"
                />
                {resumeText && (
                  <p className="text-xs text-slate-400 mt-2 text-right">
                    {resumeText.split(/\s+/).filter(w => w).length} words
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 text-center hover:bg-slate-100 transition-colors relative">
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload}
                    disabled={isExtracting}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {isExtracting ? (
                    <FaSpinner className="text-6xl text-primary-400 mb-4 animate-spin" />
                  ) : (
                    <FaCloudUploadAlt className="text-6xl text-slate-400 mb-4" />
                  )}
                  <h3 className="text-lg font-semibold text-slate-700">
                    {isExtracting ? 'Extracting text…' : 'Drag & Drop or Click to Upload'}
                  </h3>
                  <p className="text-slate-500 mt-2">Supports PDF, DOCX, and TXT files</p>
                  {selectedFile && (
                    <div className="mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium flex items-center gap-2 text-sm">
                      <FaFileAlt /> {selectedFile.name}
                    </div>
                  )}
                </div>
                {resumeText && selectedFile && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-500 mb-2">Extracted Text (editable):</p>
                    <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                      className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none bg-white text-slate-700 text-sm" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-end">
            <button onClick={performAnalysis}
              disabled={isAnalyzing || !resumeText.trim() || isExtracting}
              className="bg-gradient-to-r from-primary-600 to-accent-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 text-base">
              {isAnalyzing ? <><FaSpinner className="animate-spin" /> Analyzing…</> : <><FaChartLine /> Analyze Resume</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────── */}
      {analysisResult && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Score Cards */}
          <h2 className="text-2xl font-bold text-slate-800">ATS & Quality Scores</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Overall', score: analysisResult.scores.overall, color: '#3b82f6' },
              { label: 'Content', score: analysisResult.scores.content, color: '#10b981' },
              { label: 'Format', score: analysisResult.scores.format, color: '#6366f1' },
              { label: 'ATS', score: analysisResult.scores.ats, color: '#8b5cf6' },
              { label: 'Impact', score: analysisResult.scores.impact, color: '#f59e0b' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col items-center">
                <div className="w-20 h-20 relative">
                  <Doughnut data={makeDonut(item.score, item.color)} options={donutOpts} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                </div>
                <span className="mt-3 font-semibold text-slate-600 text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Words', value: analysisResult.stats.wordCount },
              { label: 'Action Verbs', value: analysisResult.stats.actionVerbCount },
              { label: 'Quantifications', value: analysisResult.stats.quantCount },
              { label: 'Skills Found', value: analysisResult.stats.skillCount },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Career Role Recommendations */}
          {analysisResult.roles && analysisResult.roles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-primary-500" /> Recommended Career Roles
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisResult.roles.map((role, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-700 text-sm">{role.title}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${role.matchPct >= 60 ? 'bg-green-100 text-green-700' : role.matchPct >= 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {role.matchPct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div className={`h-2 rounded-full ${role.matchPct >= 60 ? 'bg-green-500' : role.matchPct >= 30 ? 'bg-yellow-500' : 'bg-red-400'}`}
                        style={{ width: `${role.matchPct}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.matchedSkills.slice(0, 4).map((s, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Grid: Sections + Keywords + Feedback */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Left 2/3: Section Analysis */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaListUl className="text-primary-500" /> Section Analysis
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {analysisResult.sections.map((section, idx) => {
                    const Icon = section.quality.icon;
                    return (
                      <div key={idx} className={`rounded-xl p-4 border border-slate-200 flex items-start gap-3 ${section.quality.bg}`}>
                        <Icon className={`text-xl mt-0.5 ${section.quality.color} shrink-0`} />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{section.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${section.quality.bg} ${section.quality.color} border border-current/20`}>
                              {section.quality.status}
                            </span>
                            <span className="text-xs text-slate-500">{section.quality.message}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 1/3: Keywords + Feedback */}
            <div className="space-y-6">
              {/* Keywords */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Skills Detected</h3>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Found ({analysisResult.keywords.detected.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {analysisResult.keywords.detected.length > 0 ? (
                      analysisResult.keywords.detected.map(kw => (
                        <span key={kw} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[11px] font-medium">{kw}</span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">No skills detected</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Suggested to Add</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.keywords.missing.map(kw => (
                      <span key={kw} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[11px] font-medium">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Actionable Feedback</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {analysisResult.feedback.length > 0 ? (
                    analysisResult.feedback.map((item, idx) => {
                      const Icon = item.icon;
                      const colorClass = item.priority === 'High' ? 'text-red-500' : item.priority === 'Medium' ? 'text-orange-500' : 'text-blue-500';
                      return (
                        <div key={idx} className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <Icon className={`mt-0.5 ${colorClass} shrink-0 text-sm`} />
                          <div>
                            <p className="text-xs text-slate-700 leading-relaxed">{item.msg}</p>
                            <span className={`text-[9px] font-bold uppercase ${colorClass} mt-0.5 inline-block`}>{item.priority}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 p-2">
                      <FaCheckCircle /> <span className="font-medium text-sm">Your resume looks great!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </motion.div>
  );
}
