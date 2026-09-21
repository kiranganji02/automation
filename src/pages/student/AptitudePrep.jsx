import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBrain, FaCalculator, FaBookOpen, FaClock, FaFlag, 
  FaCheck, FaTimes, FaChartBar, FaHistory, FaFire, 
  FaTrophy, FaArrowRight, FaRedo, FaChevronLeft, FaChevronRight,
  FaSignOutAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';

// --- QUESTION BANK ---

const QUESTION_BANK = {
  quant: [
    {
      id: 'q1',
      question: 'A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:',
      options: ['45 km/hr', '50 km/hr', '54 km/hr', '55 km/hr'],
      correct: 1,
      explanation: 'Speed of the train relative to man = (125 / 10) m/sec = (25/2) m/sec. Converting to km/hr = (25/2) * (18/5) = 45 km/hr. Let speed of train be x. Then relative speed = x - 5. So, x - 5 = 45 => x = 50 km/hr.',
      difficulty: 'Medium',
      topic: 'Time and Distance'
    },
    {
      id: 'q2',
      question: 'If a person walks at 14 km/hr instead of 10 km/hr, he would have walked 20 km more. The actual distance travelled by him is:',
      options: ['50 km', '56 km', '70 km', '80 km'],
      correct: 0,
      explanation: 'Let actual distance be x. Then (x/10) = (x+20)/14. Solving, 14x = 10x + 200 => 4x = 200 => x = 50.',
      difficulty: 'Medium',
      topic: 'Time and Distance'
    },
    {
      id: 'q3',
      question: 'The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:',
      options: ['15', '16', '18', '25'],
      correct: 1,
      explanation: 'Let CP of each article be Rs 1. CP of x articles = x. SP of x articles = 20. Profit = 20 - x. Profit % = ((20 - x) / x) * 100 = 25. Solving for x gives x = 16.',
      difficulty: 'Medium',
      topic: 'Profit and Loss'
    },
    {
      id: 'q4',
      question: 'A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?',
      options: ['3', '4', '5', '6'],
      correct: 2,
      explanation: 'CP of 6 toffees = Rs 1. CP of 1 toffee = Rs 1/6. SP of 1 toffee = 120% of 1/6 = (120/100) * (1/6) = 1/5. Hence, for Rs 1 he must sell 5 toffees.',
      difficulty: 'Hard',
      topic: 'Profit and Loss'
    },
    {
      id: 'q5',
      question: 'A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:',
      options: ['1/4', '1/10', '7/15', '8/15'],
      correct: 3,
      explanation: 'A\'s 1 day work = 1/15, B\'s 1 day work = 1/20. (A + B)\'s 1 day work = (1/15) + (1/20) = 7/60. Work done in 4 days = 4 * (7/60) = 7/15. Remaining = 1 - 7/15 = 8/15.',
      difficulty: 'Medium',
      topic: 'Time and Work'
    },
    {
      id: 'q6',
      question: 'A is thrice as good a workman as B and therefore is able to finish a job in 60 days less than B. Working together, they can do it in:',
      options: ['20 days', '22.5 days', '25 days', '30 days'],
      correct: 1,
      explanation: 'Ratio of time taken A:B = 1:3. Difference is 2 units = 60 days. So 1 unit = 30 days. A takes 30 days, B takes 90 days. Together = (1/30) + (1/90) = 4/90 = 2/45. So 22.5 days.',
      difficulty: 'Hard',
      topic: 'Time and Work'
    },
    {
      id: 'q7',
      question: 'The average of first 50 natural numbers is:',
      options: ['25.30', '25.5', '25.00', '12.25'],
      correct: 1,
      explanation: 'Sum of first n natural numbers = n(n+1)/2. Average = (n+1)/2. For n=50, average = 51/2 = 25.5.',
      difficulty: 'Easy',
      topic: 'Averages'
    },
    {
      id: 'q8',
      question: 'The average of 7 consecutive numbers is 20. The largest of these numbers is:',
      options: ['20', '22', '23', '24'],
      correct: 2,
      explanation: 'Let numbers be x, x+1, x+2, x+3, x+4, x+5, x+6. Sum = 7x + 21. Average = (7x + 21)/7 = x + 3. So x + 3 = 20 => x = 17. Largest number is 17 + 6 = 23.',
      difficulty: 'Medium',
      topic: 'Averages'
    },
    {
      id: 'q9',
      question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
      options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
      correct: 1,
      explanation: 'This is a simple division series; each number is one-half of the previous number.',
      difficulty: 'Easy',
      topic: 'Series'
    },
    {
      id: 'q10',
      question: 'Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new numbers are in the ratio 12:23. The smaller number is:',
      options: ['27', '33', '49', '55'],
      correct: 1,
      explanation: 'Let numbers be 3x and 5x. (3x-9)/(5x-9) = 12/23. 23(3x-9) = 12(5x-9). 69x - 207 = 60x - 108. 9x = 99 => x = 11. Smaller number is 33.',
      difficulty: 'Hard',
      topic: 'Ratio'
    },
    {
      id: 'q11',
      question: 'A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:',
      options: ['Rs. 650', 'Rs. 690', 'Rs. 698', 'Rs. 700'],
      correct: 2,
      explanation: 'SI for 1 year = 854 - 815 = Rs. 39. SI for 3 years = 39 * 3 = Rs. 117. Sum = 815 - 117 = Rs. 698.',
      difficulty: 'Medium',
      topic: 'Simple Interest'
    },
    {
      id: 'q12',
      question: 'What is the probability of getting a sum 9 from two throws of a dice?',
      options: ['1/6', '1/8', '1/9', '1/12'],
      correct: 2,
      explanation: 'Ways to get sum 9: (3,6), (4,5), (5,4), (6,3). So 4 ways out of 36. Probability = 4/36 = 1/9.',
      difficulty: 'Medium',
      topic: 'Probability'
    },
    {
      id: 'q13',
      question: 'Three coins are tossed. Find the probability of getting at least two heads.',
      options: ['1/2', '3/8', '1/4', '5/8'],
      correct: 0,
      explanation: 'Total outcomes = 8. Outcomes with at least 2 heads = {HHT, HTH, THH, HHH} = 4. Probability = 4/8 = 1/2.',
      difficulty: 'Easy',
      topic: 'Probability'
    },
    {
      id: 'q14',
      question: 'Father is aged three times more than his son Ronit. After 8 years, he would be two and a half times of Ronit\'s age. After further 8 years, how many times would he be of Ronit\'s age?',
      options: ['2 times', '2.5 times', '2.75 times', '3 times'],
      correct: 0,
      explanation: 'Let Ronit\'s age be x. Father is 3 times MORE, so x + 3x = 4x. After 8 years: 4x+8 = 2.5(x+8). 4x+8 = 2.5x+20 => 1.5x = 12 => x = 8. Father = 32. After 16 years: Ronit = 24, Father = 48. Ratio = 2.',
      difficulty: 'Hard',
      topic: 'Ages'
    },
    {
      id: 'q15',
      question: 'If 20% of a = b, then b% of 20 is the same as:',
      options: ['4% of a', '5% of a', '20% of a', 'None of these'],
      correct: 0,
      explanation: '20% of a = b. b% of 20 = (b/100)*20 = b/5. Substitute b = 0.2a. b/5 = 0.2a/5 = 0.04a = 4% of a.',
      difficulty: 'Easy',
      topic: 'Percentages'
    },
    {
      id: 'q16',
      question: 'The population of a town increased from 1,75,000 to 2,62,500 in a decade. The average percent increase of population per year is:',
      options: ['4.37%', '5%', '6%', '8.75%'],
      correct: 1,
      explanation: 'Total increase = 87500. Total % increase = (87500/175000) * 100 = 50%. Average per year = 50/10 = 5%.',
      difficulty: 'Medium',
      topic: 'Percentages'
    },
    {
      id: 'q17',
      question: 'A mixture contains alcohol and water in the ratio 4:3. If 5 liters of water is added to the mixture, the ratio becomes 4:5. Find the quantity of alcohol in the given mixture.',
      options: ['10 liters', '12 liters', '15 liters', '18 liters'],
      correct: 0,
      explanation: 'Let initial alcohol be 4x and water be 3x. (4x)/(3x+5) = 4/5. 20x = 12x + 20 => 8x = 20 => x = 2.5. Alcohol = 4x = 10 liters.',
      difficulty: 'Medium',
      topic: 'Mixtures'
    },
    {
      id: 'q18',
      question: 'A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.',
      options: ['2 hours', '3 hours', '4 hours', '5 hours'],
      correct: 2,
      explanation: 'Downstream speed = 13 + 4 = 17 km/hr. Time = Distance/Speed = 68/17 = 4 hours.',
      difficulty: 'Easy',
      topic: 'Boats and Streams'
    },
    {
      id: 'q19',
      question: 'How many times in a day, are the hands of a clock in straight line but opposite in direction?',
      options: ['20', '22', '24', '48'],
      correct: 1,
      explanation: 'The hands point in opposite directions 11 times in 12 hours. So in a day (24 hours), it is 22 times.',
      difficulty: 'Easy',
      topic: 'Clocks'
    },
    {
      id: 'q20',
      question: 'What is the sum of two consecutive even numbers, the difference of whose squares is 84?',
      options: ['38', '42', '46', '34'],
      correct: 1,
      explanation: 'Let numbers be x and x+2. (x+2)^2 - x^2 = 84. x^2 + 4x + 4 - x^2 = 84. 4x = 80 => x = 20. Numbers are 20 and 22. Sum = 42.',
      difficulty: 'Medium',
      topic: 'Numbers'
    }
  ],
  logic: [
    {
      id: 'l1',
      question: 'Find the next number in the series: 3, 9, 27, 81, ...',
      options: ['162', '243', '324', '405'],
      correct: 1,
      explanation: 'Each number is multiplied by 3 to get the next number. 81 * 3 = 243.',
      difficulty: 'Easy',
      topic: 'Number Series'
    },
    {
      id: 'l2',
      question: 'If CAT is coded as 3120, how is DOG coded?',
      options: ['4157', '4158', '4147', '4151'],
      correct: 0,
      explanation: 'C=3, A=1, T=20. Similarly, D=4, O=15, G=7. So, 4157.',
      difficulty: 'Easy',
      topic: 'Coding Decoding'
    },
    {
      id: 'l3',
      question: 'A man is facing North-West. He turns 90 degrees in the clockwise direction, then 180 degrees in the anticlockwise direction. Which direction is he facing now?',
      options: ['East', 'South-East', 'South-West', 'West'],
      correct: 2,
      explanation: 'NW -> 90 CW = NE. NE -> 180 ACW = SW. So, South-West.',
      difficulty: 'Medium',
      topic: 'Direction Sense'
    },
    {
      id: 'l4',
      question: 'Pointing to a photograph of a boy Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
      options: ['Brother', 'Uncle', 'Cousin', 'Father'],
      correct: 3,
      explanation: 'Only son of Suresh\'s mother is Suresh himself. So, the boy is the son of Suresh. Therefore, Suresh is the father of the boy.',
      difficulty: 'Medium',
      topic: 'Blood Relations'
    },
    {
      id: 'l5',
      question: 'Statements: All pens are pencils. No pencil is an eraser. Conclusions: I. No eraser is a pen. II. Some pencils are pens.',
      options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither I nor II follows'],
      correct: 2,
      explanation: 'All pens are inside pencils. Pencils and erasers are disjoint. So erasers and pens are disjoint (I follows). Since all pens are pencils, some pencils are pens (II follows). Both follow.',
      difficulty: 'Hard',
      topic: 'Syllogisms'
    },
    {
      id: 'l6',
      question: 'Find the odd one out: 121, 144, 169, 196, 224, 256',
      options: ['121', '169', '196', '224'],
      correct: 3,
      explanation: 'All other numbers are perfect squares. 224 is not a perfect square.',
      difficulty: 'Easy',
      topic: 'Odd One Out'
    },
    {
      id: 'l7',
      question: 'Cup is to coffee as bowl is to:',
      options: ['Dish', 'Soup', 'Spoon', 'Food'],
      correct: 1,
      explanation: 'Coffee is served in a cup, just as soup is served in a bowl.',
      difficulty: 'Easy',
      topic: 'Analogies'
    },
    {
      id: 'l8',
      question: 'Six friends are sitting in a circle facing the center. A is between B and C. D is between E and F. B and E are opposite to each other. Who is opposite to C?',
      options: ['A', 'D', 'F', 'E'],
      correct: 2,
      explanation: 'Since B and E are opposite, and A is between B and C, F must be between E and D such that F is opposite to C.',
      difficulty: 'Hard',
      topic: 'Seating Arrangement'
    },
    {
      id: 'l9',
      question: 'If '+' means '*', '-' means '+', '*' means '/', and '/' means '-', then what is the value of 15 * 3 + 4 - 6 / 2?',
      options: ['24', '18', '12', '20'],
      correct: 0,
      explanation: 'Substitute signs: 15 / 3 * 4 + 6 - 2 = 5 * 4 + 6 - 2 = 20 + 6 - 2 = 24.',
      difficulty: 'Medium',
      topic: 'Mathematical Operations'
    },
    {
      id: 'l10',
      question: 'If day before yesterday was Thursday, what day will be four days after tomorrow?',
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      correct: 3,
      explanation: 'Today is Saturday. Tomorrow is Sunday. Four days after Sunday is Thursday.',
      difficulty: 'Medium',
      topic: 'Calendars'
    },
    {
      id: 'l11',
      question: 'Which word does NOT belong with the others?',
      options: ['Index', 'Glossary', 'Chapter', 'Book'],
      correct: 3,
      explanation: 'Index, Glossary, and Chapter are parts of a Book.',
      difficulty: 'Easy',
      topic: 'Classification'
    },
    {
      id: 'l12',
      question: 'Odometer is to mileage as compass is to:',
      options: ['Speed', 'Hiking', 'Needle', 'Direction'],
      correct: 3,
      explanation: 'An odometer measures mileage, and a compass indicates direction.',
      difficulty: 'Easy',
      topic: 'Analogies'
    },
    {
      id: 'l13',
      question: 'Look at this series: 8, 22, 8, 28, 8, ... What number should come next?',
      options: ['9', '29', '32', '34'],
      correct: 3,
      explanation: 'This is an alternating series. 8 is constant. The other sequence is 22, 28, so the next should be 28+6 = 34.',
      difficulty: 'Medium',
      topic: 'Number Series'
    },
    {
      id: 'l14',
      question: 'ELFA, GLHA, ILJA, _____, MLNA',
      options: ['OLPA', 'KLMA', 'LLMA', 'KLLA'],
      correct: 3,
      explanation: 'First letters: E, G, I, K, M (skip one). Second letters: L is constant. Third letters: F, H, J, L, N (skip one). Fourth: A is constant. So KLLA.',
      difficulty: 'Medium',
      topic: 'Letter Series'
    },
    {
      id: 'l15',
      question: 'A, B, C, D and E play a game of cards. A says to B, "If you give me three cards, you will have as many as E has and if I give you three cards, you will have as many as D has." A and B together have 10 cards more than what D and E together have. If B has two cards more than what C has and the total number of cards be 133, how many cards does B have?',
      options: ['22', '23', '25', '35'],
      correct: 2,
      explanation: 'From conditions: B-3 = E; B+3 = D; A+B = D+E+10 => A+B = B+3+B-3+10 => A = B+10. C = B-2. Total: A+B+C+D+E = 133. Substitute all in terms of B: (B+10) + B + (B-2) + (B+3) + (B-3) = 133 => 5B + 8 = 133 => 5B = 125 => B = 25.',
      difficulty: 'Hard',
      topic: 'Puzzles'
    },
    {
      id: 'l16',
      question: 'In a certain code language, "123" means "hot filtered coffee", "356" means "very hot day" and "589" means "day and night". Which digit stands for "very"?',
      options: ['5', '6', '8', '9'],
      correct: 1,
      explanation: 'From 1st and 2nd, "hot" is 3. From 2nd and 3rd, "day" is 5. So "very" in "356" must be 6.',
      difficulty: 'Medium',
      topic: 'Coding Decoding'
    },
    {
      id: 'l17',
      question: 'Statements: Some actors are singers. All the singers are dancers. Conclusions: I. Some actors are dancers. II. No singer is actor.',
      options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither I nor II follows'],
      correct: 0,
      explanation: 'Since some actors are singers and all singers are dancers, some actors must be dancers. Conclusion II is false since some actors are singers.',
      difficulty: 'Medium',
      topic: 'Syllogisms'
    },
    {
      id: 'l18',
      question: 'Choose the missing term: 1, 1, 2, 6, 24, ?, 720',
      options: ['100', '104', '108', '120'],
      correct: 3,
      explanation: 'Pattern is *1, *2, *3, *4, *5. So 24 * 5 = 120.',
      difficulty: 'Easy',
      topic: 'Number Series'
    },
    {
      id: 'l19',
      question: 'A cube is painted blue on all faces and is then cut into 125 smaller cubes of equal size. How many cubes are not painted on any face?',
      options: ['8', '16', '27', '36'],
      correct: 2,
      explanation: 'n = 5. Cubes with no face painted = (n-2)^3 = (5-2)^3 = 3^3 = 27.',
      difficulty: 'Hard',
      topic: 'Cubes'
    },
    {
      id: 'l20',
      question: 'If South-East becomes North, North-East becomes West and so on. What will West become?',
      options: ['North-East', 'North-West', 'South-East', 'South-West'],
      correct: 2,
      explanation: 'The shift is 135 degrees anticlockwise. West shifted 135 degrees anticlockwise becomes South-East.',
      difficulty: 'Medium',
      topic: 'Direction Sense'
    }
  ],
  verbal: [
    {
      id: 'v1',
      question: 'Choose the correct synonym for "ABANDON":',
      options: ['Keep', 'Forsake', 'Cherish', 'Support'],
      correct: 1,
      explanation: 'Abandon means to leave or give up completely, which is synonymous with forsake.',
      difficulty: 'Easy',
      topic: 'Synonyms'
    },
    {
      id: 'v2',
      question: 'Choose the correct antonym for "EPHEMERAL":',
      options: ['Transient', 'Short-lived', 'Permanent', 'Fleeting'],
      correct: 2,
      explanation: 'Ephemeral means lasting for a very short time. Permanent is the opposite.',
      difficulty: 'Medium',
      topic: 'Antonyms'
    },
    {
      id: 'v3',
      question: 'Fill in the blank: The manager was pleased _____ the performance of his team.',
      options: ['at', 'with', 'on', 'about'],
      correct: 1,
      explanation: 'The correct preposition to use after "pleased" when referring to someone or something\'s performance is "with".',
      difficulty: 'Easy',
      topic: 'Prepositions'
    },
    {
      id: 'v4',
      question: 'Identify the grammatically correct sentence:',
      options: ['He do not like coffee.', 'He did not liked coffee.', 'He does not like coffee.', 'He has not like coffee.'],
      correct: 2,
      explanation: '"He does not like coffee" is grammatically correct. Use "does not" with third-person singular subjects in present tense, followed by base verb.',
      difficulty: 'Easy',
      topic: 'Grammar'
    },
    {
      id: 'v5',
      question: 'What is the meaning of the idiom "To bite the bullet"?',
      options: ['To chew on a piece of metal', 'To face a difficult situation bravely', 'To shoot a gun', 'To run away from trouble'],
      correct: 1,
      explanation: '"To bite the bullet" means to endure a painful or otherwise unpleasant situation that is seen as unavoidable.',
      difficulty: 'Medium',
      topic: 'Idioms'
    },
    {
      id: 'v6',
      question: 'Substitute with one word: "A person who is indifferent to pleasure and pain".',
      options: ['Stoic', 'Epicurean', 'Sadist', 'Ascetic'],
      correct: 0,
      explanation: 'A stoic is a person who can endure pain or hardship without showing their feelings or complaining.',
      difficulty: 'Medium',
      topic: 'One Word Substitution'
    },
    {
      id: 'v7',
      question: 'Select the correctly spelt word:',
      options: ['Accomodation', 'Accommodation', 'Acomodation', 'Acommodation'],
      correct: 1,
      explanation: 'The correct spelling has two "c"s and two "m"s: Accommodation.',
      difficulty: 'Easy',
      topic: 'Spelling'
    },
    {
      id: 'v8',
      question: 'Rearrange the parts (P, Q, R, S) to form a meaningful sentence: \nP: in the world \nQ: is the largest \nR: Russia \nS: country by area',
      options: ['RQSP', 'PQRS', 'RSPQ', 'RQPS'],
      correct: 0,
      explanation: 'Russia (R) is the largest (Q) country by area (S) in the world (P). -> RQSP.',
      difficulty: 'Medium',
      topic: 'Para Jumbles'
    },
    {
      id: 'v9',
      question: 'Choose the correct synonym for "MITIGATE":',
      options: ['Aggravate', 'Alleviate', 'Instigate', 'Elevate'],
      correct: 1,
      explanation: 'Mitigate means make less severe, serious, or painful. Alleviate is the closest synonym.',
      difficulty: 'Medium',
      topic: 'Synonyms'
    },
    {
      id: 'v10',
      question: 'Choose the correct antonym for "CANDID":',
      options: ['Frank', 'Deceptive', 'Honest', 'Sincere'],
      correct: 1,
      explanation: 'Candid means truthful and straightforward. Deceptive is the opposite.',
      difficulty: 'Medium',
      topic: 'Antonyms'
    },
    {
      id: 'v11',
      question: 'Fill in the blank: Neither the manager nor the employees _____ present at the meeting.',
      options: ['was', 'were', 'has', 'is'],
      correct: 1,
      explanation: 'When subjects are joined by "neither...nor", the verb agrees with the subject closest to it. "Employees" is plural, so "were".',
      difficulty: 'Hard',
      topic: 'Grammar'
    },
    {
      id: 'v12',
      question: 'What is the meaning of the idiom "A blessing in disguise"?',
      options: ['A visible blessing', 'A curse that looks like a blessing', 'A good thing that seemed bad at first', 'A disguise worn for blessings'],
      correct: 2,
      explanation: 'It refers to something good that isn\'t recognized at first.',
      difficulty: 'Easy',
      topic: 'Idioms'
    },
    {
      id: 'v13',
      question: 'Substitute with one word: "A remedy for all diseases".',
      options: ['Panacea', 'Antibiotic', 'Vaccine', 'Antidote'],
      correct: 0,
      explanation: 'Panacea translates to a solution or remedy for all difficulties or diseases.',
      difficulty: 'Easy',
      topic: 'One Word Substitution'
    },
    {
      id: 'v14',
      question: 'Identify the error in the sentence: "One of the boy has failed the exam."',
      options: ['One of', 'the boy', 'has failed', 'the exam'],
      correct: 1,
      explanation: 'The phrase should be "One of the boys" (plural noun after "one of").',
      difficulty: 'Medium',
      topic: 'Error Spotting'
    },
    {
      id: 'v15',
      question: 'Select the word which best expresses the meaning of "OBSEQUIOUS":',
      options: ['Defiant', 'Servile', 'Arrogant', 'Assertive'],
      correct: 1,
      explanation: 'Obsequious means obedient or attentive to an excessive or servile degree.',
      difficulty: 'Hard',
      topic: 'Synonyms'
    },
    {
      id: 'v16',
      question: 'Rearrange (P,Q,R,S): \nP: the dog \nQ: bit the man \nR: who was walking \nS: in the park',
      options: ['PQRS', 'PRSQ', 'SPQR', 'QPRS'],
      correct: 0,
      explanation: 'The dog (P) bit the man (Q) who was walking (R) in the park (S).',
      difficulty: 'Easy',
      topic: 'Para Jumbles'
    },
    {
      id: 'v17',
      question: 'Fill in the blank: She has been living here _____ 1995.',
      options: ['from', 'since', 'for', 'in'],
      correct: 1,
      explanation: '"Since" is used for a specific point in time in the past.',
      difficulty: 'Easy',
      topic: 'Grammar'
    },
    {
      id: 'v18',
      question: 'Choose the correct antonym for "LAUD":',
      options: ['Praise', 'Extol', 'Criticize', 'Glorify'],
      correct: 2,
      explanation: 'Laud means to praise. Criticize is the antonym.',
      difficulty: 'Medium',
      topic: 'Antonyms'
    },
    {
      id: 'v19',
      question: 'What is the meaning of the idiom "To let the cat out of the bag"?',
      options: ['To release an animal', 'To reveal a secret', 'To buy a cat', 'To clean the bag'],
      correct: 1,
      explanation: 'It means to accidentally reveal a secret.',
      difficulty: 'Easy',
      topic: 'Idioms'
    },
    {
      id: 'v20',
      question: 'Identify the error: "He is more smarter than his brother."',
      options: ['He is', 'more smarter', 'than', 'his brother'],
      correct: 1,
      explanation: 'Double comparatives are incorrect. It should be just "smarter".',
      difficulty: 'Medium',
      topic: 'Error Spotting'
    }
  ]
};

