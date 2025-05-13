
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface PreloaderProps {
  text?: string;
}

const Preloader: React.FC<PreloaderProps> = ({ text = 'TradeX Pro KYC Portal' }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    // When progress reaches 100, start fade out
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }

    return () => clearInterval(interval);
  }, [progress]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="w-full h-full rounded-full border-t-4 border-blue-500 opacity-75"></div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-blue-600 text-white p-4 rounded-full z-10"
          >
            <Loader size={24} className="animate-spin" />
          </motion.div>
        </div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-white text-center"
        >
          {text}
        </motion.h1>
        
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-sm"
        >
          Loading {Math.round(progress)}%
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
