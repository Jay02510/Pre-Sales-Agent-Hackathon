import { describe, it, expect } from 'vitest';
import { URLValidator, FormValidator } from '../utils/validation';

describe('URLValidator', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(URLValidator.isValidUrl('https://example.com')).toBe(true);
      expect(URLValidator.isValidUrl('http://example.com')).toBe(true);
      expect(URLValidator.isValidUrl('https://www.example.com/path?query=value')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(URLValidator.isValidUrl('')).toBe(false);
      expect(URLValidator.isValidUrl('example.com')).toBe(false);
      expect(URLValidator.isValidUrl('not a url')).toBe(false);
      expect(URLValidator.isValidUrl('http://')).toBe(false);
    });
  });

  describe('isSupported', () => {
    it('should return true for supported domains', () => {
      expect(URLValidator.isSupported('https://example.com')).toBe(true);
      expect(URLValidator.isSupported('https://linkedin.com/company/microsoft')).toBe(true);
      expect(URLValidator.isSupported('https://news.example.com/article')).toBe(true);
    });

    it('should return false for restricted domains', () => {
      expect(URLValidator.isSupported('https://facebook.com/page')).toBe(false);
      expect(URLValidator.isSupported('https://twitter.com/user')).toBe(false);
      expect(URLValidator.isSupported('https://instagram.com/profile')).toBe(false);
    });
  });

  describe('getValidationMessage', () => {
    it('should return null for valid and supported URLs', () => {
      expect(URLValidator.getValidationMessage('https://example.com')).toBeNull();
    });

    it('should return appropriate message for invalid URLs', () => {
      expect(URLValidator.getValidationMessage('not a url')).toContain('valid URL');
    });

    it('should return appropriate message for unsupported domains', () => {
      expect(URLValidator.getValidationMessage('https://facebook.com')).toContain('not supported');
    });
  });
});

describe('FormValidator', () => {
  describe('validateCompanyName', () => {
    it('should return null for valid company names', () => {
      expect(FormValidator.validateCompanyName('Apple Inc.')).toBeNull();
      expect(FormValidator.validateCompanyName('Microsoft')).toBeNull();
    });

    it('should return error message for invalid company names', () => {
      expect(FormValidator.validateCompanyName('')).toContain('required');
      expect(FormValidator.validateCompanyName('A')).toContain('at least 2 characters');
    });
  });

  describe('validateEmail', () => {
    it('should return null for valid emails', () => {
      expect(FormValidator.validateEmail('test@example.com')).toBeNull();
    });

    it('should return error message for invalid emails', () => {
      expect(FormValidator.validateEmail('')).toContain('required');
      expect(FormValidator.validateEmail('not-an-email')).toContain('valid email');
    });
  });

  describe('validatePassword', () => {
    it('should return null for valid passwords', () => {
      expect(FormValidator.validatePassword('password123')).toBeNull();
    });

    it('should return error message for invalid passwords', () => {
      expect(FormValidator.validatePassword('')).toContain('required');
      expect(FormValidator.validatePassword('12345')).toContain('at least 6 characters');
    });
  });
});