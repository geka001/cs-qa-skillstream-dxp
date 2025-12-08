# Testing OAuth Token Generation

## Current Status

Your OAuth credentials are configured:
- Client ID: `d4WJ5-US6pPlBylW`
- Client Secret: ✓ (set)
- Org UID: `blt28cf49b56127ddc9`

## The Problem

The OAuth endpoint is returning errors, which indicates the Stack App is not properly configured in Developer Hub.

## Step-by-Step Fix

### 1. Verify Stack App in Developer Hub

1. **Go to Developer Hub**
   - URL: https://app.contentstack.com/#!/developer-hub
   - Select your organization: `blt28cf49b56127ddc9`

2. **Find or Create Your Stack App**
   - Look for an app with Client ID: `d4WJ5-US6pPlBylW`
   - OR create a new Stack App

3. **Configure OAuth Settings**
   
   **Critical Requirements:**
   - ✅ **App Type**: Stack App (NOT Custom App)
   - ✅ **OAuth Grant Type**: Client Credentials (M2M) - MUST be enabled
   - ✅ **Scopes** (select ALL of these):
     ```
     personalize:manage
     personalize:read
     cm:personalize:read
     cm:personalize:write
     cm:stack:read
     cm:stack:write
     ```

4. **Install the App**
   - Click "Install" button
   - Select your stack: "QA Skillstream DXP"
   - Authorize all requested permissions
   - Verify installation in Stack → Settings → Apps

### 2. Test Token Generation

After configuring the app, test with curl:

```bash
curl -X POST 'https://app.contentstack.com/apps-api/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  -d 'client_id=d4WJ5-US6pPlBylW' \
  -d 'client_secret=QLKxz-Def2XJaewBPokKF6q_SBeqSg1x'
```

**Expected Response:**
```json
{
  "access_token": "cs_oauth_xxxxxxxxxxxxx",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Common Errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid grant_type` | M2M grant not enabled | Enable "Client Credentials" in app settings |
| `unauthorized` / 401 | App not installed on stack | Install app from Developer Hub |
| `invalid_client` | Wrong credentials | Verify Client ID and Secret |
| `invalid_scope` | Missing scopes | Add personalize scopes in app settings |

### 3. Test Personalize API Access

Once you have a valid token, test the Personalize API:

```bash
# Replace YOUR_TOKEN with the access_token from step 2
curl -X GET 'https://api.contentstack.io/personalize/management/v1/projects/68a6ec844875734317267dcf/experiences' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'organization_uid: blt28cf49b56127ddc9' \
  -H 'Content-Type: application/json'
```

**Expected Response:**
```json
{
  "experiences": [
    {
      "uid": "...",
      "name": "...",
      "short_uid": "..."
    }
  ]
}
```

### 4. Update Your App

Once OAuth works, your Next.js app will work automatically! Just restart the dev server:

```bash
npm run dev
```

## Alternative: Using Contentstack MCP

Since you have Contentstack MCP configured, you can also manage experiences using the MCP tools directly from Cursor. However, OAuth is still required for the Challenge Pro activation feature to work dynamically.

## Troubleshooting Checklist

- [ ] Stack App exists in Developer Hub
- [ ] Client Credentials (M2M) grant is enabled
- [ ] All required scopes are selected (especially `personalize:manage`)
- [ ] App is installed on your stack
- [ ] Client ID and Secret match in .env.local
- [ ] Token generation curl command works
- [ ] Personalize API curl command works with token

## Need Help?

If you're still stuck:

1. Take a screenshot of your Developer Hub app settings
2. Share the error response from the curl command
3. Verify the app appears in your Stack → Settings → Apps

## Additional Resources

- [Developer Hub](https://app.contentstack.com/#!/developer-hub)
- [OAuth Documentation](https://www.contentstack.com/docs/developers/developer-hub/contentstack-oauth)
- [Personalize Management API](https://www.contentstack.com/docs/developers/apis/personalize-management-api)
- [Stack Apps Guide](https://www.contentstack.com/docs/developers/developer-hub/stack-apps)




