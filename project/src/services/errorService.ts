// Centralized Error Handling
export class ErrorService {
  static logError(error: Error, context?: string): void {
    console.error(`[${context || 'Unknown'}] Error:`, error);
    
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { tags: { context } });
    }
  }
  
  static handleApiError(error: any, fallbackMessage: string = 'An unexpected error occurred'): string {
    if (error?.message) {
      return error.message;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return fallbackMessage;
  }
  
  static createUserFriendlyMessage(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Authentication required. Please sign in and try again.';
    }
    
    if (message.includes('forbidden') || message.includes('403')) {
      return 'Access denied. You may not have permission for this action.';
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource was not found.';
    }
    
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    
    return error.message;
  }
}