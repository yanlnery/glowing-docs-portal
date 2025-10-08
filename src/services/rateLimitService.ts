// Rate limiting service for auth operations
// Limits: 1 OTP request per 60s per email, 5 verification attempts per OTP

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

class RateLimitService {
  private otpRequests: Map<string, RateLimitEntry> = new Map();
  private verificationAttempts: Map<string, RateLimitEntry> = new Map();
  private loginAttempts: Map<string, RateLimitEntry> = new Map();

  // OTP request rate limiting: 1 per 60 seconds
  checkOTPRequestLimit(email: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.otpRequests.get(email);

    if (!entry) {
      this.otpRequests.set(email, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return { allowed: true };
    }

    const timeSinceLastRequest = now - entry.lastAttempt;
    if (timeSinceLastRequest < 60000) { // 60 seconds
      return {
        allowed: false,
        retryAfter: Math.ceil((60000 - timeSinceLastRequest) / 1000)
      };
    }

    // Reset after cooldown
    this.otpRequests.set(email, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now
    });
    return { allowed: true };
  }

  // Login attempt rate limiting: 5 attempts per 15 minutes
  checkLoginLimit(email: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.loginAttempts.get(email);
    const windowDuration = 15 * 60 * 1000; // 15 minutes

    if (!entry) {
      this.loginAttempts.set(email, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return { allowed: true };
    }

    // Reset window if expired
    if (now - entry.firstAttempt > windowDuration) {
      this.loginAttempts.set(email, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return { allowed: true };
    }

    // Check if limit exceeded
    if (entry.count >= 5) {
      const timeRemaining = windowDuration - (now - entry.firstAttempt);
      return {
        allowed: false,
        retryAfter: Math.ceil(timeRemaining / 1000)
      };
    }

    // Increment count
    this.loginAttempts.set(email, {
      ...entry,
      count: entry.count + 1,
      lastAttempt: now
    });
    return { allowed: true };
  }

  // Clear rate limit on successful login
  clearLoginLimit(email: string): void {
    this.loginAttempts.delete(email);
  }

  // Verification attempt rate limiting: 5 attempts per OTP
  checkVerificationLimit(identifier: string): { allowed: boolean; attemptsLeft?: number } {
    const now = Date.now();
    const entry = this.verificationAttempts.get(identifier);
    const maxAttempts = 5;

    if (!entry) {
      this.verificationAttempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return { allowed: true, attemptsLeft: maxAttempts - 1 };
    }

    if (entry.count >= maxAttempts) {
      return { allowed: false, attemptsLeft: 0 };
    }

    this.verificationAttempts.set(identifier, {
      ...entry,
      count: entry.count + 1,
      lastAttempt: now
    });

    return { allowed: true, attemptsLeft: maxAttempts - entry.count - 1 };
  }

  // Cleanup old entries (call periodically)
  cleanup(): void {
    const now = Date.now();
    const cleanupThreshold = 60 * 60 * 1000; // 1 hour

    [this.otpRequests, this.verificationAttempts, this.loginAttempts].forEach(map => {
      for (const [key, entry] of map.entries()) {
        if (now - entry.lastAttempt > cleanupThreshold) {
          map.delete(key);
        }
      }
    });
  }
}

export const rateLimitService = new RateLimitService();

// Cleanup every 10 minutes
setInterval(() => rateLimitService.cleanup(), 10 * 60 * 1000);
