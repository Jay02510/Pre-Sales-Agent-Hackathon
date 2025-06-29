import { describe, it, expect } from 'vitest';
import { DateHelper, TextHelper, ArrayHelper } from '../utils/helpers';

describe('DateHelper', () => {
  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const date = new Date(2025, 0, 15, 14, 30); // Jan 15, 2025, 2:30 PM
      const formatted = DateHelper.formatDate(date);
      
      expect(formatted).toContain('January 15, 2025');
      expect(formatted).toMatch(/2:30|14:30/); // Account for locale differences
    });
  });

  describe('getRelativeTime', () => {
    it('should return "Today" for today', () => {
      const today = new Date();
      expect(DateHelper.getRelativeTime(today)).toBe('Today');
    });

    it('should return "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateHelper.getRelativeTime(yesterday)).toBe('Yesterday');
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date(2025, 0, 15);
      const newDate = DateHelper.addDays(date, 5);
      expect(newDate.getDate()).toBe(20);
    });
  });
});

describe('TextHelper', () => {
  describe('capitalizeFirst', () => {
    it('should capitalize the first letter', () => {
      expect(TextHelper.capitalizeFirst('hello')).toBe('Hello');
      expect(TextHelper.capitalizeFirst('world')).toBe('World');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug format', () => {
      expect(TextHelper.slugify('Hello World')).toBe('hello-world');
      expect(TextHelper.slugify('Test 123!')).toBe('test-123');
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from URL', () => {
      expect(TextHelper.extractDomain('https://example.com/path')).toBe('example.com');
      expect(TextHelper.extractDomain('http://sub.example.com')).toBe('sub.example.com');
    });
  });

  describe('pluralize', () => {
    it('should return singular for count of 1', () => {
      expect(TextHelper.pluralize(1, 'item')).toBe('1 item');
    });

    it('should return plural for count other than 1', () => {
      expect(TextHelper.pluralize(0, 'item')).toBe('0 items');
      expect(TextHelper.pluralize(2, 'item')).toBe('2 items');
    });

    it('should use custom plural if provided', () => {
      expect(TextHelper.pluralize(2, 'child', 'children')).toBe('2 children');
    });
  });
});

describe('ArrayHelper', () => {
  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const chunks = ArrayHelper.chunk(array, 3);
      expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe('unique', () => {
    it('should remove duplicates from array', () => {
      const array = [1, 2, 2, 3, 4, 4, 5];
      const unique = ArrayHelper.unique(array);
      expect(unique).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('shuffle', () => {
    it('should return an array of the same length', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = ArrayHelper.shuffle(array);
      expect(shuffled.length).toBe(array.length);
      expect(shuffled).toContain(1);
      expect(shuffled).toContain(2);
      expect(shuffled).toContain(3);
      expect(shuffled).toContain(4);
      expect(shuffled).toContain(5);
    });
  });
});