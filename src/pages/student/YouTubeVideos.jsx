import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlayCircle, FaCheckCircle, FaSearch, FaTimes } from 'react-icons/fa';
import { streamData } from '../../data/sampleData';

const YouTubeVideos = () => {
  const [stream, setStream] = useState('Computer Science');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const [watched, setWatched] = useState(() => {
    const saved = localStorage.getItem('ipc_watched_videos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ipc_watched_videos', JSON.stringify(watched));
  }, [watched]);

  const handlePlay = (video) => {
    setSelectedVideo(video);
    if (!watched.includes(video.id)) {
      setWatched([...watched, video.id]);
    }
  };

  const streams = [
    'Computer Science', 
    'AI & Machine Learning', 
    'Civil Engineering', 
    'Mechanical Engineering', 
    'Electronics & Communication', 
    'Electrical & Electronics'
  ];
  
  // Videos from sampleData
  const rawVideos = streamData?.[stream]?.videos || [];
  const videos = rawVideos.map((v, i) => ({
    ...v,
    id: v.id || v.videoId || `vid-${i}`
  }));

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.channel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Video Resources</h1>
          <p className="text-slate-500 mt-1">Curated lecture videos &amp; tutorials across all engineering streams.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search videos or channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          
          <select 
            className="px-4 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500 text-sm font-semibold text-primary-700"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          >
            {streams.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover flex flex-col">
            <div className="relative cursor-pointer group" onClick={() => handlePlay(video)}>
              <img 
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                alt={video.title}
                className="w-full aspect-video object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60';
                }}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaPlayCircle className="text-white text-5xl drop-shadow-lg" />
              </div>
              {watched.includes(video.id) && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-md text-xs">
                  <FaCheckCircle />
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-800 line-clamp-2 mb-1 text-sm" title={video.title}>{video.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{video.channel}</p>
              <div className="mt-auto">
                <span className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-600 font-medium rounded-lg">{stream}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredVideos.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-200">
            No videos found for this search. Try selecting another branch or clearing the search box.
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 p-2 rounded-full z-10"
            >
              <FaTimes />
            </button>
            <div className="aspect-video w-full bg-black">
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`} 
                title={selectedVideo.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedVideo.title}</h2>
              <p className="text-gray-600 font-medium">Channel: {selectedVideo.channel}</p>
              {selectedVideo.description && (
                <p className="text-gray-500 mt-4 text-sm whitespace-pre-wrap">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default YouTubeVideos;
