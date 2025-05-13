
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

export const useKycStatus = (username: string, redirectOnStatus = true) => {
  const [status, setStatus] = useState<KycStatus>('not_started');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!username) {
          setStatus('not_started');
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('kyc_data')
          .select('status')
          .eq('username', username)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No data found - user hasn't started KYC
            setStatus('not_started');
          } else {
            console.error('Error checking KYC status:', error);
            setError('Failed to check KYC status');
          }
        } else if (data) {
          setStatus((data.status as KycStatus) || 'not_started');
          
          // Redirect based on status if redirectOnStatus is true
          if (redirectOnStatus) {
            const query = username ? `?username=${encodeURIComponent(username)}` : '';
            
            switch (data.status) {
              case 'pending':
                navigate(`/pending-kyc${query}`);
                break;
              case 'verified':
                navigate(`/approved-kyc${query}`);
                break;
              case 'rejected':
                navigate(`/rejected-kyc${query}`);
                break;
              default:
                // If status is not set or is 'not_started', stay on current page
                break;
            }
          }
        } else {
          setStatus('not_started');
        }
      } catch (err) {
        console.error('Error in KYC status check:', err);
        setError('Failed to check KYC status');
      } finally {
        setIsLoading(false);
      }
    };

    checkKycStatus();
  }, [username, navigate, redirectOnStatus]);

  return { status, isLoading, error };
};
