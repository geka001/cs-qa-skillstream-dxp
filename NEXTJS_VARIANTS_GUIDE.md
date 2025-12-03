# 🎯 Contentstack Variants - API Guide for Next.js

## ✅ Confirmed: Variant Exists!

**Base Entry:** `blt25efa166fab8cd74`
**Variant UID:** `csc9081b7c8d45c83f`
**Variant Instance:** `blt126a3870409bc83128d5`

---

## 📊 Your Variant Details

### **Base Entry:**
- **Entry UID:** `blt25efa166fab8cd74`
- **Content Type:** `qa_training_module`
- **Title:** "Introduction to Contentstack Launch"
- **Target Segments:** `["ROOKIE"]`

### **Variant:**
- **Variant UID:** `csc9081b7c8d45c83f`
- **Title:** "From Personalize Variant: Introduction to Contentstack Launch"
- **Target Segments:** `["HIGH_FLYER"]`
- **Changed Fields:** title, target_segments, taxonomies
- **Created:** 2025-12-03T04:11:03.540Z

---

## 🔧 API Calls for Your Next.js Project

### **Method 1: Fetch Base Entry (Standard Delivery API)**

```typescript
// This returns the BASE entry only (no variants)
const fetchBaseEntry = async () => {
  const response = await fetch(
    `https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74?environment=dev`,
    {
      headers: {
        'api_key': 'blt8202119c48319b1d',
        'access_token': 'csdf941d70d6da13d4ae6265de',
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  return data.entry;
};
```

**Response:**
```json
{
  "entry": {
    "uid": "blt25efa166fab8cd74",
    "title": "Introduction to Contentstack Launch",
    "target_segments": "[\"ROOKIE\"]",
    "content": "...",
    // ... all base entry fields
    // ❌ NO variant data here
  }
}
```

---

### **Method 2: Fetch Specific Variant (Management API)**

```typescript
// Fetch the HIGH_FLYER variant directly
const fetchVariant = async () => {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74/variants/csc9081b7c8d45c83f?locale=en-us`,
    {
      headers: {
        'api_key': 'blt8202119c48319b1d',
        'authorization': 'cs911496f76cbfb543bb764ae7', // Management Token
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  return data.entry;
};
```

**Response:**
```json
{
  "entry": {
    "uid": "blt25efa166fab8cd74",
    "title": "From Personalize Variant: Introduction to Contentstack Launch",
    "target_segments": "[\"HIGH_FLYER\"]",
    "_variant": {
      "_uid": "csc9081b7c8d45c83f",
      "_change_set": ["title", "target_segments", "taxonomies"],
      "_base_entry_version": 11
    },
    // ... variant-specific fields
  }
}
```

---

### **Method 3: Fetch All Variants for Entry (Management API)**

```typescript
// Get all variants for the entry
const fetchAllVariants = async () => {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74/variants?locale=en-us`,
    {
      headers: {
        'api_key': 'blt8202119c48319b1d',
        'authorization': 'cs911496f76cbfb543bb764ae7',
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  return data.entries; // Array of variants
};
```

**Response:**
```json
{
  "entries": [
    {
      "uid": "blt25efa166fab8cd74",
      "title": "From Personalize Variant: Introduction to Contentstack Launch",
      "target_segments": "[\"HIGH_FLYER\"]",
      "_variant": {
        "_uid": "csc9081b7c8d45c83f",
        "_change_set": ["title", "target_segments", "taxonomies"]
      }
    }
  ]
}
```

---

## 🚀 Next.js Implementation

### **Option A: Server-Side with Personalize SDK (Recommended)**

```typescript
// app/training/[uid]/page.tsx
import contentstack from '@contentstack/delivery-sdk';
import personalize from '@contentstack/personalize-edge-sdk';

// Initialize Contentstack
const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: 'dev',
});

// Initialize Personalize
personalize.init({
  projectUid: '68a6ec844875734317267dcf',
  edgeApiUrl: 'https://edge.personalize.contentstack.com'
});

export default async function TrainingModulePage({
  params,
  searchParams
}: {
  params: { uid: string };
  searchParams: { segment?: string };
}) {
  // Set user segment from query or session
  const userSegment = searchParams.segment || 'ROOKIE';
  
  personalize.set({
    user_segment: userSegment.toLowerCase(),
    skill_level: userSegment === 'ROOKIE' ? 'beginner' : 'advanced'
  });

  // Fetch entry - Personalize SDK automatically applies variant
  const entry = await Stack.ContentType('qa_training_module')
    .Entry(params.uid)
    .fetch();

  return (
    <div>
      <h1>{entry.title}</h1>
      <p>Content for {userSegment}</p>
      <div dangerouslySetInnerHTML={{ __html: entry.content }} />
    </div>
  );
}
```

---

### **Option B: Client-Side with Manual Variant Selection**

```typescript
// hooks/useTrainingModule.ts
'use client';

import { useState, useEffect } from 'react';

interface TrainingModule {
  uid: string;
  title: string;
  content: string;
  target_segments: string;
  // ... other fields
}

export function useTrainingModule(entryUid: string, userSegment: string) {
  const [module, setModule] = useState<TrainingModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModule() {
      try {
        // Check if user segment matches variant criteria
        if (userSegment === 'HIGH_FLYER') {
          // Fetch variant using Management API
          const response = await fetch(`/api/variants/${entryUid}/${userSegment}`);
          const data = await response.json();
          setModule(data);
        } else {
          // Fetch base entry using Delivery API
          const response = await fetch(
            `https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/${entryUid}?environment=dev`,
            {
              headers: {
                'api_key': process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
                'access_token': process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
              }
            }
          );
          const data = await response.json();
          setModule(data.entry);
        }
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchModule();
  }, [entryUid, userSegment]);

  return { module, loading };
}
```

---

### **Option C: API Route for Variants**

```typescript
// app/api/variants/[entryUid]/[segment]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const VARIANT_MAP = {
  'HIGH_FLYER': 'csc9081b7c8d45c83f',
  // Add more variants as you create them
};

export async function GET(
  request: NextRequest,
  { params }: { params: { entryUid: string; segment: string } }
) {
  const { entryUid, segment } = params;
  const variantUid = VARIANT_MAP[segment.toUpperCase()];

  if (!variantUid) {
    // Return base entry if no variant exists
    const response = await fetch(
      `https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/${entryUid}?environment=dev`,
      {
        headers: {
          'api_key': process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          'access_token': process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
        }
      }
    );
    const data = await response.json();
    return NextResponse.json(data.entry);
  }

  // Fetch specific variant
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/qa_training_module/entries/${entryUid}/variants/${variantUid}?locale=en-us`,
    {
      headers: {
        'api_key': process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        'authorization': process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN!,
      }
    }
  );

  const data = await response.json();
  return NextResponse.json(data.entry);
}
```

**Usage:**
```typescript
// Client component
const response = await fetch(`/api/variants/blt25efa166fab8cd74/HIGH_FLYER`);
const module = await response.json();
```

---

## 📋 Complete Next.js Setup

### **1. Install Dependencies**

```bash
npm install @contentstack/delivery-sdk @contentstack/personalize-edge-sdk
```

### **2. Update .env.local**

```bash
NEXT_PUBLIC_CONTENTSTACK_API_KEY=blt8202119c48319b1d
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=csdf941d70d6da13d4ae6265de
NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN=cs911496f76cbfb543bb764ae7
NEXT_PUBLIC_CONTENTSTACK_REGION=na
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=dev
NEXT_PUBLIC_PERSONALIZE_PROJECT_UID=68a6ec844875734317267dcf
```

### **3. Create Contentstack Client**

```typescript
// lib/contentstack.ts
import contentstack from '@contentstack/delivery-sdk';
import personalize from '@contentstack/personalize-edge-sdk';

