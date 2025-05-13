
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  icon: React.ReactNode;
  delay?: number;
  variant?: 'default' | 'premium' | 'gold';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  icon, 
  delay = 0,
  variant = 'default' 
}) => {
  const getBadgeStyles = () => {
    switch(variant) {
      case 'premium':
        return "bg-gradient-to-br from-violet-500 to-purple-500 border-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]";
      case 'gold':
        return "bg-gradient-to-br from-amber-400 to-yellow-500 border-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
      default:
        return "bg-gradient-to-br from-zinc-900 to-black border-lime-400";
    }
  };

  return (
    <motion.div
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl border-2 z-10",
        getBadgeStyles()
      )}
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: delay
      }}
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        zIndex: 20,
        boxShadow: variant === 'premium' ? "0 0 12px rgba(139,92,246,0.5)" : 
                   variant === 'gold' ? "0 0 12px rgba(245,158,11,0.5)" : 
                   "0 0 12px rgba(163, 230, 53, 0.5)" 
      }}
    >
      <div className="scale-75">
        {icon}
      </div>
    </motion.div>
  );
};

export default AchievementBadge;
