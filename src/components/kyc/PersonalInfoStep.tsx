
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PersonalInfoStepProps {
  form: UseFormReturn<any>;
  prevStep: () => void;
}

const PersonalInfoStep = ({ form, prevStep }: PersonalInfoStepProps) => {
  const fieldErrorClass = "text-red-500 text-xs mt-1";
  const inputClass = "bg-zinc-800 border-gray-700";
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Personal Information</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-amber-400/10 p-1">
                  <Info className="h-4 w-4 text-amber-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="max-w-xs">Please provide accurate personal information that matches your ID documents</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Alert className="bg-amber-900/20 border-amber-500/30 text-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-xs">
            All fields are required and must match your identification documents exactly
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                {...form.register("firstName")} 
                className={inputClass}
              />
              {form.formState.errors.firstName && (
                <p className={fieldErrorClass}>{String(form.formState.errors.firstName.message)}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                {...form.register("lastName")} 
                className={inputClass}
              />
              {form.formState.errors.lastName && (
                <p className={fieldErrorClass}>{String(form.formState.errors.lastName.message)}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Must be at least 18 years old</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id="dateOfBirth" 
              type="date" 
              {...form.register("dateOfBirth")} 
              className={inputClass}
            />
            {form.formState.errors.dateOfBirth && (
              <p className={fieldErrorClass}>{String(form.formState.errors.dateOfBirth.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              placeholder="Enter your full address" 
              {...form.register("address")} 
              className={inputClass}
            />
            {form.formState.errors.address && (
              <p className={fieldErrorClass}>{String(form.formState.errors.address.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                placeholder="New York" 
                {...form.register("city")} 
                className={inputClass}
              />
              {form.formState.errors.city && (
                <p className={fieldErrorClass}>{String(form.formState.errors.city.message)}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input 
                id="postalCode" 
                placeholder="10001" 
                {...form.register("postalCode")}
                className={inputClass} 
              />
              {form.formState.errors.postalCode && (
                <p className={fieldErrorClass}>{String(form.formState.errors.postalCode.message)}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              placeholder="United States" 
              {...form.register("country")}
              className={inputClass} 
            />
            {form.formState.errors.country && (
              <p className={fieldErrorClass}>{String(form.formState.errors.country.message)}</p>
              )}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              placeholder="+1234567890" 
              {...form.register("phoneNumber")}
              className={inputClass} 
            />
            {form.formState.errors.phoneNumber && (
              <p className={fieldErrorClass}>{String(form.formState.errors.phoneNumber.message)}</p>
            )}
          </div>

          <div className="p-4 border border-gray-700 rounded-md bg-zinc-800/40">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="termsAccepted" 
                {...form.register("termsAccepted")} 
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="termsAccepted" className="text-sm">
                  I confirm that all provided information is accurate and true.
                </Label>
                <p className="text-xs text-gray-400">
                  By submitting this form, you agree to our <a href="#" className="text-amber-400 hover:underline">terms</a> and <a href="#" className="text-amber-400 hover:underline">privacy policy</a>.
                </p>
              </div>
            </div>
            {/* Terms acceptance is now optional, no error message displayed */}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-amber-400 text-black hover:bg-amber-500"
        >
          Submit
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;
