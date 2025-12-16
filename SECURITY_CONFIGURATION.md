# Security Configuration Guide

This document outlines the security improvements implemented and the required Dashboard configurations.

## ✅ Implemented (Application-Level)

### 1. Role-Based Access Control (RBAC)
- **User Roles Table**: Created `user_roles` table with `app_role` enum ('admin', 'moderator', 'user')
- **Security Definer Functions**: `has_role()` and `is_admin()` functions prevent RLS recursion
- **Updated RLS Policies**: All admin tables now require admin role via `is_admin(auth.uid())`
- **Affected tables**: products, species, manuals, carousel_items, system_settings, contact_messages, waitlist, internship_waitlist, species_waitlist, material_leads, cart_analytics

### 2. Edge Function Security (`notify-waitlist`)
- **Admin Role Verification**: Function now verifies caller has admin role before execution
- **HTML Sanitization**: Custom messages are sanitized with `escapeHtml()` to prevent XSS
- **Proper Error Handling**: Returns 401/403 for unauthorized/forbidden access

### 3. Rate Limiting Service (`src/services/rateLimitService.ts`)
- **OTP Requests**: Limited to 1 request per 60 seconds per email
- **Login Attempts**: Maximum 5 attempts per 15 minutes per email
- **Verification Attempts**: Maximum 5 attempts per OTP
- Auto-cleanup of old entries every 10 minutes

### 4. Security Monitoring Service (`src/services/authSecurityService.ts`)
- Logs all security events (failed logins, OTP requests, password resets)
- Detects suspicious activity patterns
- Monitors new device logins
- Sends security notifications for critical events

## ⚠️ Required: Supabase Dashboard Configuration

### 🔴 CRITICAL: Configure OTP Expiry

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

## 🔧 How to Grant Admin Access

After the migration is applied, you need to grant admin access to your admin users:

```sql
-- Replace 'USER_ID_HERE' with the actual user UUID
INSERT INTO user_roles (user_id, role) 
VALUES ('USER_ID_HERE', 'admin');
```

You can find user IDs in the Supabase Dashboard under [Authentication → Users](https://supabase.com/dashboard/project/xlhcneenthhhsjqqdmbm/auth/users).

## 🧪 Testing Checklist

After completing Dashboard configurations:

- [ ] Test admin access: Only users with admin role can access admin functions
- [ ] Test OTP expiry: Request OTP and verify it expires at configured time
- [ ] Test single-use: Verify OTP cannot be reused after first verification
- [ ] Test rate limiting: Try multiple login attempts (should block after 5 attempts)
- [ ] Test OTP rate limiting: Try multiple password reset requests (should block after 60s)
- [ ] Test notify-waitlist: Verify non-admin users get 403 Forbidden

## 📊 Security Features Overview

| Feature | Status | Location |
|---------|--------|----------|
| Role-Based Access Control | ✅ Implemented | Database (user_roles table) |
| RLS Admin Policies | ✅ Implemented | All admin tables |
| Edge Function Auth | ✅ Implemented | `notify-waitlist` |
| HTML Sanitization | ✅ Implemented | `notify-waitlist` |
| Login Rate Limiting | ✅ Implemented | `rateLimitService.ts` |
| OTP Rate Limiting | ✅ Implemented | `rateLimitService.ts` |
| Security Event Logging | ✅ Implemented | `authSecurityService.ts` |
| OTP Expiry (15 min) | ⚠️ Dashboard Config Required | Supabase Dashboard |
| Leaked Password Protection | ⚠️ Dashboard Config Required | Supabase Dashboard |
| PostgreSQL Update | ⚠️ Dashboard Config Required | Supabase Dashboard |

## 📝 Next Steps

1. **Grant admin role** to your admin user(s) using the SQL above
2. **Complete Dashboard configurations** (OTP expiry, leaked password protection, PostgreSQL upgrade)
3. **Test all security features** using the testing checklist above
4. **Monitor edge function logs** for any unauthorized access attempts

---

**Priority**: Grant admin role to your user first, then complete Dashboard configurations.
