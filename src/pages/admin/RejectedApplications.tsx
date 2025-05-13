
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Eye, Loader2, RefreshCw } from 'lucide-react';

interface KycData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  status: string;
  updated_at: string;
}

const RejectedApplications = () => {
  const [applications, setApplications] = useState<KycData[]>([]);
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

    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_data')
        .select('*')
        .eq('status', 'rejected' as string)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setApplications(data as KycData[]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load rejected applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplication = (id: string) => {
    navigate(`/admin/applications/${id}`);
  };

  // Mobile card view of a single application
  const ApplicationCard = ({ app }: { app: KycData }) => (
    <Card className="bg-zinc-900 border-zinc-800 mb-4">
      <CardContent className="pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-white">{app.username}</span>
          <Badge variant="secondary" className="bg-red-500/20 text-red-500 border-red-500/40">
            {app.status}
          </Badge>
        </div>
        <p className="text-sm text-zinc-300">{app.first_name} {app.last_name}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-400">
            {new Date(app.updated_at).toLocaleDateString()}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewApplication(app.id)}
            className="border-zinc-700 hover:bg-zinc-800 flex items-center gap-1"
          >
            <Eye size={14} />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Skeleton loader for mobile card view
  const CardSkeleton = () => (
    <Card className="bg-zinc-900 border-zinc-800 mb-4">
      <CardContent className="pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24 bg-zinc-800" />
          <Skeleton className="h-6 w-16 bg-zinc-800" />
        </div>
        <Skeleton className="h-5 w-36 bg-zinc-800" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20 bg-zinc-800" />
          <Skeleton className="h-8 w-16 bg-zinc-800" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">Rejected Applications</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchApplications}
            className="border-zinc-700 hover:bg-zinc-800 flex items-center gap-1"
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

        {isLoading ? (
          isMobile ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <p className="mt-2 text-sm text-zinc-400">Loading applications...</p>
              </div>
            </div>
          )
        ) : applications.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
            <p className="text-zinc-400">No rejected applications found</p>
          </div>
        ) : isMobile ? (
          <div className="space-y-2">
            {applications.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-zinc-800 overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-900">
                <TableRow>
                  <TableHead className="text-zinc-400">Username</TableHead>
                  <TableHead className="text-zinc-400">Full Name</TableHead>
                  <TableHead className="text-zinc-400">Date of Birth</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Last Updated</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id} className="bg-zinc-950 border-zinc-800">
                    <TableCell className="font-medium text-white">{app.username}</TableCell>
                    <TableCell className="text-zinc-300">{app.first_name} {app.last_name}</TableCell>
                    <TableCell className="text-zinc-300">{app.date_of_birth}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-500/20 text-red-500 border-red-500/40">
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {new Date(app.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewApplication(app.id)}
                        className="border-zinc-700 hover:bg-zinc-800 flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RejectedApplications;
