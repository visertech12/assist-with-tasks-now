import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar, Users, TrendingUp, Clock, Award, Star, BadgeDollarSign, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type Achievement = {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  reward: string;
  completed: boolean;
  progress: number;
  animation: string;
  category: string;
  dateEarned?: string;
  difficulty?: string;
  pointsValue?: number;
  completedBy?: number;
  streak?: number;
  nextMilestone?: string;
  unlockRequirement?: string;
};

interface AchievementCardProps {
  achievement: Achievement;
  onClaim: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClaim }) => {
  const isMobile = useIsMobile();
  
  const getAnimationProps = () => {
    switch (achievement.animation) {
      case 'pulse':
        return {
          animate: {
            scale: [1, 1.02, 1],
            transition: { repeat: Infinity, duration: 3 }
          }
        };
      case 'bounce':
        return {
          animate: {
            y: [0, -3, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        };
      case 'rotate':
        return {
          animate: {
            rotate: [0, 2, 0, -2, 0],
            transition: { repeat: Infinity, duration: 5 }
          }
        };
      case 'glow':
        return {
          animate: {
            boxShadow: ['0 0 0px rgba(245, 158, 11, 0)', '0 0 5px rgba(245, 158, 11, 0.2)', '0 0 0px rgba(245, 158, 11, 0)'],
            transition: { repeat: Infinity, duration: 2.5 }
          }
        };
      case 'float':
        return {
          animate: {
            y: [0, -2, 0],
            transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
          }
        };
      case 'shine':
        return {
          className: "overflow-hidden achievement-shine"
        };
      default:
        return {};
    }
  };

  const difficultyColor = () => {
    switch (achievement.difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-orange-400';
      case 'expert':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getBorderColor = () => {
    if (achievement.completed) {
      return 'border-amber-400';
    }
    
    switch (achievement.category) {
      case 'trading':
        return 'border-blue-400';
      case 'deposit':
        return 'border-amber-400';
      case 'social':
        return 'border-purple-400';
      case 'special':
        return 'border-pink-400';
      default:
        return 'border-gray-800';
    }
  };

  const getBackgroundGradient = () => {
    if (achievement.completed) {
      return 'bg-gradient-to-br from-zinc-900 to-zinc-950';
    }
    
    switch (achievement.category) {
      case 'trading':
        return 'bg-gradient-to-br from-zinc-900 to-zinc-950 via-blue-950/10';
      case 'deposit':
        return 'bg-gradient-to-br from-zinc-900 to-zinc-950 via-amber-950/10';
      case 'social':
        return 'bg-gradient-to-br from-zinc-900 to-zinc-950 via-purple-950/10';
      case 'special':
        return 'bg-gradient-to-br from-zinc-900 to-zinc-950 via-pink-950/10';
      default:
        return 'bg-gradient-to-br from-zinc-900 to-zinc-950';
    }
  };

  return (
    <motion.div 
      className={cn(
        `rounded-xl p-3 md:p-4 border-2 relative overflow-hidden`,
        getBorderColor(),
        getBackgroundGradient(),
        achievement.completed ? 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' : ''
      )}
      whileHover={{ scale: isMobile ? 1 : 1.01, y: isMobile ? 0 : -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      {...getAnimationProps()}
    >
      {/* Background pattern for visual interest - hidden on mobile */}
      {!isMobile && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="8"/>
            <path d="M20 20L60 60" stroke="currentColor" strokeWidth="8"/>
            <path d="M60 20L20 60" stroke="currentColor" strokeWidth="8"/>
          </svg>
        </div>
      )}
      
      {/* Status indicator */}
      {achievement.completed && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3">
          <motion.div 
            className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-amber-400"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 md:gap-3 mb-2">
        <motion.div 
          className={cn(
            "p-2 md:p-3 rounded-lg md:rounded-xl",
            achievement.completed ? "bg-amber-400/10" : "bg-black"
          )} 
          whileHover={{ rotate: isMobile ? 0 : 10 }}
        >
          {achievement.icon}
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-sm md:text-base flex items-center gap-1 md:gap-2">
            {achievement.title}
            {achievement.completed && (
              <motion.span 
                className="text-xs bg-amber-400 text-black px-1.5 py-0.5 rounded-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                Completed
              </motion.span>
            )}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm line-clamp-2">{achievement.description}</p>
        </div>
      </div>
      
      {/* Achievement metadata - simplified on mobile */}
      <div className="mt-2 md:mt-3 grid grid-cols-2 gap-1 md:gap-2 text-xs text-gray-400">
        {achievement.difficulty && (
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span className={difficultyColor()}>
              {achievement.difficulty.charAt(0).toUpperCase() + achievement.difficulty.slice(1)}
            </span>
          </div>
        )}
        
        {achievement.pointsValue && (
          <div className="flex items-center gap-1">
            <BadgeDollarSign size={12} className="text-amber-400" />
            <span className="text-amber-400">{achievement.pointsValue} pts</span>
          </div>
        )}
        
        {/* Show fewer metadata items on mobile */}
        {!isMobile && achievement.dateEarned && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{achievement.dateEarned}</span>
          </div>
        )}
        
        {!isMobile && achievement.completedBy && (
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{achievement.completedBy.toLocaleString()} users</span>
          </div>
        )}
        
        {achievement.streak && (
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-blue-400" />
            <span className="text-blue-400">{achievement.streak} day streak</span>
          </div>
        )}
        
        {achievement.nextMilestone && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-purple-400" />
            <span className="text-purple-400">Next: {achievement.nextMilestone}</span>
          </div>
        )}
      </div>

      {/* Unlock requirement - show only if not completed */}
      {achievement.unlockRequirement && !achievement.completed && (
        <div className="mt-2 bg-zinc-800/50 rounded-lg p-1.5 md:p-2 text-xs">
          <div className="flex items-center gap-1">
            <Award size={12} className="text-gray-400" />
            <span className="text-gray-400 line-clamp-1">Requirement: {achievement.unlockRequirement}</span>
          </div>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="mt-2 md:mt-3">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className={achievement.progress === 100 ? "text-amber-400" : "text-blue-400"}>{achievement.progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div 
            className={cn(
              "h-2 rounded-full", 
              achievement.completed ? "bg-amber-400" : "bg-blue-400"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${achievement.progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          ></motion.div>
        </div>
      </div>
      
      {/* Claim button and reward */}
      <div className="mt-2 md:mt-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-amber-400" />
          <span className="text-xs md:text-sm font-medium text-amber-400 line-clamp-1">Reward: {achievement.reward}</span>
        </div>
        
        {achievement.completed ? (
          <Link to="/win" onClick={(e) => { e.preventDefault(); onClaim(); }}>
            <Button 
              size={isMobile ? "sm" : "default"} 
              variant="outline" 
              className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black text-xs md:text-sm py-1 px-2 md:px-3 h-auto"
            >
              Claim
            </Button>
          </Link>
        ) : (
          <Button 
            size={isMobile ? "sm" : "default"}
            variant="outline" 
            className="border-gray-700 text-gray-500 text-xs md:text-sm py-1 px-2 md:px-3 h-auto" 
            disabled
          >
            Incomplete
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementCard;
