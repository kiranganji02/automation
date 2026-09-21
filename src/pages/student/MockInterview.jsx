import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserTie, FaLightbulb, FaCheckDouble, FaStar, FaArrowRight, FaArrowLeft, 
  FaClock, FaRobot, FaChartBar, FaHistory, FaPlay, FaTrophy, FaExclamationTriangle, 
  FaBrain, FaComments, FaRedo, FaList, FaRegCircle, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import 'chart.js/auto';

// Comprehensive Question Bank
const QUESTION_BANK = [
  // --- HR Questions ---
  {
    id: 'hr1', category: 'HR Round', difficulty: 'Easy',
    text: 'Tell me about yourself and your background.',
    tips: ['Structure chronologically: Past, Present, Future.', 'Keep it professional and concise.', 'Highlight relevant skills.'],
    idealPoints: ['Current status/role', 'Educational background', 'Key relevant projects/experience', 'Why you are here today'],
    keywords: ['student', 'degree', 'university', 'experience', 'worked', 'project', 'passion', 'developer', 'engineer', 'looking forward']
  },
  {
    id: 'hr2', category: 'HR Round', difficulty: 'Medium',
    text: 'What are your greatest strengths and weaknesses?',
    tips: ['Provide a real weakness but show how you are improving it.', 'Strengths should be relevant to the job.'],
    idealPoints: ['Relevant strength (e.g., problem-solving)', 'Example of strength', 'Honest weakness', 'Action plan to overcome weakness'],
    keywords: ['strength', 'weakness', 'improve', 'learning', 'working on', 'problem-solving', 'teamwork', 'communication']
  },
  {
    id: 'hr3', category: 'HR Round', difficulty: 'Easy',
    text: 'Why do you want to work for our company?',
    tips: ['Show you researched the company.', 'Align their mission with your goals.'],
    idealPoints: ['Company mission/product mention', 'Alignment with personal values/goals', 'Opportunity for growth'],
    keywords: ['mission', 'culture', 'products', 'services', 'grow', 'admire', 'values', 'opportunity']
  },
  {
    id: 'hr4', category: 'HR Round', difficulty: 'Medium',
    text: 'Where do you see yourself in five years?',
    tips: ['Be realistic but ambitious.', 'Show you want to grow within the company.'],
    idealPoints: ['Mastery of current role', 'Taking on leadership or mentorship', 'Contributing to company success'],
    keywords: ['lead', 'senior', 'manager', 'expert', 'mentor', 'contribute', 'impact', 'growth', 'years']
  },
  {
    id: 'hr5', category: 'HR Round', difficulty: 'Hard',
    text: 'Why should we hire you over other candidates?',
    tips: ['Focus on your unique combination of skills.', 'Don\'t talk down about others.', 'Reiterate your fit.'],
    idealPoints: ['Specific technical skills', 'Soft skills/team fit', 'Quick learner/adaptable', 'Enthusiasm for the role'],
    keywords: ['unique', 'combination', 'adaptable', 'fast learner', 'dedication', 'fit', 'value', 'skills', 'experience']
  },
  {
    id: 'hr6', category: 'HR Round', difficulty: 'Medium',
    text: 'What are your salary expectations?',
    tips: ['Provide a range based on research.', 'State that you are flexible and focused on the opportunity.'],
    idealPoints: ['Researched range', 'Flexibility', 'Focus on role value over exact number'],
    keywords: ['range', 'flexible', 'market', 'research', 'opportunity', 'value', 'negotiable', 'compensation']
  },
  {
    id: 'hr7', category: 'HR Round', difficulty: 'Easy',
    text: 'What is your preferred work environment?',
    tips: ['Align with the company\'s known environment (hybrid/remote/office, fast-paced).', 'Mention collaboration.'],
    idealPoints: ['Collaborative team', 'Open communication', 'Support for learning'],
    keywords: ['collaborative', 'fast-paced', 'team', 'supportive', 'agile', 'dynamic', 'communication']
  },
  {
    id: 'hr8', category: 'HR Round', difficulty: 'Hard',
    text: 'Tell me about a time you disagreed with a decision at work.',
    tips: ['Keep it professional, not personal.', 'Focus on the resolution and compromise.'],
    idealPoints: ['Context of disagreement', 'How you communicated your concern', 'The compromise/resolution', 'Positive outcome'],
    keywords: ['disagreed', 'discussed', 'compromise', 'perspective', 'listened', 'resolved', 'professional', 'outcome']
  },
  {
    id: 'hr9', category: 'HR Round', difficulty: 'Medium',
    text: 'How do you handle stress and pressure?',
    tips: ['Give a specific technique (e.g., prioritization, breaking tasks down).', 'Mention a quick example.'],
    idealPoints: ['Prioritization strategy', 'Staying calm', 'Communication with team', 'Taking short breaks/focusing'],
    keywords: ['prioritize', 'calm', 'lists', 'break down', 'focus', 'communicate', 'breathe', 'organize']
  },
  {
    id: 'hr10', category: 'HR Round', difficulty: 'Easy',
    text: 'What motivates you?',
    tips: ['Connect motivation to the job duties.', 'Avoid mentioning just money.'],
    idealPoints: ['Solving complex problems', 'Learning new things', 'Making an impact', 'Working with a great team'],
    keywords: ['learning', 'impact', 'solving', 'challenges', 'growth', 'team', 'success', 'results']
  },

  // --- Technical Questions ---
  {
    id: 'tech1', category: 'Technical Round', difficulty: 'Easy',
    text: 'What is Object-Oriented Programming (OOP)? Explain its core principles.',
    tips: ['Mention the 4 main pillars.', 'Give a brief one-line explanation of each.'],
    idealPoints: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'],
    keywords: ['encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'objects', 'classes', 'hide', 'reuse']
  },
  {
    id: 'tech2', category: 'Technical Round', difficulty: 'Medium',
    text: 'Explain the difference between a process and a thread.',
    tips: ['Focus on memory sharing.', 'Mention context switching overhead.'],
    idealPoints: ['Process is an executing program', 'Thread is a subset of a process', 'Threads share memory/resources', 'Processes have separate memory spaces'],
    keywords: ['memory', 'share', 'isolated', 'overhead', 'lightweight', 'execution', 'context switch', 'resources']
  },
  {
    id: 'tech3', category: 'Technical Round', difficulty: 'Medium',
    text: 'What are the differences between SQL and NoSQL databases?',
    tips: ['Compare schemas.', 'Compare scaling (vertical vs horizontal).'],
    idealPoints: ['Relational vs Non-relational', 'Structured schema vs Flexible schema', 'Vertical vs Horizontal scaling', 'ACID vs BASE'],
    keywords: ['relational', 'schema', 'tables', 'documents', 'scale', 'horizontal', 'vertical', 'acid', 'flexible']
  },
  {
    id: 'tech4', category: 'Technical Round', difficulty: 'Hard',
    text: 'How does a HashMap work internally?',
    tips: ['Mention hashing functions.', 'Explain collisions and how they are handled.'],
    idealPoints: ['Key-value pairs', 'Hash function calculates index', 'Array of buckets/linked lists', 'Collision resolution (chaining/probing)'],
    keywords: ['hash function', 'index', 'array', 'bucket', 'collision', 'chaining', 'linked list', 'key', 'value', 'O(1)']
  },
  {
    id: 'tech5', category: 'Technical Round', difficulty: 'Medium',
    text: 'Explain REST API and its standard HTTP methods.',
    tips: ['Mention state transfer.', 'List GET, POST, PUT, DELETE.'],
    idealPoints: ['Representational State Transfer', 'Stateless', 'GET (read)', 'POST (create)', 'PUT/PATCH (update)', 'DELETE (remove)'],
    keywords: ['stateless', 'resource', 'get', 'post', 'put', 'delete', 'json', 'client', 'server', 'endpoints']
  },
  {
    id: 'tech6', category: 'Technical Round', difficulty: 'Hard',
    text: 'What is indexing in a database, and how does it improve performance?',
    tips: ['Compare it to an index in a book.', 'Mention the data structure used (B-Tree).'],
    idealPoints: ['Data structure that improves lookup speed', 'Usually B-Tree or Hash', 'Reduces disk I/O', 'Trade-off: slower writes and takes space'],
    keywords: ['lookup', 'b-tree', 'search', 'pointer', 'fast', 'write penalty', 'storage', 'query']
  },
  {
    id: 'tech7', category: 'Technical Round', difficulty: 'Medium',
    text: 'What happens when you type a URL into the browser and press Enter?',
    tips: ['Go step by step: DNS, TCP, HTTP, Render.', 'Don\'t forget DNS resolution.'],
    idealPoints: ['DNS resolution', 'TCP handshake', 'HTTP request sent', 'Server processes and responds', 'Browser renders HTML/CSS/JS'],
    keywords: ['dns', 'ip address', 'tcp', 'handshake', 'http', 'request', 'response', 'render', 'dom']
  },
  {
    id: 'tech8', category: 'Technical Round', difficulty: 'Easy',
    text: 'What is the difference between an Array and a Linked List?',
    tips: ['Compare memory allocation (contiguous vs scattered).', 'Compare time complexity for insertion/access.'],
    idealPoints: ['Contiguous vs Non-contiguous memory', 'O(1) access for Array, O(n) for LL', 'O(n) insert for Array, O(1) for LL (if pointer known)'],
    keywords: ['contiguous', 'memory', 'pointers', 'access', 'insertion', 'dynamic', 'size', 'nodes']
  },
  {
    id: 'tech9', category: 'Technical Round', difficulty: 'Hard',
    text: 'Explain the CAP theorem.',
    tips: ['Stands for Consistency, Availability, Partition tolerance.', 'Explain why you can only pick two.'],
    idealPoints: ['Consistency (all nodes see same data)', 'Availability (every request gets a response)', 'Partition Tolerance (system works despite network drops)', 'In distributed systems, you must choose between CP or AP during a partition'],
    keywords: ['consistency', 'availability', 'partition', 'distributed', 'network', 'node', 'trade-off', 'database']
  },
  {
    id: 'tech10', category: 'Technical Round', difficulty: 'Medium',
    text: 'What are solid principles in software engineering?',
    tips: ['List the 5 acronyms if possible.', 'Focus on single responsibility and open/closed.'],
    idealPoints: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'],
    keywords: ['single', 'responsibility', 'open', 'closed', 'liskov', 'interface', 'dependency', 'clean code', 'architecture']
  },
  {
    id: 'tech11', category: 'Technical Round', difficulty: 'Easy',
    text: 'What is Git and why is it used?',
    tips: ['Mention version control.', 'Mention collaboration.'],
    idealPoints: ['Distributed version control system', 'Tracks changes in source code', 'Enables multiple developers to collaborate', 'Branching and merging features'],
    keywords: ['version control', 'track', 'changes', 'collaborate', 'branch', 'merge', 'commit', 'history', 'distributed']
  },
  {
    id: 'tech12', category: 'Technical Round', difficulty: 'Medium',
    text: 'Explain what a deadlock is and how it can be prevented.',
    tips: ['Mention multiple threads waiting on each other.', 'Explain mutual exclusion or circular wait.'],
    idealPoints: ['Two or more processes stuck waiting for each other', '4 conditions: Mutual exclusion, Hold and wait, No preemption, Circular wait', 'Prevention: ordering resource requests, timeouts'],
    keywords: ['stuck', 'infinite wait', 'resources', 'threads', 'circular', 'mutual exclusion', 'prevention', 'lock']
  },
  {
    id: 'tech13', category: 'Technical Round', difficulty: 'Medium',
    text: 'What is caching and where is it typically used?',
    tips: ['Define it as storing frequently accessed data.', 'Mention levels like CDN, Redis, Browser.'],
    idealPoints: ['Storing data temporarily for faster access', 'Reduces database load', 'Improves response time', 'Used in CDN, memory (Redis), browser'],
    keywords: ['fast', 'memory', 'temporary', 'frequent', 'redis', 'cdn', 'browser', 'database load', 'latency']
  },
  {
    id: 'tech14', category: 'Technical Round', difficulty: 'Hard',
    text: 'Explain the difference between TCP and UDP.',
    tips: ['TCP is reliable, UDP is fast.', 'Mention use cases for both.'],
    idealPoints: ['TCP: Connection-oriented, reliable, ordered (e.g., HTTP, SSH)', 'UDP: Connectionless, unreliable, fast (e.g., Video streaming, gaming)', 'TCP has handshake and error checking'],
    keywords: ['reliable', 'connection', 'fast', 'packets', 'handshake', 'guaranteed', 'streaming', 'overhead']
  },
  {
    id: 'tech15', category: 'Technical Round', difficulty: 'Easy',
    text: 'What is the purpose of normalisation in databases?',
    tips: ['Focus on reducing redundancy.', 'Mention ensuring data integrity.'],
    idealPoints: ['Organize data to minimize redundancy', 'Improve data integrity', 'Divide large tables into smaller ones', '1NF, 2NF, 3NF'],
    keywords: ['redundancy', 'duplicate', 'integrity', 'anomalies', 'tables', 'relations', 'organize', 'forms']
  },

  // --- Behavioral Questions ---
  {
    id: 'beh1', category: 'Behavioral Round', difficulty: 'Medium',
    text: 'Describe a situation where you faced a major challenge in a project. How did you handle it?',
    tips: ['Use the STAR method (Situation, Task, Action, Result).', 'Focus heavily on the "Action" part.'],
    idealPoints: ['Clear context (Situation)', 'What needed to be done (Task)', 'Specific steps you took (Action)', 'Positive outcome (Result)'],
    keywords: ['situation', 'task', 'action', 'result', 'challenge', 'overcame', 'resolved', 'learned', 'steps']
  },
  {
    id: 'beh2', category: 'Behavioral Round', difficulty: 'Medium',
    text: 'Tell me about a time you had a conflict with a team member.',
    tips: ['STAR method.', 'Show empathy and communication skills.', 'Never speak badly about the other person.'],
    idealPoints: ['Objective explanation of conflict', 'Initiated communication', 'Listened to their side', 'Reached a professional compromise/resolution'],
    keywords: ['disagreement', 'listened', 'discussed', 'perspective', 'compromise', 'professional', 'resolved', 'teamwork']
  },
  {
    id: 'beh3', category: 'Behavioral Round', difficulty: 'Hard',
    text: 'Tell me about a time you failed or made a mistake. What did you learn?',
    tips: ['Own the mistake, don\'t blame others.', 'The "learning" part is the most important.'],
    idealPoints: ['Honest admission of mistake', 'Took responsibility', 'Corrected it immediately if possible', 'Implemented preventative measures for the future'],
    keywords: ['mistake', 'failed', 'responsibility', 'owned', 'learned', 'improved', 'prevent', 'next time']
  },
  {
    id: 'beh4', category: 'Behavioral Round', difficulty: 'Medium',
    text: 'Describe a time you had to learn a new technology or skill quickly.',
    tips: ['Highlight your adaptability and learning process.', 'Give concrete examples of how you learned.'],
    idealPoints: ['The pressure/deadline (Situation)', 'Learning resources used (Docs, tutorials, peers)', 'How you applied it (Action)', 'Successful project delivery (Result)'],
    keywords: ['adapt', 'documentation', 'tutorials', 'practice', 'quickly', 'applied', 'delivered', 'deadline']
  },
  {
    id: 'beh5', category: 'Behavioral Round', difficulty: 'Medium',
    text: 'Tell me about a time you showed leadership, even if you weren\'t the designated leader.',
    tips: ['Leadership can just mean taking initiative.', 'Focus on how you guided others or organized work.'],
    idealPoints: ['Identified a gap or problem', 'Stepped up to organize/help', 'Collaborated with others', 'Achieved goal through initiative'],
    keywords: ['initiative', 'stepped up', 'organized', 'guided', 'helped', 'took charge', 'responsibility', 'success']
  },
  {
    id: 'beh6', category: 'Behavioral Round', difficulty: 'Easy',
    text: 'How do you prioritize multiple deadlines or tasks?',
    tips: ['Mention tools or methods (e.g., Eisenhower matrix, Agile boards).', 'Show you can communicate delays if necessary.'],
    idealPoints: ['Assess urgency and importance', 'Use tools (Jira, Trello, lists)', 'Break down large tasks', 'Communicate with stakeholders'],
    keywords: ['urgent', 'important', 'lists', 'tools', 'communicate', 'break down', 'manage', 'organize']
  },
  {
    id: 'beh7', category: 'Behavioral Round', difficulty: 'Hard',
    text: 'Tell me about a time you had to deliver bad news to a client or manager.',
    tips: ['Focus on transparency and having a backup plan.', 'Don\'t hide the issue.'],
    idealPoints: ['Communicated early', 'Took responsibility', 'Provided solutions/alternatives', 'Managed expectations going forward'],
    keywords: ['transparent', 'early', 'honest', 'solutions', 'alternatives', 'expectations', 'responsibility']
  },
  {
    id: 'beh8', category: 'Behavioral Round', difficulty: 'Medium',
    text: 'Describe a time you went above and beyond your expected duties.',
    tips: ['Show intrinsic motivation.', 'Ensure it had a positive impact on the team or company.'],
    idealPoints: ['Noticed something that needed improvement', 'Put in extra effort without being asked', 'Delivered value', 'Positive feedback from peers/manager'],
    keywords: ['extra', 'initiative', 'improvement', 'value', 'helped', 'beyond', 'dedication', 'impact']
  },
  {
    id: 'beh9', category: 'Behavioral Round', difficulty: 'Medium',
    text: 'How do you handle receiving critical feedback?',
    tips: ['Show you are coachable and don\'t take it personally.', 'Give an example of how you implemented feedback.'],
    idealPoints: ['Listen actively', 'Do not get defensive', 'Ask clarifying questions', 'Apply the feedback to improve'],
    keywords: ['constructive', 'listen', 'improve', 'defensive', 'thank', 'apply', 'grow', 'learn']
  },
  {
    id: 'beh10', category: 'Behavioral Round', difficulty: 'Easy',
    text: 'Describe your process for solving a difficult problem.',
    tips: ['Break the process down into logical steps.', 'Mention asking for help if stuck for too long.'],
    idealPoints: ['Understand requirements fully', 'Break down into smaller pieces', 'Research/Debug methodically', 'Ask for help if timeboxed'],
    keywords: ['break down', 'research', 'debug', 'isolate', 'understand', 'ask for help', 'step-by-step', 'methodical']
  },

  // --- Role-Specific: Software Developer ---
  {
    id: 'role_dev1', category: 'Role-Specific Round', difficulty: 'Medium',
    text: 'Explain the Virtual DOM in React and why it is useful.',
    tips: ['Contrast with Real DOM.', 'Mention reconciliation/diffing algorithm.'],
    idealPoints: ['Lightweight copy of the actual DOM', 'React uses it to compute diffs', 'Only updates changed nodes in real DOM', 'Improves performance'],
    keywords: ['copy', 'diffing', 'reconciliation', 'performance', 'real dom', 'updates', 'batch', 'state']
  },
  {
    id: 'role_dev2', category: 'Role-Specific Round', difficulty: 'Hard',
    text: 'How do you handle state management in a large React application?',
    tips: ['Discuss Context API vs Redux/Zustand.', 'Mention keeping state local when possible.'],
    idealPoints: ['Local state for UI', 'Context API for prop drilling', 'Global stores (Redux, Zustand) for complex app state', 'Server state (React Query)'],
    keywords: ['redux', 'context', 'zustand', 'local', 'global', 'prop drilling', 'react query', 'store']
  },
  {
    id: 'role_dev3', category: 'Role-Specific Round', difficulty: 'Medium',
    text: 'What are closures in JavaScript? Provide a use case.',
    tips: ['Function remembering its lexical scope.', 'Mention data privacy or currying.'],
    idealPoints: ['Inner function has access to outer function scope', 'Maintained even after outer function returns', 'Use cases: Data encapsulation/privacy, currying'],
    keywords: ['scope', 'lexical', 'remember', 'inner', 'outer', 'privacy', 'encapsulation', 'variables']
  },

  // --- Role-Specific: Civil Engineering ---
  {
    id: 'role_civ1', category: 'Role-Specific Round', stream: 'civil', difficulty: 'Medium',
    text: 'Explain the difference between Working Stress Method (WSM) and Limit State Method (LSM) in RCC design.',
    tips: ['Mention factors of safety vs partial safety factors.', 'Mention serviceability and collapse limits.'],
    idealPoints: ['WSM considers elastic behavior with high factor of safety', 'LSM accounts for ultimate strength and serviceability', 'LSM uses partial safety factors for loads and materials', 'LSM is the modern standard (IS 456)'],
    keywords: ['limit state', 'working stress', 'partial safety factor', 'is 456', 'elastic', 'collapse', 'serviceability', 'ultimate']
  },
  {
    id: 'role_civ2', category: 'Role-Specific Round', stream: 'civil', difficulty: 'Easy',
    text: 'What is a concrete slump test, and what are the different types of slump patterns?',
    tips: ['Measures workability and consistency of fresh concrete.', 'Types: True, Shear, Collapse.'],
    idealPoints: ['Tests consistency and workability of fresh concrete mix', 'True slump (uniform subsidence)', 'Shear slump (one side shears off)', 'Collapse slump (too wet, excessive water-cement ratio)'],
    keywords: ['workability', 'consistency', 'true', 'shear', 'collapse', 'slump cone', 'water-cement', 'fresh concrete']
  },
  {
    id: 'role_civ3', category: 'Role-Specific Round', stream: 'civil', difficulty: 'Hard',
    text: 'How do you determine the safe bearing capacity of soil for foundation design?',
    tips: ['Mention Standard Penetration Test (SPT) and Plate Load Test.', 'Mention Terzaghi bearing capacity equation.'],
    idealPoints: ['Field tests: Plate load test, Standard Penetration Test (SPT N-value)', 'Terzaghi or Meyerhof bearing capacity equations', 'Ultimate bearing capacity divided by factor of safety (2.5 to 3.0)', 'Considers cohesion, surcharge, and soil settlement'],
    keywords: ['bearing capacity', 'plate load', 'spt', 'terzaghi', 'factor of safety', 'settlement', 'foundation', 'soil']
  },

  // --- Role-Specific: Mechanical Engineering ---
  {
    id: 'role_mech1', category: 'Role-Specific Round', stream: 'mech', difficulty: 'Medium',
    text: 'Explain the difference between an Otto cycle and a Diesel cycle in thermodynamics.',
    tips: ['Heat addition at constant volume vs constant pressure.', 'Compression ratio differences.'],
    idealPoints: ['Otto cycle: constant volume heat addition (Spark ignition / Petrol)', 'Diesel cycle: constant pressure heat addition (Compression ignition)', 'Diesel cycle operates at higher compression ratios (16-22 vs 8-12)', 'Higher thermal efficiency at same compression ratio for Otto, but Diesel operates higher'],
    keywords: ['constant volume', 'constant pressure', 'compression ratio', 'spark ignition', 'compression ignition', 'thermal efficiency', 'p-v diagram']
  },
  {
    id: 'role_mech2', category: 'Role-Specific Round', stream: 'mech', difficulty: 'Medium',
    text: 'Explain the Stress-Strain curve for mild steel and identify key transition points.',
    tips: ['Start from proportional limit to ultimate tensile stress and fracture.', 'Mention upper and lower yield points.'],
    idealPoints: ['Proportional limit (Hookes law holds)', 'Elastic limit', 'Upper and Lower Yield points', 'Ultimate Tensile Strength (UTS)', 'Necking and Fracture point'],
    keywords: ['hooke', 'elastic limit', 'yield point', 'ultimate tensile', 'necking', 'fracture', 'proportional', 'ductile']
  },
  {
    id: 'role_mech3', category: 'Role-Specific Round', stream: 'mech', difficulty: 'Hard',
    text: 'What is GD&T (Geometric Dimensioning and Tolerancing) and why is it preferred over traditional tolerances?',
    tips: ['Controls form, orientation, location, and runout.', 'Provides maximum material condition (MMC) bonuses.'],
    idealPoints: ['Standard language (ASME Y14.5) to specify geometry of parts', 'Controls form, profile, orientation, location, and runout', 'Clear datum reference frames', 'Allows bonus tolerances using Maximum Material Condition (MMC)'],
    keywords: ['gd&t', 'asme', 'datum', 'runout', 'position', 'concentricity', 'maximum material condition', 'mmc', 'tolerance']
  },

  // --- Role-Specific: Electronics & Communication (ECE) ---
  {
    id: 'role_ece1', category: 'Role-Specific Round', stream: 'ece', difficulty: 'Easy',
    text: 'What is the difference between a Microcontroller and a Microprocessor?',
    tips: ['On-chip memory and peripherals vs external bus system.', 'Application scope differences.'],
    idealPoints: ['Microcontroller has CPU, RAM, ROM, Timers, and I/O on a single chip', 'Microprocessor has only CPU core and requires external memory and peripherals', 'Microcontrollers are optimized for embedded control, low power', 'Microprocessors are used for high-performance computing'],
    keywords: ['on-chip', 'peripherals', 'ram', 'rom', 'bus', 'embedded', 'cpu', 'external memory', 'microcontroller', 'microprocessor']
  },
  {
    id: 'role_ece2', category: 'Role-Specific Round', stream: 'ece', difficulty: 'Hard',
    text: 'Explain Setup Time and Hold Time in digital flip-flops. What happens if they are violated?',
    tips: ['Input must be stable before and after clock edge.', 'Violation causes metastability.'],
    idealPoints: ['Setup time: minimum time input data must be stable BEFORE active clock edge', 'Hold time: minimum time input data must be stable AFTER active clock edge', 'Violation leads to Metastability where output oscillates or stays in an indeterminate state', 'Critical for Static Timing Analysis (STA) in VLSI design'],
    keywords: ['setup time', 'hold time', 'clock edge', 'metastability', 'flip-flop', 'static timing', 'violation', 'slack']
  },
  {
    id: 'role_ece3', category: 'Role-Specific Round', stream: 'ece', difficulty: 'Medium',
    text: 'Compare I2C, SPI, and UART communication protocols.',
    tips: ['Number of wires, synchronous vs asynchronous, multi-master support.'],
    idealPoints: ['UART: Asynchronous, 2 wires (TX, RX), point-to-point', 'I2C: Synchronous, 2 wires (SDA, SCL), multi-master, open-drain with pull-ups', 'SPI: Synchronous, 4 wires (MOSI, MISO, SCK, CS), full duplex, high speed'],
    keywords: ['uart', 'i2c', 'spi', 'synchronous', 'asynchronous', 'mosi', 'miso', 'sda', 'scl', 'full duplex', 'baud rate']
  },

  // --- Role-Specific: Electrical & Electronics (EEE) ---
  {
    id: 'role_eee1', category: 'Role-Specific Round', stream: 'eee', difficulty: 'Medium',
    text: 'Why are transformer ratings given in kVA rather than kW? Explain core and copper losses.',
    tips: ['Power factor is determined by the load, not the transformer.', 'Iron losses depend on voltage, copper losses on current.'],
    idealPoints: ['Transformer losses depend on voltage (core loss) and current (copper loss), independent of load power factor', 'Core/Iron losses (hysteresis and eddy current) occur in the magnetic core', 'Copper/I^2*R losses occur in the windings due to load current', 'Since manufacturer does not know load power factor, rating is in kVA'],
    keywords: ['kva', 'kw', 'power factor', 'core loss', 'iron loss', 'copper loss', 'hysteresis', 'eddy current', 'load']
  },
  {
    id: 'role_eee2', category: 'Role-Specific Round', stream: 'eee', difficulty: 'Hard',
    text: 'Explain the working principle of a 3-phase Induction Motor. Why can it never run at synchronous speed?',
    tips: ['Rotating magnetic field (RMF) and slip.', 'If rotor reaches synchronous speed, relative motion becomes zero.'],
    idealPoints: ['Stator currents create a Rotating Magnetic Field (RMF) at synchronous speed Ns', 'RMF cuts rotor conductors, inducing EMF and rotor current (Lenz law)', 'Torque is produced due to interaction of rotor current and RMF', 'If rotor reaches Ns, relative speed is zero, no EMF is induced, torque drops to zero. Hence it must have slip'],
    keywords: ['rotating magnetic field', 'rmf', 'synchronous speed', 'slip', 'relative motion', 'lenz law', 'torque', 'rotor']
  },
  {
    id: 'role_eee3', category: 'Role-Specific Round', stream: 'eee', difficulty: 'Medium',
    text: 'What is power factor, why is low power factor undesirable in an electrical system, and how is it corrected?',
    tips: ['Cosine of phase angle between voltage and current.', 'Causes higher line currents and I^2*R losses. Corrected with capacitor banks.'],
    idealPoints: ['Ratio of real power (kW) to apparent power (kVA)', 'Low power factor draws higher current for the same useful work', 'Results in higher I^2*R line losses, voltage drops, and utility penalties', 'Corrected by installing shunt capacitor banks or synchronous condensers'],
    keywords: ['power factor', 'cosine', 'reactive power', 'kva', 'kw', 'capacitor bank', 'losses', 'voltage drop']
  },

  // --- Role-Specific: AI & Machine Learning ---
  {
    id: 'role_aiml1', category: 'Role-Specific Round', stream: 'aiml', difficulty: 'Medium',
    text: 'Explain the Bias-Variance tradeoff and how regularization (L1/L2) helps address it.',
    tips: ['High bias is underfitting; high variance is overfitting.', 'L1 induces sparsity (Lasso), L2 shrinks weights (Ridge).'],
    idealPoints: ['Bias is error from erroneous assumptions (underfitting)', 'Variance is sensitivity to small fluctuations in training set (overfitting)', 'Total error = Bias^2 + Variance + Irreducible Error', 'L1 (Lasso) drives weights to zero (feature selection); L2 (Ridge) penalizes large weights'],
    keywords: ['bias', 'variance', 'overfitting', 'underfitting', 'regularization', 'l1', 'l2', 'lasso', 'ridge', 'penalty']
  },
  {
    id: 'role_aiml2', category: 'Role-Specific Round', stream: 'aiml', difficulty: 'Hard',
    text: 'How does the Self-Attention mechanism in Transformers work compared to traditional Recurrent Neural Networks (RNNs)?',
    tips: ['Query, Key, Value vectors.', 'Parallel processing of sequences vs sequential bottleneck.'],
    idealPoints: ['RNNs process tokens sequentially, leading to vanishing gradients and compute bottlenecks', 'Transformers compute pairwise attention between all tokens in parallel', 'Calculates Query, Key, Value matrix projections', 'Attention(Q,K,V) = softmax((Q*K^T)/sqrt(d_k)) * V', 'Captures long-range context without sequential degradation'],
    keywords: ['self-attention', 'transformer', 'query', 'key', 'value', 'parallel', 'rnn', 'sequential', 'softmax', 'tokens']
  },
  {
    id: 'role_aiml3', category: 'Role-Specific Round', stream: 'aiml', difficulty: 'Medium',
    text: 'What is Retrieval-Augmented Generation (RAG) and why is it preferred over fine-tuning for domain knowledge?',
    tips: ['Vector database search + prompt augmentation.', 'Reduces hallucinations and allows live data updates.'],
    idealPoints: ['RAG retrieves relevant external documents via vector similarity search', 'Injects context directly into the prompt before generating response', 'Prevents hallucination by grounding generation in retrieved evidence', 'Much cheaper and easier to update than fine-tuning entire model weights'],
    keywords: ['rag', 'retrieval', 'vector database', 'embeddings', 'similarity', 'hallucination', 'context', 'grounding', 'prompt']
  }
];

const ROLES = [
  // Computer Science & IT
  'Software Developer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer', 'QA Engineer',
  // AI & Data Science
  'AI / ML Engineer', 'Data Scientist', 'Data Analyst', 'Computer Vision Engineer',
  // Civil Engineering
  'Structural Design Engineer', 'Civil Site Engineer', 'BIM Engineer', 'Quantity Surveying Engineer',
  // Mechanical Engineering
  'Mechanical Design Engineer', 'CAD / CAM Engineer', 'Thermal & HVAC Engineer', 'Production Engineer',
  // Electronics & Communication (ECE)
  'Embedded Systems Engineer', 'VLSI Design Engineer', 'IoT Firmware Engineer',
  // Electrical & Electronics (EEE)
  'Electrical Systems Engineer', 'Industrial Automation Engineer', 'Power Systems Engineer'
];

export default function MockInterview() {
  // State: 'setup', 'active', 'review', 'history'
  const [screen, setScreen] = useState('setup');
  
  // Setup State
  const [interviewType, setInterviewType] = useState('Technical Round');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  
  // Active Interview State
  const [session, setSession] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [confidence, setConfidence] = useState(3);
  const [timeElapsed, setTimeElapsed] = useState(0); // per question
  
  // History State
  const [history, setHistory] = useState([]);
  
  const timerRef = useRef(null);

  // Load History and Auto-Detect Role on mount
  useEffect(() => {
    const saved = localStorage.getItem('ipc_interview_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
    try {
      const profile = JSON.parse(localStorage.getItem('ipc_profile') || '{}');
      const jdData = JSON.parse(localStorage.getItem('ipc_jd_data') || '{}');
      const detectedRole = profile.targetRole || jdData.role;
      if (detectedRole && ROLES.includes(detectedRole)) {
        setTargetRole(detectedRole);
      }
    } catch (e) {}
  }, []);

  // Save History helper
  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('ipc_interview_history', JSON.stringify(newHistory));
  };

  // Timer logic for active interview
  useEffect(() => {
    if (screen === 'active') {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  const getRoleStream = (roleName = "") => {
    const r = roleName.toLowerCase();
    if (r.includes("civil") || r.includes("structural") || r.includes("bim") || r.includes("site") || r.includes("survey")) return "civil";
    if (r.includes("mechanical") || r.includes("cad") || r.includes("thermal") || r.includes("hvac") || r.includes("production")) return "mech";
    if (r.includes("embedded") || r.includes("vlsi") || r.includes("telecom") || r.includes("rf") || r.includes("firmware") || r.includes("iot")) return "ece";
    if (r.includes("electrical") || r.includes("automation") || r.includes("plc") || r.includes("power")) return "eee";
    if (r.includes("ai") || r.includes("ml") || r.includes("data") || r.includes("vision")) return "aiml";
    return "cs";
  };

  const startInterview = () => {
    // Filter question bank
    let pool = QUESTION_BANK.filter(q => q.category === interviewType);
    
    if (interviewType === 'Role-Specific Round') {
      const stream = getRoleStream(targetRole);
      const streamPool = pool.filter(q => q.stream === stream || (stream === 'cs' && !q.stream));
      if (streamPool.length > 0) {
        pool = streamPool;
      }
    }
    
    // If not enough in specific category, fallback to technical or others
    if (pool.length < numQuestions) {
      pool = [...pool, ...QUESTION_BANK.filter(q => q.category === 'Technical Round' || q.category === 'Behavioral Round')];
    }

    // Shuffle and pick
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numQuestions);

    setSession({
      questions: selected,
      answers: [], // Array of { questionId, text, timeSpent, confidence, analysis }
      currentIndex: 0,
      startTime: new Date().toISOString()
    });
    
    setCurrentAnswer('');
    setShowTips(false);
    setConfidence(3);
    setTimeElapsed(0);
    setScreen('active');
    toast.success(`Starting ${interviewType} Mock Interview`);
  };

  const evaluateAnswer = (question, answerText, time, conf) => {
    // Sophisticated heuristic AI evaluation
    const text = answerText.toLowerCase();
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    // 1. Relevance & Completeness (Keyword matching)
    let keywordHits = 0;
    question.keywords.forEach(kw => {
      if (text.includes(kw.toLowerCase())) keywordHits++;
    });
    const keywordScore = Math.min(100, (keywordHits / Math.max(1, question.keywords.length)) * 100 * 1.5); // 1.5 multiplier to be generous

    // 2. Communication Quality (Length and structure)
    let commScore = 50;
    if (wordCount > 30) commScore += 20;
    if (wordCount > 80) commScore += 20;
    if (wordCount > 150) commScore += 10;
    if (wordCount < 15) commScore = 20;

    // 3. Behavioral STAR Method check
    let starScore = 0;
    if (question.category === 'Behavioral Round') {
      const starKeywords = ['situation', 'task', 'action', 'result', 'because', 'led to', 'consequently', 'resulted in', 'achieved', 'objective'];
      let starHits = 0;
      starKeywords.forEach(kw => { if (text.includes(kw)) starHits++; });
      starScore = Math.min(100, (starHits / 3) * 100);
    }

    // Base Calculation
    let totalScore = 0;
    if (question.category === 'Behavioral Round') {
      totalScore = (keywordScore * 0.4) + (commScore * 0.3) + (starScore * 0.3);
    } else {
      totalScore = (keywordScore * 0.6) + (commScore * 0.4);
    }

    // Confidence Penalty/Bonus
    if (conf <= 2) totalScore *= 0.9;
    if (conf === 5 && totalScore > 70) totalScore = Math.min(100, totalScore + 5);

    // Hardcap and Letter
    totalScore = Math.min(100, Math.max(0, Math.round(totalScore)));
    let grade = 'F';
    if (totalScore >= 90) grade = 'A';
    else if (totalScore >= 80) grade = 'B';
    else if (totalScore >= 70) grade = 'C';
    else if (totalScore >= 60) grade = 'D';

    // Generate Feedback string
    let feedback = [];
    if (wordCount < 20) {
      feedback.push("Your answer is too brief. Try to elaborate more and provide specific details.");
    } else if (totalScore >= 85) {
      feedback.push("Excellent response! You hit most of the key points clearly.");
    }

    if (keywordScore < 50) {
      feedback.push("You missed several core concepts. Make sure to review the ideal answer points.");
    }

    if (question.category === 'Behavioral Round' && starScore < 50) {
      feedback.push("Try using the STAR method (Situation, Task, Action, Result) to structure your story better.");
    }

    return {
      score: totalScore,
      grade,
      metrics: {
        relevance: Math.round(keywordScore),
        communication: Math.round(commScore),
        depth: Math.round(totalScore), // simplified mapping
        confidenceScore: conf * 20
      },
      feedbackText: feedback.join(" ") || "Good effort, but there is room for adding more depth and specific examples."
    };
  };

  const handleNextQuestion = () => {
    const q = session.questions[session.currentIndex];
    
    // Save current answer
    const analysis = evaluateAnswer(q, currentAnswer, timeElapsed, confidence);
    
    const answerData = {
      questionId: q.id,
      questionText: q.text,
      category: q.category,
      idealPoints: q.idealPoints,
      text: currentAnswer,
      timeSpent: timeElapsed,
      confidence,
      analysis
    };

    const newAnswers = [...session.answers, answerData];

    if (session.currentIndex < session.questions.length - 1) {
      setSession({
        ...session,
        answers: newAnswers,
        currentIndex: session.currentIndex + 1
      });
      // Reset for next
      setCurrentAnswer('');
      setShowTips(false);
      setConfidence(3);
      setTimeElapsed(0);
    } else {
      // Finish Interview
      const finalSession = {
        ...session,
        answers: newAnswers,
        endTime: new Date().toISOString()
      };
      
      // Calculate overall
      const totalScore = finalSession.answers.reduce((acc, a) => acc + a.analysis.score, 0);
      finalSession.overallScore = Math.round(totalScore / finalSession.questions.length);
      
      setSession(finalSession);
      
      // Save to history
      const historyEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: interviewType,
        role: targetRole,
        score: finalSession.overallScore,
        numQuestions
      };
      saveHistory([historyEntry, ...history]);
      
      setScreen('review');
      toast.success("Interview Completed!");
    }
  };

  const handleSkip = () => {
    // Treat as empty answer
    setCurrentAnswer('');
    handleNextQuestion();
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- RENDERERS ---

  const renderSetup = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
          <FaUserTie className="text-4xl text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800">AI Mock Interview <span className="gradient-text">Simulator</span></h1>
        <p className="text-slate-500 text-lg">Practice real-world interview scenarios with advanced AI evaluation. Get instant feedback on your answers, communication, and technical depth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FaRobot className="text-primary-500" /> Configure Your Interview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Interview Type</label>
                <select 
                  value={interviewType} 
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                >
                  <option value="HR Round">HR Round (Culture Fit)</option>
                  <option value="Technical Round">Technical Round (Core CS)</option>
                  <option value="Behavioral Round">Behavioral Round (STAR Method)</option>
                  <option value="Role-Specific Round">Role-Specific Round</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Target Role</label>
                <select 
                  value={targetRole} 
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`flex-1 py-2 rounded-xl border font-medium transition-all ${difficulty === lvl ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Number of Questions</label>
                <div className="flex gap-2">
                  {[5, 10, 15].map(num => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`flex-1 py-2 rounded-xl border font-medium transition-all ${numQuestions === num ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={startInterview}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-primary-500/30"
              >
                <FaPlay /> Start Interview Now
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FaHistory className="text-accent-500" /> Past Sessions
            </h2>
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FaUserTie className="mx-auto text-3xl mb-2 opacity-50" />
                <p>No past interviews found.</p>
                <p className="text-sm">Start a session to see history.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.slice(0, 5).map(h => (
                  <div key={h.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-primary-200 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-700 text-sm">{h.type}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.score >= 80 ? 'bg-green-100 text-green-700' : h.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {h.score}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>{new Date(h.date).toLocaleDateString()}</span>
                      <span>{h.numQuestions} Qs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderActive = () => {
    if (!session || !session.questions) return null;
    const q = session.questions[session.currentIndex];
    
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        {/* Header / Progress */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-primary-600 font-bold text-xl">
              Q{session.currentIndex + 1}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{q.category}</div>
              <div className="text-xs text-slate-400">Question {session.currentIndex + 1} of {session.questions.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-mono font-bold">
            <FaClock className="text-accent-500" /> {formatTime(timeElapsed)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((session.currentIndex) / session.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
            {q.text}
          </h2>

          <div className="mb-4 flex justify-between items-center">
             <button 
                onClick={() => setShowTips(!showTips)}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-2"
              >
                <FaLightbulb /> {showTips ? 'Hide Hints' : 'Show Hints'}
              </button>
              <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {q.difficulty}
              </span>
          </div>

          <AnimatePresence>
            {showTips && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-primary-50 rounded-xl p-4 mb-6 border border-primary-100 overflow-hidden"
              >
                <h4 className="font-bold text-primary-800 text-sm mb-2 flex items-center gap-2">
                  <FaBrain /> AI Coach Tips
                </h4>
                <ul className="list-disc pl-5 text-sm text-primary-700 space-y-1">
                  {q.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex justify-between">
              <span>Your Answer</span>
              <span className="text-slate-400 font-normal">{currentAnswer.split(/\s+/).filter(w => w.length > 0).length} words</span>
            </label>
            <textarea 
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your comprehensive answer here... Imagine you are speaking to the interviewer."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none text-slate-700 leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          
          <div className="flex flex-col items-center sm:items-start">
            <label className="text-xs font-semibold text-slate-500 mb-2 uppercase">Self-Rating Confidence</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setConfidence(star)}
                  className={`text-2xl transition-all ${confidence >= star ? 'text-yellow-400 transform scale-110' : 'text-slate-200 hover:text-yellow-200'}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
             <button 
                onClick={handleSkip}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Skip
              </button>
             <button 
                onClick={handleNextQuestion}
                disabled={currentAnswer.trim().length < 10}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${currentAnswer.trim().length < 10 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 transform hover:-translate-y-1'}`}
              >
                {session.currentIndex === session.questions.length - 1 ? 'Finish Interview' : 'Next Question'} <FaArrowRight />
              </button>
          </div>
        </div>

      </motion.div>
    );
  };

  const renderReview = () => {
    if (!session) return null;

    // Aggregate Data for Charts
    const avgScore = session.overallScore;
    
    const chartData = {
      labels: ['Relevance', 'Communication', 'Depth', 'Confidence'],
      datasets: [
        {
          label: 'Average Scores',
          data: [
            session.answers.reduce((acc, a) => acc + a.analysis.metrics.relevance, 0) / session.answers.length,
            session.answers.reduce((acc, a) => acc + a.analysis.metrics.communication, 0) / session.answers.length,
            session.answers.reduce((acc, a) => acc + a.analysis.metrics.depth, 0) / session.answers.length,
            session.answers.reduce((acc, a) => acc + a.analysis.metrics.confidenceScore, 0) / session.answers.length,
          ],
          backgroundColor: 'rgba(14, 165, 233, 0.2)', // primary-500 with opacity
          borderColor: 'rgba(14, 165, 233, 1)',
          pointBackgroundColor: 'rgba(14, 165, 233, 1)',
          borderWidth: 2,
        }
      ]
    };

    const radarOptions = {
      scales: {
        r: {
          angleLines: { color: 'rgba(0,0,0,0.1)' },
          grid: { color: 'rgba(0,0,0,0.1)' },
          pointLabels: { font: { size: 12, family: "'Inter', sans-serif" }, color: '#64748b' },
          ticks: { backdropColor: 'transparent', display: false, min: 0, max: 100 }
        }
      },
      plugins: { legend: { display: false } }
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
        
        {/* Header Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-accent-500"></div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Session Complete</h1>
          <p className="text-slate-500 mb-8">{targetRole} • {interviewType} • {session.questions.length} Questions</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="relative w-48 h-48">
              <Doughnut 
                data={{
                  labels: ['Score', 'Remaining'],
                  datasets: [{
                    data: [avgScore, 100 - avgScore],
                    backgroundColor: [avgScore >= 80 ? '#22c55e' : avgScore >= 60 ? '#eab308' : '#ef4444', '#f1f5f9'],
                    borderWidth: 0,
                    cutout: '80%'
                  }]
                }}
                options={{ plugins: { legend: { display: false }, tooltip: { enabled: false } }, rotation: -90, circumference: 180 }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                <span className="text-5xl font-black text-slate-800">{avgScore}</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Overall</span>
              </div>
            </div>

            <div className="w-full md:w-96 aspect-square max-h-[250px]">
               <Radar data={chartData} options={radarOptions} />
            </div>
          </div>
        </div>

        {/* Detailed Review */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaCheckDouble className="text-primary-500" /> Question Breakdown
          </h2>

          <div className="space-y-6">
            {session.answers.map((ans, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4">
                  <div>
                    <div className="text-sm font-bold text-primary-600 mb-1">Question {idx + 1}</div>
                    <h3 className="text-xl font-bold text-slate-800">{ans.questionText}</h3>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-xl flex items-center gap-2
                    ${ans.analysis.grade === 'A' ? 'bg-green-100 text-green-700' : 
                      ans.analysis.grade === 'B' ? 'bg-green-50 text-green-600' :
                      ans.analysis.grade === 'C' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}
                  >
                    {ans.analysis.score} <span className="text-sm font-semibold opacity-70">/ 100</span>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Col: Answer & Feedback */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FaComments /> Your Answer
                      </h4>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                        {ans.text || <span className="text-slate-400 italic">No answer provided.</span>}
                      </div>
                    </div>

                    <div>
                       <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FaRobot /> AI Feedback
                      </h4>
                      <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl text-primary-900 text-sm">
                        {ans.analysis.feedbackText}
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Metrics & Ideal */}
                  <div className="space-y-6">
                     <div>
                       <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Metrics</h4>
                       <div className="space-y-3">
                         {Object.entries(ans.analysis.metrics).map(([key, val]) => (
                           <div key={key}>
                             <div className="flex justify-between text-xs mb-1 font-semibold">
                               <span className="capitalize text-slate-600">{key.replace('Score', '')}</span>
                               <span className="text-slate-800">{val}/100</span>
                             </div>
                             <div className="w-full bg-slate-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${val >= 80 ? 'bg-green-500' : val >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${val}%` }}></div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     <div>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" /> Ideal Answer Points
                        </h4>
                        <ul className="space-y-2">
                          {ans.idealPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <FaRegCircle className="mt-1 text-slate-400 flex-shrink-0 text-xs" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => { setScreen('setup'); setSession(null); }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg"
          >
            <FaRedo /> Start New Interview
          </button>
        </div>

      </motion.div>
    );
  };


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      {screen === 'setup' && renderSetup()}
      {screen === 'active' && renderActive()}
      {screen === 'review' && renderReview()}
    </motion.div>
  );
}
