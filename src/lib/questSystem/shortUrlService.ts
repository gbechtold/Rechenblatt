import { ChallengeLink } from './types';

// Simple in-memory storage for demo - in production, use a database
const urlMap = new Map<string, string>();
let counter = 1000;

export class ShortUrlService {
  private static instance: ShortUrlService;

  private constructor() {}

  public static getInstance(): ShortUrlService {
    if (!ShortUrlService.instance) {
      ShortUrlService.instance = new ShortUrlService();
    }
    return ShortUrlService.instance;
  }

  // Generate a short code
  private generateShortCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    let num = counter++;
    
    while (num > 0) {
      code = chars[num % chars.length] + code;
      num = Math.floor(num / chars.length);
    }
    
    return code.padStart(4, chars[0]);
  }

  // Create a short URL
  public createShortUrl(longData: string): string {
    // Check if we already have this data
    const entries = Array.from(urlMap.entries());
    for (const [code, data] of entries) {
      if (data === longData) {
        return code;
      }
    }
    
    // Generate new short code
    const shortCode = this.generateShortCode();
    urlMap.set(shortCode, longData);
    
    return shortCode;
  }

  // Retrieve the original data
  public getLongData(shortCode: string): string | null {
    return urlMap.get(shortCode) || null;
  }

  // Store challenge data and return short code
  public createChallengeCode(challengeData: ChallengeLink): string {
    const json = JSON.stringify(challengeData);
    return this.createShortUrl(json);
  }

  // Retrieve challenge data from short code
  public getChallenge(shortCode: string): ChallengeLink | null {
    const data = this.getLongData(shortCode);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as ChallengeLink;
    } catch {
      return null;
    }
  }
}