import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaUserGraduate, FaMoneyBillWave, FaBuilding, 
  FaSignOutAlt, FaSearch, FaFilter, FaChartBar, FaBriefcase 
} from 'react-icons/fa';
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

// Sample Data
const studentData = [
  { id: 1, name: 'Rahul Sharma', stream: 'Computer Science', cgpa: 8.5, skills: ['React', 'Node.js', 'Python'], status: 'Placed', company: 'Google' },
  { id: 2, name: 'Priya Patel', stream: 'Information Tech', cgpa: 9.1, skills: ['Java', 'Spring Boot', 'AWS'], status: 'Interviewing', company: 'Microsoft' },
  { id: 3, name: 'Amit Kumar', stream: 'Electronics', cgpa: 7.8, skills: ['C++', 'IoT', 'Embedded Systems'], status: 'Active', company: null },
  { id: 4, name: 'Neha Gupta', stream: 'Computer Science', cgpa: 8.9, skills: ['Python', 'Machine Learning', 'SQL'], status: 'Placed', company: 'Amazon' },
  { id: 5, name: 'Vikram Singh', stream: 'Mechanical', cgpa: 8.2, skills: ['AutoCAD', 'SolidWorks', 'MATLAB'], status: 'Active', company: null },
  { id: 6, name: 'Anjali Verma', stream: 'Information Tech', cgpa: 8.7, skills: ['Cybersecurity', 'Networks', 'Linux'], status: 'Placed', company: 'Palo Alto' },
];

const companyData = [
  { name: 'Google', hired: 15 },
  { name: 'Amazon', hired: 12 },
  { name: 'Microsoft', hired: 10 },
  { name: 'TCS', hired: 45 },
  { name: 'Infosys', hired: 38 },
];

const HRDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Stats calculation
  const totalStudents = studentData.length * 150; // Scaled up for realistic look
  const placedStudents = Math.floor(totalStudents * 0.65);
  const avgPackage = '8.5 LPA';
  const activeCompanies = 42;

  const filteredStudents = useMemo(() => {
    return studentData.filter(student => {
      const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStream = filterStream === 'All' || student.stream === filterStream;
      const matchStatus = filterStatus === 'All' || student.status === filterStatus;
      
      return matchSearch && matchStream && matchStatus;
    });
  }, [searchTerm, filterStream, filterStatus]);

  const streams = ['All', ...new Set(studentData.map(s => s.stream))];
  const statuses = ['All', 'Placed', 'Interviewing', 'Active'];

  // Chart configurations
  const barChartData = {
    labels: ['CS', 'IT', 'EC', 'ME', 'CE'],
    datasets: [
      {
        label: 'Placements 2024',
        data: [120, 95, 60, 45, 30],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Placements 2023',
        data: [100, 80, 75, 50, 40],
        backgroundColor: 'rgba(148, 163, 184, 0.5)',
        borderRadius: 6,
      }
    ],
  };

  const doughnutData = {
    labels: ['Placed', 'Interviewing', 'Active'],
    datasets: [
      {
        data: [65, 15, 20],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const handleLogout = () => {
    // Basic logout handling
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 text-white p-2 rounded-lg">
              <FaBriefcase size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">HR Portal</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Placement Drive 2024 Active
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-500 rounded-xl"><FaUsers size={24} /></div>
                <div>
                  <p className="text-slate-500 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-500 rounded-xl"><FaUserGraduate size={24} /></div>
                <div>
                  <p className="text-slate-500 text-sm">Placed Students</p>
                  <p className="text-2xl font-bold text-slate-800">{placedStudents}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-purple-50 text-purple-500 rounded-xl"><FaMoneyBillWave size={24} /></div>
                <div>
                  <p className="text-slate-500 text-sm">Average Package</p>
                  <p className="text-2xl font-bold text-slate-800">{avgPackage}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-orange-50 text-orange-500 rounded-xl"><FaBuilding size={24} /></div>
                <div>
                  <p className="text-slate-500 text-sm">Active Companies</p>
                  <p className="text-2xl font-bold text-slate-800">{activeCompanies}</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-slate-400" /> Placements by Stream
                </h3>
                <div className="h-[300px] flex items-center justify-center">
                  <Bar 
                    data={barChartData} 
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} 
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Status Distribution</h3>
                <div className="h-[250px] flex items-center justify-center relative">
                  <Doughnut 
                    data={doughnutData} 
                    options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }} 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-800">65%</span>
                    <span className="text-xs text-slate-500">Placed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Database Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Student Database</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by name or skill..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="relative">
                      <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                      <select 
                        className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                        value={filterStream}
                        onChange={(e) => setFilterStream(e.target.value)}
                      >
                        {streams.map(s => <option key={s} value={s}>{s === 'All' ? 'All Streams' : s}</option>)}
                      </select>
                    </div>
                    <select 
                      className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student Name</th>
                      <th className="px-6 py-4 font-semibold">Stream & CGPA</th>
                      <th className="px-6 py-4 font-semibold">Top Skills</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{student.name}</div>
                            <div className="text-xs text-slate-500">ID: STU2024{student.id.toString().padStart(3, '0')}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-700">{student.stream}</div>
                            <div className="text-xs font-semibold text-primary-600">{student.cgpa} CGPA</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {student.skills.map(skill => (
                                <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              student.status === 'Placed' ? 'bg-green-100 text-green-700' :
                              student.status === 'Interviewing' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {student.status}
                            </span>
                            {student.company && <div className="text-xs text-slate-500 mt-1">at {student.company}</div>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-primary-500 hover:text-primary-700 text-sm font-semibold">
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                          No students found matching the criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;
