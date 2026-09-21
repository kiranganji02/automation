// Sample data for the Intelligent Placement Coach application

export const codingProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
    ],
    starterCode: "function twoSum(nums, target) {\n  // Write your solution here\n  \n}",
    solution: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
    ]
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: "Reverse the array in-place." }
    ],
    starterCode: "function reverseString(s) {\n  // Write your solution here\n  \n}",
    solution: "function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  return s;\n}",
    testCases: [
      { input: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] },
    ]
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true", explanation: "Simple valid parentheses." },
      { input: 's = "()[]{}"', output: "true", explanation: "Multiple valid pairs." },
    ],
    starterCode: "function isValid(s) {\n  // Write your solution here\n  \n}",
    solution: "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if ('({['.includes(char)) {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
    ]
  },
  {
    id: 4,
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: "The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones. Given n, calculate F(n).",
    examples: [
      { input: "n = 4", output: "3", explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3." }
    ],
    starterCode: "function fib(n) {\n  // Write your solution here\n  \n}",
    solution: "function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}",
    testCases: [
      { input: [2], expected: 1 },
      { input: [4], expected: 3 },
      { input: [10], expected: 55 },
    ]
  },
  {
    id: 5,
    title: "Linked List Cycle",
    difficulty: "Medium",
    category: "Linked List",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle where tail connects to the 1st node." }
    ],
    starterCode: "function hasCycle(head) {\n  // Write your solution here\n  // Use Floyd's cycle detection\n  \n}",
    solution: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
    testCases: []
  },
  {
    id: 6,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Searching",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." }
    ],
    starterCode: "function search(nums, target) {\n  // Write your solution here\n  \n}",
    solution: "function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
    testCases: [
      { input: [[-1,0,3,5,9,12], 9], expected: 4 },
      { input: [[-1,0,3,5,9,12], 2], expected: -1 },
    ]
  },
];

export const mockTestQuestions = {
  aptitude: [
    {
      id: 1,
      question: "A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
      options: ["120m", "180m", "324m", "150m"],
      correct: 3,
      explanation: "Speed = 60 × 5/18 = 50/3 m/s. Length = Speed × Time = 50/3 × 9 = 150m"
    },
    {
      id: 2,
      question: "If the cost price of 12 pens is equal to the selling price of 8 pens, what is the profit percent?",
      options: ["25%", "33.33%", "50%", "66.67%"],
      correct: 2,
      explanation: "Let CP of each pen = 1. CP of 12 = 12. SP of 8 = 12, so SP of each = 12/8 = 1.5. Profit = 0.5/1 = 50%"
    },
    {
      id: 3,
      question: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "46"],
      correct: 1,
      explanation: "Differences: 4, 6, 8, 10, 12. Next number = 30 + 12 = 42"
    },
    {
      id: 4,
      question: "A can do a piece of work in 10 days and B in 15 days. Together, how many days will they take?",
      options: ["5 days", "6 days", "7 days", "8 days"],
      correct: 1,
      explanation: "A's rate = 1/10, B's rate = 1/15. Combined = 1/10 + 1/15 = 5/30 = 1/6. Time = 6 days"
    },
    {
      id: 5,
      question: "The average of first 50 natural numbers is:",
      options: ["25", "25.5", "26", "50"],
      correct: 1,
      explanation: "Sum = n(n+1)/2 = 50×51/2 = 1275. Average = 1275/50 = 25.5"
    },
  ],
  technical: [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
      correct: 2,
      explanation: "Binary search halves the search space each time, resulting in O(log n) complexity."
    },
    {
      id: 2,
      question: "Which data structure uses FIFO ordering?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correct: 1,
      explanation: "Queue follows First-In-First-Out (FIFO) ordering."
    },
    {
      id: 3,
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"],
      correct: 0,
      explanation: "SQL stands for Structured Query Language."
    },
    {
      id: 4,
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
      correct: 2,
      explanation: "Merge Sort has O(n log n) average-case time complexity."
    },
    {
      id: 5,
      question: "What is polymorphism in OOP?",
      options: [
        "Hiding implementation details",
        "Ability of an object to take multiple forms",
        "Inheriting properties from a parent class",
        "Wrapping data and methods together"
      ],
      correct: 1,
      explanation: "Polymorphism allows objects to take multiple forms, enabling method overriding and overloading."
    },
  ],
  verbal: [
    {
      id: 1,
      question: "Choose the synonym of 'Eloquent':",
      options: ["Silent", "Articulate", "Confused", "Quiet"],
      correct: 1,
      explanation: "Eloquent means fluent or persuasive in speaking or writing. Articulate is the closest synonym."
    },
    {
      id: 2,
      question: "Choose the antonym of 'Benevolent':",
      options: ["Kind", "Generous", "Malevolent", "Helpful"],
      correct: 2,
      explanation: "Benevolent means well-meaning and kindly. Malevolent means having or showing a wish to do evil."
    },
    {
      id: 3,
      question: "Fill in the blank: She _____ to the store yesterday.",
      options: ["go", "goes", "went", "going"],
      correct: 2,
      explanation: "'Went' is the past tense of 'go', which matches 'yesterday' (past time indicator)."
    },
    {
      id: 4,
      question: "Identify the error: 'Each of the students have completed their assignment.'",
      options: ["Each", "have", "their", "assignment"],
      correct: 1,
      explanation: "'Each' is singular and requires 'has' instead of 'have'."
    },
    {
      id: 5,
      question: "What is the meaning of the idiom 'Break the ice'?",
      options: [
        "To destroy something frozen",
        "To initiate conversation in a social setting",
        "To solve a difficult problem",
        "To take a risk"
      ],
      correct: 1,
      explanation: "'Break the ice' means to initiate conversation or relieve tension in a social situation."
    },
  ],
};

