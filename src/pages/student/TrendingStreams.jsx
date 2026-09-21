import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaSortAmountDown, FaChartLine, FaTimes, FaExchangeAlt, FaLink } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { trendingStreams as importedStreams } from '../../data/sampleData';

const fallbackStreams = [
  { id: 1, name: 'AI & Machine Learning', icon: '🤖', growth: 96, demand: 'Very High', packageRange: '12 - 28 LPA', companies: ['Google', 'Microsoft', 'Nvidia', 'OpenAI'], gradient: 'from-purple-500 to-pink-500' },
  { id: 2, name: 'Computer Science & IT', icon: '💻', growth: 90, demand: 'Very High', packageRange: '8 - 22 LPA', companies: ['Google', 'Microsoft', 'Amazon', 'TCS'], gradient: 'from-blue-500 to-indigo-600' },
  { id: 3, name: 'Electronics & Communication (ECE)', icon: '📡', growth: 86, demand: 'High', packageRange: '8 - 20 LPA', companies: ['Qualcomm', 'Texas Instruments', 'Intel', 'Samsung'], gradient: 'from-cyan-400 to-teal-500' },
  { id: 4, name: 'Civil Engineering & BIM', icon: '🏗️', growth: 76, demand: 'High', packageRange: '6 - 16 LPA', companies: ['Larsen & Toubro (L&T)', 'Tata Projects', 'Afcons', 'DLF'], gradient: 'from-amber-400 to-yellow-600' },
  { id: 5, name: 'Mechanical & EV Engineering', icon: '⚙️', growth: 82, demand: 'High', packageRange: '7 - 18 LPA', companies: ['Tata Motors', 'Mahindra', 'Ola Electric', 'Bosch'], gradient: 'from-orange-400 to-red-500' },
  { id: 6, name: 'Electrical & Energy Systems (EEE)', icon: '⚡', growth: 84, demand: 'High', packageRange: '7 - 19 LPA', companies: ['Siemens', 'Schneider Electric', 'ABB', 'Tata Power'], gradient: 'from-emerald-400 to-green-600' },
  { id: 7, name: 'Semiconductor & VLSI Design', icon: '🔬', growth: 92, demand: 'Very High', packageRange: '14 - 30 LPA', companies: ['Intel', 'AMD', 'Broadcom', 'Synopsys'], gradient: 'from-rose-400 to-pink-600' },
  { id: 8, name: 'Cloud & DevOps Engineering', icon: '☁️', growth: 88, demand: 'Very High', packageRange: '10 - 24 LPA', companies: ['AWS', 'Microsoft Azure', 'Google Cloud'], gradient: 'from-sky-400 to-blue-500' }
];

const trendingStreamsData = importedStreams && importedStreams.length > 0 
  ? importedStreams.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      icon: s.icon || '🚀',
      growth: s.growth,
      demand: s.demand,
      packageRange: s.avgPackage || s.packageRange || '8 - 18 LPA',
      companies: s.companies || [],
      gradient: s.color || s.gradient || 'from-blue-500 to-indigo-600'
    }))
  : fallbackStreams;

const TrendingStreams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('growth'); // growth, demand, package
  const [compareItems, setCompareItems] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleCompareToggle = (stream) => {
    if (compareItems.find(item => item.id === stream.id)) {
      setCompareItems(compareItems.filter(item => item.id !== stream.id));
    } else {
      if (compareItems.length < 2) {
        setCompareItems([...compareItems, stream]);
      }
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...trendingStreamsData];
    
    if (searchTerm) {
      result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    result.sort((a, b) => {
      if (sortBy === 'growth') return b.growth - a.growth;
      if (sortBy === 'demand') {
        const demandScore = { 'Very High': 3, 'High': 2, 'Medium': 1 };
        return demandScore[b.demand] - demandScore[a.demand];
      }
      return 0; // Simple fallback
    });

    return result;
  }, [searchTerm, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
            Trending Streams
          </h1>
          <p className="text-slate-500 mt-2">Discover the hottest tech careers and industry demands</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search streams..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="growth">Sort by Growth</option>
              <option value="demand">Sort by Demand</option>
            </select>
            <FaSortAmountDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Compare Banner */}
      <AnimatePresence>
        {compareItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800 text-white p-4 rounded-xl mb-8 flex justify-between items-center shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="font-semibold">Compare:</span>
              <div className="flex gap-2">
                {compareItems.map(item => (
                  <span key={item.id} className="bg-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {item.icon} {item.name}
                    <button onClick={() => handleCompareToggle(item)} className="hover:text-red-400">
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {compareItems.length === 2 && (
              <button 
                onClick={() => setShowCompare(true)}
                className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <FaExchangeAlt /> Compare Now
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showCompare && compareItems.length === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Stream Comparison</h2>
                <button onClick={() => setShowCompare(false)} className="text-slate-500 hover:text-slate-700">
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {compareItems.map(stream => (
                  <div key={stream.id} className="border border-slate-200 rounded-xl p-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stream.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                      {stream.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6">{stream.name}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Growth</p>
                        <div className="flex items-center gap-2">
                          <FaChartLine className="text-accent-500" />
                          <span className="font-bold text-lg text-slate-800">{stream.growth}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Demand Level</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          stream.demand === 'Very High' ? 'bg-red-100 text-red-600' : 
                          stream.demand === 'High' ? 'bg-orange-100 text-orange-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {stream.demand}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Avg Package</p>
                        <p className="font-bold text-slate-800">{stream.packageRange}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Top Hiring Companies</p>
                        <div className="flex flex-wrap gap-2">
                          {stream.companies.map(company => (
                            <span key={company} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map(stream => {
          const isSelected = compareItems.find(item => item.id === stream.id);
          
          return (
            <motion.div 
              key={stream.id}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                isSelected ? 'border-primary-500 shadow-md shadow-primary-500/20' : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stream.gradient} flex items-center justify-center text-2xl shadow-sm`}>
                  {stream.icon}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCompareToggle(stream)}
                    className={`p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title="Compare"
                  >
                    <FaExchangeAlt />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-4">{stream.name}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Industry Growth</span>
                    <span className="font-bold text-accent-600">+{stream.growth}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <motion.div 
                      className={`h-full rounded-full bg-gradient-to-r ${stream.gradient}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stream.growth}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Demand</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    stream.demand === 'Very High' ? 'bg-red-100 text-red-600' : 
                    stream.demand === 'High' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {stream.demand}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Avg Package</span>
                  <span className="font-semibold text-slate-800 text-sm">{stream.packageRange}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Top Employers</p>
                <div className="flex flex-wrap gap-2">
                  {stream.companies.map(company => (
                    <span key={company} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-md">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/youtube-explore" 
                className={`w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors
                  bg-slate-50 text-slate-700 hover:bg-primary-50 hover:text-primary-600 border border-slate-200 hover:border-primary-200
                `}
              >
                Explore Path <FaLink size={12} />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TrendingStreams;
