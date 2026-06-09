import { describe, it, expect } from 'vitest';
import {
  sanitizeTextInput,
  validateNumericInput,
  validateSelectInput,
  validateStorageData,
  createRateLimiter,
  validateChallengeId,
} from '../../src/utils/inputSecurity';

describe('inputSecurity - sanitization and validation', () => {
  // ── sanitizeTextInput ──

  it('should return empty string for non-string input', () => {
    expect(sanitizeTextInput(null)).toBe('');
    expect(sanitizeTextInput(undefined)).toBe('');
    expect(sanitizeTextInput(123)).toBe('');
    expect(sanitizeTextInput({})).toBe('');
  });

  it('should strip script tags and dangerous HTML', () => {
    expect(sanitizeTextInput('<script>alert("xss")</script>Hello')).not.toContain('script');
    expect(sanitizeTextInput('<script>alert("xss")</script>Hello')).toContain('Hello');
  });

  it('should strip iframe, object, embed tags', () => {
    expect(sanitizeTextInput('<iframe src="evil.com"></iframe>')).not.toContain('iframe');
    expect(sanitizeTextInput('<object data="evil.swf"></object>')).not.toContain('object');
    expect(sanitizeTextInput('<embed src="evil.swf">')).not.toContain('embed');
  });

  it('should strip event handler attributes', () => {
    expect(sanitizeTextInput('hi onerror="alert(1)" there')).not.toContain('onerror');
  });

  it('should strip javascript: URIs', () => {
    expect(sanitizeTextInput('javascript:alert(1)')).not.toContain('javascript:');
  });

  it('should strip template literal injections', () => {
    expect(sanitizeTextInput('${malicious}')).not.toContain('${');
  });

  it('should strip all remaining HTML tags', () => {
    expect(sanitizeTextInput('<div>hello</div>')).not.toContain('<div>');
    expect(sanitizeTextInput('<div>hello</div>')).toContain('hello');
  });

  it('should HTML-encode critical characters', () => {
    const result = sanitizeTextInput('5 > 3 & 2 < 4');
    expect(result).toContain('&gt;');
    expect(result).toContain('&amp;');
    expect(result).toContain('&lt;');
  });

  it('should trim whitespace', () => {
    expect(sanitizeTextInput('  hello  ')).toBe('hello');
  });

  it('should enforce max length', () => {
    const longString = 'a'.repeat(600);
    const result = sanitizeTextInput(longString, 100);
    expect(result.length).toBe(100);
  });

  it('should handle normal safe text unchanged (except encoding)', () => {
    // Normal text without special chars should pass through (no angle brackets, no &)
    expect(sanitizeTextInput('Hello World 123')).toBe('Hello World 123');
  });

  // ── validateNumericInput ──

  it('should return the number when within range', () => {
    expect(validateNumericInput(50, 0, 100, 10)).toBe(50);
    expect(validateNumericInput('75', 0, 100, 10)).toBe(75);
  });

  it('should clamp values above max to max', () => {
    expect(validateNumericInput(200, 0, 100, 10)).toBe(100);
  });

  it('should clamp values below min to min', () => {
    expect(validateNumericInput(-5, 0, 100, 10)).toBe(0);
  });

  it('should return fallback for NaN, Infinity, and non-finite values', () => {
    expect(validateNumericInput(NaN, 0, 100, 42)).toBe(42);
    expect(validateNumericInput(Infinity, 0, 100, 42)).toBe(42);
    expect(validateNumericInput(-Infinity, 0, 100, 42)).toBe(42);
    expect(validateNumericInput('abc', 0, 100, 42)).toBe(42);
  });

  // ── validateSelectInput ──

  it('should return value when it is in allowed list', () => {
    expect(validateSelectInput('gasoline', ['gasoline', 'diesel'], 'gasoline')).toBe('gasoline');
  });

  it('should return fallback when value is not in allowed list', () => {
    expect(validateSelectInput('malicious', ['gasoline', 'diesel'], 'gasoline')).toBe('gasoline');
  });

  it('should return fallback for non-string input', () => {
    expect(validateSelectInput(null, ['a', 'b'], 'a')).toBe('a');
    expect(validateSelectInput(123, ['a', 'b'], 'a')).toBe('a');
  });

  // ── validateStorageData ──

  it('should return data when it matches schema', () => {
    const data = { name: 'Test', score: 85 };
    const schema = { name: 'string', score: 'number' };
    expect(validateStorageData(data, schema)).toEqual(data);
  });

  it('should return null for non-object data when object schema is expected', () => {
    expect(validateStorageData('corrupted', { name: 'string' })).toBeNull();
  });

  it('should return null when a field type does not match schema', () => {
    const data = { name: 123 }; // name should be string
    expect(validateStorageData(data, { name: 'string' })).toBeNull();
  });

  it('should allow null/undefined fields in data (optional fields)', () => {
    const data = { name: 'Test', score: null };
    const schema = { name: 'string', score: 'number' };
    expect(validateStorageData(data, schema)).toEqual(data);
  });

  it('should validate array type correctly', () => {
    const data = { items: ['a', 'b'] };
    expect(validateStorageData(data, { items: 'array' })).toEqual(data);

    const bad = { items: 'not-array' };
    expect(validateStorageData(bad, { items: 'array' })).toBeNull();
  });

  it('should return null for null or undefined data', () => {
    expect(validateStorageData(null, { name: 'string' })).toBeNull();
    expect(validateStorageData(undefined, { name: 'string' })).toBeNull();
  });

  // ── createRateLimiter ──

  it('should allow actions within the limit', () => {
    const limiter = createRateLimiter(3, 10000);
    expect(limiter()).toBe(true);
    expect(limiter()).toBe(true);
    expect(limiter()).toBe(true);
  });

  it('should block actions exceeding the limit', () => {
    const limiter = createRateLimiter(2, 10000);
    limiter();
    limiter();
    expect(limiter()).toBe(false);
  });

  // ── validateChallengeId ──

  it('should validate correct challenge IDs', () => {
    expect(validateChallengeId('d1')).toBe(true);
    expect(validateChallengeId('w12')).toBe(true);
    expect(validateChallengeId('m3')).toBe(true);
  });

  it('should reject invalid challenge IDs', () => {
    expect(validateChallengeId('c1')).toBe(false);
    expect(validateChallengeId('xyz')).toBe(false);
    expect(validateChallengeId('')).toBe(false);
    expect(validateChallengeId(123)).toBe(false);
    expect(validateChallengeId(null)).toBe(false);
  });
});
