# Security Configuration Guide

This document outlines the security improvements implemented and the required Dashboard configurations to fully address the OTP expiry security warnings.

## ✅ Implemented (Application-Level)

### 1. Rate Limiting Service (`src/services/rateLimitService.ts`)
- **OTP Requests**: Limited to 1 request per 60 seconds per email
- **Login Attempts**: Maximum 5 attempts per 15 minutes per email
- **Verification Attempts**: Maximum 5 attempts per OTP
- Auto-cleanup of old entries every 10 minutes

### 2. Security Monitoring Service (`src/services/authSecurityService.ts`)
- Logs all security events (failed logins, OTP requests, password resets)
- Detects suspicious activity patterns
- Monitors new device logins
- Sends security notifications for critical events
- Tracks recent events for monitoring dashboard

### 3. Enhanced Authentication Service
- Login service now includes rate limiting and security monitoring
- Password reset service includes OTP rate limiting
- New device detection and notifications
- Failed login attempt tracking

## ⚠️ Required: Supabase Dashboard Configuration

### 🔴 CRITICAL: Configure OTP Expiry (PRIMARY FIX)

**Status**: Must be configured manually in Dashboard

**Steps**:
1. Navigate to: [Authentication → Settings](https://supabase.com/dashboard/project/xlhcneenthhhsjqqdmbm/auth/providers)
2. Scroll to **Email Auth** section
3. Locate **OTP Expiry** field
4. Change from current value to: **900** (15 minutes)
5. Alternative secure values:
   - `300` = 5 minutes (high security)
   - `600` = 10 minutes (recommended)
   - `1800` = 30 minutes (moderate)
6. Click **Save**

### 🟡 Enable Leaked Password Protection

**Status**: Dashboard-only configuration

**Steps**:
1. Go to: [Auth → Settings → Password Protection](https://supabase.com/dashboard/project/xlhcneenthhhsjqqdmbm/auth/providers)
2. Enable the **"Protect against leaked passwords"** toggle
3. Optional: Adjust sensitivity level
4. Click **Save**

**Reference**: [Supabase Password Policies](https://supabase.com/docs/guides/auth/passwords)

### 🟡 Upgrade PostgreSQL Version

**Status**: Dashboard-only operation

**Steps**:
1. Navigate to: [Database → Settings](https://supabase.com/dashboard/project/xlhcneenthhhsjqqdmbm/settings/database)
2. Check current PostgreSQL version
3. If update available, click **Upgrade to latest version**
4. **⚠️ Important**: Ensure backup is taken before upgrading
5. Monitor upgrade progress

**Reference**: [PostgreSQL Release Notes](https://www.postgresql.org/docs/release/)

### 🟡 Email Security Settings (Recommended)

**Steps**:
1. Go to: [Settings → Email](https://supabase.com/dashboard/project/xlhcneenthhhsjqqdmbm/settings/auth)
2. Verify SMTP settings use TLS
3. Consider using reputable email service (SendGrid, AWS SES, etc.)
4. Enable DKIM and SPF records for your domain

## 🧪 Testing Checklist

After completing Dashboard configurations:

- [ ] Test OTP expiry: Request OTP and verify it expires at configured time
- [ ] Test single-use: Verify OTP cannot be reused after first verification
- [ ] Test rate limiting: Try multiple login attempts (should block after 5 attempts)
- [ ] Test OTP rate limiting: Try multiple password reset requests (should block after 60s)
- [ ] Monitor security logs in browser console (development mode)
- [ ] Verify security notifications are logged for suspicious activity

## 📊 Monitoring

In development mode, security events are logged to the browser console with prefix: `[Security Event]`

To view recent security events programmatically:
```typescript
import { authSecurityService } from '@/services/authSecurityService';

// Get last 50 security events
const events = authSecurityService.getRecentEvents(50);
console.log(events);
```

## 🔒 Security Features Overview

| Feature | Status | Location |
|---------|--------|----------|
| OTP Expiry (15 min) | ⚠️ Dashboard Config Required | Supabase Dashboard |
| Login Rate Limiting | ✅ Implemented | `rateLimitService.ts` |
| OTP Rate Limiting | ✅ Implemented | `rateLimitService.ts` |
| Security Event Logging | ✅ Implemented | `authSecurityService.ts` |
| New Device Detection | ✅ Implemented | `authSecurityService.ts` |
| Leaked Password Protection | ⚠️ Dashboard Config Required | Supabase Dashboard |
| PostgreSQL Update | ⚠️ Dashboard Config Required | Supabase Dashboard |

## 📝 Next Steps

1. **Complete Dashboard configurations** (OTP expiry is most critical)
2. **Test all security features** using the testing checklist above
3. **Monitor security logs** during testing
4. **Consider implementing** edge function for email notifications
5. **Set up** external monitoring/alerting for production

---

**Priority**: Configure OTP expiry in Dashboard ASAP - this is the primary fix for the security warning.
