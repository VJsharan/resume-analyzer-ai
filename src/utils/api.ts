/**
 * API utility functions for the Election Intelligence Platform frontend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/v1/health`,
  healthDetailed: `${API_BASE_URL}/api/v1/health/detailed`,
  analyze: `${API_BASE_URL}/api/v1/analyze`,
  analyzeAsync: `${API_BASE_URL}/api/v1/analyze/async`,
  analyzeStatus: (id: string) => `${API_BASE_URL}/api/v1/analyze/status/${id}`,
  // Database endpoints
  listAnalyses: `${API_BASE_URL}/api/v1/analyses`,
  getAnalysis: (speechId: string) => `${API_BASE_URL}/api/v1/analyses/${speechId}`,
  deleteAnalysis: (speechId: string) => `${API_BASE_URL}/api/v1/analyses/${speechId}`,
  dashboardStats: `${API_BASE_URL}/api/v1/dashboard/stats`,
  recentAnalyses: `${API_BASE_URL}/api/v1/dashboard/recent`,
  // Reports endpoints
  reportsDashboardStats: `${API_BASE_URL}/api/v1/reports/dashboard-stats`,
  reportsSpeaker: (speakerName: string) => `${API_BASE_URL}/api/v1/reports/speaker/${encodeURIComponent(speakerName)}`,
  reportsTrends: `${API_BASE_URL}/api/v1/reports/trends`,
  reportsGenerate: `${API_BASE_URL}/api/v1/reports/generate`,
  reportsAnalytics: `${API_BASE_URL}/api/v1/reports/analytics`,
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status?: number;
  response?: any;
  
  constructor(
    message: string,
    status?: number,
    response?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Health check - basic
 */
export async function checkHealth(): Promise<{ status: string; service: string; version: string }> {
  try {
    const response = await fetch(API_ENDPOINTS.health);

    if (!response.ok) {
      throw new ApiError(`Health check failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error during health check: ${error}`);
  }
}

/**
 * Health check - detailed
 */
export async function checkDetailedHealth(): Promise<{
  status: string;
  service: string;
  version: string;
  configuration: any;
  dependencies: any;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.healthDetailed);

    if (!response.ok) {
      throw new ApiError(`Detailed health check failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error during detailed health check: ${error}`);
  }
}

/**
 * Upload and analyze video file (synchronous)
 */
export async function uploadAndAnalyzeVideo(
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.analyze, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header, let browser set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `Upload failed: ${response.status}`,
        response.status,
        errorData
      );
    }

    const result = await response.json();

    // Simulate progress completion if callback provided
    if (onProgress) {
      onProgress(100);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error during video analysis: ${error}`);
  }
}

/**
 * Upload and analyze video file (asynchronous)
 */
export async function uploadAndAnalyzeVideoAsync(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ analysis_id: string; status: string; message: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.analyzeAsync, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `Async upload failed: ${response.status}`,
        response.status,
        errorData
      );
    }

    const result = await response.json();

    // Simulate progress for upload completion
    if (onProgress) {
      onProgress(25);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error during async video analysis: ${error}`);
  }
}

/**
 * Check analysis status (for async analysis)
 */
export async function checkAnalysisStatus(analysisId: string): Promise<{
  analysis_id: string;
  status: 'processing' | 'completed' | 'failed';
  filename: string;
  result?: any;
  error?: string;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.analyzeStatus(analysisId));

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('Analysis not found', 404);
      }
      throw new ApiError(`Status check failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error during status check: ${error}`);
  }
}

/**
 * Poll analysis status until completion
 */
export async function pollAnalysisStatus(
  analysisId: string,
  onProgress?: (status: string) => void,
  maxAttempts: number = 120, // 10 minutes max
  intervalMs: number = 5000 // Check every 5 seconds
): Promise<any> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const statusResponse = await checkAnalysisStatus(analysisId);

      if (onProgress) {
        onProgress(statusResponse.status);
      }

      if (statusResponse.status === 'completed') {
        return statusResponse.result;
      }

      if (statusResponse.status === 'failed') {
        throw new ApiError(statusResponse.error || 'Analysis failed', 500);
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempts++;

    } catch (error) {
      if (error instanceof ApiError) throw error;

      // For network errors, wait and retry
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempts++;
    }
  }

  throw new ApiError('Analysis timeout - please try again', 408);
}

/**
 * Upload file with progress tracking
 */
export async function uploadFileWithProgress(
  file: File,
  endpoint: string,
  onProgress: (progress: number) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Create a mock Response object
        const response = new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers()
        });
        resolve(response);
      } else {
        reject(new ApiError(`Upload failed: ${xhr.status}`, xhr.status));
      }
    };

    xhr.onerror = () => {
      reject(new ApiError('Network error during upload'));
    };

    xhr.open('POST', endpoint);
    xhr.send(formData);
  });
}

/**
 * Validate API connection
 */
