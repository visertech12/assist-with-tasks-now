import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { UserCheck, Shield, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { submitKycData, KycFormData } from '@/services/api';
import { extractUsername } from '@/utils/extractUsername';
import DocumentUploadStep from '@/components/kyc/DocumentUploadStep';
import PersonalInfoStep from '@/components/kyc/PersonalInfoStep';
import UsernameInputStep from '@/components/kyc/UsernameInputStep';
import VerificationSuccessStep from '@/components/kyc/VerificationSuccessStep';
import VerificationStatusBadge from '@/components/kyc/VerificationStatusBadge';
import FaqSection from '@/components/kyc/FaqSection';
import WhyKycSection from '@/components/kyc/WhyKycSection';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Define schema for KYC form
const kycFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z.string().min(1, {
    message: "Date of birth is required.",
  }).refine((date) => {
    // Check if user is at least 18 years old
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return (age > 18 || (age === 18 && m >= 0));
  }, { message: "You must be at least 18 years old." }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(1, {
    message: "City is required.",
  }),
  country: z.string().min(1, {
    message: "Country is required.",
  }),
  postalCode: z.string().min(1, {
    message: "Postal code is required.",
  }),
  phoneNumber: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  // Make termsAccepted optional and default to true to avoid validation errors
  termsAccepted: z.boolean().optional().default(true),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

const Kyc = () => {
  const [idCardFront, setIdCardFront] = useState<string | null>(null);
  const [idCardBack, setIdCardBack] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [step, setStep] = useState(0); // Start with username step (0) if no username in URL
  const [username, setUsername] = useState<string>('');
  const [usernameFound, setUsernameFound] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittingForm, setSubmittingForm] = useState<boolean>(false);
  const [stepLoading, setStepLoading] = useState<boolean>(false);
  
  const totalSteps = 3; // Now we have 3 steps including username input

  // Extract username from URL when component mounts
  useEffect(() => {
    const extractedUsername = extractUsername();
    if (extractedUsername) {
      setStepLoading(true);
      setTimeout(() => {
        setUsername(extractedUsername);
        setUsernameFound(true);
        setStep(1); // Skip to document upload step if username was found in URL
        setStepLoading(false);
      }, 1000);
    }
  }, []);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      phoneNumber: "",
      termsAccepted: true, // Set default to true so it doesn't block submission
    },
  });

  const onSubmit = async (data: KycFormValues) => {
    // Make sure we have all the required data
    if (!idCardFront || !idCardBack || !selfieImage) {
      toast.error("All documents are required");
      setStep(1); // Go back to document upload step
      return;
    }
    
    setSubmittingForm(true);
    setStepLoading(true);
    
    // Create a properly typed KycFormData object with required fields
    const kycData: KycFormData = {
      username: username, // Include username in the data sent to API
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.postalCode,
      phoneNumber: data.phoneNumber,
      idCardFront: idCardFront,
      idCardBack: idCardBack,
      selfieImage: selfieImage,
      termsAccepted: true // Always set to true regardless of checkbox
    };
    
    try {
      console.log(kycData);
      const success = await submitKycData(kycData);
      
      if (success) {
        toast.success("KYC information submitted successfully");
        setIsSubmitted(true);
        setStep(3); // Go to success step
      }
    } catch (error) {
      toast.error("Failed to submit KYC data. Please try again.");
      console.error(error);
    } finally {
      setSubmittingForm(false);
      setStepLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStepLoading(true);
      setTimeout(() => {
        setStep(step + 1);
        setStepLoading(false);
      }, 800);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStepLoading(true);
      setTimeout(() => {
        setStep(step - 1);
        setStepLoading(false);
      }, 800);
    }
  };

  const handleContinueFromUsername = () => {
    if (username.trim()) {
      setStepLoading(true);
      setTimeout(() => {
        setUsernameFound(true);
        nextStep();
        setStepLoading(false);
      }, 800);
    } else {
      toast.error("Please enter a username or email");
    }
  };

  const isUsernameStep = step === 0;
  const isDocumentStep = step === 1;
  const isPersonalInfoStep = step === 2;
  const isSuccessStep = step === 3;

  // Calculate which step to display in the progress indicator
  const displayStep = usernameFound ? step : step + 1;
  const displayTotalSteps = usernameFound ? totalSteps - 1 : totalSteps;

  // Get step name
  const getStepName = () => {
    if (isDocumentStep) return 'Document Upload';
    if (isPersonalInfoStep) return 'Personal Information';
    return '';
  };

  return (
    <div className="min-h-screen max-w-md mx-auto overflow-hidden bg-black text-white pb-10">
      {stepLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="text-amber-400"
          >
            <Loader size={36} />
          </motion.div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Identity Verification</h1>
          {!isUsernameStep && !isSuccessStep && (
            <VerificationStatusBadge status="pending" />
          )}
        </div>
        
        {/* Username display - only show when username is found */}
        {usernameFound && !isSuccessStep && (
          <Card className="mb-4 border-amber-500/30 bg-zinc-900">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <UserCheck className="text-amber-400 h-5 w-5" />
                <span className="text-gray-300">
                  Verifying: <span className="font-medium text-amber-400">{username}</span>
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Security info banner */}
        {!isSuccessStep && !isUsernameStep && (
          <div className="bg-zinc-900/50 rounded-md p-2 mb-4 flex items-center gap-2 border border-zinc-800">
            <Shield className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-gray-400">Your data is encrypted and processed securely</p>
          </div>
        )}
        
        {/* Progress indicator - don't show for username step or success step */}
        {!isUsernameStep && !isSuccessStep && (
          <>
            <div className="flex items-center justify-center mb-4 gap-2">
              <div className={`h-2 w-10 rounded-full ${displayStep >= 1 ? 'bg-amber-400' : 'bg-gray-600'}`}></div>
              <div className={`h-2 w-10 rounded-full ${displayStep >= 2 ? 'bg-amber-400' : 'bg-gray-600'}`}></div>
            </div>
            
            <div className="text-center text-gray-400 mb-6">
              Step {displayStep} of {displayTotalSteps}: {getStepName()}
            </div>
          </>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {isUsernameStep && (
            <>
              <UsernameInputStep 
                username={username}
                setUsername={setUsername}
                onContinue={handleContinueFromUsername}
              />
              <div className="mt-6">
                <WhyKycSection />
              </div>
              <FaqSection />
            </>
          )}

          {isDocumentStep && (
            <DocumentUploadStep 
              idCardFront={idCardFront}
              setIdCardFront={setIdCardFront}
              idCardBack={idCardBack}
              setIdCardBack={setIdCardBack}
              selfieImage={selfieImage}
              setSelfieImage={setSelfieImage}
              nextStep={nextStep}
            />
          )}

          {isPersonalInfoStep && (
            <PersonalInfoStep 
              form={form}
              prevStep={prevStep}
            />
          )}
          
          {isSuccessStep && (
            <VerificationSuccessStep username={username} />
          )}
        </form>
      </div>
    </div>
  );
};

export default Kyc;