// --- HELPER COMPONENTS ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- MAIN COMPONENT ---

export default function AptitudePrep() {
  // Navigation State
  // 'home' | 'setup' | 'practice' | 'test' | 'results'
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null); // 'quant', 'logic', 'verbal'
  const [mode, setMode] = useState('practice'); // 'practice', 'test'
  const [difficultyFilter, setDifficultyFilter] = useState('Mixed'); // 'Easy', 'Medium', 'Hard', 'Mixed'
  
  // Test/Practice State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [testStats, setTestStats] = useState(null);
  
  // Timers
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef(null);
  const [timeTakenPerQuestion, setTimeTakenPerQuestion] = useState({});

  // History Data
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ipc_aptitude_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ipc_aptitude_history', JSON.stringify(history));
  }, [history]);

  // --- STATS CALCULATION ---
  const calculateOverallStats = () => {
    if (history.length === 0) return { total: 0, accuracy: 0, streak: 0 };
    const totalAttempted = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
    const totalCorrect = history.reduce((acc, curr) => acc + curr.correct, 0);
    const accuracy = totalAttempted ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    
    // Simple streak calc based on dates
    const dates = [...new Set(history.map(h => new Date(h.date).toDateString()))].sort((a,b) => new Date(b) - new Date(a));
    let streak = 0;
    let currDate = new Date();
    for (let d of dates) {
      if (currDate.toDateString() === d || new Date(currDate.getTime() - 86400000).toDateString() === d) {
        streak++;
        currDate = new Date(d);
      } else {
        break;
      }
    }

    return { total: totalAttempted, accuracy, streak };
  };
  const overallStats = useMemo(() => calculateOverallStats(), [history]);

  const getCategoryBestScore = (catId) => {
    const catHistory = history.filter(h => h.category === catId);
    if (catHistory.length === 0) return 0;
    return Math.max(...catHistory.map(h => Math.round((h.correct / h.totalQuestions) * 100)));
  };

  const getCategoryLastAttempt = (catId) => {
    const catHistory = history.filter(h => h.category === catId).sort((a,b) => b.timestamp - a.timestamp);
    if (catHistory.length === 0) return 'Never';
    return new Date(catHistory[0].timestamp).toLocaleDateString();
  };

  // --- START TEST/PRACTICE ---
  const handleStart = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('setup');
  };

  const beginSession = () => {
    let rawQ = QUESTION_BANK[selectedCategory];
    if (difficultyFilter !== 'Mixed') {
      rawQ = rawQ.filter(q => q.difficulty === difficultyFilter);
    }
    
    // Shuffle and pick up to 10 for practice, or all filtered for test
    const shuffled = [...rawQ].sort(() => Math.random() - 0.5);
    const selectedQ = mode === 'practice' ? shuffled.slice(0, 10) : shuffled;

    if (selectedQ.length === 0) {
      toast.error('No questions available for this difficulty.');
      return;
    }

    setQuestions(selectedQ);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlags({});
    setTimeTakenPerQuestion({});
    
    if (mode === 'test') {
      // 1 minute per question
      setTimeRemaining(selectedQ.length * 60);
      startTimer();
    }
    
    setCurrentView(mode);
    toast.success(`Started ${mode} session with ${selectedQ.length} questions!`);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
      // Increment time for current question
      setTimeTakenPerQuestion(prev => ({
        ...prev,
        [currentIndex]: (prev[currentIndex] || 0) + 1
      }));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --- DURING TEST/PRACTICE ---
  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const toggleFlag = () => {
    setFlags(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(c => c + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  // --- SUBMIT RESULTS ---
  const handleSubmit = (autoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (!autoSubmit && Object.keys(userAnswers).length < questions.length) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
        if (mode === 'test') startTimer();
        return;
      }
    }

    let correct = 0;
    let wrong = 0;
    
    questions.forEach((q, idx) => {
      const uAns = userAnswers[idx];
      if (uAns !== undefined) {
        if (uAns === q.correct) correct++;
        else wrong++;
      }
    });

    const unanswered = questions.length - (correct + wrong);
    
    const stats = {
      id: Date.now(),
      timestamp: Date.now(),
      date: new Date().toISOString(),
      category: selectedCategory,
      mode,
      difficulty: difficultyFilter,
      totalQuestions: questions.length,
      correct,
      wrong,
      unanswered,
      userAnswers,
      timeTakenPerQuestion
    };

    setTestStats(stats);
    setHistory(prev => [stats, ...prev]);
    setCurrentView('results');
    
    if (autoSubmit) toast.info('Time is up! Auto-submitted.');
    else toast.success('Session completed!');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDERS ---

  const renderHome = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Aptitude Preparation</h1>
          <p className="text-slate-600 mt-1">Master quant, logic, and verbal skills for placements.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 bg-primary-50/50 border-primary-100">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
            <FaChartBar size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Questions Attempted</p>
            <p className="text-2xl font-bold text-slate-800">{overallStats.total}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 bg-emerald-50/50 border-emerald-100">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <FaCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Overall Accuracy</p>
            <p className="text-2xl font-bold text-slate-800">{overallStats.accuracy}%</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 bg-orange-50/50 border-orange-100">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <FaFire size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Current Streak</p>
            <p className="text-2xl font-bold text-slate-800">{overallStats.streak} Days</p>
          </div>
        </Card>
      </div>

      {/* Categories */}
      <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Choose a Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quant */}
        <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => handleStart('quant')}>
          <Card className="h-full border-2 border-transparent hover:border-primary-300 transition-colors">
            <div className="p-6">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <FaCalculator size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Quantitative Aptitude</h3>
              <p className="text-sm text-slate-500 mb-6">Numbers, Percentages, Ratios, Time & Work, Averages</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Available Questions</span>
                  <span className="font-semibold">{QUESTION_BANK.quant.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Best Score</span>
                  <span className="font-semibold text-emerald-600">{getCategoryBestScore('quant')}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Attempt</span>
                  <span className="font-semibold">{getCategoryLastAttempt('quant')}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
              Start Practice <FaArrowRight />
            </div>
          </Card>
        </motion.div>

        {/* Logic */}
        <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => handleStart('logic')}>
          <Card className="h-full border-2 border-transparent hover:border-purple-300 transition-colors">
            <div className="p-6">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <FaBrain size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Logical Reasoning</h3>
              <p className="text-sm text-slate-500 mb-6">Series, Patterns, Coding, Blood Relations, Syllogisms</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Available Questions</span>
                  <span className="font-semibold">{QUESTION_BANK.logic.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Best Score</span>
                  <span className="font-semibold text-emerald-600">{getCategoryBestScore('logic')}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Attempt</span>
                  <span className="font-semibold">{getCategoryLastAttempt('logic')}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 text-center text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
              Start Practice <FaArrowRight />
            </div>
          </Card>
        </motion.div>

        {/* Verbal */}
        <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => handleStart('verbal')}>
          <Card className="h-full border-2 border-transparent hover:border-amber-300 transition-colors">
            <div className="p-6">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                <FaBookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Verbal Ability</h3>
              <p className="text-sm text-slate-500 mb-6">Synonyms, Grammar, Idioms, Sentence Completion</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Available Questions</span>
                  <span className="font-semibold">{QUESTION_BANK.verbal.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Best Score</span>
                  <span className="font-semibold text-emerald-600">{getCategoryBestScore('verbal')}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Attempt</span>
                  <span className="font-semibold">{getCategoryLastAttempt('verbal')}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 text-center text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
              Start Practice <FaArrowRight />
            </div>
          </Card>
        </motion.div>

      </div>
      
      {/* Recent Activity */}
      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaHistory /> Recent Performance Trend
          </h2>
          <Card className="p-6">
            <div className="h-64">
              <Line 
                data={{
                  labels: history.slice(0, 10).reverse().map(h => new Date(h.timestamp).toLocaleDateString()),
                  datasets: [{
                    label: 'Accuracy %',
                    data: history.slice(0, 10).reverse().map(h => Math.round((h.correct/h.totalQuestions)*100)),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true, max: 100 } },
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );

  const renderSetup = () => {
    const catName = selectedCategory === 'quant' ? 'Quantitative Aptitude' : selectedCategory === 'logic' ? 'Logical Reasoning' : 'Verbal Ability';
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-10">
        <button onClick={() => setCurrentView('home')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <FaChevronLeft /> Back to Categories
        </button>
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Setup: {catName}</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setMode('practice')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'practice' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FaBookOpen className={mode === 'practice' ? 'text-primary-600' : 'text-slate-400'} />
                    <span className={`font-semibold ${mode === 'practice' ? 'text-primary-700' : 'text-slate-700'}`}>Practice Mode</span>
                  </div>
                  <p className="text-xs text-slate-500">Untimed, instant feedback, max 10 questions</p>
                </button>
                <button 
                  onClick={() => setMode('test')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'test' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FaClock className={mode === 'test' ? 'text-primary-600' : 'text-slate-400'} />
                    <span className={`font-semibold ${mode === 'test' ? 'text-primary-700' : 'text-slate-700'}`}>Timed Test</span>
                  </div>
                  <p className="text-xs text-slate-500">60s per question, results at the end</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Difficulty Level</label>
              <div className="flex flex-wrap gap-3">
                {['Mixed', 'Easy', 'Medium', 'Hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                      difficultyFilter === level 
                        ? 'bg-slate-800 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={beginSession}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Start Session <FaPlay />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderPracticeOrTest = () => {
    const q = questions[currentIndex];
    if (!q) return null;

    const isPractice = mode === 'practice';
    const isAnswered = userAnswers[currentIndex] !== undefined;

    return (
      <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Question {currentIndex + 1} <span className="text-sm font-normal text-slate-500">of {questions.length}</span>
            </h2>
            <div className="flex items-center gap-4">
              {mode === 'test' && (
                <div className={`px-4 py-2 rounded-full font-mono font-bold flex items-center gap-2 ${timeRemaining < 60 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-800'}`}>
                  <FaClock /> {formatTime(timeRemaining)}
                </div>
              )}
              <button 
                onClick={toggleFlag}
                className={`p-2 rounded-full transition-colors ${flags[currentIndex] ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                title="Flag for review"
              >
                <FaFlag />
              </button>
            </div>
          </div>

          {/* Question Card */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md font-medium">{q.topic}</span>
                <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                  q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 
                  q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {q.difficulty}
                </span>
              </div>
              
              <p className="text-lg md:text-xl text-slate-800 mb-8 leading-relaxed font-medium">
                {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentIndex] === idx;
                  let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                  
                  if (isPractice && isAnswered) {
                    if (idx === q.correct) btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                    else if (isSelected) btnClass += "border-red-500 bg-red-50 text-red-800";
                    else btnClass += "border-slate-200 opacity-50";
                  } else {
                    if (isSelected) btnClass += "border-primary-500 bg-primary-50 text-primary-800";
                    else btnClass += "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isPractice && isAnswered}
                      onClick={() => handleAnswerSelect(idx)}
                      className={btnClass}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </span>
                        {isPractice && isAnswered && idx === q.correct && <FaCheck className="text-emerald-500" />}
                        {isPractice && isAnswered && isSelected && idx !== q.correct && <FaTimes className="text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Practice Mode Explanation */}
              {isPractice && isAnswered && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-2">Explanation</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                </motion.div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <button 
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-slate-600 font-medium disabled:opacity-50 flex items-center gap-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <FaChevronLeft /> Previous
              </button>
              
              <button 
                onClick={() => handleSubmit(false)}
                className="px-6 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors hidden md:block"
              >
                Submit {mode === 'test' ? 'Test' : 'Session'}
              </button>

              <button 
                onClick={nextQuestion}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2 text-slate-600 font-medium disabled:opacity-50 flex items-center gap-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Next <FaChevronRight />
              </button>
            </div>
          </Card>
        </div>

        {/* Sidebar Palette */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <Card className="p-4 flex-1">
            <h3 className="font-bold text-slate-800 mb-4">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const isAns = userAnswers[idx] !== undefined;
                const isFlagged = flags[idx];
                const isCur = currentIndex === idx;
                
                let baseClass = "w-10 h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-all relative cursor-pointer ";
                if (isCur) baseClass += "ring-2 ring-primary-500 ring-offset-2 ";
                
                if (isPractice && isAns) {
                   if (userAnswers[idx] === questions[idx].correct) baseClass += "bg-emerald-100 text-emerald-700";
                   else baseClass += "bg-red-100 text-red-700";
                } else if (isAns) {
                  baseClass += "bg-primary-100 text-primary-700";
                } else {
                  baseClass += "bg-slate-100 text-slate-600 hover:bg-slate-200";
                }

                return (
                  <button key={idx} onClick={() => setCurrentIndex(idx)} className={baseClass}>
                    {idx + 1}
                    {isFlagged && <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary-100 rounded-sm"></div> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 rounded-sm"></div> Unanswered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Flagged for Review</div>
            </div>
          </Card>

          {/* Mobile submit button */}
          <button 
            onClick={() => handleSubmit(false)}
            className="md:hidden w-full py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg"
          >
            Submit Session
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!testStats) return null;

    const accuracy = testStats.totalQuestions > 0 ? Math.round((testStats.correct / testStats.totalQuestions) * 100) : 0;
    
    // Topic performance
    const topicStats = {};
    questions.forEach((q, idx) => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { total: 0, correct: 0 };
      topicStats[q.topic].total++;
      if (testStats.userAnswers[idx] === q.correct) {
        topicStats[q.topic].correct++;
      }
    });

    const topicLabels = Object.keys(topicStats);
    const topicData = topicLabels.map(t => Math.round((topicStats[t].correct / topicStats[t].total) * 100));

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800">Session Results</h2>
          <button 
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <FaSignOutAlt /> Exit to Home
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 md:col-span-1 text-center flex flex-col justify-center">
            <h3 className="text-slate-500 font-medium mb-2">Accuracy</h3>
            <div className="text-5xl font-black mb-2" style={{ color: accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#f59e0b' : '#ef4444' }}>
              {accuracy}%
            </div>
            <p className="text-sm text-slate-400">Score: {testStats.correct}/{testStats.totalQuestions}</p>
          </Card>
          
          <Card className="p-6 md:col-span-3">
            <h3 className="text-slate-500 font-medium mb-4">Performance Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <FaCheck className="text-emerald-500 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-700">{testStats.correct}</div>
                <div className="text-xs text-emerald-600 uppercase font-bold tracking-wider">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <FaTimes className="text-red-500 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">{testStats.wrong}</div>
                <div className="text-xs text-red-600 uppercase font-bold tracking-wider">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <FaFlag className="text-slate-400 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-700">{testStats.unanswered}</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Skipped</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Topic Accuracy</h3>
            <div className="h-64">
              <Bar 
                data={{
                  labels: topicLabels,
                  datasets: [{
                    label: 'Accuracy %',
                    data: topicData,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1,
                    borderRadius: 4
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { x: { max: 100 } },
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Detailed Review</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {questions.map((q, idx) => {
                const uAns = testStats.userAnswers[idx];
                const isCorrect = uAns === q.correct;
                const isSkipped = uAns === undefined;
                
                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex gap-3 mb-2">
                      <div className="mt-1">
                        {isCorrect ? <FaCheck className="text-emerald-500" /> : 
                         isSkipped ? <FaFlag className="text-slate-400" /> : 
                         <FaTimes className="text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 mb-2">Q{idx + 1}. {q.question}</p>
                        <div className="text-xs space-y-1">
                          <p className="text-slate-500">Your Answer: <span className={`font-semibold ${isCorrect ? 'text-emerald-600' : isSkipped ? 'text-slate-400' : 'text-red-600'}`}>
                            {isSkipped ? 'Skipped' : q.options[uAns]}
                          </span></p>
                          {!isCorrect && (
                            <p className="text-slate-500">Correct Answer: <span className="font-semibold text-emerald-600">{q.options[q.correct]}</span></p>
                          )}
                          <div className="mt-2 p-2 bg-white rounded border border-slate-200 text-slate-600 italic">
                            {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="text-center pt-4">
           <button 
             onClick={() => setCurrentView('setup')}
             className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors inline-flex items-center gap-2"
           >
             <FaRedo /> Practice Again
           </button>
        </div>

      </motion.div>
    );
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {currentView === 'home' && <motion.div key="home" exit={{ opacity: 0, y: -20 }}>{renderHome()}</motion.div>}
        {currentView === 'setup' && <motion.div key="setup" exit={{ opacity: 0, y: -20 }}>{renderSetup()}</motion.div>}
        {(currentView === 'practice' || currentView === 'test') && <motion.div key="test" exit={{ opacity: 0, scale: 0.95 }}>{renderPracticeOrTest()}</motion.div>}
        {currentView === 'results' && <motion.div key="results" exit={{ opacity: 0 }}>{renderResults()}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
