
import React, { useState } from 'react';
import { Skeleton } from './skeleton';
import { getPublicUrl } from '@/lib/supabase';

interface OptimizedImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill';
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  objectFit = 'cover'
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Get proper URL for Supabase storage objects
  const getImageUrl = (): string | null => {
    if (!src) return null;
    
    // If it's already a full URL or data URL, return as is
    if (src.startsWith('http') || src.startsWith('data:')) {
      return src;
    }
    
    // If it's a path to a storage object, construct the public URL
    if (src.startsWith('tradexpro-images/')) {
      // Extract the actual file path after the bucket name
      const path = src.replace('tradexpro-images/', '');
      console.log("Getting public URL for path:", path);
      return getPublicUrl('tradexpro-images', path);
    }
    
    // Default case, just return the source
    return src;
  };

  const imageUrl = getImageUrl();

  const handleRetry = () => {
    if (retryCount < 3) {
      console.log("Retrying image load:", imageUrl);
      setError(false);
      setIsLoading(true);
      setRetryCount(retryCount + 1);
      
      // Force browser to reload the image by adding a cache-busting parameter
      const cacheBustUrl = imageUrl && imageUrl.includes('?') 
        ? `${imageUrl}&cacheBust=${Date.now()}` 
        : `${imageUrl}?cacheBust=${Date.now()}`;
      
      const img = new Image();
      img.src = cacheBustUrl || '';
    }
  };

  if (!imageUrl) {
    return (
      <div className="bg-zinc-800 rounded-md flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm">No image available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <Skeleton className="absolute inset-0 bg-zinc-800 rounded-md" />
      )}
      <img 
        src={imageUrl} 
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 rounded-md w-full h-full`}
        style={{
          objectFit: objectFit,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => {
          console.log("Image loaded successfully:", imageUrl);
          setIsLoading(false);
        }}
        onError={(e) => {
          setError(true);
          setIsLoading(false);
          console.error(`Failed to load image: ${imageUrl}`, e);
        }}
      />
      {error && (
        <div className="absolute inset-0 bg-zinc-800 rounded-md flex flex-col items-center justify-center">
          <p className="text-zinc-500 text-sm mb-2">Failed to load image</p>
          {retryCount < 3 && (
            <button 
              onClick={handleRetry} 
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