export const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,
});

// Initialize Personalize
if (process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID) {
  personalize.init({
    projectUid: process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID,
    edgeApiUrl: 'https://edge.personalize.contentstack.com'
  });
}

export { personalize };
```

### **4. Use in Components**

```typescript
// app/modules/[uid]/page.tsx
import { Stack, personalize } from '@/lib/contentstack';

export default async function ModulePage({
  params,
  searchParams
}: {
  params: { uid: string };
  searchParams: { segment?: string };
}) {
  // Set user context
  const segment = searchParams.segment || 'ROOKIE';
  
  personalize.set({
    user_segment: segment.toLowerCase(),
  });

  // Fetch with automatic variant resolution
  const result = await Stack.ContentType('qa_training_module')
    .Entry(params.uid)
    .toJSON()
    .fetch();

  const module = result.entry;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{module.title}</h1>
      <div className="badge badge-primary">{segment}</div>
      <div 
        className="prose max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: module.content }}
      />
    </div>
  );
}
```

---

## 🎯 Testing Your Variants

### **Test URLs:**

```bash
# Base entry (ROOKIE)
http://localhost:3000/modules/blt25efa166fab8cd74

# HIGH_FLYER variant
http://localhost:3000/modules/blt25efa166fab8cd74?segment=HIGH_FLYER

# AT_RISK variant (if you create one)
http://localhost:3000/modules/blt25efa166fab8cd74?segment=AT_RISK
```

---

## 📊 Summary

### **Your Current Setup:**
- ✅ Base Entry: `blt25efa166fab8cd74` (for ROOKIE)
- ✅ Variant: `csc9081b7c8d45c83f` (for HIGH_FLYER)
- ✅ Variant changes: title, target_segments, taxonomies

### **Recommended Approach:**
**Option A (Personalize SDK)** - Best for production, automatic variant resolution

### **Quick Test Approach:**
**Option C (API Route)** - Easy to implement, full control over variant selection

---

## 🚀 Next Steps

1. **Install Personalize SDK** (Option A)
2. **Or create API route** (Option C for quick start)
3. **Test with different segments**
4. **Create more variants** for AT_RISK, etc.

---

**Need help implementing any of these approaches?** Let me know! 🎯

