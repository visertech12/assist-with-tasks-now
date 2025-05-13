import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldX, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import VerificationStatusBadge from '@/components/kyc/VerificationStatusBadge';
import NavigationBar from "@/components/NavigationBar";

const KycNotVerified = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-black text-white p-4 flex flex-col items-center justify-center">
      <NavigationBar />
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Identity Verification</h1>
          <VerificationStatusBadge status="not_started" />
        </div>
        
        <Card className="border-amber-500/30 bg-zinc-900 mb-6">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <ShieldX size={40} className="text-red-500" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">KYC Not Verified</h2>
            <p className="text-gray-400 mb-4">
              Your identity verification is not complete. Please complete the KYC process to access all platform features.
            </p>
            
            <div className="bg-zinc-800/70 p-4 rounded-md w-full mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <p className="text-sm text-amber-400">Why is verification required?</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                KYC verification is required for security purposes and to comply with regulations. It helps prevent fraud and ensures a safe environment for all users.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-6 pt-0">
            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium">
              <Link to="/">Complete KYC Verification</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
              <Link to="/check-status" className="flex items-center gap-2">
                <Search size={16} />
                Check KYC Status
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center text-gray-500 text-sm">
          <p>
            If you have any questions or need assistance,{' '}
            <Link to="/help" className="text-amber-500 hover:underline">contact support</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KycNotVerified;
