
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, BookOpen, Home } from 'lucide-react';

const NavigationBar = () => {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 py-3 px-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-xl flex items-center">
          <motion.div 
            className="bg-blue-600 p-1 rounded mr-2"
            whileHover={{ rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home className="h-5 w-5" />
          </motion.div>
          CryptoKYC
        </Link>
        
        <div className="flex items-center gap-1 md:gap-4">
          <NavLink to="/achievements">
            <Award className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Achievements</span>
          </NavLink>
          
          <NavLink to="/help">
            <BookOpen className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Help</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => (
  <Link to={to}>
    <motion.div 
      className="flex items-center py-1 px-3 text-gray-300 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.div>
  </Link>
);

export default NavigationBar;
