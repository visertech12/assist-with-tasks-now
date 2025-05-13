
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface VerificationSuccessStepProps {
  username: string;
}

const VerificationSuccessStep = ({ username }: VerificationSuccessStepProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800 text-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4 achievement-shine">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold">Verification Submitted</h2>
          <p className="text-gray-400 mt-2">Thank you for completing your KYC verification</p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-medium">Verification in Progress</h3>
          </div>
          <p className="text-xs text-gray-400 text-left">
            We are reviewing your documents. This process typically takes 24-48 hours. 
            You will receive an email notification once your verification is complete.
          </p>
        </div>

        <div className="border-t border-gray-800 pt-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-4">
            <span>User ID:</span>
            <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-amber-400">{username}</span>
          </div>
          <div className="flex items-center gap-2 text-center justify-center text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Your data is encrypted and securely stored</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full bg-amber-400 text-black hover:bg-amber-500">
            <Link to="https://trade-x-pro.com/wallets">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
      
      <div className="bg-zinc-900/60 rounded-xl p-4 border border-gray-800">
        <h3 className="text-sm font-medium mb-2">What happens next?</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <div className="mt-0.5 min-w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
              <span className="text-amber-400 text-xs">1</span>
            </div>
            <p className="text-gray-300">Our team reviews your submitted documents</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 min-w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
              <span className="text-amber-400 text-xs">2</span>
            </div>
            <p className="text-gray-300">You'll receive an email with verification results</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 min-w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
              <span className="text-amber-400 text-xs">3</span>
            </div>
            <p className="text-gray-300">Once approved, you'll have full access to all platform features</p>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default VerificationSuccessStep;
