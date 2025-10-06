import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileVideo, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadAndAnalyzeVideo } from '../utils/api';

interface VideoUploadProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: any) => void;
}

interface UploadError {
  message: string;
  type: 'file' | 'upload' | 'analysis' | 'network';
}

export default function VideoUpload({ onAnalysisStart, onAnalysisComplete }: VideoUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<UploadError | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File validation
  const validateFile = (file: File): UploadError | null => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!allowedTypes.some(type => file.type === type || file.name.toLowerCase().endsWith(type.split('/')[1]))) {
      return {
        message: 'Invalid file format. Please upload MP4, AVI, MOV, MKV, or WMV files.',
        type: 'file'
      };
    }

    if (file.size > maxSize) {
      return {
        message: 'File too large. Please upload files smaller than 500MB.',
        type: 'file'
      };
    }

    return null;
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setUploadProgress(0);

    if (rejectedFiles.length > 0) {
      setError({
        message: 'Some files were rejected. Please check file format and size.',
        type: 'file'
      });
      return;
    }

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadedFile(file);
  }, []);

  // Configure dropzone
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.wmv']
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
    disabled: isUploading
  });

  // Handle analysis start
  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setError(null);
    onAnalysisStart();

    try {
      const result = await uploadAndAnalyzeVideo(uploadedFile, (progress) => {
        setUploadProgress(progress);
      });

      // Debug: Log prosody fields
      console.log('🎙️ Analysis result received:', {
        prosody_available: result.prosody_available,
        has_prosody_analysis: !!result.prosody_analysis,
        prosody_keys: result.prosody_analysis ? Object.keys(result.prosody_analysis) : []
      });

      onAnalysisComplete(result);
    } catch (err: any) {
      console.error('Analysis failed:', err);

      let errorMessage = 'Analysis failed. Please try again.';
      let errorType: UploadError['type'] = 'analysis';

      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        errorType = 'network';
      } else if (err.message?.includes('upload')) {
        errorMessage = 'Upload failed. Please check your file and try again.';
        errorType = 'upload';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }

      setError({
        message: errorMessage,
        type: errorType
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset upload
  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Get dropzone class names
  const getDropzoneClassName = () => {
    const baseClass = 'border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 p-8';

    if (isDragAccept) return `${baseClass} border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50/70`;
    if (isDragReject) return `${baseClass} border-red-500 bg-red-50/50 hover:bg-red-50/70`;
    if (isDragActive) return `${baseClass} border-slate-900 bg-slate-50/50 hover:bg-slate-50/70`;

    return `${baseClass} border-slate-300 hover:border-slate-900 hover:bg-slate-50/30 hover:shadow-md`;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-100 rounded-lg">
            <FileVideo className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Upload Video</h2>
            <p className="text-slate-600 text-sm">Select a video file to analyze</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!uploadedFile ? (
          <div {...getRootProps()} className={getDropzoneClassName()}>
            <input {...getInputProps()} />
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileVideo className="h-10 w-10 text-slate-600" />
              </div>
              {isDragActive ? (
                <div>
                  <p className="text-xl font-semibold text-slate-900 mb-2">
                    Drop the video here
                  </p>
                  <p className="text-slate-600 text-sm">
                    Release to upload your video file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xl font-semibold text-slate-900 mb-2">
                    Drag and drop a video file, or click to select
                  </p>
                  <p className="text-slate-600 text-sm mb-4">
                    MP4, AVI, MOV, MKV, WMV up to 500MB
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                    Choose File
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="p-2 bg-slate-200 rounded-lg">
                    <FileVideo className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-slate-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetUpload}
                  className="text-slate-400 hover:text-slate-900 text-xl font-bold flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded-lg transition-colors"
                  disabled={isUploading}
                >
                  ×
                </button>
              </div>

              {/* Upload progress */}
              {isUploading && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-700 font-medium">Uploading...</span>
                    <span className="text-slate-900 font-semibold bg-slate-200 px-2 py-1 rounded">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-slate-900 to-slate-700 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={resetUpload}
                className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                disabled={isUploading}
              >
                Remove File
              </button>
              <button
                onClick={handleAnalyze}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl disabled:shadow-sm"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Start Analysis'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start">
              <div className="p-1 bg-red-100 rounded-lg mr-4 flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800 mb-1">Upload Error</p>
                <p className="text-red-700 text-sm">{error.message}</p>
                {error.type === 'network' && (
                  <p className="text-sm text-red-600 mt-2 bg-red-100 px-3 py-2 rounded-lg">
                    Please ensure the backend service is running
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {uploadedFile && !error && !isUploading && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center">
              <div className="p-1 bg-emerald-100 rounded-lg mr-4">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800">
                  File ready for analysis
                </p>
                <p className="text-emerald-700 text-sm mt-1">
                  Click "Start Analysis" to begin processing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}