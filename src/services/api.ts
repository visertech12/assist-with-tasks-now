
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// Types for our KYC data
export interface KycFormData {
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  idCardFront: string | null;
  idCardBack: string | null;
  selfieImage: string | null;
  termsAccepted: boolean;
}

// Function to submit KYC data to Supabase
export const submitKycData = async (data: KycFormData): Promise<boolean> => {
  try {
    console.log("Submitting KYC data to Supabase:", data);
    
    // Check if user with this username already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('kyc_data')
      .select('id')
      .eq('username', data.username)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is the error code for "no rows found" which is expected when the user doesn't exist
      console.error("Error checking existing user:", fetchError);
      throw new Error(fetchError.message);
    }
    
    const kycData = {
      username: data.username,
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      country: data.country,
      postal_code: data.postalCode,
      phone_number: data.phoneNumber,
      id_card_front: data.idCardFront,
      id_card_back: data.idCardBack,
      selfie_image: data.selfieImage,
      terms_accepted: data.termsAccepted,
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    if (existingUser) {
      // Update existing record
      result = await supabase
        .from('kyc_data')
        .update(kycData)
        .eq('username', data.username);
      
      if (result.error) {
        console.error("Error updating KYC data:", result.error);
        throw new Error(result.error.message);
      }
      
      toast.success("KYC data updated successfully");
    } else {
      // Insert new record
      result = await supabase
        .from('kyc_data')
        .insert([kycData]);
      
      if (result.error) {
        console.error("Error inserting KYC data:", result.error);
        throw new Error(result.error.message);
      }
      
      toast.success("KYC data submitted successfully");
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting KYC data:', error);

    if (error instanceof Error) {
      toast.error(`Failed to submit KYC data: ${error.message}`);
    } else {
      toast.error("Failed to submit KYC data. Please try again.");
    }

    return false;
  }
};

// Function to retrieve KYC data for a user
export const fetchKycData = async (username: string): Promise<KycFormData | null> => {
  try {
    console.log("Fetching KYC data for username:", username);
    
    const { data, error } = await supabase
      .from('kyc_data')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching KYC data:", error);
      
      // Don't throw for "not found" errors, just return null
      if (error.code === 'PGRST116') {
        return null;
      }
      
      throw error;
    }
    
    if (!data) return null;
    
    // Map Supabase data to our KycFormData interface
    return {
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      dateOfBirth: data.date_of_birth,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.postal_code,
      phoneNumber: data.phone_number,
      idCardFront: data.id_card_front,
      idCardBack: data.id_card_back,
      selfieImage: data.selfie_image,
      termsAccepted: data.terms_accepted
    };
  } catch (error) {
    console.error('Error fetching KYC data:', error);
    toast.error("Failed to load KYC data");
    return null;
  }
};
