
import React from 'react';
import { motion } from 'framer-motion';
import { User, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UsernameInputStepProps {
  username: string;
  setUsername: (username: string) => void;
  onContinue: () => void;
}

const UsernameInputStep = ({ username, setUsername, onContinue }: UsernameInputStepProps) => {
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && username.trim()) {
      onContinue();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400/10 mb-4">
            <User className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold">Welcome to KYC Verification</h2>
          <p className="text-gray-400 mt-2">Let's verify your identity to secure your account</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="username">Username or Email</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Enter the username or email associated with your account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="username"
                value={username}
                onChange={handleUsernameChange}
                onKeyDown={handleKeyDown}
                placeholder="john.doe@example.com"
                className="bg-zinc-800 border-gray-700 pl-10"
              />
            </div>
          </div>
          
          <Button 
            type="button" 
            onClick={onContinue}
            disabled={!username.trim()}
            className="w-full bg-amber-400 text-black hover:bg-amber-500"
          >
            Continue
          </Button>

          <div className="text-xs text-center text-gray-500 mt-4">
            <p>By continuing, you agree to our <a href="#" className="text-amber-400 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-400 hover:underline">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UsernameInputStep;
