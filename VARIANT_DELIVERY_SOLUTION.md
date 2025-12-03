# 🔍 Variant Delivery API Issue - Analysis & Solution

## 🔴 Problem

Variants exist and are published, but **NOT showing in Delivery API** response.

### What We Know:

✅ **Variants exist** (confirmed via Management API):
- Variant 1: cs339eb8eb9100124a - "Advanced Launch Concepts"
- Variant 2: csf9708d83a43f0669 - "Introduction to Contentstack Launch - Basics"
- Variant 3: cs147a3baad1c51f80 - Modified content for new joiners

✅ **Variant Group exists**:
- Name: "Learner Level Variants"
- UID: cs1b25b89d5e82878f
- Linked to: qa_training_module

✅ **Base entry is published** to dev environment

❌ **Delivery API returns no `_variants` field**

---

## 🎯 Root Cause

**Variants in Contentstack require BOTH:**

1. ✅ Variants to be created and published (Done)
2. ❌ **Personalize Experience to be active and published** (Likely missing)

---

## 📋 Why Variants Don't Show in Delivery API

### Contentstack Variants Work Differently:

Variants are **NOT automatically exposed** in the Delivery API. They are delivered based on:

1. **Personalize Rules** - Experience must be active
2. **Audience Targeting** - User must match experience criteria
3. **SDK Integration** - Must use Personalize SDK to fetch variant content

### Standard Delivery API Response:
```json
// Will ONLY return base entry
{
  "entry": {
    "uid": "blt25efa166fab8cd74",
    "title": "Introduction to Contentstack Launch",
    // ... base entry fields only ...
    // ❌ NO _variants field
  }
}
```

---

## ✅ How to Access Variants

### **Option 1: Using Personalize SDK (Recommended)**

Variants are delivered through **Contentstack Personalize**, not the standard Delivery API.

#### Steps:

1. **Install Personalize SDK:**
```bash
npm install @contentstack/personalize-edge-sdk
```

2. **Initialize Personalize:**
```javascript
import personalize from '@contentstack/personalize-edge-sdk';

const personalizeConfig = {
  projectUid: '68a6ec844875734317267dcf', // From variant group
  edgeApiUrl: 'https://edge.personalize.contentstack.com'
};

personalize.init(personalizeConfig);
```

3. **Set User Attributes:**
```javascript
// Set attributes that match your experience criteria
personalize.set({
  user_segment: 'rookie',  // or 'at_risk', 'high_flyer'
  skill_level: 'beginner'
});
```

4. **Fetch Entry with Personalization:**
```javascript
// The SDK automatically applies variants based on user attributes
const entry = await Stack.ContentType('qa_training_module')
  .Entry('blt25efa166fab8cd74')
  .fetch();

// Entry will contain variant content if user matches experience
console.log(entry.title); // May show variant title
console.log(entry.content); // May show variant content
```

---

### **Option 2: Directly Fetch Specific Variant (Management API)**

If you want to fetch a specific variant directly:

```bash
# Fetch specific variant
curl -X GET \
  'https://api.contentstack.io/v3/content_types/qa_training_module/entries/blt25efa166fab8cd74/variants/cs339eb8eb9100124a?locale=en-us' \
  -H 'api_key: blt8202119c48319b1d' \
  -H 'authorization: cs911496f76cbfb543bb764ae7' \
  -H 'Content-Type: application/json'
```

---

## 🔧 Checklist for Variants to Work

### 1. ✅ Variant Group Created
- ✅ Name: "Learner Level Variants"
- ✅ UID: cs1b25b89d5e82878f

### 2. ✅ Variants Created
- ✅ 3 variants created for entry blt25efa166fab8cd74

### 3. ✅ Variants Published
- ✅ All 3 variants published to dev

### 4. ⚠️ Personalize Experience Active?
**Check in Contentstack:**
- Go to **Personalize** (or Launch)
- Find experience: "692d74dde97e5a98f368c0b0" (short uid: 2)
- Verify it's **Active** and **Published**

### 5. ⚠️ Experience Has Audience Rules?
- Audience must be defined (e.g., user_segment = rookie)
- Rules must match your user attributes

### 6. ⚠️ Using Personalize SDK?
- Standard Delivery API won't return variants
- Must use Personalize SDK or Edge API

---

## 💡 Testing Variants

### **Method 1: Via Personalize SDK**

```javascript
import contentstack from '@contentstack/delivery-sdk';
import personalize from '@contentstack/personalize-edge-sdk';

// Initialize Personalize
personalize.init({
  projectUid: '68a6ec844875734317267dcf',
  edgeApiUrl: 'https://edge.personalize.contentstack.com'
});

// Set user as ROOKIE
personalize.set({
  user_segment: 'rookie',
  skill_level: 'beginner'
});

// Fetch entry - will get variant for ROOKIE
const entry = await Stack.ContentType('qa_training_module')
  .Entry('blt25efa166fab8cd74')
  .fetch();

console.log('Content for ROOKIE:', entry.content);

// Now change to HIGH_FLYER
personalize.set({
  user_segment: 'high_flyer',
  skill_level: 'advanced'
});

// Fetch again - should get different variant
const entryHighFlyer = await Stack.ContentType('qa_training_module')
  .Entry('blt25efa166fab8cd74')
  .fetch();

console.log('Content for HIGH_FLYER:', entryHighFlyer.content);
```

### **Method 2: Via Edge API**

```bash
curl -X POST 'https://edge.personalize.contentstack.com/v1/projects/68a6ec844875734317267dcf/execute' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_attributes": {
      "user_segment": "rookie",
      "skill_level": "beginner"
    },
    "entry_uid": "blt25efa166fab8cd74",
    "content_type_uid": "qa_training_module",
    "locale": "en-us",
    "environment": "dev"
  }'
```

---

## 📚 Key Takeaways

1. **Variants are NOT in standard Delivery API**
   - They're delivered via Personalize SDK/Edge API

2. **Personalize Experience must be active**
   - Check your Launch/Personalize dashboard
   - Experience "692d74dde97e5a98f368c0b0" must be running

3. **Audience rules must match**
   - User attributes must match experience targeting

4. **Use Personalize SDK in your app**
   - Install `@contentstack/personalize-edge-sdk`
   - Set user attributes
   - Fetch entries normally - variants applied automatically

---

## 🚀 Next Steps

1. **Verify Personalize Experience is Active:**
   - Go to Contentstack → Personalize
   - Check experience with UID "692d74dde97e5a98f368c0b0"
   - Ensure it's published and active

2. **Integrate Personalize SDK:**
   - Follow the SDK setup above
   - Test with different user attributes

3. **Alternative: Fetch Variants Directly**
   - Use Management API to fetch specific variant UIDs
   - Useful for preview/admin interfaces

---

**Need help setting up the Personalize SDK?** Let me know and I can create a complete integration guide! 🎯

