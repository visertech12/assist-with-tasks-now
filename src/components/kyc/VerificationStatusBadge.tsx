
import React from 'react';
import { Check, Clock, X, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not_started';

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
}

const VerificationStatusBadge = ({ status }: VerificationStatusBadgeProps) => {
  let icon;
  let label;
  let bgColor;
  let textColor;
  let tooltipText;

  switch (status) {
    case 'verified':
      icon = <Check className="h-3 w-3" />;
      label = 'Verified';
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-500';
      tooltipText = 'Your identity has been successfully verified';
      break;
    case 'pending':
      icon = <Clock className="h-3 w-3" />;
      label = 'Pending';
      bgColor = 'bg-amber-500/20';
      textColor = 'text-amber-500';
      tooltipText = 'Your verification is being processed';
      break;
    case 'rejected':
      icon = <X className="h-3 w-3" />;
      label = 'Rejected';
      bgColor = 'bg-red-500/20';
      textColor = 'text-red-500';
      tooltipText = 'Your verification was rejected. Please resubmit';
      break;
    case 'not_started':
    default:
      icon = <AlertTriangle className="h-3 w-3" />;
      label = 'Not Verified';
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
      tooltipText = 'Please complete identity verification';
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${bgColor} ${textColor} text-xs font-medium`}>
            {icon}
            <span>{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationStatusBadge;
