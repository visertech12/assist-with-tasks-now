
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKycStatus } from '@/hooks/useKycStatus';
import { Loader } from 'lucide-react';

interface KycStatusGuardProps {
  allowedStatus: 'pending' | 'verified' | 'rejected';
  username?: string; // Make username optional with '?'
  children: React.ReactNode;
}

const KycStatusGuard: React.FC<KycStatusGuardProps> = ({ allowedStatus, username: propUsername, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Use provided username from props, or fall back to URL param
  const urlUsername = new URLSearchParams(location.search).get('username') || '';
  const username = propUsername || urlUsername;
  const { status, isLoading } = useKycStatus(username, false);

  useEffect(() => {
    if (isLoading || !status) return;

    // Skip redirection if the user is on the correct page for their status
    if (status === allowedStatus) return;

    // Handle redirection based on actual user status
    switch (status) {
      case 'pending':
        if (location.pathname !== '/pending-kyc') {
          navigate('/pending-kyc' + (username ? `?username=${username}` : ''));
        }
        break;
      case 'verified':
        if (location.pathname !== '/approved-kyc') {
          navigate('/approved-kyc' + (username ? `?username=${username}` : ''));
        }
        break;
      case 'rejected':
        if (location.pathname !== '/rejected-kyc') {
          navigate('/rejected-kyc' + (username ? `?username=${username}` : ''));
        }
        break;
      default:
        // For 'not_started' or any other status, don't redirect
        break;
    }
  }, [status, isLoading, navigate, allowedStatus, location.pathname, username]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-amber-500" />
          <p className="mt-4">Verifying your status...</p>
        </div>
      </div>
    );
  }

  // If the user's status matches the allowed status, render the children
  // Otherwise, this will be unmounted when the redirection happens
  return <>{children}</>;
};

export default KycStatusGuard;
