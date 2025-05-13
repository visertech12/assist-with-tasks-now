
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AchievementCard from '@/components/AchievementCard';
import AchievementBadge from '@/components/AchievementBadge';
import { Zap, Star, TrendingUp, ArrowUp, Award } from 'lucide-react';
import { toast } from 'sonner';

const Achievements = () => {
  const [displayedAchievements, setDisplayedAchievements] = useState<string>('all');

  // Sample achievement data
  const achievements = [
    {
      id: 1,
      title: "First Trade",
      icon: <TrendingUp className="text-blue-400" />,
      description: "Complete your first trade on the platform",
      reward: "50 XP",
      completed: true,
      progress: 100,
      animation: "pulse",
      category: "trading",
      dateEarned: "2023-04-15",
      difficulty: "easy",
      pointsValue: 50,
      completedBy: 15423,
      unlockRequirement: "Make your first trade"
    },
    {
      id: 2,
      title: "Diamond Hands",
      icon: <Star className="text-amber-400" />,
      description: "Hold your assets for 30 consecutive days",
      reward: "100 XP + Badge",
      completed: false,
      progress: 70,
      animation: "bounce",
      category: "trading",
      difficulty: "medium",
      pointsValue: 100,
      completedBy: 5821,
      streak: 21,
      unlockRequirement: "Hold assets for 30 days"
    },
    {
      id: 3,
      title: "Verified Trader",
      icon: <Award className="text-green-400" />,
      description: "Complete KYC verification process",
      reward: "200 XP",
      completed: true,
      progress: 100,
      animation: "glow",
      category: "deposit",
      dateEarned: "2023-05-02",
      difficulty: "easy",
      pointsValue: 200,
      completedBy: 12850,
      unlockRequirement: "Complete KYC verification"
    },
    {
      id: 4,
      title: "Trading Guru",
      icon: <ArrowUp className="text-purple-400" />,
      description: "Complete 100 successful trades",
      reward: "500 XP + Special Badge",
      completed: false,
      progress: 35,
      animation: "float",
      category: "trading",
      difficulty: "hard",
      pointsValue: 500,
      nextMilestone: "35/100 trades",
      unlockRequirement: "Complete 100 trades"
    },
    {
      id: 5,
      title: "Crypto Master",
      icon: <Zap className="text-pink-400" />,
      description: "Trade with 10 different cryptocurrencies",
      reward: "300 XP",
      completed: false,
      progress: 60,
      animation: "rotate",
      category: "special",
      difficulty: "medium",
      pointsValue: 300,
      nextMilestone: "6/10 cryptocurrencies",
      unlockRequirement: "Trade 10 different cryptos"
    }
  ];

  // Filter achievements based on category selection
  const filteredAchievements = achievements.filter(achievement => {
    if (displayedAchievements === 'all') return true;
    if (displayedAchievements === 'completed') return achievement.completed;
    if (displayedAchievements === 'in-progress') return !achievement.completed;
    return achievement.category === displayedAchievements;
  });

  // Handler for claiming rewards
  const handleClaimReward = (id: number) => {
    toast.success(`Reward claimed for ${achievements.find(a => a.id === id)?.title}!`, {
      description: "Your rewards have been added to your account."
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-black to-zinc-900 pt-8 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Your Achievements</h1>
          <p className="text-gray-400 mt-2">Track your progress and earn rewards</p>
          
          {/* Badge Showcase */}
          <div className="flex flex-wrap gap-2 mt-6">
            <AchievementBadge icon={<Award className="text-white" />} variant="gold" delay={0.1} />
            <AchievementBadge icon={<Star className="text-white" />} variant="premium" delay={0.2} />
            <AchievementBadge icon={<TrendingUp className="text-white" />} delay={0.3} />
            <AchievementBadge icon={<Zap className="text-white" />} delay={0.4} />
          </div>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-6">
        <div className="bg-zinc-900 rounded-xl p-4 shadow-lg">
          <div className="flex flex-wrap gap-2">
            <FilterButton 
              active={displayedAchievements === 'all'} 
              onClick={() => setDisplayedAchievements('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={displayedAchievements === 'completed'} 
              onClick={() => setDisplayedAchievements('completed')}
            >
              Completed
            </FilterButton>
            <FilterButton 
              active={displayedAchievements === 'in-progress'} 
              onClick={() => setDisplayedAchievements('in-progress')}
            >
              In Progress
            </FilterButton>
            <FilterButton 
              active={displayedAchievements === 'trading'} 
              onClick={() => setDisplayedAchievements('trading')}
            >
              Trading
            </FilterButton>
            <FilterButton 
              active={displayedAchievements === 'deposit'} 
              onClick={() => setDisplayedAchievements('deposit')}
            >
              Deposit
            </FilterButton>
            <FilterButton 
              active={displayedAchievements === 'social'} 
              onClick={() => setDisplayedAchievements('social')}
            >
              Social
            </FilterButton>
            <FilterButton 
              active={displayedAchievements === 'special'} 
              onClick={() => setDisplayedAchievements('special')}
            >
              Special
            </FilterButton>
          </div>
        </div>
      </div>
      
      {/* Achievements Grid */}
      <div className="max-w-6xl mx-auto mt-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => (
            <AchievementCard 
              key={achievement.id}
              achievement={achievement}
              onClaim={() => handleClaimReward(achievement.id)}
            />
          ))}
        </div>
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No achievements found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Filter button component
interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const FilterButton = ({ children, active, onClick }: FilterButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
      active ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
    }`}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default Achievements;
