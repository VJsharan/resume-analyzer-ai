/**
 * Utility functions for analysis data processing
 */

export interface AnalysisData {
  classification?: string;
  is_political?: boolean;
  empathy_score?: number;
  overall_sentiment?: string;
  confidence?: number;
  [key: string]: any;
}

/**
 * Determines if an analysis represents political content
 * Checks both classification field and is_political boolean for accuracy
 */
export function isPoliticalContent(analysis: AnalysisData): boolean {
  // Primary check: is_political boolean (most reliable)
  if (typeof analysis.is_political === 'boolean') {
    return analysis.is_political;
  }

  // Fallback: classification string check
  if (analysis.classification) {
    return analysis.classification.toLowerCase() === 'political';
  }

  // Default to false if no political indicators
  return false;
}

/**
 * Gets the display name for classification
 */
export function getClassificationDisplay(analysis: AnalysisData): string {
  if (isPoliticalContent(analysis)) {
    return 'Political';
  }
  return 'Non-Political';
}

/**
 * Gets appropriate styling class for classification badges
 */
export function getClassificationStyle(analysis: AnalysisData): string {
  if (isPoliticalContent(analysis)) {
    return 'bg-black text-white';
  }
  return 'bg-gray-100 text-gray-800';
}

/**
 * Formats confidence score as percentage
 */
export function formatConfidence(confidence?: number): string {
  if (typeof confidence !== 'number') return '0%';
  return `${Math.round(confidence * 100)}%`;
}