export const interviewQuestions = [
  {
    id: 1,
    category: "Introduction",
    question: "Tell me about yourself.",
    tips: "Structure your answer: Present → Past → Future. Keep it professional and under 2 minutes.",
    sampleAnswer: "I am a final year Computer Science student with a strong foundation in data structures, algorithms, and web development. During my academic journey, I have completed multiple projects including a full-stack e-commerce application and a machine learning-based sentiment analyzer. I am passionate about solving complex problems and am looking for opportunities to contribute to innovative technology solutions."
  },
  {
    id: 2,
    category: "Behavioral",
    question: "Describe a challenging project you worked on.",
    tips: "Use the STAR method: Situation, Task, Action, Result. Be specific with metrics.",
    sampleAnswer: "In my final year project, I built a real-time chat application with video conferencing. The challenge was implementing WebRTC for peer-to-peer communication. I researched the technology, built a signaling server, and implemented fallback mechanisms. The result was a fully functional app supporting 10+ concurrent users with less than 100ms latency."
  },
  {
    id: 3,
    category: "Technical",
    question: "Explain the difference between REST and GraphQL.",
    tips: "Compare key aspects: data fetching, endpoints, flexibility, and use cases.",
    sampleAnswer: "REST uses multiple endpoints with fixed data structures, while GraphQL uses a single endpoint where clients specify exactly what data they need. REST can lead to over-fetching or under-fetching, while GraphQL solves this with precise queries. REST is simpler to cache and has broader tooling support, while GraphQL is more flexible for complex, nested data requirements."
  },
  {
    id: 4,
    category: "Technical",
    question: "What are the SOLID principles?",
    tips: "Explain each principle with a brief real-world example.",
    sampleAnswer: "SOLID stands for: Single Responsibility (one class, one job), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable for base types), Interface Segregation (prefer small, specific interfaces), and Dependency Inversion (depend on abstractions, not implementations). These principles lead to maintainable, scalable code."
  },
  {
    id: 5,
    category: "HR",
    question: "Where do you see yourself in 5 years?",
    tips: "Show ambition aligned with the company's growth. Be realistic but aspirational.",
    sampleAnswer: "In 5 years, I see myself as a senior software engineer leading a small team, having contributed significantly to key products. I want to deepen my expertise in distributed systems and mentor junior developers. I believe this role provides the perfect foundation for that growth trajectory."
  },
  {
    id: 6,
    category: "Behavioral",
    question: "How do you handle pressure and tight deadlines?",
    tips: "Give a specific example. Show planning and prioritization skills.",
    sampleAnswer: "I thrive under pressure by breaking tasks into smaller, manageable pieces and prioritizing based on impact. During a hackathon, our team had 24 hours to build a complete app. I created a task breakdown, assigned responsibilities, and we delivered a working MVP that won second place. The key is staying organized and focused."
  },
  {
    id: 7,
    category: "Technical",
    question: "Explain the concept of Big O notation.",
    tips: "Start simple, then give examples of common complexities.",
    sampleAnswer: "Big O notation describes the upper bound of an algorithm's time or space complexity as input grows. O(1) is constant time (hash table lookup), O(log n) is logarithmic (binary search), O(n) is linear (simple loop), O(n log n) is linearithmic (merge sort), and O(n²) is quadratic (nested loops). It helps us choose the most efficient algorithm for a given problem."
  },
  {
    id: 8,
    category: "HR",
    question: "What are your strengths and weaknesses?",
    tips: "Be honest about weaknesses but show self-awareness and improvement efforts.",
    sampleAnswer: "My strengths include problem-solving, quick learning, and effective teamwork. I enjoy breaking down complex problems into logical steps. As for weaknesses, I sometimes spend too much time optimizing code for perfection. I've learned to set time boundaries and follow the 'good enough' principle for initial iterations, then refine later."
  },
];

