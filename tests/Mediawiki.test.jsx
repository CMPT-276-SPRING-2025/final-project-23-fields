import { describe, it, expect, beforeEach } from 'vitest';
import { callWikipediaAPI } from '../src/components/Mediawiki';

describe('Mediawiki Component', () => {
  describe('callWikipediaAPI', () => {
    it('should return error for invalid request type', async () => {
      const result = await callWikipediaAPI('invalid', 'test');
      expect(result.missing).toBe(true);
      expect(result.extract).toBe("Improper search query. This is likely a formatting error resulting from Gemini!");
    });

    it('should handle search request', async () => {
      const result = await callWikipediaAPI('search', 'JavaScript programming');
      expect(result.missing).toBe(false);
      expect(result.extract).toBeTruthy();
    });

    it('should handle page request', async () => {
      const result = await callWikipediaAPI('page', 'JavaScript');
      expect(result.missing).toBe(false);
      expect(result.extract).toBeTruthy();
    });

    it('should handle description request', async () => {
      const result = await callWikipediaAPI('description', 'JavaScript');
      expect(result.missing).toBe(false);
      expect(result.extract).toBeTruthy();
    });

    it('should handle non-existent page', async () => {
      const result = await callWikipediaAPI('page', 'ThisPageDefinitelyDoesNotExist12345');
      expect(result.missing).toBe(true);
      expect(result.extract).toBe('Wiki Page for ThisPageDefinitelyDoesNotExist12345 does not exist!');
    });
  });
});