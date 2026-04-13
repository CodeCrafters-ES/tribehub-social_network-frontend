# PR: Add onboarding profile UI (I-F-P01-05-02)

## Summary

Implemented the onboarding profile screen that allows users to complete their profile after login. Uses the existing GET/PATCH `/v1/profile/me` backend endpoints.

## Changes

### New Files

| File                                           | Description                          |
| ---------------------------------------------- | ------------------------------------ |
| `app/(protected)/layout.tsx`                   | Protected routes with auth check     |
| `app/(protected)/onboarding/profile/page.tsx`  | Profile form (React Hook Form + Zod) |
| `app/(protected)/onboarding/profile/error.tsx` | Error boundary                       |
| `app/api/v1/profile/route.ts`                  | BFF: cookie → JWT Authorization      |
| `services/api/profile.ts`                      | Profile API service                  |

### Modified Files

| File                    | Change            |
| ----------------------- | ----------------- |
| `.gitignore`            | Added `openspec/` |
| `next.config.ts`        | CSP fix for dev   |
| `services/api/axios.ts` | Cleanup           |

## How It Works

1. User visits `/onboarding/profile`
2. Protected layout checks auth via cookie
3. Page fetches profile via BFF route `/api/v1/profile`
4. BFF reads `tribehub_session` cookie, adds `Authorization: Bearer <token>`
5. BFF forwards to backend
6. On save, PATCH to backend → redirect to `/feed`

## Validation

- displayName: 2-50 chars (required)
- bio: 0-280 chars (optional)
- avatarUrl: valid URL (optional)
- isPublic: boolean (default true)

## UX States

- Loading: skeleton
- Saving: button spinner
- Error: inline message
- Success: redirect to `/feed`

## Testing

- `services/api/__tests__/profileApi.test.ts`
- `app/(protected)/onboarding/profile/__tests__/profileValidation.test.ts`

## Related

- Closes #40
- Parent: #29 (F-P01-05)
- Related: I-F-P01-05-01 (backend endpoints)

## Notes

- Redirect goes to `/feed` (exists in app)
- If user has displayName, redirects to feed (profile already complete)
- BFF is ready for CSRF when PR #158 merges
- Error handling distinguishes 404 (new user) from actual errors
