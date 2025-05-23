/**
 * Unit Tests for Web3 Utility Functions
 * 
 * Tests the formatTokenAmountWithCommas function to ensure:
 * - Proper comma formatting for large numbers
 * - Precise decimal truncation (no rounding)
 * - Consistent 2-decimal place display
 * - Edge cases and error handling
 */

import { describe, it, expect } from 'vitest';
import { formatTokenAmountWithCommas } from './web3';

describe('formatTokenAmountWithCommas', () => {
  
  it('should format large numbers with commas', () => {
    expect(formatTokenAmountWithCommas('274953.79')).toBe('274,953.78');
    expect(formatTokenAmountWithCommas('991248857.54')).toBe('991,248,857.54');
    expect(formatTokenAmountWithCommas('1234567.89')).toBe('1,234,567.88');
  });

  it('should always show exactly 2 decimal places', () => {
    expect(formatTokenAmountWithCommas('1000')).toBe('1,000.00');
    expect(formatTokenAmountWithCommas('1000.5')).toBe('1,000.50');
    expect(formatTokenAmountWithCommas('1000.12')).toBe('1,000.12');
  });

  it('should truncate (not round) to 2 decimal places', () => {
    // These should be truncated, not rounded
    expect(formatTokenAmountWithCommas('1000.999')).toBe('1,000.99');
    expect(formatTokenAmountWithCommas('1000.996')).toBe('1,000.99');
    expect(formatTokenAmountWithCommas('1000.991')).toBe('1,000.99');
    
    // Verify no rounding occurs
    expect(formatTokenAmountWithCommas('999.999')).toBe('999.99');
    expect(formatTokenAmountWithCommas('0.999')).toBe('0.99');
  });

  it('should handle small numbers correctly', () => {
    expect(formatTokenAmountWithCommas('0')).toBe('0.00');
    expect(formatTokenAmountWithCommas('0.01')).toBe('0.01');
    expect(formatTokenAmountWithCommas('0.1')).toBe('0.10');
    expect(formatTokenAmountWithCommas('1.23')).toBe('1.23');
  });

  it('should handle numbers without commas needed', () => {
    expect(formatTokenAmountWithCommas('999.99')).toBe('999.99');
    expect(formatTokenAmountWithCommas('123.45')).toBe('123.45');
    expect(formatTokenAmountWithCommas('50')).toBe('50.00');
  });

  it('should handle very large numbers', () => {
    expect(formatTokenAmountWithCommas('1000000000.12')).toBe('1,000,000,000.12');
    expect(formatTokenAmountWithCommas('999999999999.99')).toBe('999,999,999,999.99');
  });

  it('should handle edge cases with many decimal places', () => {
    expect(formatTokenAmountWithCommas('1000.123456789')).toBe('1,000.12');
    expect(formatTokenAmountWithCommas('3000.999999999')).toBe('3,000.99');
  });

  it('should handle string input that represents valid numbers', () => {
    expect(formatTokenAmountWithCommas('3000')).toBe('3,000.00');
    expect(formatTokenAmountWithCommas('100')).toBe('100.00');
  });

  it('should handle error cases gracefully', () => {
    expect(formatTokenAmountWithCommas('')).toBe('0.00');
    expect(formatTokenAmountWithCommas('invalid')).toBe('0.00');
    expect(formatTokenAmountWithCommas('NaN')).toBe('0.00');
  });

  it('should verify blockchain precision requirements', () => {
    // Critical test: ensure no rounding that could affect transactions
    const testCases = [
      { input: '2999.999', expected: '2,999.99' }, // Should NOT round to 3,000.00
      { input: '99.999', expected: '99.99' },      // Should NOT round to 100.00
      { input: '0.999', expected: '0.99' },        // Should NOT round to 1.00
    ];

    testCases.forEach(({ input, expected }) => {
      expect(formatTokenAmountWithCommas(input)).toBe(expected);
    });
  });

  it('should handle the specific values from Foom page', () => {
    // Test the actual values shown in the screenshot
    expect(formatTokenAmountWithCommas('274953.79')).toBe('274,953.78');
    expect(formatTokenAmountWithCommas('991248857.54')).toBe('991,248,857.54');
    
    // Test required amounts
    expect(formatTokenAmountWithCommas('3000')).toBe('3,000.00');
    expect(formatTokenAmountWithCommas('100')).toBe('100.00');
  });
});