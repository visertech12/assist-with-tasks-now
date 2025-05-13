
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Camera, ArrowLeft, Upload, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabase';
import { getPublicUrl } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import OptimizedImage from '../ui/OptimizedImage';

type ImageUploadCardProps = { 
  title: string; 
  description: string; 
  imageUrl: string | null; 
  setImageUrl: (url: string | null) => void; 
  icon: React.ReactNode;
};

const ImageUploadCard = ({ 
  title, 
  description, 
  imageUrl, 
  setImageUrl, 
  icon 
}: ImageUploadCardProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'prompt'|'granted'|'denied'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Effect to set camera as ready once the video is loaded
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setIsCameraReady(true);
      };
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
      }
    };
  }, [isCapturing]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      setCameraError(null);
      
      // First check if camera permissions are already granted
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermissionStatus(permissions.state as 'prompt'|'granted'|'denied');
      
      if (permissions.state === 'granted') {
        await startCamera();
      } else if (permissions.state === 'prompt') {
        // If permission is in prompt state, we'll trigger the prompt by trying to access the camera
        await startCamera();
      } else {
        // Permission was denied previously
        setCameraError("Camera access denied. Please enable camera permissions in your browser settings.");
        toast.error("Camera access denied. Please enable camera permissions in your browser settings.");
      }
    } catch (err) {
      console.log("Permission API not supported, falling back to getUserMedia");
      // Fallback for browsers that don't support permissions API
      await startCamera();
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      const constraints = { 
        video: isMobile 
          ? { facingMode: "environment" } // Use back camera on mobile
          : { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
      };
      
      console.log("Starting camera with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        console.log("Setting video stream");
        videoRef.current.srcObject = stream;
        
        try {
          await videoRef.current.play();
          console.log("Video playing");
          setIsCapturing(true);
          setCameraPermissionStatus('granted');
        } catch (playErr) {
          console.error("Error playing video:", playErr);
          setCameraError("Could not play video stream. Please try again.");
          toast.error("Could not start camera stream. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermissionStatus('denied');
      
      // Show more helpful error message based on the error type
      if (err instanceof DOMException) {
        if (err.name === 'NotFoundError') {
          setCameraError("No camera found. Please ensure your device has a camera connected.");
          toast.error("No camera found. Please ensure your device has a camera connected.");
        } else if (err.name === 'NotAllowedError') {
          setCameraError("Camera access denied. Please enable camera permissions in your browser settings.");
          toast.error("Camera access denied. Please enable camera permissions in your browser settings.");
        } else {
          setCameraError(`Camera error: ${err.message}`);
          toast.error("Could not access camera: " + err.message);
        }
      } else {
        setCameraError("Camera error: Check permissions or try uploading instead");
        toast.error("Could not access camera. Please check permissions.");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
      setIsCameraReady(false);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally if using front camera (not on mobile)
        if (!isMobile) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset transformation if we applied it
        if (!isMobile) {
          context.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        try {
          // Get image data as a blob with JPEG format
          canvas.toBlob(async (blob) => {
            if (blob) {
              await uploadFileToSupabase(blob, 'image/jpeg');
              stopCamera();
            } else {
              throw new Error('Failed to create image blob');
            }
          }, 'image/jpeg', 0.95);
        } catch (error) {
          console.error('Error processing captured image:', error);
          toast.error('Failed to process captured image');
        }
      }
    }
  };

  const uploadFileToSupabase = async (file: Blob | File, mimeType: string) => {
    try {
      setIsUploading(true);
      
      // Generate a unique filename with the title as prefix and proper extension
      const filePrefix = title.toLowerCase().replace(/\s+/g, '-');
      const uniqueId = uuidv4().substring(0, 8); // Use shorter UUID for filename
      
      // Determine file extension from MIME type
      let extension = 'jpg'; // Default
      if (mimeType === 'image/png') extension = 'png';
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') extension = 'jpg';
      if (mimeType === 'image/gif') extension = 'gif';
      if (mimeType === 'image/webp') extension = 'webp';
      if (mimeType === 'image/heic') extension = 'heic';
      if (mimeType === 'image/heif') extension = 'heif';
      
      const fileName = `${filePrefix}-${uniqueId}.${extension}`;
      
      console.log(`Uploading ${title} image as: ${fileName} with MIME type: ${mimeType}`);
      
      // Upload to Supabase Storage with contentType explicitly set
      const { data, error } = await supabase.storage
        .from('tradexpro-images')
        .upload(fileName, file, {
          contentType: mimeType,
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }
      
      console.log('Upload successful:', data);
      
      // Store the path with bucket prefix
      setImageUrl(`tradexpro-images/${fileName}`);
      toast.success(`${title} image uploaded successfully`);
      
      // Verify the image is accessible
      const publicUrl = getPublicUrl('tradexpro-images', fileName);
      console.log('Public URL for verification:', publicUrl);
      
      // Pre-load image to warm cache
      const img = new Image();
      img.src = publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload ${title} image. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Maximum size is 5MB.");
        return;
      }
      
      try {
        setIsUploading(true);
        console.log("File type:", file.type);
        console.log("File name:", file.name);
        
        // Upload directly using the original file with its mime type
        await uploadFileToSupabase(file, file.type);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Failed to upload ${title} image. Please try again.`);
      } finally {
        // Clear the input so the same file can be selected again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (cameraInputRef.current) {
          cameraInputRef.current.value = '';
        }
        setIsUploading(false);
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const triggerCameraCapture = () => {
    if (isMobile) {
      // On mobile, use the native camera
      cameraInputRef.current?.click();
    } else {
      // On desktop, use our custom camera UI
      checkCameraPermission();
    }
  };

  const resetImage = () => {
    setImageUrl(null);
    toast.info(`${title} image removed`);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-gray-800 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        {imageUrl && (
          <Button size="icon" variant="ghost" onClick={resetImage} className="h-6 w-6">
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      {isCapturing ? (
        <div className="relative w-full">
          <div className="bg-black rounded-lg overflow-hidden h-60 flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className={`w-full h-full object-cover ${!isMobile ? 'scale-x-[-1]' : ''}`} 
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-amber-400">Loading camera...</div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex justify-center gap-2">
              <Button 
                size="sm" 
                onClick={captureImage}
                disabled={!isCameraReady}
              >
                Capture
              </Button>
              <Button size="sm" variant="outline" onClick={stopCamera}>Cancel</Button>
            </div>
          </div>
        </div>
      ) : imageUrl ? (
        <div className="relative w-full h-60" 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <OptimizedImage
            src={imageUrl}
            alt={title}
            className="w-full h-full"
            objectFit="contain"
          />
          {isHovering && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Button size="sm" variant="outline" onClick={resetImage}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Reset
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-dashed border-gray-700 rounded-lg p-4 w-full flex flex-col items-center gap-3 h-60">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-2" />
              <p className="text-sm text-gray-400">Uploading image...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center flex-1">
                <p className="text-sm text-center text-gray-500 mb-4">
                  Capture a photo or upload from your device
                </p>
                <div className="flex gap-2">
                  {/* Hidden input for camera capture */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                  />
                  <Button onClick={triggerCameraCapture}>
                    <Camera className="mr-1 h-4 w-4" /> Capture
                  </Button>
                  
                  {/* Hidden input for gallery selection */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="outline" 
                    onClick={triggerFileUpload}
                  >
                    <Upload className="mr-1 h-4 w-4" /> Upload
                  </Button>
                </div>
                {cameraError && (
                  <p className="text-xs text-red-400 text-center mt-2">
                    {cameraError}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadCard;
