# 🎯 Quick Reference: Variants API Calls

## Your Entry Details

| Field | Value |
|-------|-------|
| **Base Entry UID** | `blt25efa166fab8cd74` |
| **Base Title** | "Introduction to Contentstack Launch" |
| **Base Segment** | ROOKIE |
| **Variant UID** | `csc9081b7c8d45c83f` |
| **Variant Title** | "From Personalize Variant: Introduction to Contentstack Launch" |
| **Variant Segment** | HIGH_FLYER |
| **Variant Group** | `cs1b25b89d5e82878f` |

---

## 📡 API Endpoints

### 1. **Fetch Base Entry** (Delivery API)
```bash
GET https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74?environment=dev

Headers:
  api_key: blt8202119c48319b1d
  access_token: csdf941d70d6da13d4ae6265de
```

### 2. **Fetch Specific Variant** (Management API)
```bash
GET https://api.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74/variants/csc9081b7c8d45c83f?locale=en-us

Headers:
  api_key: blt8202119c48319b1d
  authorization: cs911496f76cbfb543bb764ae7
```

### 3. **Fetch All Variants** (Management API)
```bash
GET https://api.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74/variants?locale=en-us

Headers:
  api_key: blt8202119c48319b1d
  authorization: cs911496f76cbfb543bb764ae7
```

---

## 🚀 Copy-Paste Next.js Code

### **Simple Fetch Function**
```typescript
// Fetch base or variant based on segment
export async function fetchTrainingModule(
  entryUid: string, 
  segment: 'ROOKIE' | 'HIGH_FLYER' | 'AT_RISK'
) {
  const isVariant = segment === 'HIGH_FLYER';
  const variantUid = 'csc9081b7c8d45c83f';
  
  const url = isVariant
    ? `https://api.contentstack.io/v3/content_types/qa_training_module/entries/${entryUid}/variants/${variantUid}?locale=en-us`
    : `https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/${entryUid}?environment=dev`;
  
  const headers = isVariant
    ? {
        'api_key': 'blt8202119c48319b1d',
        'authorization': 'cs911496f76cbfb543bb764ae7',
      }
    : {
        'api_key': 'blt8202119c48319b1d',
        'access_token': 'csdf941d70d6da13d4ae6265de',
      };
  
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data.entry;
}

// Usage
const module = await fetchTrainingModule('blt25efa166fab8cd74', 'HIGH_FLYER');
console.log(module.title); // "From Personalize Variant: Introduction to Contentstack Launch"
```

---

## 🧪 Test Commands

### **cURL - Base Entry**
```bash
curl -X GET \
  'https://cdn.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74?environment=dev' \
  -H 'api_key: blt8202119c48319b1d' \
  -H 'access_token: csdf941d70d6da13d4ae6265de'
```

### **cURL - Variant**
```bash
curl -X GET \
  'https://api.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74/variants/csc9081b7c8d45c83f?locale=en-us' \
  -H 'api_key: blt8202119c48319b1d' \
  -H 'authorization: cs911496f76cbfb543bb764ae7'
```

---

## 📊 Expected Responses

### **Base Entry Response:**
```json
{
  "entry": {
    "uid": "blt25efa166fab8cd74",
    "title": "Introduction to Contentstack Launch",
    "target_segments": "[\"ROOKIE\"]",
    "difficulty": "beginner",
    "content": "<h2>Introduction to Contentstack Launch</h2>...",
    "taxonomies": [
      { "taxonomy_uid": "skill_level", "term_uid": "beginner" },
      { "taxonomy_uid": "user_segment", "term_uid": "rookie" }
    ]
  }
}
```

### **Variant Response:**
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
    "taxonomies": [
      { "taxonomy_uid": "skill_level", "term_uid": "beginner" },
      { "taxonomy_uid": "user_segment", "term_uid": "high_flyer" }
    ]
  }
}
```

---

## 💡 Key Differences

| Aspect | Base Entry | Variant |
|--------|-----------|---------|
| **API** | Delivery API | Management API |
| **Token** | Delivery Token | Management Token |
| **URL** | cdn.contentstack.io | api.contentstack.io |
| **Title** | "Introduction to Contentstack Launch" | "From Personalize Variant: ..." |
| **Segment** | ROOKIE | HIGH_FLYER |
| **Has `_variant`** | ❌ No | ✅ Yes |

---

## ⚡ Quick Implementation

```typescript
// app/modules/[uid]/page.tsx
export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: { uid: string }; 
  searchParams: { segment?: string } 
}) {
  const segment = searchParams.segment || 'ROOKIE';
  const module = await fetchTrainingModule(params.uid, segment as any);
  
  return (
    <div>
      <h1>{module.title}</h1>
      <span className="badge">{segment}</span>
      <div dangerouslySetInnerHTML={{ __html: module.content }} />
    </div>
  );
}
```

**Test URLs:**
- Base: `http://localhost:3000/modules/blt25efa166fab8cd74`
- Variant: `http://localhost:3000/modules/blt25efa166fab8cd74?segment=HIGH_FLYER`

---

## 🎯 Summary

✅ **Variant confirmed in your stack**
✅ **API endpoints documented**
✅ **Next.js code ready to use**
✅ **Test commands provided**

**Start with the simple fetch function above and expand as needed!** 🚀

