
import React from 'react';
import { motion } from 'framer-motion';
import { IdCard, User, Info, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImageUploadCard from './ImageUploadCard';

interface DocumentUploadStepProps {
  idCardFront: string | null;
  setIdCardFront: (url: string | null) => void;
  idCardBack: string | null;
  setIdCardBack: (url: string | null) => void;
  selfieImage: string | null;
  setSelfieImage: (url: string | null) => void;
  nextStep: () => void;
}

const DocumentUploadStep = ({
  idCardFront,
  setIdCardFront,
  idCardBack,
  setIdCardBack,
  selfieImage,
  setSelfieImage,
  nextStep
}: DocumentUploadStepProps) => {
  const allUploaded = idCardFront && idCardBack && selfieImage;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="bg-zinc-900 rounded-xl p-4 border border-gray-800 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Document Verification</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-amber-400/10 p-1">
                  <Info className="h-4 w-4 text-amber-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="max-w-xs">We need clear photos of your ID and a selfie to verify your identity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-gray-400 mb-4">Upload high-quality images of your documents for faster verification</p>
      </div>
      
      <Alert className="bg-blue-900/20 border-blue-500/30 text-blue-200 mb-4">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-xs">
          For best results, ensure good lighting, avoid glare, and make sure all text is clearly visible
        </AlertDescription>
      </Alert>
      
      <ImageUploadCard
        title="ID Card Front"
        description="Upload a clear photo of the front of your ID card"
        imageUrl={idCardFront}
        setImageUrl={setIdCardFront}
        icon={<IdCard className="text-amber-400" />}
      />
      
      <ImageUploadCard
        title="ID Card Back"
        description="Upload a clear photo of the back of your ID card"
        imageUrl={idCardBack}
        setImageUrl={setIdCardBack}
        icon={<IdCard className="text-amber-400" />}
      />
      
      <ImageUploadCard
        title="Selfie Photo"
        description="Take a clear selfie photo with neutral expression and good lighting"
        imageUrl={selfieImage}
        setImageUrl={setSelfieImage}
        icon={<User className="text-amber-400" />}
      />

      <div className="flex gap-3 items-center text-xs text-amber-300 mb-2">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${allUploaded ? 'bg-amber-400' : 'bg-gray-600'}`}>
          {allUploaded && <Check className="h-3 w-3 text-black" />}
        </div>
        {allUploaded ? 
          "All documents uploaded successfully!" : 
          "Please upload all required documents to continue"
        }
      </div>

      <div className="mt-6">
        <Button 
          type="button" 
          onClick={nextStep}
          disabled={!idCardFront || !idCardBack || !selfieImage}
          className="w-full bg-amber-400 text-black hover:bg-amber-500"
        >
          Continue to Personal Information
        </Button>
      </div>
    </motion.div>
  );
};

export default DocumentUploadStep;
