import type { NextRequest } from 'next/server';
import type { RateLimitEntry, CheckRateLimit, PasswordStrengthAnalyzer } from '@/types/auth';
import { JWT_SECRET } from '@/config/env';
import crypto from 'crypto';

// Advanced rate limiting with Redis-like behavior using Map
const rateLimitStore = new Map<string, RateLimitEntry>();

// Enhanced security utilities
export class SecurityUtils {
  // Generate secure hash for various purposes
  static generateSecureHash(data: string, salt?: string): string {
    const hashSalt = salt || JWT_SECRET!;
    return crypto
      .createHash('sha256')
      .update(data + hashSalt)
      .digest('hex');
  }

  // Hash IP address for GDPR-compliant storage
  static hashIP(ip: string): string {
    return this.generateSecureHash(ip).substring(0, 16);
  }

  // Create device fingerprint hash
  static createDeviceFingerprint(userAgent: string, acceptLanguage: string, ip: string): string {
    const deviceData = `${userAgent}|${acceptLanguage}|${this.hashIP(ip)}`;
    return this.generateSecureHash(deviceData).substring(0, 32);
  }

  // Enhanced user agent sanitization
  static sanitizeUserAgent(userAgent: string | undefined): string | null {
    if (!userAgent) return null;

    // Remove potentially dangerous content
    const sanitized = userAgent
      .replace(/[<>\"'\\]/g, '') // Remove dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/data:/gi, '') // Remove data protocol
      .substring(0, 300); // Increased limit for better analytics

    return sanitized || null;
  }

  // Extract real IP with enhanced proxy detection
  static extractIP(request: NextRequest): string {
    const headers = [
      'cf-connecting-ip', // Cloudflare
      'x-real-ip',
      'x-forwarded-for',
      'x-client-ip',
      'x-forwarded',
      'x-cluster-client-ip',
      'forwarded-for',
      'forwarded',
    ];

    for (const header of headers) {
      const value = request.headers.get(header);
      if (value) {
        // Handle comma-separated IPs (proxies)
        const ip = value.split(',')[0].trim();
        if (ip && ip !== 'unknown') {
          return ip;
        }
      }
    }

    return 'unknown';
  }

  // Advanced rate limiting with progressive penalties
  static checkRateLimit(
    identifier: string,
    maxRequests: number = 5,
    windowMs: number = 15 * 60 * 1000,
    blockDurationMs: number = 60 * 60 * 1000,
  ): CheckRateLimit {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    // Check if currently blocked
    if (record?.blocked && record.blockUntil && now < record.blockUntil) {
      return { allowed: false, retryAfter: Math.ceil((record.blockUntil - now) / 1000) };
    }

    // Reset or create new record
    if (!record || now > record.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
        blocked: false,
      });
      return { allowed: true };
    }

    // Increment count
    record.count++;

    // Block if exceeded
    if (record.count > maxRequests) {
      record.blocked = true;
      record.blockUntil = now + blockDurationMs;
      return { allowed: false, retryAfter: Math.ceil(blockDurationMs / 1000) };
    }

    return { allowed: true };
  }

  // Password strength analyzer
  static analyzePasswordStrength(password: string): PasswordStrengthAnalyzer {
    const feedback: string[] = [];
    let score = 0;

    // Length checks
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Advanced patterns
    if (!/(.)\1{2,}/.test(password))
      score += 1; // No repeated characters
    else feedback.push('Avoid repeated characters');

    if (!/123|abc|qwe|password|admin/i.test(password)) score += 1;
    else feedback.push('Avoid common patterns');

    return {
      score,
      feedback,
      isStrong: score >= 6,
    };
  }

  // Clean up expired rate limit entries
  static cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetTime < now && (!record.blockUntil || record.blockUntil < now)) {
        rateLimitStore.delete(key);
      }
    }
  }
}
