import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBriefcase, FaStar, FaChartLine, FaGraduationCap, FaArrowRight, 
  FaCheckCircle, FaTimesCircle, FaBuilding, FaRocket, FaLightbulb, 
  FaExternalLinkAlt, FaCode, FaBrain, FaCogs, FaTools, FaPlus, FaTimes,
  FaSearch, FaFilter
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

const FaTrophy = FaStar;

// CAREER ROLE DATABASE
const CAREER_DATABASE = [
  // CS/IT
  {
    id: 'sd',
    title: 'Software Developer',
    stream: 'CS / IT',
    category: 'Engineering',
    description: 'Design, develop, and test software systems and applications. Work across the stack to build robust solutions.',
    requiredSkills: ['Java', 'Python', 'DSA', 'Git', 'SQL', 'C++'],
    preferredSkills: ['React', 'Node.js', 'Docker', 'AWS', 'System Design'],
    avgSalary: { entry: '₹5-10 LPA', mid: '₹12-25 LPA', senior: '₹30-60 LPA' },
    demand: 'Very High',
    growthOutlook: '92%',
    companies: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'TCS', 'Infosys'],
    certifications: ['AWS Certified Developer', 'Oracle Certified Professional Java'],
    dayInLife: 'Write and debug code, participate in agile standups, review peer code (PRs), and brainstorm system architectures.',
    resources: [{ name: 'freeCodeCamp', url: 'https://freecodecamp.org' }, { name: 'LeetCode', url: 'https://leetcode.com' }]
  },
  {
    id: 'fe',
    title: 'Frontend Engineer',
    stream: 'CS / IT',
    category: 'Web',
    description: 'Specializes in creating user interfaces and user experiences on the web using modern JavaScript frameworks.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design'],
    preferredSkills: ['TypeScript', 'Redux', 'Next.js', 'Tailwind CSS', 'Figma'],
    avgSalary: { entry: '₹4-9 LPA', mid: '₹10-22 LPA', senior: '₹25-50 LPA' },
    demand: 'High',
    growthOutlook: '88%',
    companies: ['Flipkart', 'Swiggy', 'Zomato', 'Cred', 'Meta'],
    certifications: ['Meta Front-End Developer', 'React Certification'],
    dayInLife: 'Translate UI/UX designs into code, optimize web performance, ensure cross-browser compatibility.',
    resources: [{ name: 'Frontend Masters', url: 'https://frontendmasters.com' }]
  },
  {
    id: 'be',
    title: 'Backend Engineer',
    stream: 'CS / IT',
    category: 'Web',
    description: 'Focuses on server-side logic, databases, and APIs to ensure applications run smoothly and securely.',
    requiredSkills: ['Node.js', 'Python', 'Java', 'SQL', 'REST APIs', 'Git'],
    preferredSkills: ['MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Microservices', 'GraphQL'],
    avgSalary: { entry: '₹5-10 LPA', mid: '₹12-25 LPA', senior: '₹30-55 LPA' },
    demand: 'Very High',
    growthOutlook: '90%',
    companies: ['Uber', 'Amazon', 'Netflix', 'Razorpay'],
    certifications: ['AWS Solutions Architect', 'MongoDB Developer'],
    dayInLife: 'Design database schemas, write scalable APIs, optimize server performance, and integrate third-party services.',
    resources: [{ name: 'Backend Developer Roadmap', url: 'https://roadmap.sh/backend' }]
  },
  {
    id: 'fs',
    title: 'Full Stack Developer',
    stream: 'CS / IT',
    category: 'Web',
    description: 'Handles both frontend and backend development, delivering complete web applications from end to end.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'SQL', 'MongoDB', 'Git'],
    preferredSkills: ['TypeScript', 'AWS', 'Docker', 'Next.js', 'System Design'],
    avgSalary: { entry: '₹6-12 LPA', mid: '₹15-30 LPA', senior: '₹35-70 LPA' },
    demand: 'Very High',
    growthOutlook: '94%',
    companies: ['Startups', 'Google', 'Microsoft', 'Intuit'],
    certifications: ['IBM Full Stack Software Developer', 'AWS Certified Developer'],
    dayInLife: 'Build UI components, design database architecture, deploy applications, and troubleshoot full-stack bugs.',
    resources: [{ name: 'The Odin Project', url: 'https://theodinproject.com' }]
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    stream: 'CS / IT',
    category: 'Cloud',
    description: 'Bridges the gap between development and operations, automating deployments and managing cloud infrastructure.',
    requiredSkills: ['Linux', 'Git', 'Docker', 'CI/CD', 'Bash', 'Python'],
    preferredSkills: ['Kubernetes', 'AWS/Azure', 'Terraform', 'Jenkins', 'Ansible'],
    avgSalary: { entry: '₹6-11 LPA', mid: '₹14-28 LPA', senior: '₹30-60 LPA' },
    demand: 'High',
    growthOutlook: '95%',
    companies: ['ThoughtWorks', 'IBM', 'Red Hat', 'AWS'],
    certifications: ['AWS DevOps Engineer', 'CKA (Kubernetes Administrator)'],
    dayInLife: 'Maintain CI/CD pipelines, monitor server health, write infrastructure as code (IaC), and automate repetitive tasks.',
    resources: [{ name: 'DevOps Roadmap', url: 'https://roadmap.sh/devops' }]
  },
  {
    id: 'qa',
    title: 'QA Engineer',
    stream: 'CS / IT',
    category: 'Testing',
    description: 'Ensures software quality through manual and automated testing, identifying bugs before deployment.',
    requiredSkills: ['Manual Testing', 'Java/Python', 'SQL', 'Agile', 'Bug Tracking'],
    preferredSkills: ['Selenium', 'Cypress', 'Appium', 'Postman', 'JMeter'],
    avgSalary: { entry: '₹3-7 LPA', mid: '₹8-16 LPA', senior: '₹18-30 LPA' },
    demand: 'Medium',
    growthOutlook: '75%',
    companies: ['Cognizant', 'Capgemini', 'Wipro', 'Accenture'],
    certifications: ['ISTQB Foundation Level'],
    dayInLife: 'Write test cases, perform regression testing, write automation scripts, and collaborate with developers on bugs.',
    resources: [{ name: 'Test Automation University', url: 'https://testautomationu.applitools.com/' }]
  },
  {
    id: 'cloud',
    title: 'Cloud Engineer',
    stream: 'CS / IT',
    category: 'Cloud',
    description: 'Designs, implements, and manages cloud-based systems and services.',
    requiredSkills: ['Linux', 'Networking', 'AWS/Azure/GCP', 'Security'],
    preferredSkills: ['Python', 'Terraform', 'Kubernetes', 'CloudFormation'],
    avgSalary: { entry: '₹6-12 LPA', mid: '₹14-28 LPA', senior: '₹35-65 LPA' },
    demand: 'Very High',
    growthOutlook: '96%',
    companies: ['Amazon', 'Google', 'Microsoft', 'Oracle', 'VMware'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Engineer'],
    dayInLife: 'Migrate on-prem systems to cloud, optimize cloud costs, manage IAM permissions, setup load balancers.',
    resources: [{ name: 'A Cloud Guru', url: 'https://acloudguru.com' }]
  },
  // AI/ML
  {
    id: 'aiml',
    title: 'AI/ML Engineer',
    stream: 'AI/ML',
    category: 'Data/AI',
    description: 'Builds and deploys machine learning models and artificial intelligence systems.',
    requiredSkills: ['Python', 'Machine Learning', 'Mathematics', 'Pandas', 'Scikit-Learn', 'SQL'],
    preferredSkills: ['Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
    avgSalary: { entry: '₹8-15 LPA', mid: '₹18-35 LPA', senior: '₹40-80 LPA' },
    demand: 'Very High',
    growthOutlook: '98%',
    companies: ['OpenAI', 'Google DeepMind', 'Microsoft', 'NVIDIA'],
    certifications: ['DeepLearning.AI TensorFlow Developer', 'AWS Machine Learning'],
    dayInLife: 'Clean and preprocess data, train ML models, tune hyperparameters, deploy models to production APIs.',
    resources: [{ name: 'Kaggle', url: 'https://kaggle.com' }]
  },
  {
    id: 'ds',
    title: 'Data Scientist',
    stream: 'AI/ML',
    category: 'Data/AI',
    description: 'Analyzes complex datasets to extract actionable insights and drive business decisions.',
    requiredSkills: ['Python', 'R', 'SQL', 'Statistics', 'Data Visualization', 'Machine Learning'],
    preferredSkills: ['Tableau', 'PowerBI', 'Hadoop', 'Spark', 'Big Data'],
    avgSalary: { entry: '₹7-14 LPA', mid: '₹16-30 LPA', senior: '₹35-70 LPA' },
    demand: 'High',
    growthOutlook: '91%',
    companies: ['Mu Sigma', 'Fractal Analytics', 'Amazon', 'Meta'],
    certifications: ['IBM Data Science', 'Google Data Analytics'],
    dayInLife: 'Perform exploratory data analysis (EDA), create dashboards, build predictive models, present findings to stakeholders.',
    resources: [{ name: 'Towards Data Science', url: 'https://towardsdatascience.com/' }]
  },
  {
    id: 'da',
    title: 'Data Analyst',
    stream: 'AI/ML',
    category: 'Data/AI',
    description: 'Gathers, cleans, and analyzes data to help organizations make better decisions.',
    requiredSkills: ['SQL', 'Excel', 'Data Visualization', 'Statistics', 'Communication'],
    preferredSkills: ['Python', 'Tableau', 'PowerBI', 'Google Analytics'],
    avgSalary: { entry: '₹4-8 LPA', mid: '₹9-18 LPA', senior: '₹20-35 LPA' },
    demand: 'High',
    growthOutlook: '85%',
    companies: ['Deloitte', 'KPMG', 'Ernst & Young', 'Accenture'],
    certifications: ['Google Data Analytics Certificate', 'Microsoft Certified: Data Analyst'],
    dayInLife: 'Write complex SQL queries, build dashboards in PowerBI, clean messy data in Excel/Python, write reports.',
    resources: [{ name: 'DataCamp', url: 'https://datacamp.com' }]
  },
  {
    id: 'cv',
    title: 'Computer Vision Engineer',
    stream: 'AI/ML',
    category: 'Data/AI',
    description: 'Develops algorithms and systems that enable computers to interpret and process visual information from the world.',
    requiredSkills: ['Python', 'C++', 'OpenCV', 'Deep Learning', 'Linear Algebra'],
    preferredSkills: ['PyTorch', 'TensorFlow', 'CUDA', 'Image Processing'],
    avgSalary: { entry: '₹8-16 LPA', mid: '₹18-35 LPA', senior: '₹40-75 LPA' },
    demand: 'Medium-High',
    growthOutlook: '94%',
    companies: ['NVIDIA', 'Tesla', 'Qualcomm', 'Intel'],
    certifications: ['DeepLearning.AI Computer Vision'],
    dayInLife: 'Implement object detection models, optimize inference speed on edge devices, read research papers.',
    resources: [{ name: 'PyImageSearch', url: 'https://pyimagesearch.com/' }]
  },
  // Civil
  {
    id: 'structural',
    title: 'Structural Design Engineer',
    stream: 'Civil',
    category: 'Design',
    description: 'Designs and analyzes structures to ensure they can withstand loads and forces safely.',
    requiredSkills: ['AutoCAD', 'Structural Analysis', 'Mechanics of Materials', 'STAAD.Pro'],
    preferredSkills: ['ETABS', 'SAFE', 'Revit Structure', 'IS Codes'],
    avgSalary: { entry: '₹3-6 LPA', mid: '₹7-15 LPA', senior: '₹18-35 LPA' },
    demand: 'Medium',
    growthOutlook: '70%',
    companies: ['L&T', 'Tata Consulting Engineers', 'Ramboll', 'Arup'],
    certifications: ['Bentley STAAD.Pro Certification'],
    dayInLife: 'Calculate loads, model structures in software, prepare structural drawings, collaborate with architects.',
    resources: [{ name: 'SkyFi Labs', url: 'https://www.skyfilabs.com/civil-engineering' }]
  },
  {
    id: 'site',
    title: 'Civil Site Engineer',
    stream: 'Civil',
    category: 'Core',
    description: 'Manages construction projects on-site, ensuring work follows design, safety, and quality standards.',
    requiredSkills: ['Project Management', 'Surveying', 'Quality Control', 'Estimation', 'AutoCAD'],
    preferredSkills: ['Primavera P6', 'MS Project', 'Site Safety Management'],
    avgSalary: { entry: '₹2.5-5 LPA', mid: '₹6-12 LPA', senior: '₹15-25 LPA' },
    demand: 'High',
    growthOutlook: '75%',
    companies: ['L&T Construction', 'Shapoorji Pallonji', 'Afcons', 'GMR'],
    certifications: ['PMP (Project Management Professional)'],
    dayInLife: 'Supervise labor, check material quality, coordinate with contractors, update project schedules.',
    resources: [{ name: 'Civil Engineering Portal', url: 'https://www.engineeringcivil.com/' }]
  },
  {
    id: 'bim',
    title: 'BIM Engineer',
    stream: 'Civil',
    category: 'Design',
    description: 'Uses Building Information Modeling software to create and manage 3D building models.',
    requiredSkills: ['Revit', 'AutoCAD', 'Navisworks', 'Civil 3D', '3D Modeling'],
    preferredSkills: ['Dynamo', 'Python', 'Clash Detection', 'BIM 360'],
    avgSalary: { entry: '₹3.5-7 LPA', mid: '₹8-16 LPA', senior: '₹18-30 LPA' },
    demand: 'High',
    growthOutlook: '88%',
    companies: ['Atkins', 'WSP', 'AECOM', 'Buro Happold'],
    certifications: ['Autodesk Certified Professional: Revit'],
    dayInLife: 'Create 3D models, perform clash detection between MEP and structural elements, extract material quantities.',
    resources: [{ name: 'BIMsmith', url: 'https://www.bimsmith.com/' }]
  },
  // Mechanical
  {
    id: 'mech_design',
    title: 'Mechanical Design Engineer',
    stream: 'Mechanical',
    category: 'Design',
    description: 'Designs mechanical components, products, and systems using CAD software.',
    requiredSkills: ['SolidWorks', 'AutoCAD', 'Thermodynamics', 'Machine Design', 'GD&T'],
    preferredSkills: ['ANSYS', 'CATIA', 'NX', 'FEA'],
    avgSalary: { entry: '₹3-6 LPA', mid: '₹7-14 LPA', senior: '₹15-30 LPA' },
    demand: 'Medium-High',
    growthOutlook: '75%',
    companies: ['Tata Motors', 'Mahindra', 'Bosch', 'GE'],
    certifications: ['CSWP (Certified SolidWorks Professional)'],
    dayInLife: 'Create 3D CAD models, generate 2D manufacturing drawings, apply GD&T, run basic simulations.',
    resources: [{ name: 'GrabCAD', url: 'https://grabcad.com/' }]
  },
  {
    id: 'thermal',
    title: 'Thermal/HVAC Engineer',
    stream: 'Mechanical',
    category: 'Core',
    description: 'Designs heating, ventilation, and air conditioning systems for buildings and industrial applications.',
    requiredSkills: ['Heat Transfer', 'Fluid Mechanics', 'HVAC Design', 'AutoCAD'],
    preferredSkills: ['HAP (Hourly Analysis Program)', 'CFD', 'Revit MEP'],
    avgSalary: { entry: '₹3-6 LPA', mid: '₹6-12 LPA', senior: '₹15-25 LPA' },
    demand: 'Medium',
    growthOutlook: '72%',
    companies: ['Voltas', 'Blue Star', 'Daikin', 'Carrier'],
    certifications: ['ASHRAE Certification'],
    dayInLife: 'Calculate cooling/heating loads, select equipment, design ducting/piping layouts, perform energy analysis.',
    resources: [{ name: 'ASHRAE', url: 'https://www.ashrae.org/' }]
  },
  {
    id: 'production',
    title: 'Production Engineer',
    stream: 'Mechanical',
    category: 'Core',
    description: 'Optimizes manufacturing processes, improves efficiency, and ensures product quality on the factory floor.',
    requiredSkills: ['Manufacturing Processes', 'Lean Six Sigma', 'Quality Control', 'Industrial Engineering'],
    preferredSkills: ['CNC Programming', 'SAP PP', 'Automation'],
    avgSalary: { entry: '₹2.5-5 LPA', mid: '₹6-12 LPA', senior: '₹15-25 LPA' },
    demand: 'High',
    growthOutlook: '70%',
    companies: ['Maruti Suzuki', 'Bajaj Auto', 'L&T', 'Godrej'],
    certifications: ['Six Sigma Green Belt'],
    dayInLife: 'Monitor production lines, reduce cycle times, resolve manufacturing defects, implement lean principles.',
    resources: [{ name: 'Lean Enterprise Institute', url: 'https://www.lean.org/' }]
  },
  // ECE
  {
    id: 'embedded',
    title: 'Embedded Systems Engineer',
    stream: 'ECE',
    category: 'Core',
    description: 'Designs and develops hardware and software for embedded devices and microcontrollers.',
    requiredSkills: ['C', 'C++', 'Microcontrollers', 'RTOS', 'Electronics'],
    preferredSkills: ['ARM Cortex', 'IoT Protocols (MQTT/CoAP)', 'PCB Design', 'Python'],
    avgSalary: { entry: '₹4-8 LPA', mid: '₹10-20 LPA', senior: '₹25-45 LPA' },
    demand: 'High',
    growthOutlook: '85%',
    companies: ['Qualcomm', 'Intel', 'Samsung', 'Texas Instruments', 'Bosch'],
    certifications: ['ARM Accredited Engineer'],
    dayInLife: 'Write firmware in C, debug hardware using oscilloscopes, optimize power consumption, interface with sensors.',
    resources: [{ name: 'Embedded.com', url: 'https://www.embedded.com/' }]
  },
  {
    id: 'vlsi',
    title: 'VLSI Design Engineer',
    stream: 'ECE',
    category: 'Core',
    description: 'Designs integrated circuits, microprocessors, and memory chips.',
    requiredSkills: ['Verilog', 'VHDL', 'Digital Logic Design', 'Computer Architecture', 'C/C++'],
    preferredSkills: ['SystemVerilog', 'UVM', 'FPGA', 'Scripting (Perl/Tcl/Python)'],
    avgSalary: { entry: '₹6-12 LPA', mid: '₹15-30 LPA', senior: '₹35-60 LPA' },
    demand: 'High',
    growthOutlook: '88%',
    companies: ['Intel', 'AMD', 'NVIDIA', 'Broadcom', 'MediaTek'],
    certifications: ['Cadence/Synopsys Training Certs'],
    dayInLife: 'Write RTL code, perform functional verification, run synthesis, analyze timing reports (STA).',
    resources: [{ name: 'ASIC World', url: 'http://www.asic-world.com/' }]
  },
  {
    id: 'iot',
    title: 'IoT Engineer',
    stream: 'ECE',
    category: 'Core',
    description: 'Develops Internet of Things solutions, connecting edge devices to cloud platforms.',
    requiredSkills: ['Sensors', 'Microcontrollers', 'Python/C', 'Networking Protocols', 'Wireless Tech (BLE, Wi-Fi)'],
    preferredSkills: ['AWS IoT / Azure IoT', 'Edge Computing', 'Security', 'MQTT'],
    avgSalary: { entry: '₹5-9 LPA', mid: '₹10-22 LPA', senior: '₹25-45 LPA' },
    demand: 'Very High',
    growthOutlook: '92%',
    companies: ['Cisco', 'IBM', 'Siemens', 'TCS (IoT Practice)'],
    certifications: ['AWS Certified IoT Specialty'],
    dayInLife: 'Integrate sensors with gateways, write code to send telemetry data to cloud, build basic dashboards.',
    resources: [{ name: 'Hackster.io', url: 'https://www.hackster.io/' }]
  },
  // EEE
  {
    id: 'electrical',
    title: 'Electrical Systems Engineer',
    stream: 'EEE',
    category: 'Core',
    description: 'Designs, develops, and tests electrical equipment, systems, and components.',
    requiredSkills: ['Circuit Design', 'Power Systems', 'AutoCAD Electrical', 'Control Systems'],
    preferredSkills: ['MATLAB/Simulink', 'PLC/SCADA', 'ETAP'],
    avgSalary: { entry: '₹3-6 LPA', mid: '₹7-14 LPA', senior: '₹15-30 LPA' },
    demand: 'Medium',
    growthOutlook: '74%',
    companies: ['Siemens', 'ABB', 'Schneider Electric', 'BHEL'],
    certifications: ['AutoCAD Electrical Certification'],
    dayInLife: 'Design single line diagrams, calculate cable sizing, model power systems, test electrical panels.',
    resources: [{ name: 'Electrical4U', url: 'https://www.electrical4u.com/' }]
  },
  {
    id: 'industrial_auto',
    title: 'Industrial Automation Engineer',
    stream: 'EEE',
    category: 'Core',
    description: 'Designs and implements automated systems for manufacturing and industrial processes.',
    requiredSkills: ['PLC Programming', 'SCADA', 'HMI', 'Sensors/Actuators', 'Control Systems'],
    preferredSkills: ['DCS', 'Robotics', 'Industrial IoT', 'AutoCAD Electrical'],
    avgSalary: { entry: '₹3.5-7 LPA', mid: '₹8-16 LPA', senior: '₹18-35 LPA' },
    demand: 'High',
    growthOutlook: '82%',
    companies: ['Rockwell Automation', 'Siemens', 'Honeywell', 'Yokogawa'],
    certifications: ['Siemens/Allen-Bradley PLC Certifications'],
    dayInLife: 'Write ladder logic for PLCs, design HMI screens, troubleshoot automated assembly lines, integrate VFDs.',
    resources: [{ name: 'PlcAcademy', url: 'https://www.plcacademy.com/' }]
  },
  // General / Management
  {
    id: 'pm',
    title: 'Product Manager',
    stream: 'General',
    category: 'Management',
    description: 'Guides the success of a product and leads the cross-functional team that is responsible for improving it.',
    requiredSkills: ['Communication', 'Agile/Scrum', 'Data Analysis', 'User Experience (UX)', 'Wireframing'],
    preferredSkills: ['SQL', 'Jira', 'A/B Testing', 'Basic coding knowledge'],
    avgSalary: { entry: '₹8-15 LPA', mid: '₹18-35 LPA', senior: '₹40-80 LPA' },
    demand: 'Very High',
    growthOutlook: '90%',
    companies: ['Google', 'Microsoft', 'Flipkart', 'Paytm', 'Swiggy'],
    certifications: ['CSPO (Certified Scrum Product Owner)', 'Pragmatic Institute'],
    dayInLife: 'Write PRDs, prioritize backlog, conduct user interviews, analyze metrics, coordinate with engineering/design.',
    resources: [{ name: 'Mind the Product', url: 'https://www.mindtheproduct.com/' }]
  },
  {
    id: 'ba',
    title: 'Business Analyst',
    stream: 'General',
    category: 'Management',
    description: 'Analyzes business processes, identifies needs, and develops data-driven solutions.',
    requiredSkills: ['Requirements Gathering', 'Excel', 'SQL', 'Communication', 'Process Mapping'],
    preferredSkills: ['Tableau/PowerBI', 'Agile', 'Jira', 'BPMN'],
    avgSalary: { entry: '₹5-10 LPA', mid: '₹12-22 LPA', senior: '₹25-45 LPA' },
    demand: 'High',
    growthOutlook: '86%',
    companies: ['TCS', 'Infosys', 'McKinsey', 'BCG', 'Banks'],
    certifications: ['CBAP (Certified Business Analysis Professional)'],
    dayInLife: 'Meet stakeholders to gather requirements, translate business needs to technical specs, create process flowcharts.',
    resources: [{ name: 'IIBA', url: 'https://www.iiba.org/' }]
  }
];

export default function CareerRecommendation() {
  const navigate = useNavigate();
  
  // State
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [interests, setInterests] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Available interests for checkbox
  const availableInterests = [
    'Web Development', 'Mobile Apps', 'Data Science', 'AI & Machine Learning',
    'Cloud Computing', 'Cybersecurity', 'IoT', 'Embedded Systems',
    'Design & UX', 'Robotics', 'Core Engineering', 'Management'
  ];

  // Load data on mount
  useEffect(() => {
    try {
      let loadedSkills = new Set();
      
      // Load from profile
      const profile = JSON.parse(localStorage.getItem('ipc_profile'));
      if (profile) {
        if (profile.skills) profile.skills.forEach(s => loadedSkills.add(s.toLowerCase()));
        if (profile.programmingLanguages) profile.programmingLanguages.forEach(s => loadedSkills.add(s.toLowerCase()));
        if (profile.frameworksLibraries) profile.frameworksLibraries.forEach(s => loadedSkills.add(s.toLowerCase()));
        if (profile.toolsPlatforms) profile.toolsPlatforms.forEach(s => loadedSkills.add(s.toLowerCase()));
      }
      
      // Load from resume analysis
      const resumeAnalysis = JSON.parse(localStorage.getItem('ipc_resume_analysis'));
      if (resumeAnalysis && resumeAnalysis.skills) {
        resumeAnalysis.skills.forEach(s => loadedSkills.add(s.toLowerCase()));
      }
      
      // Load from resume extracted data
      const resumeData = JSON.parse(localStorage.getItem('ipc_resume_data'));
      if (resumeData && resumeData.skills) {
        resumeData.skills.forEach(s => loadedSkills.add(s.toLowerCase()));
      }
      
      // Format skills (capitalize first letter for display)
      const formattedSkills = Array.from(loadedSkills).map(s => 
        s.charAt(0).toUpperCase() + s.slice(1)
      ).filter(Boolean);
      
      setSkills(formattedSkills);

      // Load previous recommendations if any
      const savedRecs = JSON.parse(localStorage.getItem('ipc_career_recommendations'));
      if (savedRecs && savedRecs.length > 0) {
        setRecommendations(savedRecs);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  // Handle skill add/remove
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.some(s => s.toLowerCase() === newSkill.trim().toLowerCase())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Handle Interest toggle
  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Analyze & Recommend function
  const handleAnalyze = () => {
    if (skills.length === 0) {
      toast.warning('Please add some skills first!');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API delay
    setTimeout(() => {
      const userSkillsLower = skills.map(s => s.toLowerCase());
      
      const results = CAREER_DATABASE.map(role => {
        let matchScore = 0;
        let matchedReq = [];
        let matchedPref = [];
        let missingReq = [];
        let missingPref = [];
        
        // Check required skills (weight: 2)
        role.requiredSkills.forEach(rs => {
          const rsLower = rs.toLowerCase();
          // Simple string match or substring match
          if (userSkillsLower.some(us => us.includes(rsLower) || rsLower.includes(us))) {
            matchScore += 2;
            matchedReq.push(rs);
          } else {
            missingReq.push(rs);
          }
        });
        
        // Check preferred skills (weight: 1)
        role.preferredSkills.forEach(ps => {
          const psLower = ps.toLowerCase();
          if (userSkillsLower.some(us => us.includes(psLower) || psLower.includes(us))) {
            matchScore += 1;
            matchedPref.push(ps);
          } else {
            missingPref.push(ps);
          }
        });
        
        const maxPossibleScore = (role.requiredSkills.length * 2) + (role.preferredSkills.length * 1);
        const matchPercentage = Math.round((matchScore / maxPossibleScore) * 100);
        
        // Boost score slightly based on category/interests heuristic
        let finalPercentage = matchPercentage;
        if (interests.length > 0) {
          const roleCategoryStr = `${role.category} ${role.stream} ${role.title}`.toLowerCase();
          if (interests.some(i => roleCategoryStr.includes(i.toLowerCase().split(' ')[0]))) {
            finalPercentage = Math.min(100, finalPercentage + 15);
          }
        }
        
        return {
          ...role,
          matchPercentage: finalPercentage,
          matchedReq,
          matchedPref,
          missingReq,
          missingPref,
          totalMatched: matchedReq.length + matchedPref.length,
          totalMissing: missingReq.length + missingPref.length
        };
      });
      
      // Sort descending by match percentage
      const sortedResults = results.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 6);
      
      setRecommendations(sortedResults);
      localStorage.setItem('ipc_career_recommendations', JSON.stringify(sortedResults));
      
      setIsAnalyzing(false);
      toast.success('Analysis complete! Check out your recommendations.');
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    }, 2000);
  };

  // Set Target Role
  const handleSetTargetRole = (role) => {
    try {
      const profileStr = localStorage.getItem('ipc_profile');
      let profile = profileStr ? JSON.parse(profileStr) : {};
      profile.targetRole = role.title;
      localStorage.setItem('ipc_profile', JSON.stringify(profile));
      toast.success(`'${role.title}' set as your target role!`);
      // Update local storage event for other components if needed
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      toast.error('Failed to set target role.');
    }
  };

  // Chart Data preparation
  const getRadarData = (role) => {
    return {
      labels: ['Required Skills', 'Preferred Skills', 'Overall Match'],
      datasets: [
        {
          label: role.title,
          data: [
            Math.round((role.matchedReq.length / Math.max(1, role.requiredSkills.length)) * 100),
            Math.round((role.matchedPref.length / Math.max(1, role.preferredSkills.length)) * 100),
            role.matchPercentage
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    };
  };
  
  const getComparisonBarData = () => {
    const top3 = recommendations.slice(0, 3);
    return {
      labels: top3.map(r => r.title),
      datasets: [
        {
          label: 'Match %',
          data: top3.map(r => r.matchPercentage),
          backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(168, 85, 247, 0.6)'],
          borderColor: ['rgb(34, 197, 94)', 'rgb(59, 130, 246)', 'rgb(168, 85, 247)'],
          borderWidth: 1,
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                <FaBrain className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Career & Role Recommendation</h1>
                <p className="text-sm text-slate-500">AI-powered analysis to find your best-fit career path</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="text-slate-500 hover:text-slate-700 font-medium text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* INPUT SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <FaCogs className="mr-2 text-primary-600" /> Profiling Configuration
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skills Panel */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Your Skills Portfolio</h3>
                <p className="text-xs text-slate-500 mb-3">These skills were auto-extracted from your profile and resume. Add or remove as needed.</p>
                
                <div className="flex flex-wrap gap-2 mb-4 max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {skills.length === 0 ? (
                    <span className="text-sm text-slate-400 italic">No skills detected. Please add some below.</span>
                  ) : (
                    skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200"
                      >
                        {skill}
                        <button 
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-primary-400 hover:text-primary-600 focus:outline-none"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., Python, React, AutoCAD)..."
                    className="flex-1 rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaPlus className="mr-2" /> Add
                  </button>
                </form>
              </div>
            </div>

            {/* Filters / Preferences */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Experience Level</h3>
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                >
                  <option>Fresher (0 years)</option>
                  <option>0-1 Years</option>
                  <option>1-3 Years</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Areas of Interest (Optional)</h3>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                  {availableInterests.map(interest => (
                    <label key={interest} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={interests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="truncate">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`
                relative inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-xl shadow-md text-white 
                ${isAnalyzing ? 'bg-primary-400 cursor-wait' : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 card-hover'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300
              `}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <FaSearch className="mr-2" /> Analyze & Find Best Matches
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* RESULTS SECTION */}
        <AnimatePresence>
          {recommendations.length > 0 && !isAnalyzing && (
            <motion.div 
              id="results-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              
              {/* Top Summary & Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <FaTrophy className="mr-2 text-yellow-500" /> Top Matches Comparison
                  </h3>
                  <div className="h-64">
                    <Bar 
                      data={getComparisonBarData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, max: 100 } }
                      }} 
                    />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-sm text-white flex flex-col justify-center items-center text-center">
                  <FaStar className="text-4xl text-yellow-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Best Fit Role</h3>
                  <p className="text-3xl font-extrabold mb-2">{recommendations[0].title}</p>
                  <div className="bg-white/20 px-4 py-2 rounded-full font-semibold mb-6">
                    {recommendations[0].matchPercentage}% Match
                  </div>
                  <button 
                    onClick={() => handleSetTargetRole(recommendations[0])}
                    className="w-full bg-white text-indigo-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Set as Target Role
                  </button>
                </div>
              </div>

              {/* Detailed Recommendations List */}
              <h3 className="text-2xl font-bold text-slate-800 pt-4 flex items-center">
                <FaBriefcase className="mr-3 text-primary-600" /> Recommended Career Paths
              </h3>
              
              <div className="space-y-6">
                {recommendations.map((role, idx) => (
                  <motion.div 
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                  >
                    <div className="border-b border-slate-100 p-6 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold text-slate-900">{role.title}</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {role.stream}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            role.demand === 'Very High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {role.demand} Demand
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{role.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-center sm:items-end">
                        <div className="flex items-center mb-2">
                          <div className="text-3xl font-black text-primary-600 mr-2">{role.matchPercentage}%</div>
                          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Match</div>
                        </div>
                        <button
                          onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
                          className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          {selectedRole?.id === role.id ? 'Hide Details' : 'View Action Plan'} 
                          <FaArrowRight className={`ml-1 transition-transform ${selectedRole?.id === role.id ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Details View */}
                    <AnimatePresence>
                      {selectedRole?.id === role.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 border-t border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              
                              {/* Skills Gap Analysis */}
                              <div className="lg:col-span-2 space-y-6">
                                <div>
                                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                                    <FaCheckCircle className="mr-2 text-green-500" /> Matched Skills
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {[...role.matchedReq, ...role.matchedPref].length > 0 ? (
                                      [...role.matchedReq, ...role.matchedPref].map((s, i) => (
                                        <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
                                          {s}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-sm text-slate-500 italic">No exact matches found.</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                                    <FaTimesCircle className="mr-2 text-red-500" /> Missing Skills (Learning Path)
                                  </h5>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {role.missingReq.map((s, i) => (
                                      <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded border border-red-200 font-bold">
                                        {s} (Required)
                                      </span>
                                    ))}
                                    {role.missingPref.map((s, i) => (
                                      <span key={i} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded border border-orange-200">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  {role.missingReq.length > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start mt-2">
                                      <FaLightbulb className="mr-2 mt-0.5 flex-shrink-0" />
                                      <p>Focus on learning <strong>{role.missingReq.slice(0, 2).join(' and ')}</strong> first. These are critical required skills for this role.</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                  <div>
                                    <h5 className="font-bold text-slate-800 mb-2 flex items-center text-sm">
                                      <FaGraduationCap className="mr-2 text-slate-500" /> Recommended Certifications
                                    </h5>
                                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                      {role.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-slate-800 mb-2 flex items-center text-sm">
                                      <FaBuilding className="mr-2 text-slate-500" /> Top Companies Hiring
                                    </h5>
                                    <p className="text-sm text-slate-600">{role.companies.join(', ')}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Sidebar Details & Radar Chart */}
                              <div className="space-y-6">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                  <h5 className="font-bold text-slate-800 mb-4 text-center text-sm">Skill Coverage</h5>
                                  <div className="h-40">
                                    <Radar 
                                      data={getRadarData(role)}
                                      options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { r: { min: 0, max: 100, ticks: { display: false } } },
                                        plugins: { legend: { display: false } }
                                      }}
                                    />
                                  </div>
                                </div>
                                
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                  <h5 className="font-bold text-slate-800 mb-3 text-sm">Salary Expectations (India)</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Entry Level:</span>
                                      <span className="font-semibold text-slate-700">{role.avgSalary.entry}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Mid Level:</span>
                                      <span className="font-semibold text-slate-700">{role.avgSalary.mid}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Senior Level:</span>
                                      <span className="font-semibold text-slate-700">{role.avgSalary.senior}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="pt-2 flex flex-col gap-2">
                                  <button
                                    onClick={() => handleSetTargetRole(role)}
                                    className="w-full flex justify-center items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-xl text-primary-600 bg-white hover:bg-primary-50 transition-colors"
                                  >
                                    <FaRocket className="mr-2" /> Set as Target Role
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleSetTargetRole(role);
                                      navigate('/student/skill-gap');
                                    }}
                                    className="w-full flex justify-center items-center px-4 py-2 bg-primary-600 text-sm font-medium rounded-xl text-white hover:bg-primary-700 transition-colors shadow-sm"
                                  >
                                    <FaChartLine className="mr-2" /> Analyze Skill Gap for this Role <FaArrowRight className="ml-2 text-xs" />
                                  </button>
                                </div>
                              </div>
                              
                            </div>
                            
                            {/* Day in Life & Resources Footer */}
                            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-bold text-slate-800 mb-2 text-sm">A Day in the Life</h5>
                                <p className="text-sm text-slate-600 italic">"{role.dayInLife}"</p>
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-800 mb-2 text-sm">Free Learning Resources</h5>
                                <div className="flex flex-wrap gap-2">
                                  {role.resources.map((res, i) => (
                                    <a 
                                      key={i} 
                                      href={res.url} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="inline-flex items-center px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
                                    >
                                      {res.name} <FaExternalLinkAlt className="ml-1.5 text-[10px]" />
                                    </a>
                                  ))}
                                  <a 
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(role.title + ' tutorial for beginners')}`}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-medium rounded transition-colors"
                                  >
                                    YouTube Tutorials <FaExternalLinkAlt className="ml-1.5 text-[10px]" />
                                  </a>
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
