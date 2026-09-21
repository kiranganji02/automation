import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCode, FaPlay, FaCheckCircle, FaTimesCircle, FaDatabase, 
  FaBug, FaClipboardCheck, FaClock, FaFlag, FaList, FaChevronLeft,
  FaChevronRight, FaTrophy, FaChartBar, FaLightbulb, FaUndo, FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- EMBEDDED DATA ---

const CODING_PROBLEMS = [
  {
    id: 'c1', title: 'Two Sum', difficulty: 'Easy', category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
    starterCode: {
      JavaScript: 'function twoSum(nums, target) {\n  // write your code here\n}',
      Python: 'def twoSum(nums, target):\n    # write your code here\n    pass',
      'C++': 'vector<int> twoSum(vector<int>& nums, int target) {\n  // write your code here\n}'
    },
    functionName: 'twoSum',
    testCases: [
      { input: '([2,7,11,15], 9)', expectedOutput: '[0,1]' },
      { input: '([3,2,4], 6)', expectedOutput: '[1,2]' },
      { input: '([3,3], 6)', expectedOutput: '[0,1]' }
    ]
  },
  {
    id: 'c2', title: 'Reverse String', difficulty: 'Easy', category: 'Strings',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    examples: 'Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]',
    starterCode: {
      JavaScript: 'function reverseString(s) {\n  // write your code here\n}',
      Python: 'def reverseString(s):\n    # write your code here\n    pass',
      'C++': 'void reverseString(vector<char>& s) {\n  // write your code here\n}'
    },
    functionName: 'reverseString',
    testCases: [
      { input: '(["h","e","l","l","o"])', expectedOutput: '["o","l","l","e","h"]' },
      { input: '(["H","a","n","n","a","h"])', expectedOutput: '["h","a","n","n","a","H"]' }
    ]
  },
  {
    id: 'c3', title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stacks',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    examples: 'Input: s = "()[]{}"\nOutput: true',
    starterCode: {
      JavaScript: 'function isValid(s) {\n  // write your code here\n}',
      Python: 'def isValid(s):\n    # write your code here\n    pass',
      'C++': 'bool isValid(string s) {\n  // write your code here\n}'
    },
    functionName: 'isValid',
    testCases: [
      { input: '("()")', expectedOutput: 'true' },
      { input: '("()[]{}")', expectedOutput: 'true' },
      { input: '("(]")', expectedOutput: 'false' }
    ]
  },
  {
    id: 'c4', title: 'FizzBuzz', difficulty: 'Easy', category: 'Math',
    description: 'Given an integer n, return a string array answer (1-indexed) where answer[i] == "FizzBuzz" if i is divisible by 3 and 5, "Fizz" if i is divisible by 3, "Buzz" if i is divisible by 5, and i (as a string) if none of the above conditions are true.',
    examples: 'Input: n = 3\nOutput: ["1","2","Fizz"]',
    starterCode: {
      JavaScript: 'function fizzBuzz(n) {\n  // write your code here\n}',
      Python: 'def fizzBuzz(n):\n    # write your code here\n    pass',
      'C++': 'vector<string> fizzBuzz(int n) {\n  // write your code here\n}'
    },
    functionName: 'fizzBuzz',
    testCases: [
      { input: '(3)', expectedOutput: '["1","2","Fizz"]' },
      { input: '(5)', expectedOutput: '["1","2","Fizz","4","Buzz"]' }
    ]
  },
  {
    id: 'c5', title: 'Palindrome Check', difficulty: 'Easy', category: 'Strings',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.',
    examples: 'Input: s = "A man, a plan, a canal: Panama"\nOutput: true',
    starterCode: {
      JavaScript: 'function isPalindrome(s) {\n  // write your code here\n}',
      Python: 'def isPalindrome(s):\n    # write your code here\n    pass',
      'C++': 'bool isPalindrome(string s) {\n  // write your code here\n}'
    },
    functionName: 'isPalindrome',
    testCases: [
      { input: '("A man, a plan, a canal: Panama")', expectedOutput: 'true' },
      { input: '("race a car")', expectedOutput: 'false' }
    ]
  },
  {
    id: 'c6', title: 'Fibonacci', difficulty: 'Easy', category: 'Dynamic Programming',
    description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
    examples: 'Input: n = 4\nOutput: 3',
    starterCode: {
      JavaScript: 'function fib(n) {\n  // write your code here\n}',
      Python: 'def fib(n):\n    # write your code here\n    pass',
      'C++': 'int fib(int n) {\n  // write your code here\n}'
    },
    functionName: 'fib',
    testCases: [
      { input: '(2)', expectedOutput: '1' },
      { input: '(3)', expectedOutput: '2' },
      { input: '(4)', expectedOutput: '3' }
    ]
  },
  {
    id: 'c7', title: 'Binary Search', difficulty: 'Easy', category: 'Algorithms',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    examples: 'Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4',
    starterCode: {
      JavaScript: 'function search(nums, target) {\n  // write your code here\n}',
      Python: 'def search(nums, target):\n    # write your code here\n    pass',
      'C++': 'int search(vector<int>& nums, int target) {\n  // write your code here\n}'
    },
    functionName: 'search',
    testCases: [
      { input: '([-1,0,3,5,9,12], 9)', expectedOutput: '4' },
      { input: '([-1,0,3,5,9,12], 2)', expectedOutput: '-1' }
    ]
  },
  {
    id: 'c8', title: 'Maximum Subarray', difficulty: 'Medium', category: 'Dynamic Programming',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: 'Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.',
    starterCode: {
      JavaScript: 'function maxSubArray(nums) {\n  // write your code here\n}',
      Python: 'def maxSubArray(nums):\n    # write your code here\n    pass',
      'C++': 'int maxSubArray(vector<int>& nums) {\n  // write your code here\n}'
    },
    functionName: 'maxSubArray',
    testCases: [
      { input: '([-2,1,-3,4,-1,2,1,-5,4])', expectedOutput: '6' },
      { input: '([1])', expectedOutput: '1' },
      { input: '([5,4,-1,7,8])', expectedOutput: '23' }
    ]
  },
  {
    id: 'c9', title: 'Merge Sorted Arrays', difficulty: 'Easy', category: 'Arrays',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order.',
    examples: 'Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\nOutput: [1,2,2,3,5,6]',
    starterCode: {
      JavaScript: 'function merge(nums1, m, nums2, n) {\n  // write your code here\n}',
      Python: 'def merge(nums1, m, nums2, n):\n    # write your code here\n    pass',
      'C++': 'void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n  // write your code here\n}'
    },
    functionName: 'merge',
    testCases: [
      { input: '([1,2,3,0,0,0], 3, [2,5,6], 3)', expectedOutput: '[1,2,2,3,5,6]' },
      { input: '([1], 1, [], 0)', expectedOutput: '[1]' }
    ]
  },
  {
    id: 'c10', title: 'String Anagram', difficulty: 'Easy', category: 'Strings',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    examples: 'Input: s = "anagram", t = "nagaram"\nOutput: true',
    starterCode: {
      JavaScript: 'function isAnagram(s, t) {\n  // write your code here\n}',
      Python: 'def isAnagram(s, t):\n    # write your code here\n    pass',
      'C++': 'bool isAnagram(string s, string t) {\n  // write your code here\n}'
    },
    functionName: 'isAnagram',
    testCases: [
      { input: '("anagram", "nagaram")', expectedOutput: 'true' },
      { input: '("rat", "car")', expectedOutput: 'false' }
    ]
  }
];

