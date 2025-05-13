
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Clock, UserCheck } from 'lucide-react';

const VerificationTimeline = () => {
  const steps = [
    {
      title: "Document Submission",
      description: "Upload your ID documents and take a selfie",
      icon: FileText,
      color: "bg-amber-400",
    },
    {
      title: "Information Review",
      description: "Provide your personal information for verification",
      icon: UserCheck,
      color: "bg-amber-400",
    },
    {
      title: "Verification Processing",
      description: "Our team verifies your identity (24-48 hours)",
      icon: Clock,
      color: "bg-zinc-600",
    },
    {
      title: "Verification Complete",
      description: "Your identity is verified and your account is upgraded",
      icon: CheckCircle,
      color: "bg-zinc-600",
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Verification Process</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-start gap-3"
          >
            <div className={`${step.color} p-2 rounded-full flex-shrink-0`}>
              <step.icon className="h-4 w-4 text-black" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{step.title}</p>
              <p className="text-xs text-gray-400">{step.description}</p>
            </div>
          </motion.div>
        ))}

        <div className="mt-4 border-l-2 border-dashed border-zinc-700 ml-4 pl-4 py-2">
          <p className="text-xs text-gray-400 italic">
            Complete the verification process to unlock full account functionality and higher transaction limits
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationTimeline;
