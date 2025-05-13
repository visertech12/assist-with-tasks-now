
import React from 'react';
import { Shield, Check, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const WhyKycSection = () => {
  const benefits = [
    {
      title: "Enhanced Security",
      description: "Protect your account from unauthorized access and fraud",
      icon: Shield,
    },
    {
      title: "Regulatory Compliance",
      description: "Meet global standards for financial transactions",
      icon: Check,
    },
    {
      title: "Higher Transaction Limits",
      description: "Enjoy increased deposit and withdrawal limits",
      icon: AlertTriangle,
    },
    {
      title: "Full Feature Access",
      description: "Unlock all platform features and services",
      icon: Lock,
    },
  ];

  return (
    <Card className="border-amber-500/30 bg-zinc-900 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Why KYC Verification?</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700 hover:border-amber-500/30 transition-colors cursor-pointer"
            >
              <div className="bg-amber-400/10 p-2 rounded-full">
                <benefit.icon className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{benefit.title}</h4>
                <p className="text-xs text-gray-400">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhyKycSection;
