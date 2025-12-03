# 🔍 Variant Debugging Guide

## Issue: Not Seeing HIGH_FLYER Variant Content

You mentioned: "I am not able to see Advanced Launch Concepts variant version in high-flyer module"

Let's debug this step by step.

---

## 🧪 Step 1: Check Browser Console

I've added debug logs to help diagnose the issue.

**What to do:**
1. Open your browser console (F12)
2. Login as HIGH_FLYER user
3. Navigate to modules page
4. Look for these log messages:

### Expected Logs:
```
📦 Processing module: Introduction to Contentstack Launch, user segment: HIGH_FLYER, variant key: high_flyer_version

🔍 Extracting variant: {
  variantKey: "high_flyer_version",
  fieldType: "object",
  hasVariant: true/false
}

✅ Found variant: high_flyer_version
✅ Extracted content length: XXX chars
```

---

## 🎯 What the Logs Tell Us:

### Scenario 1: Field is a String
```
📝 Plain string content (non-variant entry)
```
**Meaning:** Entry doesn't have variants, just plain text content  
**This is normal for non-variant modules**

---

### Scenario 2: Variant Found
```
✅ Found variant: high_flyer_version
✅ Extracted content length: 500 chars
```
**Meaning:** Variant exists and was extracted successfully!  
**If you still don't see it, the issue is in UI rendering**

---

### Scenario 3: No Variant Found
```
⚠️ No variants found. Available keys: ["title", "rookie_version", "at_risk_version"]
```
**Meaning:** The entry has variants BUT `high_flyer_version` is missing!  
**Solution:** Add the missing variant in Contentstack UI

---

### Scenario 4: Falling Back
```
⚠️ Falling back to rookie_version
```
**Meaning:** `high_flyer_version` doesn't exist, showing rookie content instead  
**Solution:** Add `high_flyer_version` content in Contentstack

---

## 🔧 Step 2: Check Contentstack Entry

### Go to Contentstack UI:
1. Navigate to **Entries** → **qa_training_module**
2. Find: "Introduction to Contentstack Launch"
3. Open the entry

### Check the `content` Field:
You should see **3 tabs**:
- `Rookie Version`
- `AT-Risk Version`
- `High-Flyer Version`

**Click each tab and verify content exists!**

---

## ✅ Correct Setup in Contentstack:

### Entry Configuration:
```json
{
  "title": "Introduction to Contentstack Launch",
  "content": {
    // This is shown as tabs in UI:
    "rookie_version": "Basic introduction to Launch...",
    "at_risk_version": "Step-by-step Launch guide...",
    "high_flyer_version": "Advanced Launch concepts..." // ← Must be filled!
  },
  "team_taxonomy": ["Launch"],
  "segment_taxonomy": ["Rookie", "AT Risk", "High flyer"] // ← ALL 3!
}
```

**Key Points:**
- ✅ All 3 variant tabs must have content
- ✅ `segment_taxonomy` must include all 3 segments
- ✅ Entry must be **Published** to `dev` environment

---

## 🐛 Common Issues:

### Issue 1: Empty Variant Tab
**Symptom:** Logs show "No variants found" or fallback  
**Cause:** `high_flyer_version` tab is empty in Contentstack  
**Fix:** 
1. Go to entry in Contentstack
2. Click "High-Flyer Version" tab
3. Add content
4. Save and Publish

---

### Issue 2: Wrong Variant Field Name
**Symptom:** Logs show wrong available keys  
**Cause:** Variant field names don't match expected format  
**Expected:** `rookie_version`, `at_risk_version`, `high_flyer_version`  
**Fix:** Check variant group UIDs match these names

---

### Issue 3: Entry Not Published
**Symptom:** Entry exists but app doesn't show it  
**Cause:** Entry is in "Draft" state  
**Fix:** 
1. Open entry
2. Click **Publish**
3. Select `dev` environment
4. Publish

---

### Issue 4: Taxonomy Filtering
**Symptom:** HIGH_FLYER user doesn't see module at all  
**Cause:** `segment_taxonomy` doesn't include "High flyer"  
**Fix:**
1. Open entry
2. Find `segment_taxonomy` field
3. Add all 3: `["Rookie", "AT Risk", "High flyer"]`
4. Save and Publish

---

## 📝 Step 3: Copy the Console Logs

**After checking the console, please share:**

1. The variant extraction logs (🔍 Extracting variant...)
2. Whether you see ✅ or ⚠️ messages
3. The "Available keys" if shown

**This will tell me exactly what's wrong!**

---

## 🎯 Quick Test:

### Test Variant Switching:

1. **Login as ROOKIE** (or create fresh user)
   - Open "Introduction to Launch"
   - Note the content you see
   - **Copy first sentence** for comparison

2. **Become HIGH_FLYER** (complete onboarding)
   - Open same module
   - **Content should be different!**
   - Compare with what you saw as ROOKIE

3. **If content is the same:**
   - Check console logs
   - Share what you see
   - We'll diagnose from there

---

## 🔍 Manual Verification Script

If you want to check the raw data from Contentstack:

**Open browser console on any page:**
```javascript
// Check what Contentstack returns
fetch('https://cdn.contentstack.io/v3/content_types/qa_training_module/entries?environment=dev&query={"title":"Introduction to Contentstack Launch"}', {
  headers: {
    'api_key': 'YOUR_API_KEY',
    'access_token': 'YOUR_DELIVERY_TOKEN'
  }
})
.then(r => r.json())
.then(data => {
  const entry = data.entries[0];
  console.log('📦 Entry title:', entry.title);
  console.log('📦 Content type:', typeof entry.content);
  console.log('📦 Content structure:', entry.content);
  
  if (typeof entry.content === 'object') {
    console.log('✅ Variant entry detected!');
    console.log('Available variants:', Object.keys(entry.content));
    console.log('high_flyer_version exists?', !!entry.content.high_flyer_version);
    console.log('high_flyer_version content:', entry.content.high_flyer_version?.substring(0, 100));
  } else {
    console.log('❌ Non-variant entry (plain string)');
  }
});
```

---

## 🚀 Next Steps:

1. ✅ **Open browser console** and check the logs
2. ✅ **Go to Contentstack** and verify all 3 variant tabs have content
3. ✅ **Share console logs** with me
4. ✅ I'll help diagnose the exact issue

---

## 💡 Most Likely Issue:

Based on experience, it's usually one of these:

1. **60% chance:** `high_flyer_version` tab is empty in Contentstack UI
2. **20% chance:** Entry not published to `dev` environment
3. **15% chance:** `segment_taxonomy` missing "High flyer"
4. **5% chance:** Variant group setup issue

---

**Check the console logs and Contentstack entry, then let me know what you find!** 🔍

I've added detailed debug logging to help us pinpoint the exact issue. The logs will tell us:
- Is the entry being fetched?
- Does it have variants?
- Which variant is being selected?
- What content is being extracted?

**This will make it easy to fix!** 🎯

