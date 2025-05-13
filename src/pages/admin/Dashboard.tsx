
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, XCircle, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch total KYC applications
      const { count: total } = await supabase
        .from('kyc_data')
        .select('*', { count: 'exact', head: true });

      // Fetch pending applications
      const { count: pending } = await supabase
        .from('kyc_data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch approved applications
      const { count: approved } = await supabase
        .from('kyc_data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verified');

      // Fetch rejected applications
      const { count: rejected } = await supabase
        .from('kyc_data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      setStats({
        total: total || 0,
        pending: pending || 0, 
        approved: approved || 0,
        rejected: rejected || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplications = (status: string) => {
    switch (status) {
      case 'pending':
        navigate('/admin/pending');
        break;
      case 'approved':
        navigate('/admin/approved');
        break;
      case 'rejected':
        navigate('/admin/rejected');
        break;
      default:
        break;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
          <Button 
            onClick={fetchStats} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={isMobile ? 14 : 16} className="animate-spin" />
            ) : (
              <RefreshCw size={isMobile ? 14 : 16} />
            )}
            {!isMobile && "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800/60 transition-colors"
            onClick={() => navigate('/admin/pending')}
          >
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-zinc-400">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 md:h-6 md:w-6 mr-2 text-amber-500" />
                <span className="text-xl md:text-2xl font-bold text-white">{isLoading ? '-' : stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800/60 transition-colors"
            onClick={() => handleViewApplications('pending')}
          >
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-zinc-400">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 md:h-6 md:w-6 mr-2 text-amber-500" />
                <span className="text-xl md:text-2xl font-bold text-white">{isLoading ? '-' : stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800/60 transition-colors"
            onClick={() => handleViewApplications('approved')}
          >
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-zinc-400">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 mr-2 text-green-500" />
                <span className="text-xl md:text-2xl font-bold text-white">{isLoading ? '-' : stats.approved}</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800/60 transition-colors"
            onClick={() => handleViewApplications('rejected')}
          >
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-zinc-400">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 md:h-6 md:w-6 mr-2 text-red-500" />
                <span className="text-xl md:text-2xl font-bold text-white">{isLoading ? '-' : stats.rejected}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {isMobile && (
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500">Tip: Tap on any card to view details</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