export async function validateApiConnection(): Promise<{
  connected: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const health = await checkHealth();
    return {
      connected: true,
      version: health.version
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Format API error for display
 */
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return !error.status || error.message.includes('network') || error.message.includes('fetch');
  }

  return false;
}

/**
 * Retry API call with exponential backoff
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Don't wait after the last attempt
      if (i < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, i); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Database API Functions

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
  total_analyses: number;
  political_speeches: number;
  non_political_content: number;
  average_empathy_score: number;
  recent_analyses: number;
  language_distribution: Array<{ _id: string; count: number }>;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.dashboardStats);

    if (!response.ok) {
      throw new ApiError(`Dashboard stats failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error getting dashboard stats: ${error}`);
  }
}

/**
 * Get recent analyses for dashboard
 */
export async function getRecentAnalyses(): Promise<{
  recent_analyses: Array<{
    speech_id: string;
    filename: string;
    duration_seconds: number;
    language_detected: string;
    created_at: string;
    classification: string;
    confidence: number;
    leader_name?: string;
    empathy_score?: number;
    overall_sentiment?: string;
    key_themes: string[];
    status: string;
  }>;
  count: number;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.recentAnalyses);

    if (!response.ok) {
      throw new ApiError(`Recent analyses failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error getting recent analyses: ${error}`);
  }
}

/**
 * List analyses with filtering and pagination
 */
export async function listAnalyses(params: {
  limit?: number;
  offset?: number;
  classification?: string;
  search?: string;
  sort_by?: string;
  sort_order?: number;
} = {}): Promise<{
  analyses: Array<{
    speech_id: string;
    filename: string;
    duration_seconds: number;
    language_detected: string;
    created_at: string;
    classification: string;
    confidence: number;
    leader_name?: string;
    empathy_score?: number;
    overall_sentiment?: string;
    key_themes: string[];
    status: string;
  }>;
  count: number;
  offset: number;
  limit: number;
}> {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${API_ENDPOINTS.listAnalyses}?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(`List analyses failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error listing analyses: ${error}`);
  }
}

/**
 * Get a specific analysis by speech_id
 */
export async function getAnalysis(speechId: string): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.getAnalysis(speechId));

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('Analysis not found', 404);
      }
      throw new ApiError(`Get analysis failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error getting analysis: ${error}`);
  }
}

/**
 * Delete a specific analysis
 */
export async function deleteAnalysis(speechId: string): Promise<{
  message: string;
  speech_id: string;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.deleteAnalysis(speechId), {
      method: 'DELETE'
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('Analysis not found', 404);
      }
      throw new ApiError(`Delete analysis failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error deleting analysis: ${error}`);
  }
}

// Reports API Functions

/**
 * Get enhanced dashboard statistics for reports
 */
export async function getReportsDashboardStats(): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.reportsDashboardStats);

    if (!response.ok) {
      throw new ApiError(`Reports dashboard stats failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error getting reports dashboard stats: ${error}`);
  }
}

/**
 * Get speaker profile report
 */
export async function getSpeakerProfile(speakerName: string): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.reportsSpeaker(speakerName));

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(`No speeches found for speaker: ${speakerName}`, 404);
      }
      throw new ApiError(`Speaker profile failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error getting speaker profile: ${error}`);
  }
}

/**
 * Get trend analysis
 */
export async function getTrendAnalysis(params: {
  days?: number;
  metrics?: string[];
} = {}): Promise<any> {
  try {
    const searchParams = new URLSearchParams();

    if (params.days) {
      searchParams.append('days', params.days.toString());
    }

    if (params.metrics && params.metrics.length > 0) {
      params.metrics.forEach(metric => searchParams.append('metrics', metric));
    }

    const url = `${API_ENDPOINTS.reportsTrends}?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(`Trend analysis failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error getting trend analysis: ${error}`);
  }
}

/**
 * Generate custom report
 */
export async function generateReport(request: {
  report_type: 'single' | 'speaker' | 'comparative' | 'trends' | 'dashboard';
  speech_ids?: string[];
  speaker_name?: string;
  date_range?: { start: string; end: string };
  metrics?: string[];
  format?: 'json' | 'pdf' | 'csv';
}): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.reportsGenerate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `Report generation failed: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error generating report: ${error}`);
  }
}

/**
 * Download analysis as PDF
 */
export async function downloadAnalysisPDF(analysisId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyses/${analysisId}/download/pdf`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `PDF download failed: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `analysis_${analysisId}_report.pdf`;

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error downloading PDF: ${error}`);
  }
}

/**
 * Get advanced analytics with filters
 */
export async function getAdvancedAnalytics(params: {
  min_empathy?: number;
  sentiment?: string;
  speaker?: string;
  days?: number;
} = {}): Promise<any> {
  try {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${API_ENDPOINTS.reportsAnalytics}?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(`Advanced analytics failed: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Network error getting advanced analytics: ${error}`);
  }
}