export const typingTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet and is commonly used for typing practice.",
  "Programming is the art of telling a computer what to do. A good programmer writes code that humans can understand and machines can execute efficiently.",
  "Data structures and algorithms form the backbone of computer science. Understanding them is essential for writing efficient and scalable software solutions.",
  "In today's digital age, technology drives innovation across all industries. From artificial intelligence to cloud computing, the possibilities are endless.",
  "The best way to predict the future is to create it. Every great software product started as an idea that someone had the courage to build.",
  "Machine learning is a subset of artificial intelligence that enables systems to learn from data. It powers recommendation engines, image recognition, and natural language processing.",
  "Web development involves creating websites and web applications for the internet. It includes front-end development, back-end development, and database management.",
  "Effective communication is a critical skill for software engineers. Writing clear documentation, explaining technical concepts, and collaborating with teams are essential abilities.",
  "The agile methodology emphasizes iterative development, collaboration, and adaptability. Teams work in short sprints to deliver incremental improvements to their products.",
  "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. It requires constant vigilance and proactive measures to stay ahead of threats.",
];

export const streamData = {
  "Computer Science": {
    skills: ["Data Structures", "Algorithms", "Web Development", "Database Management", "Operating Systems", "Computer Networks", "Cloud Computing", "Software Engineering"],
    youtubeChannels: [
      { name: "freeCodeCamp", url: "https://www.youtube.com/c/Freecodecamp", description: "Full courses on web dev, cloud, and programming" },
      { name: "CS Dojo", url: "https://www.youtube.com/c/CSDojo", description: "Data structures, algorithms, and coding interview prep" },
      { name: "Traversy Media", url: "https://www.youtube.com/c/TraversyMedia", description: "Web development tutorials and crash courses" },
      { name: "Kunal Kushwaha", url: "https://www.youtube.com/@KunalKushwaha", description: "DSA and open source preparation" },
    ],
    videos: [
      { title: "Data Structures Easy to Advanced", videoId: "RBSGKlAvoiM", channel: "freeCodeCamp" },
      { title: "Full Stack Web Development Course", videoId: "nu_pCVPKzTk", channel: "freeCodeCamp" },
      { title: "Operating Systems Fundamentals", videoId: "26QPDBe-NB8", channel: "NPTEL" },
      { title: "System Design for Beginners", videoId: "m8Icp_Cid5o", channel: "freeCodeCamp" },
    ],
    trendingTopics: ["Cloud Native Architecture", "DevOps & Kubernetes", "Cybersecurity", "Distributed Systems", "Full Stack Next.js"],
  },
  "AI & Machine Learning": {
    skills: ["Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "NLP", "Computer Vision", "Scikit-learn", "Generative AI", "LLMs", "MLOps"],
    youtubeChannels: [
      { name: "StatQuest", url: "https://www.youtube.com/c/joshstarmer", description: "Statistics and ML concepts simplified" },
      { name: "Andrej Karpathy", url: "https://www.youtube.com/@AndrejKarpathy", description: "Deep learning and neural networks from scratch" },
      { name: "3Blue1Brown", url: "https://www.youtube.com/c/3blue1brown", description: "Intuitive mathematical and neural net visualizations" },
      { name: "Krish Naik", url: "https://www.youtube.com/@krishnaik06", description: "Complete Data Science and AI tutorials" },
    ],
    videos: [
      { title: "Machine Learning Full Course", videoId: "NWONeJKn6kc", channel: "freeCodeCamp" },
      { title: "Deep Learning Crash Course", videoId: "VyWAvY2CF9c", channel: "freeCodeCamp" },
      { title: "Intro to Large Language Models", videoId: "zjkBMFhNj_g", channel: "Andrej Karpathy" },
      { title: "Computer Vision with OpenCV", videoId: "oXlwWbU8l2o", channel: "freeCodeCamp" },
    ],
    trendingTopics: ["Large Language Models (LLMs)", "Agentic AI Workflows", "MLOps & Model Deployment", "Diffusion & Generative Models", "Retrieval-Augmented Generation (RAG)"],
  },
  "Civil Engineering": {
    skills: ["AutoCAD", "Revit", "STAAD.Pro", "ETABS", "Structural Analysis", "Concrete Technology", "Geotechnical Engineering", "Surveying & Total Station", "Estimation & Costing", "Primavera & MS Project", "BIM"],
    youtubeChannels: [
      { name: "Civil Mentors", url: "https://www.youtube.com/@CivilMentors", description: "Practical civil engineering, structural design, and drafting" },
      { name: "NPTEL Civil Engineering", url: "https://www.youtube.com/@nptelcivil", description: "IIT faculty lectures on structures, geotech, and hydrology" },
      { name: "Structure Free", url: "https://www.youtube.com/@structurefree", description: "Shear force, bending moment, and structural mechanics" },
    ],
    videos: [
      { title: "AutoCAD 2D and 3D Complete Course", videoId: "cmR9cfWJRUU", channel: "Civil Mentors" },
      { title: "Structural Analysis & Design (STAAD.Pro)", videoId: "p5717J3eXfE", channel: "NPTEL" },
      { title: "Concrete Mix Design as per IS 10262", videoId: "wGq-vR3X5Z8", channel: "Civil Guruji" },
      { title: "Surveying with Total Station", videoId: "o5XzZz1g2i8", channel: "NPTEL" },
    ],
    trendingTopics: ["Building Information Modeling (BIM)", "Green Buildings & Sustainable Design", "Earthquake-Resistant Structures", "Smart Cities Infrastructure", "Prefabricated & Modular Construction"],
  },
  "Mechanical Engineering": {
    skills: ["SolidWorks", "CATIA", "AutoCAD", "ANSYS FEA", "Thermodynamics", "Fluid Mechanics", "Strength of Materials", "GD&T", "CNC Machining", "Manufacturing Processes", "HVAC", "Mechatronics"],
    youtubeChannels: [
      { name: "Learn Engineering (Lesics)", url: "https://www.youtube.com/@Lesics", description: "3D animated engineering concepts and machine workings" },
      { name: "Real Engineering", url: "https://www.youtube.com/@RealEngineering", description: "Aeronautics, materials, and mechanical innovation" },
      { name: "CAD CAM Tutorials", url: "https://www.youtube.com/@CADCAMTutorial", description: "Practical SolidWorks, CATIA, and CNC tutorials" },
    ],
    videos: [
      { title: "SolidWorks Complete 3D Modeling Tutorial", videoId: "qtgmGkEOJSQ", channel: "CADCAMTutorial" },
      { title: "Thermodynamics & Heat Transfer Fundamentals", videoId: "brN9citU0RA", channel: "Learn Engineering" },
      { title: "ANSYS Finite Element Analysis (FEA)", videoId: "9gX_h5e1zWc", channel: "NPTEL" },
      { title: "Electric Vehicle (EV) Powertrain Design", videoId: "3SAxXUIre28", channel: "Lesics" },
    ],
    trendingTopics: ["Electric Vehicles (EV) & Battery Tech", "Additive Manufacturing (3D Printing)", "Robotics & Industrial Automation", "Computational Fluid Dynamics (CFD)", "Industry 4.0 & Digital Twin"],
  },
  "Electronics & Communication": {
    skills: ["Embedded Systems", "Embedded C", "VLSI Design", "Verilog / VHDL", "Microcontrollers (ARM, 8051)", "Arduino & Raspberry Pi", "PCB Design (KiCad, Eagle)", "Digital Signal Processing (DSP)", "IoT", "Wireless & 5G Communication"],
    youtubeChannels: [
      { name: "Ben Eater", url: "https://www.youtube.com/@BenEater", description: "Building computers from breadboards and digital logic" },
      { name: "All About Electronics", url: "https://www.youtube.com/@AllAboutElectronics", description: "Analog, digital circuits, and communication theory" },
      { name: "NPTEL ECE", url: "https://www.youtube.com/@nptelece", description: "VLSI, embedded systems, and signal processing" },
    ],
    videos: [
      { title: "Embedded Systems with ARM Cortex-M", videoId: "3V9eqvkMzHA", channel: "NPTEL" },
      { title: "VLSI Design & Verilog HDL Course", videoId: "nb4ovfwqup8", channel: "Tutorials Point" },
      { title: "Digital Signal Processing Fundamentals", videoId: "zJ-LqeX_fLU", channel: "All About Electronics" },
      { title: "PCB Design from Scratch with KiCad", videoId: "vaCVh2SAZY4", channel: "freeCodeCamp" },
    ],
    trendingTopics: ["Semiconductor Manufacturing & Chip Design", "5G & 6G Wireless Networks", "Edge AI on Microcontrollers (TinyML)", "Automotive Electronics (CAN Bus, AUTOSAR)", "Internet of Things (IoT) Security"],
  },
  "Electrical & Electronics": {
    skills: ["Power Systems", "Electrical Machines", "Power Electronics", "Control Systems", "MATLAB / Simulink", "PLC & SCADA Automation", "Circuit Theory", "Renewable Energy Integration", "Switchgear & Substation Engineering"],
    youtubeChannels: [
      { name: "The Engineering Mindset", url: "https://www.youtube.com/@TheEngineeringMindset", description: "Beautiful animations of electrical machines and circuits" },
      { name: "NPTEL Electrical", url: "https://www.youtube.com/@nptelelectrical", description: "IIT courses on power systems, drives, and machines" },
      { name: "ElectroBOOM", url: "https://www.youtube.com/@ElectroBOOM", description: "Practical electronics, mains electricity, and experiments" },
    ],
    videos: [
      { title: "Electrical Transformers & Alternators", videoId: "vh_aCAHThTQ", channel: "The Engineering Mindset" },
      { title: "Power Electronics & Inverters Masterclass", videoId: "qiQR5rTSshw", channel: "NPTEL" },
      { title: "PLC & SCADA Industrial Automation Tutorial", videoId: "U_P23SqJaDc", channel: "Engineering Mindset" },
      { title: "Solar & Wind Power Systems Modeling in MATLAB", videoId: "SOTamWNgDKc", channel: "MATLAB" },
    ],
    trendingTopics: ["Smart Grid Technology", "EV Fast Charging Infrastructure", "Battery Energy Storage Systems (BESS)", "HVDC Transmission", "Industrial Automation & Industry 4.0"],
  },
};

export const achievements = [
  { id: 1, title: "First Login", description: "Logged in for the first time", icon: "🎉", points: 10, unlocked: true },
  { id: 2, title: "Profile Complete", description: "Completed your student profile", icon: "👤", points: 20, unlocked: false },
  { id: 3, title: "Code Warrior", description: "Solved 5 coding problems", icon: "⚔️", points: 50, unlocked: false },
  { id: 4, title: "Speed Demon", description: "Achieved 60+ WPM in typing test", icon: "⚡", points: 30, unlocked: false },
  { id: 5, title: "Resume Master", description: "Built your first resume", icon: "📄", points: 40, unlocked: false },
  { id: 6, title: "Interview Ready", description: "Completed 5 mock interviews", icon: "🎤", points: 60, unlocked: false },
  { id: 7, title: "Test Ace", description: "Scored 80%+ in a mock test", icon: "🏆", points: 50, unlocked: false },
  { id: 8, title: "Consistent Learner", description: "Logged in for 7 consecutive days", icon: "🔥", points: 70, unlocked: false },
  { id: 9, title: "Task Master", description: "Completed 10 to-do items", icon: "✅", points: 30, unlocked: false },
  { id: 10, title: "Chat Explorer", description: "Asked 20 questions to AI chatbot", icon: "🤖", points: 40, unlocked: false },
  { id: 11, title: "Video Scholar", description: "Watched 10 recommended videos", icon: "🎬", points: 30, unlocked: false },
  { id: 12, title: "All-Rounder", description: "Used every feature at least once", icon: "🌟", points: 100, unlocked: false },
];

export const chatbotResponses = {
  greetings: [
    "Hello! I'm your AI Placement Coach. How can I help you today? 🤖",
    "Hi there! Ready to help you ace your placement preparation! 💪",
    "Welcome! Ask me anything about placements, coding, or career guidance! 🎯",
  ],
  dsa: {
    keywords: ["data structure", "algorithm", "dsa", "array", "linked list", "tree", "graph", "sorting", "searching", "stack", "queue", "hash"],
    responses: [
      "Great question about DSA! Here's what I recommend:\n\n📚 **Learning Path:**\n1. Start with Arrays and Strings\n2. Move to Linked Lists and Stacks/Queues\n3. Learn Trees and Graphs\n4. Master Dynamic Programming\n\n🎯 **Practice:** Solve at least 2-3 problems daily on the Coding Practice section!",
      "For DSA preparation:\n\n⏰ **Time Allocation:**\n- 2 hours daily for learning concepts\n- 1 hour for problem-solving\n- 30 mins for revision\n\n📖 **Resources:**\n- GeeksforGeeks for theory\n- LeetCode for practice\n- Our Coding Practice section for hands-on!",
    ]
  },
  interview: {
    keywords: ["interview", "hr", "placement", "company", "job", "hiring", "recruit"],
    responses: [
      "Interview Preparation Tips:\n\n1. **Technical Round:** Practice DSA and system design\n2. **HR Round:** Prepare STAR method answers\n3. **Group Discussion:** Stay updated with current affairs\n4. **Resume:** Keep it concise and impactful\n\n💡 Try our Mock Interview section for practice!",
      "For placement preparation:\n\n📋 **Checklist:**\n- ✅ Strong resume (use our Resume Builder)\n- ✅ DSA proficiency (practice daily)\n- ✅ Communication skills (try Communication Practice)\n- ✅ Aptitude (take Mock Tests regularly)\n- ✅ Projects (showcase 2-3 strong projects)",
    ]
  },
  resume: {
    keywords: ["resume", "cv", "portfolio", "experience", "skills section"],
    responses: [
      "Resume Tips:\n\n📄 **Structure:**\n1. Contact Information\n2. Professional Summary\n3. Skills\n4. Projects (with tech stack)\n5. Education\n6. Achievements\n\n✨ Use our Resume Builder to create a professional resume!\n\n⚠️ **Avoid:** Typos, generic objectives, and irrelevant information.",
    ]
  },
  coding: {
    keywords: ["code", "programming", "python", "java", "javascript", "c++", "web", "development", "frontend", "backend"],
    responses: [
      "Programming Tips:\n\n🔥 **Popular Languages for Placements:**\n1. Python - Versatile and beginner-friendly\n2. Java - Enterprise and Android development\n3. JavaScript - Web development (Full Stack)\n4. C++ - Competitive programming\n\n📝 **Advice:** Master one language deeply rather than knowing many superficially.\n\nTry our Coding Practice section! 💻",
    ]
  },
  career: {
    keywords: ["career", "stream", "branch", "field", "future", "scope", "salary", "package"],
    responses: [
      "Career Guidance:\n\n🌟 **Trending Fields in 2024:**\n1. AI/ML Engineer - High demand, great packages\n2. Full Stack Developer - Versatile and always needed\n3. Data Scientist - Data is the new oil\n4. Cloud Engineer - Cloud-first world\n5. Cybersecurity - Growing need for security\n\n💰 **Average Packages:** ₹6-15 LPA for freshers in top companies\n\nCheck our Trending Streams section for more! 📈",
    ]
  },
  default: [
    "That's a great question! Let me help you with that. Could you be more specific about what aspect of placement preparation you'd like to know about? 🤔",
    "I'd love to help! Here are some areas I can assist with:\n\n1. 📚 DSA & Coding\n2. 📝 Resume Building\n3. 🎤 Interview Prep\n4. 💼 Career Guidance\n5. 🧮 Aptitude Practice\n\nWhat interests you most?",
    "Interesting question! While I may not have a specific answer for that, I recommend exploring our various sections like Mock Tests, Coding Practice, and Career Guidance. Is there something specific I can help with? 🎯",
  ]
};

export const communicationTopics = [
  {
    id: 1,
    title: "Self Introduction",
    type: "speaking",
    prompt: "Introduce yourself as if you're in a job interview. Cover your background, skills, and career goals.",
    duration: 120,
    tips: ["Keep it under 2 minutes", "Follow Present-Past-Future structure", "Highlight relevant skills and experiences"],
  },
  {
    id: 2,
    title: "Project Explanation",
    type: "speaking",
    prompt: "Explain your most significant project, including the problem it solves, technologies used, and your role.",
    duration: 180,
    tips: ["Start with the problem statement", "Explain your approach", "Mention challenges and how you overcame them"],
  },
  {
    id: 3,
    title: "Email Writing",
    type: "writing",
    prompt: "Write a professional email to your manager requesting a day off next week for a personal commitment.",
    tips: ["Use formal greeting", "Be concise and clear", "Include specific dates", "End with a polite closing"],
  },
  {
    id: 4,
    title: "Technical Explanation",
    type: "speaking",
    prompt: "Explain the concept of Object-Oriented Programming to someone who is not from a technical background.",
    duration: 150,
    tips: ["Use real-world analogies", "Avoid jargon", "Give examples", "Keep it simple"],
  },
  {
    id: 5,
    title: "Group Discussion",
    type: "speaking",
    prompt: "Topic: 'Is Artificial Intelligence a threat or opportunity for the job market?' Share your perspective.",
    duration: 120,
    tips: ["Take a balanced view", "Support with examples", "Acknowledge opposing views", "Conclude with your stance"],
  },
  {
    id: 6,
    title: "Report Writing",
    type: "writing",
    prompt: "Write a brief report on the impact of remote work on team productivity in the IT industry.",
    tips: ["Use clear headings", "Include data points", "Present both pros and cons", "End with recommendations"],
  },
];

export const trendingStreams = [
  {
    name: "Artificial Intelligence & ML",
    growth: 96,
    demand: "Very High",
    avgPackage: "₹12-28 LPA",
    companies: ["Google", "Microsoft", "Nvidia", "OpenAI", "Amazon"],
    icon: "🤖",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Computer Science & IT",
    growth: 90,
    demand: "Very High",
    avgPackage: "₹8-22 LPA",
    companies: ["Google", "Microsoft", "Amazon", "Flipkart", "TCS"],
    icon: "💻",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Electronics & Communication (ECE)",
    growth: 86,
    demand: "High",
    avgPackage: "₹8-20 LPA",
    companies: ["Qualcomm", "Texas Instruments", "Intel", "Nvidia", "Samsung"],
    icon: "📡",
    color: "from-cyan-500 to-teal-500",
  },
  {
    name: "Civil Engineering & BIM",
    growth: 76,
    demand: "High",
    avgPackage: "₹6-16 LPA",
    companies: ["Larsen & Toubro (L&T)", "Tata Projects", "Afcons", "Shapoorji Pallonji", "DLF"],
    icon: "🏗️",
    color: "from-amber-500 to-yellow-600",
  },
  {
    name: "Mechanical & EV Engineering",
    growth: 82,
    demand: "High",
    avgPackage: "₹7-18 LPA",
    companies: ["Tata Motors", "Mahindra & Mahindra", "Ola Electric", "Tesla", "Bosch", "BHEL"],
    icon: "⚙️",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Electrical & Energy Systems (EEE)",
    growth: 84,
    demand: "High",
    avgPackage: "₹7-19 LPA",
    companies: ["Siemens", "Schneider Electric", "ABB", "PowerGrid", "Tata Power", "BHEL"],
    icon: "⚡",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Cloud & DevOps Engineering",
    growth: 88,
    demand: "Very High",
    avgPackage: "₹10-24 LPA",
    companies: ["AWS", "Microsoft Azure", "Google Cloud", "IBM", "Red Hat"],
    icon: "☁️",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Semiconductor & VLSI Design",
    growth: 92,
    demand: "Very High",
    avgPackage: "₹14-30 LPA",
    companies: ["Intel", "AMD", "Broadcom", "MediaTek", "TSMC", "Synopsys"],
    icon: "🔬",
    color: "from-rose-500 to-pink-600",
  },
];
