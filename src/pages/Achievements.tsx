
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AchievementCard from '@/components/AchievementCard';
import AchievementBadge from '@/components/AchievementBadge';
import { Zap, Star, TrendingUp, ArrowUp, Award, Filter } from 'lucide-react';
import { toast } from 'sonner';
import NavigationBar from '@/components/NavigationBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Achievements = () => {
  const [displayedAchievements, setDisplayedAchievements] = useState<string>('all');
  const isMobile = useIsMobile();

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

  // Filter categories for the UI
  const filterCategories = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'trading', label: 'Trading' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'social', label: 'Social' },
    { id: 'special', label: 'Special' }
  ];

  // Mobile filter sheet content
  const FilterSheetContent = () => (
    <div className="pt-6">
      <h3 className="text-lg font-semibold mb-4 px-2">Filter Achievements</h3>
      <div className="flex flex-col gap-2 p-2">
        {filterCategories.map(category => (
          <button
            key={category.id}
            className={`w-full text-left px-4 py-3 rounded-lg ${
              displayedAchievements === category.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-zinc-800 text-gray-300'
            }`}
            onClick={() => {
              setDisplayedAchievements(category.id);
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-b from-black to-zinc-900 pt-6 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">Your Achievements</h1>
          <p className="text-gray-400 mt-1">Track your progress and earn rewards</p>
          
          {/* Badge Showcase - Horizontal scrollable on mobile */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <AchievementBadge icon={<Award className="text-white" />} variant="gold" delay={0.1} />
            <AchievementBadge icon={<Star className="text-white" />} variant="premium" delay={0.2} />
            <AchievementBadge icon={<TrendingUp className="text-white" />} delay={0.3} />
            <AchievementBadge icon={<Zap className="text-white" />} delay={0.4} />
          </div>
        </div>
      </div>
      
      {/* Filter Controls - Desktop vs Mobile */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        {isMobile ? (
          <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-300">
              {displayedAchievements === 'all' ? 'All Achievements' : 
               displayedAchievements === 'completed' ? 'Completed' :
               displayedAchievements === 'in-progress' ? 'In Progress' :
               `${displayedAchievements.charAt(0).toUpperCase() + displayedAchievements.slice(1)}`}
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-zinc-800 p-2 rounded-md"
                >
                  <Filter size={20} className="text-gray-300" />
                </motion.button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-zinc-900 text-white border-t border-zinc-800">
                <FilterSheetContent />
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-4 shadow-lg">
            <div className="flex flex-wrap gap-2">
              {filterCategories.map(category => (
                <FilterButton 
                  key={category.id}
                  active={displayedAchievements === category.id} 
                  onClick={() => setDisplayedAchievements(category.id)}
                >
                  {category.label}
                </FilterButton>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Achievements Grid - Single column on mobile, multi-column on larger screens */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
