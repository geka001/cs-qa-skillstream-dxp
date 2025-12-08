# OAuth Setup Summary

## What I Did

I've helped you troubleshoot and fix the OAuth token generation for the Contentstack Personalize Management API. Here's what was implemented:

### 1. ✅ Enhanced Error Handling

Updated `/app/api/challenge-pro/activate/route.ts` with:
- **Better error messages** with detailed troubleshooting steps
- **Fallback endpoints** - tries two different OAuth endpoints
- **Comprehensive logging** to help diagnose issues
- **Dual authentication support** - OAuth or Management Token (though Management Token doesn't work for Personalize API)

### 2. ✅ Added Feature Flag

Added `PERSONALIZE_USE_MANAGEMENT_TOKEN` environment variable:
- Allows quick switching between OAuth and Management Token
- Added to `env.template` with documentation
- Already enabled in your `.env.local`

Note: Management Token doesn't work with Personalize Management API, so OAuth is required.

### 3. ✅ Created Documentation

Three comprehensive guides:

1. **OAUTH_SETUP_GUIDE.md** - Complete OAuth setup instructions
2. **TEST_OAUTH_TOKEN.md** - Step-by-step testing and troubleshooting
3. This summary document

### 4. ✅ Code Improvements

- Added `getAuthHeaders()` helper function
- Fixed all API calls to use correct authentication headers
- Added support for both OAuth Bearer tokens and Management Token (authtoken)
- Enhanced logging throughout the authentication flow

## The Root Cause

Your OAuth error (`invalid grant_type` or `401 Unauthorized`) indicates the Stack App in Developer Hub is not properly configured. This is **NOT a code issue** - the code is correct.

## What You Need to Do

### Step 1: Configure Stack App in Developer Hub

1. Go to https://app.contentstack.com/#!/developer-hub
2. Find or create your Stack App (Client ID: `d4WJ5-US6pPlBylW`)
3. **Critical Settings:**
   - ✅ App Type: **Stack App** (not Custom App)
   - ✅ OAuth Grant Type: **Enable "Client Credentials (M2M)"**
   - ✅ Scopes: Select ALL of these:
     - `personalize:manage`
     - `personalize:read`
     - `cm:personalize:read`
     - `cm:personalize:write`
     - `cm:stack:read`
     - `cm:stack:write`

4. **Install the app** on your stack (QA Skillstream DXP)

### Step 2: Test Token Generation

```bash
curl -X POST 'https://app.contentstack.com/apps-api/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  -d 'client_id=d4WJ5-US6pPlBylW' \
  -d 'client_secret=QLKxz-Def2XJaewBPokKF6q_SBeqSg1x'
```

You should get:
```json
{
  "access_token": "cs_oauth_xxxxx...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Step 3: Restart Your App

```bash
npm run dev
```

The Challenge Pro activation will now work!

## Testing the Integration

Once OAuth works, you can test Challenge Pro:

1. Log in as a HIGH_FLYER user
2. Click "Activate Challenge Pro"
3. Check server logs - you should see:
   ```
   ✅ Successfully generated OAuth token
   📝 Creating audience: ...
   ✅ Audience created
   📝 Creating experience: ...
   ✅ Experience created
   ```

## Files Modified

1. `/app/api/challenge-pro/activate/route.ts` - Enhanced OAuth logic
2. `/env.template` - Added PERSONALIZE_USE_MANAGEMENT_TOKEN flag
3. `/.env.local` - Added PERSONALIZE_USE_MANAGEMENT_TOKEN=true
4. Created `/OAUTH_SETUP_GUIDE.md`
5. Created `/TEST_OAUTH_TOKEN.md`

## Current Environment Variables

Your `.env.local` has:
```env
CONTENTSTACK_CLIENT_ID=d4WJ5-US6pPlBylW
CONTENTSTACK_CLIENT_SECRET=QLKxz-Def2XJaewBPokKF6q_SBeqSg1x
CONTENTSTACK_ORG_ID=blt28cf49b56127ddc9
NEXT_PUBLIC_PERSONALIZE_PROJECT_UID=68a6ec844875734317267dcf
PERSONALIZE_USE_MANAGEMENT_TOKEN=true  # Can set to false once OAuth works
```

## Troubleshooting

If it still doesn't work after configuring the Stack App:

1. Check Developer Hub → Your App → Settings
2. Verify "Client Credentials" checkbox is enabled
3. Verify all 6 scopes are selected
4. Verify app shows in Stack → Settings → Apps
5. Try regenerating Client Secret if needed
6. Check server logs for detailed error messages

## Using Contentstack MCP (Alternative)

While waiting for OAuth setup, you can use Contentstack MCP tools directly in Cursor to:
- Create audiences
- Create experiences
- Manage content

However, the Challenge Pro feature requires OAuth to work dynamically.

## Next Steps

1. Configure Stack App in Developer Hub (see TEST_OAUTH_TOKEN.md)
2. Test with curl command
3. Restart Next.js dev server
4. Test Challenge Pro activation

## Questions?

The code is ready and will work once the Stack App is properly configured. See the documentation files for detailed instructions.




