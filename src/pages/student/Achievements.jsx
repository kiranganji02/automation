import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaLock, FaStar, FaFire, FaMedal, FaGem } from 'react-icons/fa';
import { achievements as defaultAchievements } from '../../data/sampleData';

const Achievements = () => {
  const [achievementsList, setAchievementsList] = useState(() => {
    const saved = localStorage.getItem('ipc_achievements');
    if (saved) return JSON.parse(saved);
    return defaultAchievements;
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    localStorage.setItem('ipc_achievements', JSON.stringify(achievementsList));
  }, [achievementsList]);

  const totalPoints = achievementsList.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievementsList.filter(a => a.unlocked).length;
  const totalCount = achievementsList.length;

  // Level system
  const getLevel = (points) => {
    if (points >= 601) return { name: 'Expert', icon: '💎', color: 'from-purple-500 to-pink-500', min: 601, max: 1000 };
    if (points >= 301) return { name: 'Advanced', icon: '🔥', color: 'from-orange-500 to-red-500', min: 301, max: 600 };
    if (points >= 101) return { name: 'Intermediate', icon: '⭐', color: 'from-blue-500 to-cyan-500', min: 101, max: 300 };
    return { name: 'Beginner', icon: '🌱', color: 'from-green-500 to-emerald-500', min: 0, max: 100 };
  };

  const level = getLevel(totalPoints);
  const levelProgress = Math.min(((totalPoints - level.min) / (level.max - level.min)) * 100, 100);

  const toggleAchievement = (id) => {
    setAchievementsList(prev =>
      prev.map(a => {
        if (a.id === id) {
          if (!a.unlocked) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
          }
          return { ...a, unlocked: !a.unlocked };
        }
        return a;
      })
    );
  };

  // Confetti particles
  const confettiColors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [0, 1, 0.5],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: confettiColors[i % confettiColors.length] }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Level Badge */}
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg`}>
            <span className="text-4xl">{level.icon}</span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-dark-800">
              <span className="gradient-text">Achievements</span>
            </h1>
            <p className="text-dark-400 mt-1">Level: <span className="font-semibold text-dark-700">{level.name}</span></p>

            {/* Level Progress Bar */}
            <div className="mt-3 max-w-md">
              <div className="flex justify-between text-xs text-dark-400 mb-1">
                <span>{totalPoints} pts</span>
                <span>{level.max} pts</span>
              </div>
              <div className="h-3 bg-dark-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${level.color} rounded-full`}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-primary-50 rounded-xl">
              <div className="text-2xl font-bold text-primary-600">{unlockedCount}</div>
              <div className="text-xs text-dark-400">Unlocked</div>
            </div>
            <div className="text-center px-4 py-2 bg-accent-50 rounded-xl">
              <div className="text-2xl font-bold text-accent-600">{totalPoints}</div>
              <div className="text-xs text-dark-400">Points</div>
            </div>
            <div className="text-center px-4 py-2 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-600">{totalCount}</div>
              <div className="text-xs text-dark-400">Total</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recently Unlocked */}
      {achievementsList.some(a => a.unlocked) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-dark-800 mb-3 flex items-center gap-2">
            <FaStar className="text-amber-500" /> Recently Unlocked
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {achievementsList.filter(a => a.unlocked).map(a => (
              <div
                key={a.id}
                className="flex-shrink-0 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-amber-100"
              >
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="font-medium text-dark-800 text-sm">{a.title}</p>
                  <p className="text-xs text-amber-600">+{a.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Achievements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold text-dark-800 mb-3 flex items-center gap-2">
          <FaTrophy className="text-primary-500" /> All Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {achievementsList.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleAchievement(achievement.id)}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 card-hover ${
                achievement.unlocked
                  ? 'bg-white border-amber-200 shadow-sm hover:shadow-md'
                  : 'bg-dark-50 border-dark-100 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Lock overlay */}
              {!achievement.unlocked && (
                <div className="absolute top-3 right-3">
                  <FaLock className="text-dark-300 text-sm" />
                </div>
              )}

              {/* Icon */}
              <div className={`text-4xl mb-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </div>

              {/* Content */}
              <h3 className={`font-semibold text-sm ${achievement.unlocked ? 'text-dark-800' : 'text-dark-400'}`}>
                {achievement.title}
              </h3>
              <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-dark-500' : 'text-dark-300'}`}>
                {achievement.description}
              </p>

              {/* Points */}
              <div className={`mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                achievement.unlocked
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-dark-100 text-dark-400'
              }`}>
                <FaMedal className="text-xs" />
                {achievement.points} pts
              </div>

              {/* Unlocked indicator */}
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center"
      >
        <p className="text-sm text-primary-700">
          💡 <span className="font-medium">Tip:</span> Complete various activities across the platform to unlock achievements and earn points!
        </p>
      </motion.div>
    </div>
  );
};

export default Achievements;
