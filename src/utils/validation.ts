import { APP_CONSTANTS } from './constants';

// URL Validation Utilities
export class URLValidator {
  static isValidUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  static isSupported(url: string): boolean {
    if (!this.isValidUrl(url)) return false;
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      return !APP_CONSTANTS.RESTRICTED_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }
  
  static getValidationMessage(url: string): string | null {
    if (!url || !url.trim()) return null;
    
    if (!this.isValidUrl(url)) {
      return 'Please enter a valid URL starting with http:// or https://';
    }
    
    if (!this.isSupported(url)) {
      try {
        const hostname = new URL(url).hostname;
        return `${hostname} is not supported. Try company websites, LinkedIn pages, or news articles.`;
      } catch {
        return 'This URL is not supported. Try company websites, LinkedIn pages, or news articles.';
      }
    }
    
    return null;
  }
  
  static filterSupportedUrls(urls: string[]): { supported: string[]; unsupported: string[] } {
    const supported: string[] = [];
    const unsupported: string[] = [];
    
    if (!Array.isArray(urls)) {
      return { supported, unsupported };
    }
    
    urls.forEach(url => {
      if (!url || typeof url !== 'string') {
        return;
      }
      
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        return;
      }
      
      if (this.isValidUrl(trimmedUrl) && this.isSupported(trimmedUrl)) {
        supported.push(trimmedUrl);
      } else {
        unsupported.push(trimmedUrl);
      }
    });
    
    return { supported, unsupported };
  }
}

// Form Validation
export class FormValidator {
  static validateCompanyName(name: string): string | null {
    if (!name.trim()) return 'Company name is required';
    if (name.length < 2) return 'Company name must be at least 2 characters';
    if (name.length > 100) return 'Company name must be less than 100 characters';
    return null;
  }
  
  static validateEmail(email: string): string | null {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  }
  
  static validatePassword(password: string): string | null {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }
}

// Data Validation
export class DataValidator {
  static validateReportData(data: any): string[] {
    const errors: string[] = [];
    
    if (!data.companyName) errors.push('Company name is required');
    if (!data.sourceUrls || data.sourceUrls.length === 0) errors.push('At least one source URL is required');
    if (!data.summary) errors.push('Summary is required');
    
    return errors;
  }
  
  static sanitizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }
  
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}