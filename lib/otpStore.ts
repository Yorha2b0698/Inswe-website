// Singleton OTP store — shared across all API routes in the same process.
// For production with multiple instances, replace with Redis.

export type OtpRecord = {
  code: string;
  expiresAt: number;
  attempts: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpRecord> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map<string, OtpRecord>();
}

export const otpStore = global.__otpStore;
