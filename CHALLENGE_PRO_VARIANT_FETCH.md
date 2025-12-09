# Challenge Pro Variant Fetch - Management API Fallback

## Overview

Due to issues with publishing variants to the Delivery API, we've implemented a fallback mechanism that fetches Challenge Pro variant details directly from the Management API. This ensures Challenge Pro content is always available even when variants aren't published.

## Changes Made

### 1. New Functions in `lib/contentstack.ts`

#### `fetchChallengeProVariantFromManagementAPI()`
Fetches a specific Challenge Pro variant by variant UID from Management API.

```typescript
async function fetchChallengeProVariantFromManagementAPI(
  baseEntryUid: string,
  variantUid: string,
  locale: string = 'en-us'
): Promise<ModuleEntry | null>
```

#### `fetchChallengeProVariantsFromManagementAPI()`
Fetches all Challenge Pro variants for a team from Management API.

```typescript
async function fetchChallengeProVariantsFromManagementAPI(
  baseEntryUid: string,
  teamName: string,
  locale: string = 'en-us'
): Promise<ModuleEntry[]>
```

### 2. Updated `getCsModules()` Function

The `getCsModules()` function now includes automatic fallback logic:

1. **First**: Tries to fetch variants from Delivery API using variant aliases
2. **Fallback**: If Challenge Pro variant alias is provided but Delivery API doesn't return the variant, it automatically fetches from Management API
3. **Merge**: Challenge Pro variant from Management API replaces/adds to the entries list

### 3. New API Endpoint: `/api/challenge-pro/get-variant`

#### Get Variants for a Team
```bash
GET /api/challenge-pro/get-variant?team=Launch
```

Response:
```json
{
  "success": true,
  "team": "Launch",
  "baseEntryUid": "blt25efa166fab8cd74",
  "variants": [
    {
      "uid": "blt25efa166fab8cd74",
      "title": "Launch Pro: Advanced Deployment Strategies Hi",
      "module_id": "mod-launch-pro-001",
      "_variant": {
        "_uid": "cs5dcdb813390ecb6f",
        "_base_entry_version": 13
      },
      ...
    }
  ],
  "count": 1
}
```

#### Get Specific Variant
```bash
GET /api/challenge-pro/get-variant?entryUid=blt25efa166fab8cd74&variantUid=cs5dcdb813390ecb6f
```

Response:
```json
{
  "success": true,
  "variant": {
    "uid": "blt25efa166fab8cd74",
    "title": "Launch Pro: Advanced Deployment Strategies Hi",
    ...
  }
}
```

## How It Works

### Automatic Fallback Flow

1. User has Challenge Pro enabled (has `challengeProVariantAlias` in profile)
2. `getCsModules()` is called with `challengeProVariantAlias` parameter
3. System tries Delivery API first with variant alias
4. If Challenge Pro variant not found in Delivery API response:
   - System automatically calls `fetchChallengeProVariantsFromManagementAPI()`
   - Finds Challenge Pro variant matching the team
   - Adds it to the entries list (replacing base entry if needed)
5. User sees Challenge Pro content even if variant isn't published

### Manual Fetch (API Endpoint)

You can also manually fetch Challenge Pro variants using the new API endpoint:

```typescript
// Fetch all Challenge Pro variants for a team
const response = await fetch('/api/challenge-pro/get-variant?team=Launch');
const data = await response.json();
console.log(data.variants); // Array of Challenge Pro variants
```

## Benefits

1. **Reliability**: Challenge Pro content is always available, even if publishing fails
2. **Transparency**: Variant details are visible via Management API
3. **Flexibility**: Can fetch specific variants or all variants for a team
4. **Backward Compatible**: Existing Delivery API flow still works when variants are published

## Usage Examples

### In Frontend Code

```typescript
import { getCsModules } from '@/lib/contentstack';

// Challenge Pro variant will be fetched automatically if not in Delivery API
const modules = await getCsModules(
  'Launch',
  'HIGH_FLYER',
  'cs_personalize_l_0' // Challenge Pro variant alias
);
```

### Direct API Call

```typescript
// Fetch Challenge Pro variants for a team
const response = await fetch('/api/challenge-pro/get-variant?team=Launch', {
  headers: {
    'Authorization': `Bearer ${token}` // Optional: uses env token if not provided
  }
});
const { variants } = await response.json();
```

## Testing

### Test Variant Fetch

```bash
# Get variants for Launch team
curl "http://localhost:3000/api/challenge-pro/get-variant?team=Launch" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific variant
curl "http://localhost:3000/api/challenge-pro/get-variant?entryUid=blt25efa166fab8cd74&variantUid=cs5dcdb813390ecb6f" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- Management API requires `NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN` environment variable
- Variants fetched from Management API are the latest unpublished versions
- The fallback only triggers for Challenge Pro variants (HIGH_FLYER users with Challenge Pro enabled)
- Regular High Flyer variants still use Delivery API when available

