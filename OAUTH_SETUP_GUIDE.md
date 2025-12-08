# OAuth Setup Guide for Personalize Management API

## Current Issue
Your OAuth app is returning `401 Unauthorized` error when trying to generate a token. This indicates the app is not properly configured or installed on your stack.

## Solution Options

### Option 1: Fix OAuth App (Recommended for Production)

#### Step 1: Create/Configure Stack App in Developer Hub

1. **Go to Developer Hub**
   - URL: https://app.contentstack.com/#!/developer-hub
   - Navigate to your organization

2. **Create New Stack App**
   - Click "Create App" → "Stack App"
   - **App Name**: `Personalize Management`
   - **Description**: `App for managing Personalize experiences and audiences`

3. **Configure OAuth Settings**
   - **OAuth Grant Type**: ✅ Enable "Client Credentials (M2M)"
   - **Redirect URL**: Not needed for M2M
   - **Scopes** (CRITICAL - must select these):
     - ✅ `cm:personalize:read` - Read Personalize data
     - ✅ `cm:personalize:write` - Write Personalize data
     - ✅ `cm:stack:read` - Read stack data
     - ✅ `cm:stack:write` - Write stack data

4. **Save and Get Credentials**
   After saving, you'll see:
   - **Client ID**: `xxxx-xxxxx`
   - **Client Secret**: `xxxxx-xxxxx` (SAVE THIS - shown only once!)

#### Step 2: Install App on Your Stack

1. **Install the App**
   - In Developer Hub, find your app
   - Click "Install"
   - Select your stack (QA Skillstream)
   - Authorize the requested permissions

2. **Verify Installation**
   - Go to your stack → Settings → Apps
   - You should see "Personalize Management" listed

#### Step 3: Update Environment Variables

```env
# In .env.local
CONTENTSTACK_CLIENT_ID=your_new_client_id
CONTENTSTACK_CLIENT_SECRET=your_new_client_secret
CONTENTSTACK_ORG_ID=blt28cf49b56127ddc9
```

#### Step 4: Test Token Generation

```bash
curl -X POST https://app.contentstack.com/apps-api/authorize/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=cm:personalize:read cm:personalize:write"
```

You should get:
```json
{
  "access_token": "cs_oauth_xxxxx...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

### Option 2: Use Management Token (Quick Solution)

Your current Management Token already has personalize permissions. You can use it directly without OAuth:

**Pros:**
- ✅ Works immediately
- ✅ No OAuth app setup needed
- ✅ Simpler code

**Cons:**
- ⚠️ Less secure (token doesn't expire)
- ⚠️ Not best practice for production
- ⚠️ Management token has broader permissions

I've created an alternative implementation that uses your Management Token. See `route-management-token.ts`.

---

## Troubleshooting

### Error: "invalid grant_type"
- OAuth app doesn't have "Client Credentials" grant type enabled
- Fix: Edit app in Developer Hub → Enable M2M grant type

### Error: "You're not allowed in here"
- App is not installed on your stack
- Fix: Install the app from Developer Hub

### Error: "invalid_scope"
- Missing required scopes
- Fix: Edit app → Add personalize scopes

### Error: "invalid_client"
- Wrong client_id or client_secret
- Fix: Verify credentials in .env.local

---

## API Endpoints Reference

### OAuth Token Generation
```
POST https://app.contentstack.com/apps-api/authorize/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
client_id=YOUR_CLIENT_ID
client_secret=YOUR_CLIENT_SECRET
scope=cm:personalize:read cm:personalize:write
```

### Personalize Management API
```
GET/POST https://api.contentstack.io/personalize/management/v1/...
Authorization: Bearer YOUR_OAUTH_TOKEN
organization_uid: YOUR_ORG_UID
x-project-uid: YOUR_PROJECT_UID
```

### Using Management Token (Alternative)
```
GET/POST https://api.contentstack.io/personalize/management/v1/...
authtoken: YOUR_MANAGEMENT_TOKEN
organization_uid: YOUR_ORG_UID
x-project-uid: YOUR_PROJECT_UID
```

---

## Next Steps

1. ✅ Choose Option 1 (OAuth) or Option 2 (Management Token)
2. ✅ Test token generation with curl command
3. ✅ Restart your Next.js dev server
4. ✅ Test Challenge Pro activation

---

## Resources

- [Contentstack OAuth Documentation](https://www.contentstack.com/docs/developers/developer-hub/contentstack-oauth)
- [Personalize Management API](https://www.contentstack.com/docs/developers/apis/personalize-management-api)
- [Developer Hub](https://app.contentstack.com/#!/developer-hub)