const MCQ_QUESTIONS = [
  // Generate 25 questions across categories
  { id: 'm1', category: 'Data Structures', text: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correctIndex: 1, explanation: 'Stack follows Last-In-First-Out (LIFO).' },
  { id: 'm2', category: 'Data Structures', text: 'What is the time complexity of searching in a Balanced Binary Search Tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctIndex: 2, explanation: 'In a balanced BST, searching takes O(log n) time.' },
  { id: 'm3', category: 'Algorithms', text: 'Which sorting algorithm has the worst-case time complexity of O(n^2)?', options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort'], correctIndex: 1, explanation: 'Quick Sort degrades to O(n^2) when the pivot choices are repeatedly bad.' },
  { id: 'm4', category: 'Algorithms', text: 'Dijkstra’s Algorithm is used to solve which problem?', options: ['Minimum Spanning Tree', 'Single-Source Shortest Path', 'All-Pairs Shortest Path', 'Network Flow'], correctIndex: 1, explanation: 'Dijkstra finds the shortest paths from a single source to all other vertices.' },
  { id: 'm5', category: 'OOP', text: 'Which of the following is NOT a pillar of Object-Oriented Programming?', options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'], correctIndex: 2, explanation: 'Compilation is a translation process, not an OOP concept.' },
  { id: 'm6', category: 'OOP', text: 'What does "polymorphism" mean in OOP?', options: ['Hiding data', 'Multiple inheritance', 'Many forms', 'Code reuse'], correctIndex: 2, explanation: 'Polymorphism literally means "many forms", allowing methods to do different things based on the object.' },
  { id: 'm7', category: 'Database', text: 'Which normal form deals with eliminating transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctIndex: 2, explanation: 'Third Normal Form (3NF) requires removing transitive dependencies.' },
  { id: 'm8', category: 'Database', text: 'What is the purpose of an index in a database?', options: ['Save storage space', 'Speed up data retrieval', 'Ensure data integrity', 'Encrypt data'], correctIndex: 1, explanation: 'Indexes improve the speed of data retrieval operations.' },
  { id: 'm9', category: 'OS', text: 'What is a context switch?', options: ['Switching between monitors', 'Switching the CPU from one process to another', 'Changing network context', 'Switching user accounts'], correctIndex: 1, explanation: 'A context switch is the process of storing the state of a process so it can be resumed later, allowing another process to execute.' },
  { id: 'm10', category: 'OS', text: 'Which of these is a technique to prevent deadlocks?', options: ['Banker\'s Algorithm', 'Round Robin', 'Paging', 'Spooling'], correctIndex: 0, explanation: 'Banker\'s algorithm is used for deadlock avoidance.' },
  { id: 'm11', category: 'Networking', text: 'Which layer of the OSI model does IP (Internet Protocol) operate on?', options: ['Data Link', 'Network', 'Transport', 'Application'], correctIndex: 1, explanation: 'IP operates at Layer 3, the Network layer.' },
  { id: 'm12', category: 'Networking', text: 'What port does HTTPS typically use?', options: ['80', '21', '443', '22'], correctIndex: 2, explanation: 'HTTPS traffic is usually transmitted over port 443.' },
  { id: 'm13', category: 'Web Development', text: 'What does CSS stand for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], correctIndex: 1, explanation: 'CSS stands for Cascading Style Sheets.' },
  { id: 'm14', category: 'Web Development', text: 'Which HTTP method is meant to be idempotent?', options: ['POST', 'PUT', 'PATCH', 'CONNECT'], correctIndex: 1, explanation: 'PUT is idempotent, meaning multiple identical requests should have the same effect as a single one.' },
  { id: 'm15', category: 'Data Structures', text: 'How are elements accessed in a hash table?', options: ['By index', 'By key', 'By pointer', 'Sequentially'], correctIndex: 1, explanation: 'Hash tables use a hash function to map keys to values.' },
  { id: 'm16', category: 'Algorithms', text: 'What is the space complexity of Depth First Search (DFS)?', options: ['O(1)', 'O(V)', 'O(E)', 'O(V+E)'], correctIndex: 1, explanation: 'DFS requires O(V) space for the recursion stack in the worst case (e.g., a skewed tree/graph).' },
  { id: 'm17', category: 'OOP', text: 'Can an interface have concrete methods in standard Java 8+?', options: ['Yes, default methods', 'No', 'Only private methods', 'Only static methods'], correctIndex: 0, explanation: 'Java 8 introduced default methods in interfaces which can have implementations.' },
  { id: 'm18', category: 'Database', text: 'What command is used to remove a table from a database completely?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correctIndex: 1, explanation: 'DROP completely removes the table schema and data.' },
  { id: 'm19', category: 'OS', text: 'What is thrashing in an operating system?', options: ['High CPU utilization doing actual work', 'When a system spends more time paging than executing', 'Disk failure', 'Network congestion'], correctIndex: 1, explanation: 'Thrashing occurs when virtual memory is overused, causing constant page faults.' },
  { id: 'm20', category: 'Networking', text: 'What is the purpose of DNS?', options: ['To assign IP addresses', 'To resolve domain names to IP addresses', 'To route packets', 'To secure connections'], correctIndex: 1, explanation: 'DNS translates human-readable domain names into IP addresses.' },
  { id: 'm21', category: 'Web Development', text: 'What does "DOM" stand for?', options: ['Data Object Model', 'Document Object Model', 'Design Object Model', 'Dynamic Object Model'], correctIndex: 1, explanation: 'DOM is the Document Object Model, an API for HTML/XML documents.' },
  { id: 'm22', category: 'Data Structures', text: 'Which data structure is typically used to implement a priority queue?', options: ['Array', 'Linked List', 'Heap', 'Stack'], correctIndex: 2, explanation: 'Heaps provide efficient O(log n) insertions and deletions for priority queues.' },
  { id: 'm23', category: 'Algorithms', text: 'Which algorithm is used to find the longest common subsequence?', options: ['Greedy', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking'], correctIndex: 2, explanation: 'LCS is a classic Dynamic Programming problem.' },
  { id: 'm24', category: 'Database', text: 'What is a foreign key?', options: ['A key from another database', 'A primary key of another table used to establish a link', 'A key used for encryption', 'A unique index'], correctIndex: 1, explanation: 'A foreign key links two tables by referencing the primary key of another table.' },
  { id: 'm25', category: 'OS', text: 'Which scheduling algorithm is non-preemptive?', options: ['Round Robin', 'First-Come, First-Served', 'Shortest Remaining Time First', 'Multilevel Queue'], correctIndex: 1, explanation: 'FCFS is strictly non-preemptive.' }
];

const SQL_PROBLEMS = [
  {
    id: 's1', title: 'Basic Select', difficulty: 'Easy',
    description: 'Write a query to retrieve all columns for all customers from the "customers" table.',
    schema: 'Table: customers\n- id (INT)\n- name (VARCHAR)\n- email (VARCHAR)',
    expectedOutput: 'All customer records',
    solution: 'SELECT * FROM customers;',
    hint: 'Use SELECT * to get all columns.'
  },
  {
    id: 's2', title: 'Filtering with WHERE', difficulty: 'Easy',
    description: 'Find the names of employees in the "employees" table who have a salary greater than 50000.',
    schema: 'Table: employees\n- id (INT)\n- name (VARCHAR)\n- salary (INT)',
    expectedOutput: 'List of names',
    solution: 'SELECT name FROM employees WHERE salary > 50000;',
    hint: 'Use the WHERE clause to filter the salary.'
  },
  {
    id: 's3', title: 'Simple JOIN', difficulty: 'Medium',
    description: 'Write a query to get the customer names and their order dates by joining the "customers" and "orders" tables.',
    schema: 'Table: customers (id, name)\nTable: orders (id, customer_id, order_date)',
    expectedOutput: 'Customer names and their order dates',
    solution: 'SELECT customers.name, orders.order_date FROM customers JOIN orders ON customers.id = orders.customer_id;',
    hint: 'Use an INNER JOIN on customer_id.'
  },
  {
    id: 's4', title: 'Aggregation with GROUP BY', difficulty: 'Medium',
    description: 'Count the number of employees in each department. Return the department_id and the count as "employee_count".',
    schema: 'Table: employees (id, name, department_id)',
    expectedOutput: 'department_id, employee_count',
    solution: 'SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id;',
    hint: 'Use GROUP BY department_id and COUNT().'
  },
  {
    id: 's5', title: 'Sorting Results', difficulty: 'Easy',
    description: 'Get all product names and prices from "products" table, ordered by price descending.',
    schema: 'Table: products (id, name, price)',
    expectedOutput: 'Product names and prices, most expensive first',
    solution: 'SELECT name, price FROM products ORDER BY price DESC;',
    hint: 'Use ORDER BY column_name DESC.'
  },
  {
    id: 's6', title: 'Subquery', difficulty: 'Hard',
    description: 'Find the names of employees who earn more than the average salary of all employees.',
    schema: 'Table: employees (id, name, salary)',
    expectedOutput: 'Names of high-earning employees',
    solution: 'SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
    hint: 'Use a subquery in the WHERE clause to calculate the average.'
  },
  {
    id: 's7', title: 'UPDATE Data', difficulty: 'Medium',
    description: 'Update the status of all orders in the "orders" table to "Shipped" where the order_date is before "2023-01-01".',
    schema: 'Table: orders (id, order_date, status)',
    expectedOutput: 'Updated table (no output expected from query, just execution)',
    solution: 'UPDATE orders SET status = \'Shipped\' WHERE order_date < \'2023-01-01\';',
    hint: 'Use the UPDATE statement with a SET and WHERE clause.'
  },
  {
    id: 's8', title: 'Multi-table JOIN', difficulty: 'Hard',
    description: 'Retrieve the student names, course names, and grades by joining "students", "courses", and "enrollments" tables.',
    schema: 'Table: students (id, name)\nTable: courses (id, title)\nTable: enrollments (student_id, course_id, grade)',
    expectedOutput: 'Student Name, Course Title, Grade',
    solution: 'SELECT students.name, courses.title, enrollments.grade FROM enrollments JOIN students ON enrollments.student_id = students.id JOIN courses ON enrollments.course_id = courses.id;',
    hint: 'You will need two JOIN clauses.'
  }
];

const DEBUG_TASKS = [
  {
    id: 'd1', title: 'Off-by-one Error', difficulty: 'Easy', language: 'JavaScript',
    description: 'This function is supposed to print numbers from 1 to 5, but it does not print 5. Fix the loop condition.',
    buggyCode: 'function printNumbers() {\n  let result = [];\n  for(let i=1; i<5; i++) {\n    result.push(i);\n  }\n  return result;\n}',
    expectedFix: '<=', // simplified validation for demo
    hint: 'Check the loop\'s termination condition.'
  },
  {
    id: 'd2', title: 'Scope Issue', difficulty: 'Medium', language: 'JavaScript',
    description: 'This function is supposed to return the sum of the array, but it throws a ReferenceError. Fix the variable declaration.',
    buggyCode: 'function getSum(arr) {\n  for(var i=0; i<arr.length; i++) {\n    let sum = 0;\n    sum += arr[i];\n  }\n  return sum;\n}',
    expectedFix: 'let sum = 0; before loop',
    hint: 'Where is the variable `sum` scoped?'
  },
  {
    id: 'd3', title: 'Type Coercion', difficulty: 'Easy', language: 'JavaScript',
    description: 'This function checks if two numbers are strictly equal. It is returning true for (5, "5"). Fix it.',
    buggyCode: 'function isEqual(a, b) {\n  return a == b;\n}',
    expectedFix: '===',
    hint: 'Use strict equality.'
  },
  {
    id: 'd4', title: 'Infinite Loop', difficulty: 'Medium', language: 'Python',
    description: 'This while loop never terminates. Fix it so it counts down to 0.',
    buggyCode: 'def countdown(n):\n    while n > 0:\n        print(n)\n        # missing decrement\n    return "Done!"',
    expectedFix: 'n -= 1',
    hint: 'You need to change the loop variable inside the loop.'
  },
  {
    id: 'd5', title: 'Null Reference', difficulty: 'Easy', language: 'JavaScript',
    description: 'This code throws an error if user is null. Add a check to safely return undefined if user is null.',
    buggyCode: 'function getUserName(user) {\n  return user.name;\n}',
    expectedFix: 'user?.name', // or if(user) return user.name;
    hint: 'Use optional chaining or an if statement.'
  },
  {
    id: 'd6', title: 'Missing Return', difficulty: 'Easy', language: 'JavaScript',
    description: 'This map function is supposed to double the numbers, but it returns an array of undefined. Fix it.',
    buggyCode: 'const doubled = [1,2,3].map(num => {\n  num * 2;\n});',
    expectedFix: 'return num * 2',
    hint: 'Arrow functions with curly braces need an explicit return.'
  },
  {
    id: 'd7', title: 'Wrong Operator', difficulty: 'Easy', language: 'Python',
    description: 'This function should return True if n is even. It is using the wrong operator.',
    buggyCode: 'def is_even(n):\n    return n / 2 == 0',
    expectedFix: '%',
    hint: 'Use the modulo operator.'
  },
  {
    id: 'd8', title: 'Array Mutation', difficulty: 'Medium', language: 'JavaScript',
    description: 'This function should return a new array with an item appended, without mutating the original. It currently mutates it.',
    buggyCode: 'function appendItem(arr, item) {\n  arr.push(item);\n  return arr;\n}',
    expectedFix: '[...arr, item]',
    hint: 'Use the spread operator or concat.'
  }
];

export default function CodingAssessment() {
  const [assessmentState, setAssessmentState] = useState('setup'); // setup, coding, mcq, sql, debug, results
  const [config, setConfig] = useState({
    type: 'coding', // coding, mcq, sql, debug
    difficulty: 'Any',
    count: 5,
    timed: false,
    duration: 30 // minutes
  });

  const [sessionData, setSessionData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const timerRef = useRef(null);

  // History tracking
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ipc_coding_assessment_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveHistory = (result) => {
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('ipc_coding_assessment_history', JSON.stringify(newHistory));
  };

  const startAssessment = () => {
    let selectedQuestions = [];
    
    if (config.type === 'coding') {
      selectedQuestions = CODING_PROBLEMS.filter(p => config.difficulty === 'Any' || p.difficulty === config.difficulty);
      selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, Math.min(config.count, selectedQuestions.length));
    } else if (config.type === 'mcq') {
      selectedQuestions = MCQ_QUESTIONS.sort(() => 0.5 - Math.random()).slice(0, Math.min(config.count, MCQ_QUESTIONS.length));
    } else if (config.type === 'sql') {
      selectedQuestions = SQL_PROBLEMS.filter(p => config.difficulty === 'Any' || p.difficulty === config.difficulty);
      selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, Math.min(config.count, selectedQuestions.length));
    } else if (config.type === 'debug') {
      selectedQuestions = DEBUG_TASKS.filter(p => config.difficulty === 'Any' || p.difficulty === config.difficulty);
      selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, Math.min(config.count, selectedQuestions.length));
    }

    if (selectedQuestions.length === 0) {
      toast.error('Not enough questions match your criteria.');
      return;
    }

    setSessionData({
      questions: selectedQuestions,
      answers: {}, // user's answers or code
      results: {}, // evaluation results
      currentQuestionIndex: 0,
      startTime: new Date().toISOString()
    });

    if (config.timed) {
      setTimeRemaining(config.duration * 60);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    setAssessmentState(config.type);
  };

  const finishAssessment = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Evaluate if necessary (MCQ handles mostly on the fly or end)
    let score = 0;
    let total = sessionData?.questions.length || 0;
    
    if (config.type === 'mcq') {
      sessionData.questions.forEach((q, idx) => {
        if (sessionData.answers[idx] === q.correctIndex) {
          score++;
        }
      });
    } else {
      // For coding/sql/debug, count passed problems in results
      Object.keys(sessionData.results).forEach(key => {
        if (sessionData.results[key].passed) score++;
      });
    }

    const result = {
      id: Date.now(),
      type: config.type,
      date: new Date().toISOString(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
      difficulty: config.difficulty,
      timed: config.timed
    };

    saveHistory(result);
    setAssessmentState('results');
  }, [sessionData, config]);

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- RENDERING VIEWS ---

  const renderSetup = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-3xl font-bold mb-6 gradient-text">Technical Assessment Setup</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Assessment Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'coding', icon: <FaCode />, label: 'Coding' },
              { id: 'mcq', icon: <FaList />, label: 'MCQ Quiz' },
              { id: 'sql', icon: <FaDatabase />, label: 'SQL' },
              { id: 'debug', icon: <FaBug />, label: 'Debugging' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setConfig({...config, type: type.id})}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${config.type === type.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300'}`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Difficulty</label>
          <select 
            value={config.difficulty} 
            onChange={(e) => setConfig({...config, difficulty: e.target.value})}
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={config.type === 'mcq'}
          >
            <option value="Any">Any</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Number of Questions</label>
          <select 
            value={config.count} 
            onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Time Limit</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={config.timed} 
                onChange={(e) => setConfig({...config, timed: e.target.checked})}
                className="w-5 h-5 text-primary-600 rounded"
              />
              Enable Timer
            </label>
            {config.timed && (
              <select 
                value={config.duration} 
                onChange={(e) => setConfig({...config, duration: parseInt(e.target.value)})}
                className="p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-100">
        <button 
          onClick={startAssessment}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-sm transition-colors"
        >
          Start Assessment
        </button>
      </div>
    </motion.div>
  );

  // --- CODING VIEW ---
  const renderCoding = () => {
    if (!sessionData) return null;
    const currentQ = sessionData.questions[sessionData.currentQuestionIndex];
    const [language, setLanguage] = useState('JavaScript');
    const [code, setCode] = useState(sessionData.answers[sessionData.currentQuestionIndex]?.code || currentQ.starterCode[language] || '');
    const [running, setRunning] = useState(false);
    
    useEffect(() => {
      setCode(sessionData.answers[sessionData.currentQuestionIndex]?.code || currentQ.starterCode[language] || '');
    }, [sessionData.currentQuestionIndex, language]);

    const handleRunCode = () => {
      setRunning(true);
      
      // Simulate code execution
      setTimeout(() => {
        // Mock evaluation logic
        const passed = Math.random() > 0.3; // 70% chance to pass mock evaluation
        const testsPassed = passed ? currentQ.testCases.length : Math.max(0, currentQ.testCases.length - 1);
        
        setSessionData(prev => ({
          ...prev,
          answers: { ...prev.answers, [prev.currentQuestionIndex]: { code, language } },
          results: { ...prev.results, [prev.currentQuestionIndex]: { passed, testsPassed, totalTests: currentQ.testCases.length } }
        }));
        
        if (passed) {
          toast.success('All test cases passed!');
        } else {
          toast.error('Some test cases failed. Keep trying!');
        }
        setRunning(false);
      }, 1500);
    };

    return (
      <div className="h-[80vh] flex flex-col md:flex-row gap-6">
        {/* Left Panel - Description */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="font-bold text-slate-700 flex items-center gap-2">
              <FaList /> Problem {sessionData.currentQuestionIndex + 1} of {sessionData.questions.length}
            </div>
            {config.timed && (
              <div className="text-primary-600 font-mono font-bold flex items-center gap-2">
                <FaClock /> {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <h3 className="text-2xl font-bold mb-2">{currentQ.title}</h3>
            <div className="flex gap-2 mb-6">
              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>{currentQ.difficulty}</span>
              <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">{currentQ.category}</span>
            </div>
            <div className="prose prose-sm max-w-none text-slate-700">
              <p>{currentQ.description}</p>
              <h4 className="mt-4 font-bold text-slate-800">Examples:</h4>
              <pre className="bg-slate-50 p-3 rounded-lg text-xs whitespace-pre-wrap">{currentQ.examples}</pre>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 flex justify-between">
            <button 
              disabled={sessionData.currentQuestionIndex === 0}
              onClick={() => setSessionData(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex - 1}))}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
            >
              Previous
            </button>
            {sessionData.currentQuestionIndex < sessionData.questions.length - 1 ? (
              <button 
                onClick={() => setSessionData(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex + 1}))}
                className="px-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-800"
              >
                Next Problem
              </button>
            ) : (
              <button 
                onClick={finishAssessment}
                className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Finish Assessment
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Editor */}
        <div className="w-full md:w-2/3 bg-[#1e1e1e] rounded-2xl shadow-sm border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex justify-between items-center bg-[#2d2d2d]">
            <select 
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(currentQ.starterCode[e.target.value] || '');
              }}
              className="bg-[#1e1e1e] text-slate-300 text-sm p-1 rounded border border-slate-600 focus:outline-none"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="C++">C++</option>
            </select>
            <button 
              onClick={handleRunCode}
              disabled={running}
              className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
            >
              {running ? <FaSpinner className="animate-spin" /> : <FaPlay />} Run Code
            </button>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent text-slate-300 font-mono p-4 focus:outline-none resize-none code-editor"
            spellCheck="false"
          />

          {/* Test Results Panel */}
          {sessionData.results[sessionData.currentQuestionIndex] && (
            <div className="h-48 bg-[#2d2d2d] border-t border-slate-700 p-4 overflow-y-auto">
              <h4 className="text-white text-sm font-bold mb-3">Test Results:</h4>
              <div className="flex items-center gap-2 mb-3">
                {sessionData.results[sessionData.currentQuestionIndex].passed ? (
                  <span className="text-green-400 flex items-center gap-1"><FaCheckCircle/> Accepted</span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1"><FaTimesCircle/> Failed</span>
                )}
                <span className="text-slate-400 text-xs">
                  ({sessionData.results[sessionData.currentQuestionIndex].testsPassed} / {sessionData.results[sessionData.currentQuestionIndex].totalTests} passed)
                </span>
              </div>
              <div className="space-y-2">
                {currentQ.testCases.map((tc, idx) => {
                  // Mock showing passed/failed per test case based on total tests passed
                  const isPassed = idx < sessionData.results[sessionData.currentQuestionIndex].testsPassed;
                  return (
                    <div key={idx} className="bg-[#1e1e1e] p-2 rounded text-xs font-mono flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {isPassed ? <FaCheckCircle className="text-green-500"/> : <FaTimesCircle className="text-red-500"/>}
                        <span className="text-slate-300">Test Case {idx + 1}</span>
                      </div>
                      <div className="text-slate-500">Input: {tc.input}</div>
                      <div className="text-slate-500">Expected: {tc.expectedOutput}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- MCQ VIEW ---
  const renderMCQ = () => {
    if (!sessionData) return null;
    const currentQ = sessionData.questions[sessionData.currentQuestionIndex];
    const selectedAnswer = sessionData.answers[sessionData.currentQuestionIndex];

    const handleSelectOption = (index) => {
      setSessionData(prev => ({
        ...prev,
        answers: { ...prev.answers, [prev.currentQuestionIndex]: index }
      }));
    };

    return (
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Question {sessionData.currentQuestionIndex + 1} of {sessionData.questions.length}
              </span>
              {config.timed && (
                <div className="text-primary-600 font-mono font-bold flex items-center gap-2 bg-primary-50 px-3 py-1 rounded-full">
                  <FaClock /> {formatTime(timeRemaining)}
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-6">{currentQ.text}</h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === idx 
                      ? 'border-primary-500 bg-primary-50 text-primary-800' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="inline-block w-6 font-semibold text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button 
              disabled={sessionData.currentQuestionIndex === 0}
              onClick={() => setSessionData(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex - 1}))}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            {sessionData.currentQuestionIndex < sessionData.questions.length - 1 ? (
              <button 
                onClick={() => setSessionData(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex + 1}))}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={finishAssessment}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h4 className="font-bold text-slate-700 mb-4">Question Palette</h4>
          <div className="grid grid-cols-4 gap-2">
            {sessionData.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSessionData(prev => ({...prev, currentQuestionIndex: idx}))}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                  sessionData.currentQuestionIndex === idx ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                } ${
                  sessionData.answers[idx] !== undefined 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary-600 rounded-sm"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-sm"></div> Not Answered</div>
          </div>
        </div>
      </div>
    );
  };

  // --- SQL & DEBUG VIEWS (Simplified versions of coding view) ---
  // We'll reuse the coding layout pattern for SQL and Debug for consistency
  const renderSQLOrDebug = () => {
    if (!sessionData) return null;
    const currentQ = sessionData.questions[sessionData.currentQuestionIndex];
    const isSQL = config.type === 'sql';
    const initialCode = isSQL ? '-- write your query here' : currentQ.buggyCode;
    const [code, setCode] = useState(sessionData.answers[sessionData.currentQuestionIndex]?.code || initialCode);
    const [running, setRunning] = useState(false);

    useEffect(() => {
      setCode(sessionData.answers[sessionData.currentQuestionIndex]?.code || initialCode);
    }, [sessionData.currentQuestionIndex]);

    const handleRunCode = () => {
      setRunning(true);
      setTimeout(() => {
        const passed = Math.random() > 0.4;
        setSessionData(prev => ({
          ...prev,
          answers: { ...prev.answers, [prev.currentQuestionIndex]: { code } },
          results: { ...prev.results, [prev.currentQuestionIndex]: { passed } }
        }));
        if (passed) toast.success('Correct!');
        else toast.error('Not quite right. Try again.');
        setRunning(false);
      }, 1000);
    };

    return (
      <div className="h-[80vh] flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="font-bold text-slate-700">
              Task {sessionData.currentQuestionIndex + 1} of {sessionData.questions.length}
            </div>
            {config.timed && (
              <div className="text-primary-600 font-mono font-bold flex items-center gap-2">
                <FaClock /> {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          <div className="p-6 overflow-y-auto flex-1 text-slate-700">
            <h3 className="text-xl font-bold mb-2">{currentQ.title}</h3>
            <span className="inline-block px-2 py-1 mb-4 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">{currentQ.difficulty}</span>
            <p className="mb-4">{currentQ.description}</p>
            
            {isSQL && (
              <div className="mb-4">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Schema:</h4>
                <pre className="bg-slate-50 p-2 rounded text-xs">{currentQ.schema}</pre>
              </div>
            )}
            
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm flex items-start gap-2">
              <FaLightbulb className="text-amber-500 mt-1 flex-shrink-0"/>
              <p className="text-amber-800"><strong>Hint:</strong> {currentQ.hint}</p>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 flex justify-between">
            <button 
              disabled={sessionData.currentQuestionIndex === 0}
              onClick={() => setSessionData(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex - 1}))}
              className="px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Previous
            </button>
            {sessionData.currentQuestionIndex < sessionData.questions.length - 1 ? (
              <button 
                onClick={() => setSessionData(prev => ({...prev, currentQuestionIndex: prev.currentQuestionIndex + 1}))}
                className="px-4 py-2 text-sm font-semibold text-primary-600"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={finishAssessment}
                className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg"
              >
                Finish
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-[#1e1e1e] rounded-2xl shadow-sm border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex justify-between items-center bg-[#2d2d2d]">
            <span className="text-slate-400 text-sm font-mono px-2">{isSQL ? 'SQL' : currentQ.language}</span>
            <div className="flex gap-2">
              {!isSQL && (
                <button 
                  onClick={() => setCode(initialCode)}
                  className="flex items-center gap-1 px-3 py-1.5 text-slate-300 hover:text-white text-sm"
                >
                  <FaUndo /> Reset
                </button>
              )}
              <button 
                onClick={handleRunCode}
                disabled={running}
                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md"
              >
                {running ? <FaSpinner className="animate-spin" /> : <FaPlay />} Run
              </button>
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent text-slate-300 font-mono p-4 focus:outline-none resize-none code-editor"
            spellCheck="false"
          />

          {sessionData.results[sessionData.currentQuestionIndex] && (
            <div className={`p-3 text-sm font-mono flex items-center gap-2 ${sessionData.results[sessionData.currentQuestionIndex].passed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
              {sessionData.results[sessionData.currentQuestionIndex].passed ? <><FaCheckCircle/> Passed validation</> : <><FaTimesCircle/> Validation failed</>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  const renderResults = () => {
    if (!history.length) return null;
    const latestResult = history[0];
    
    const chartData = {
      labels: ['Score', 'Incorrect/Skipped'],
      datasets: [
        {
          data: [latestResult.score, latestResult.total - latestResult.score],
          backgroundColor: ['#10b981', '#f1f5f9'],
          borderWidth: 0,
        },
      ],
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-4 text-4xl">
            <FaTrophy />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Assessment Complete!</h2>
          <p className="text-slate-500 mb-8">You have successfully completed the {latestResult.type} assessment.</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-12">
            <div className="w-48 h-48 relative">
              <Doughnut data={chartData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-800">{latestResult.percentage}%</span>
              </div>
            </div>
            
            <div className="text-left space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-sm text-slate-500">Total Score</div>
                <div className="text-2xl font-bold text-slate-800">{latestResult.score} / {latestResult.total}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-sm text-slate-500">Type</div>
                  <div className="font-semibold text-slate-800 capitalize">{latestResult.type}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-sm text-slate-500">Mode</div>
                  <div className="font-semibold text-slate-800">{latestResult.timed ? 'Timed' : 'Practice'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center gap-4">
             <button 
              onClick={() => setAssessmentState('setup')}
              className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
            >
              Take Another Assessment
            </button>
            <button 
              onClick={() => setAssessmentState('history')}
              className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
            >
              View History
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderHistory = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Assessment History</h2>
        <button 
          onClick={() => setAssessmentState('setup')}
          className="px-4 py-2 bg-primary-50 text-primary-700 font-semibold rounded-lg hover:bg-primary-100"
        >
          New Assessment
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
          No assessment history found. Take a test to see your progress here.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Date</th>
                <th className="p-4 font-semibold text-slate-600">Type</th>
                <th className="p-4 font-semibold text-slate-600">Difficulty</th>
                <th className="p-4 font-semibold text-slate-600">Score</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-700 capitalize">{item.type}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{item.difficulty || 'Any'}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{item.score}/{item.total} ({item.percentage}%)</td>
                  <td className="p-4">
                    {item.percentage >= 70 ? (
                      <span className="text-green-600 flex items-center gap-1 text-sm font-semibold"><FaCheckCircle/> Passed</span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1 text-sm font-semibold"><FaTimesCircle/> Needs Work</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      {assessmentState === 'setup' && renderSetup()}
      {assessmentState === 'coding' && renderCoding()}
      {assessmentState === 'mcq' && renderMCQ()}
      {(assessmentState === 'sql' || assessmentState === 'debug') && renderSQLOrDebug()}
      {assessmentState === 'results' && renderResults()}
      {assessmentState === 'history' && renderHistory()}
    </div>
  );
}
