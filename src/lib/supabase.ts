
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the correct Supabase URL and anon key
const supabaseUrl = "https://jpahgggrmsvavtpbjkll.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYWhnZ2dybXN2YXZ0cGJqa2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzQyOTMsImV4cCI6MjA2MjQ1MDI5M30.JcTtHQ2hLZG_MpZAHlF0bYpL9Ner-m18okjP-C1N18w";

// Create the Supabase client with explicit options
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  },
  global: {
    headers: {
      'Prefer': 'return=minimal'
    }
  }
});

// Helper function to get public URL for a file
export const getPublicUrl = (bucket: string, path: string): string => {
  if (!path) return '';
  // Ensure we have the direct path without any additional bucket prefix
  const cleanPath = path.startsWith(`${bucket}/`) ? path.replace(`${bucket}/`, '') : path;
  const url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
  console.log("Generated public URL:", url);
  return url;
};

// Create our required bucket if it doesn't exist
const createRequiredBuckets = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const tradexproBucketExists = buckets?.some(b => b.name === 'tradexpro-images');
    
    if (!tradexproBucketExists) {
      console.log('Creating tradexpro-images bucket...');
      const { data, error } = await supabase.storage.createBucket('tradexpro-images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/heic', 'image/heif'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Bucket created successfully:', data);
      }
    } else {
      console.log('tradexpro-images bucket already exists');
    }
  } catch (err) {
    console.error('Error in bucket setup:', err);
  }
};

// Initialize and test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection established successfully');
    // Create required buckets after successful connection
    createRequiredBuckets();
  }
});

// Test storage bucket access and ensure bucket exists
supabase.storage.listBuckets().then(({ data, error }) => {
  if (error) {
    console.warn('Storage buckets access error:', error);
  } else {
    console.log('Available storage buckets:', data?.map(b => b.name));
    
    // Check if our bucket exists
    const tradexproBucketExists = data?.some(b => b.name === 'tradexpro-images');
    
    if (!tradexproBucketExists) {
      console.warn('Warning: tradexpro-images bucket not found. Images may not load properly.');
    }
    
    // Verify public access is enabled for the bucket
    if (tradexproBucketExists) {
      supabase.storage.getBucket('tradexpro-images').then(({ data: bucketData, error: bucketError }) => {
        if (bucketError) {
          console.warn('Error getting bucket details:', bucketError);
        } else if (bucketData && !bucketData.public) {
          console.warn('Warning: tradexpro-images bucket is not public. Images may not load properly.');
        }
      });
    }
  }
});
