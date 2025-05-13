
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const FaqSection = () => {
  return (
    <Card className="border-amber-500/30 bg-zinc-900 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Frequently Asked Questions</h3>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-zinc-800">
            <AccordionTrigger className="text-sm text-gray-300 hover:text-amber-400">
              How long does verification take?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-gray-400">
              Verification is typically completed within 24-48 hours after all required documents are submitted. In some cases, it may take longer if additional verification is needed.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-zinc-800">
            <AccordionTrigger className="text-sm text-gray-300 hover:text-amber-400">
              What documents are accepted for verification?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-gray-400">
              We accept government-issued photo IDs such as passports, national ID cards, and driver's licenses. Documents must be valid, not expired, and clearly legible.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-zinc-800">
            <AccordionTrigger className="text-sm text-gray-300 hover:text-amber-400">
              Is my data secure?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-gray-400">
              Yes, all your personal information and documents are encrypted and securely stored. We use industry-standard security protocols to protect your data and comply with privacy regulations.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-zinc-800">
            <AccordionTrigger className="text-sm text-gray-300 hover:text-amber-400">
              Can I use my account before verification is complete?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-gray-400">
              You can access basic features, but certain actions like withdrawals and higher transaction limits require completed verification.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-zinc-800">
            <AccordionTrigger className="text-sm text-gray-300 hover:text-amber-400">
              What if my verification is rejected?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-gray-400">
              If your verification is rejected, you'll receive an email explaining why. You can resubmit with the correct documents through the verification portal.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FaqSection;
