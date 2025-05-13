
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { KycFormData } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, Image, Loader2, ZoomIn } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'; 

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<KycFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }

    if (id) {
      fetchApplicationDetails(id);
    }
  }, [id, navigate]);

  const fetchApplicationDetails = async (applicationId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_data')
        .select('*')
        .eq('id', applicationId as string)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setApplication({
          username: data.username as string,
          firstName: data.first_name as string,
          lastName: data.last_name as string,
          dateOfBirth: data.date_of_birth as string,
          address: data.address as string,
          city: data.city as string,
          country: data.country as string,
          postalCode: data.postal_code as string,
          phoneNumber: data.phone_number as string,
          idCardFront: data.id_card_front as string | null,
          idCardBack: data.id_card_back as string | null,
          selfieImage: data.selfie_image as string | null,
          termsAccepted: data.terms_accepted || false
        });
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to load application details');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (status: 'verified' | 'rejected') => {
    if (!id) return;
    
    setIsProcessing(true);
    try {
      // Create update data with the new status and timestamp
      const updateData = { 
        status: status as string,
        updated_at: new Date().toISOString()
      };
      
      // Log the update operation for debugging
      console.log(`Updating application ${id} with status: ${status}`);
      console.log('Update data:', updateData);
      
      // Perform the update operation
      const { error } = await supabase
        .from('kyc_data')
        .update(updateData)
        .eq('id', id as string);
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      toast.success(`Application ${status === 'verified' ? 'approved' : 'rejected'} successfully`);
      
      // Add a short delay before navigation to ensure the update is processed
      setTimeout(() => {
        // Redirect to the appropriate page based on the status
        if (status === 'verified') {
          navigate('/admin/approved');
        } else {
          navigate('/admin/rejected');
        }
      }, 500);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="mt-2 text-sm text-zinc-400">Loading application details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout>
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-6">Application Not Found</h1>
          <Button onClick={() => navigate('/admin/pending')} variant="outline" className="flex items-center gap-2 border-zinc-700">
            <ArrowLeft size={16} />
            Back to Pending Applications
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 pb-20 md:pb-6">
        {!isMobile && (
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => navigate('/admin/pending')} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 border-zinc-700"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Application Details</h1>
          </div>
        )}

        <Card className="bg-zinc-900 border-zinc-800 mb-4 md:mb-6">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Username</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.username}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Full Name</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.firstName} {application?.lastName}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Date of Birth</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Phone Number</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.phoneNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 mb-4 md:mb-6">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl text-white">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Address</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.address}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">City</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.city}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Country</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.country}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Postal Code</p>
                <p className="text-sm md:text-base text-white font-medium">{application?.postalCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 mb-4 md:mb-6">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl text-white">Verification Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {application?.idCardFront && (
                <div>
                  <p className="text-xs md:text-sm text-zinc-400 mb-2">ID Card (Front)</p>
                  <div className="bg-zinc-800 rounded-md overflow-hidden h-[250px] md:h-[300px] relative group">
                    <OptimizedImage
                      src={application.idCardFront}
                      alt="ID Card Front"
                      className="w-full h-full"
                      objectFit="contain"
                      priority={true}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white" 
                        onClick={() => setZoomedImage(application.idCardFront)}
                      >
                        <ZoomIn className="h-5 w-5 mr-2" />
                        View Larger
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {application?.idCardBack && (
                <div>
                  <p className="text-xs md:text-sm text-zinc-400 mb-2">ID Card (Back)</p>
                  <div className="bg-zinc-800 rounded-md overflow-hidden h-[250px] md:h-[300px] relative group">
                    <OptimizedImage
                      src={application.idCardBack}
                      alt="ID Card Back"
                      className="w-full h-full"
                      objectFit="contain"
                      priority={true}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white" 
                        onClick={() => setZoomedImage(application.idCardBack)}
                      >
                        <ZoomIn className="h-5 w-5 mr-2" />
                        View Larger
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {application?.selfieImage && (
                <div>
                  <p className="text-xs md:text-sm text-zinc-400 mb-2">Selfie</p>
                  <div className="bg-zinc-800 rounded-md overflow-hidden h-[250px] md:h-[300px] relative group">
                    <OptimizedImage
                      src={application.selfieImage}
                      alt="Selfie"
                      className="w-full h-full"
                      objectFit="contain"
                      priority={true}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white" 
                        onClick={() => setZoomedImage(application.selfieImage)}
                      >
                        <ZoomIn className="h-5 w-5 mr-2" />
                        View Larger
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {(!application?.idCardFront && !application?.idCardBack && !application?.selfieImage) && (
                <div className="col-span-3 flex flex-col items-center justify-center p-8 bg-zinc-800/50 rounded-lg">
                  <Image className="h-16 w-16 text-zinc-500 mb-4" />
                  <p className="text-zinc-400 text-center">No verification documents uploaded</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className={`flex gap-4 border-t border-zinc-800 pt-4 md:pt-6 ${isMobile ? 'fixed bottom-0 left-0 w-full z-10 bg-zinc-900 px-4 py-3' : ''}`}>
            <Button
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => updateApplicationStatus('verified')}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              Approve
            </Button>
            <Button
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => updateApplicationStatus('rejected')}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Reject
            </Button>
          </CardFooter>
        </Card>

        {/* Image Zoom Dialog */}
        <Dialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
          <DialogContent className="sm:max-w-4xl bg-zinc-900 p-0 border-zinc-800">
            <div className="p-6">
              <DialogTitle className="text-lg font-medium">Document Preview</DialogTitle>
            </div>
            <div className="bg-black flex items-center justify-center" style={{ height: '80vh' }}>
              {zoomedImage && (
                <OptimizedImage
                  src={zoomedImage}
                  alt="Zoomed document"
                  className="max-w-full max-h-full object-contain"
                  objectFit="contain"
                  priority={true}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetail;
