# Variant Delivery Problem Documentation

## Overview

This document explains the gap discovered between Contentstack Personalize SDK and the Delivery SDK when implementing personalized variant content delivery.

> **✅ SOLUTION FOUND**: The gap has been bridged using `getVariantAliases()` from the Personalize SDK! See the [Solution](#solution-using-variant-aliases) section below.

---

## The Expected Flow (How It Should Work)

```
1. User logs in → Personalize SDK receives attributes (QA_LEVEL, TEAM_NAME)
2. Personalize SDK evaluates → Returns variant aliases
3. Delivery SDK → Uses aliases to fetch personalized content
```

---

## What the Personalize SDK Actually Provides

| Method | Returns | Example |
|--------|---------|---------|
| `getVariants()` | Experience Short UID → Variant Short UID | `{ "9": "a", "c": "b" }` |
| `getVariantAliases()` | Array of variant alias strings | `["launch_high_flyer"]` (if configured) |

### Code Example

```typescript
import { getVariants, getVariantAliases } from '@contentstack/personalize-edge-sdk';

// Returns experience-to-variant mapping
const variants = await sdk.getVariants();
// Result: { "9": "a" } - Experience short UID to Variant short UID

// Returns variant aliases (if configured in Personalize dashboard)
const aliases = await sdk.getVariantAliases();
// Result: ["launch_high_flyer"] or [] if not configured
```

---

## What the Delivery API Requires

The Delivery API needs the **actual Variant UID** in the `x-cs-variant-uid` header:

```bash
curl "https://cdn.contentstack.io/v3/content_types/qa_training_module/entries?environment=dev" \
  -H "api_key: YOUR_API_KEY" \
  -H "access_token: YOUR_DELIVERY_TOKEN" \
  -H "x-cs-variant-uid: csc9081b7c8d45c83f"  # <-- Actual variant UID required!
```

---

## The Gap

| What We Have (from Personalize SDK) | What We Need (for Delivery API) |
|-------------------------------------|--------------------------------|
| Experience Short UID: `9` | Variant UID: `csc9081b7c8d45c83f` |
| Variant Group UID: `cs473b29644b9967b9` | ❌ Does NOT work with Delivery API |
| Variant Aliases: (often not configured) | Would work if set up in Personalize dashboard |

### The Missing Bridge

```
Personalize SDK                         Delivery SDK
      ↓                                       ↓
Experience Short UID: "9"    ──────?──────>  Variant UID: "csc9081b7c8d45c83f"
                                    
                         (No SDK method to bridge this!)
```

---

## Discovery via curl Testing

### Test 1: Using Variant Group UID (❌ Does NOT Work)

```bash
curl -s "https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74?environment=dev" \
  -H "api_key: $API_KEY" \
  -H "access_token: $DELIVERY_TOKEN" \
  -H "x-cs-variant-uid: cs473b29644b9967b9"  # Variant GROUP UID

# Result: Returns BASE entry (no variant content)
{
  "title": "Introduction to Contentstack Launch",
  "target_segments": "[\"ROOKIE\", \"AT_RISK\"]",  # Base content!
  "_variant": null
}
```

### Test 2: Using Actual Variant UID (✅ Works)

```bash
curl -s "https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74?environment=dev" \
  -H "api_key: $API_KEY" \
  -H "access_token: $DELIVERY_TOKEN" \
  -H "x-cs-variant-uid: csc9081b7c8d45c83f"  # Actual Variant UID

# Result: Returns VARIANT content
{
  "title": "From Personalize Variant: Introduction to Contentstack Launch",
  "target_segments": "[\"HIGH_FLYER\"]",  # Variant content!
  "_variant": null
}
```

---

## Why Management API is Required

The **only way** to get the actual Variant UID is through the Management API:

### Step 1: Get Variant Groups

```bash
GET https://api.contentstack.io/v3/variant_groups
Authorization: YOUR_MANAGEMENT_TOKEN

# Response includes experience_short_uid mapping:
{
  "variant_groups": [
    {
      "name": "Launch High Flyer",
      "uid": "cs473b29644b9967b9",  # Variant GROUP UID (doesn't work with Delivery)
      "personalize_metadata": {
        "experience_short_uid": "9",
        "experience_uid": "692eb55fe97e5a98f368d501"
      }
    }
  ]
}
```

### Step 2: Get Entry Variants (to find actual Variant UIDs)

```bash
GET https://api.contentstack.io/v3/content_types/qa_training_module/entries/{entry_uid}/variants
Authorization: YOUR_MANAGEMENT_TOKEN

# Response includes actual variant UIDs:
{
  "entries": [
    {
      "title": "From Personalize Variant: Introduction to Contentstack Launch",
      "_variant": {
        "_uid": "csc9081b7c8d45c83f"  # This is what we need!
      }
    }
  ]
}
```

---

## Current Variant UID Mappings

| Team | Experience Short UID | Variant Group UID | Actual Variant UID |
|------|---------------------|-------------------|-------------------|
| Launch | `9` | `cs473b29644b9967b9` | `csc9081b7c8d45c83f` |
| DAM | `c` | `cs1a64519d3ef700a9` | `cs60cc6658dc79414d` |
| Data & Insights | `d` | `cs2b18613ac4229bf8` | `cs034a353f2525dbba` |
| AutoDraft | `e` | `csa9aae8e27d4725e7` | `cs49da1226306931d8` |

---

## Potential Solutions

### Solution 1: Configure Variant Aliases in Personalize Dashboard (Recommended)

**Pros:**
- No Management API needed
- `getVariantAliases()` returns usable values
- Works directly with Delivery SDK

**Cons:**
- Manual setup required for each variant
- Need to maintain alias configuration

**Implementation:**
1. Go to Contentstack Personalize dashboard
2. For each experience, configure variant aliases
3. Use `getVariantAliases()` in code

### Solution 2: Use Management API (Current Implementation)

**Pros:**
- Dynamic - auto-discovers new variants
- No manual configuration needed

**Cons:**
- Requires Management Token (security consideration)
- Additional API calls
- Must be server-side only

**Implementation:**
- Created `/api/variants/config` endpoint
- Caches results for 5 minutes
- Falls back to hardcoded values if API fails

### Solution 3: Hardcode Variant UIDs

**Pros:**
- Simple
- No additional API calls

**Cons:**
- Requires code changes for new teams/variants
- Easy to get out of sync

---

## Ideal SDK Enhancement Request

### Option A: Personalize SDK Enhancement

```typescript
// Proposed new method
const variantUid = await sdk.getVariantUidForExperience("9");
// Returns: "csc9081b7c8d45c83f"
```

### Option B: Delivery SDK Enhancement

```typescript
// Proposed: Accept experience short UID directly
const entries = await stack
  .contentType('qa_training_module')
  .entry()
  .experience("9")  // Pass experience short UID
  .find();
```

### Option C: Unified SDK Method

```typescript
// Proposed: Get delivery-ready variant information
const deliveryVariants = await sdk.getDeliveryVariants();
// Returns: { "csc9081b7c8d45c83f": { team: "Launch", experience: "9" } }
```

---

---

## Solution: Using Variant Aliases

### The Discovery

The Personalize SDK's `getVariantAliases()` method returns **auto-generated aliases** in the format:

```
cs_personalize_<experience_short_uid>_<variant_short_uid>
```

These aliases work **DIRECTLY** with the Delivery API's `x-cs-variant-uid` header!

### Verified Working Example

```bash
# Using variant alias (WORKS!)
curl "https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74?environment=dev" \
  -H "api_key: YOUR_API_KEY" \
  -H "access_token: YOUR_DELIVERY_TOKEN" \
  -H "x-cs-variant-uid: cs_personalize_9_0"

# Result: Returns variant content!
{
  "title": "From Personalize Variant: Introduction to Contentstack Launch",
  "target_segments": "[\"HIGH_FLYER\"]"
}
```

### Working Alias Format for All Teams

| Team | Experience Short UID | Variant Alias | ✅ Verified |
|------|---------------------|---------------|-------------|
| Launch | `9` | `cs_personalize_9_0` | ✅ |
| DAM | `c` | `cs_personalize_c_0` | ✅ |
| Data & Insights | `d` | `cs_personalize_d_0` | ✅ |
| AutoDraft | `e` | `cs_personalize_e_0` | ✅ |

### The Correct Implementation

```typescript
// 1. Get variant aliases from Personalize SDK
const aliases = await sdk.getVariantAliases();
// Returns: ['cs_personalize_9_0']

// 2. Use aliases directly with Delivery API
fetch(url, {
  headers: {
    'x-cs-variant-uid': aliases.join(',')
  }
});
// Returns: Personalized variant content!
```

### Benefits of This Approach

- ✅ **No Management API needed** - Uses only Personalize SDK + Delivery API
- ✅ **No hardcoded values** - Aliases are auto-generated
- ✅ **Dynamic** - Adding new experiences/variants requires NO code changes
- ✅ **Simple** - Just call `getVariantAliases()` and use the result

---

## Summary

### The Problem (Original)

There was no obvious path from Personalize SDK's experience/variant information to the actual Variant UID needed by the Delivery API.

### The Solution

Use `getVariantAliases()` from the Personalize SDK! It returns auto-generated aliases in format `cs_personalize_<exp>_<variant>` that work directly with the Delivery API's `x-cs-variant-uid` header.

### Key Code Changes

| File | Change |
|------|--------|
| `lib/contentstack.ts` | Uses `getVariantAliases()` instead of hardcoded variant UIDs |
| `lib/personalize.ts` | Added `getExperiences()`, `triggerImpressionForTeam()`, simplified alias handling |
| `components/modules/ModuleViewer.tsx` | Added proper `triggerImpression` call when variant content is rendered |
| `app/api/variants/config/route.ts` | **DEPRECATED** - No longer needed |

### Proper Impression Tracking

According to the [official documentation](https://www.contentstack.com/docs/personalize/setup-nextjs-website-with-personalize-launch):

> "We are using useEffect in this example so that the impression is triggered only on the first render of the component"

**Correct Usage (in ModuleViewer.tsx):**

```typescript
useEffect(() => {
  const isHighFlyerContent = module.targetSegments?.includes('HIGH_FLYER');
  const isHighFlyerUser = user?.segment === 'HIGH_FLYER';
  
  if (isHighFlyerUser && isHighFlyerContent && !impressionTriggeredRef.current) {
    impressionTriggeredRef.current = true;
    // Trigger when variant content is RENDERED
    triggerImpressionForTeam(user.team);
  }
}, [module, user]);
```

**Wrong Usage (previously in setPersonalizeAttributes):**

```typescript
// ❌ DON'T trigger when setting attributes - content not rendered yet!
await sdk.set(attributes);
await sdk.triggerImpression(experienceUid); // WRONG!
```

---

## Related Files

| File | Purpose |
|------|---------|
| `lib/personalize.ts` | Personalize SDK integration with `getVariantAliases()` |
| `lib/contentstack.ts` | Delivery SDK with variant alias support |
| `app/api/variants/config/route.ts` | **DEPRECATED** - Dynamic config API (was using Management API) |

---

## References

- [Contentstack Personalize Edge SDK](https://www.contentstack.com/docs/developers/sdks/personalize-edge-sdk/)
- [Dynamically Track Variant Impressions](https://www.contentstack.com/docs/personalize/dynamically-track-variant-impressions) - **Key documentation that revealed the solution**
- [Contentstack Delivery API](https://www.contentstack.com/docs/developers/apis/content-delivery-api/)
- [Personalize Glossary - Variant Aliases](https://www.contentstack.com/docs/personalize/glossary-key-features)

