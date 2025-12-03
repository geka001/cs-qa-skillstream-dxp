# 🔍 Debug Script - Check What Contentstack Returns

## Run This in Browser Console:

```javascript
// Fetch one module directly to see what Contentstack returns
fetch('https://na-cdn.contentstack.com/v3/content_types/qa_training_module/entries/bltb26ef099037ee104?environment=dev', {
  headers: {
    'api_key': 'blt8202119c48319b1d',
    'access_token': 'csdf941d70d6da13d4ae6265de'
  }
})
.then(r => r.json())
.then(data => {
  console.log('📦 Raw Contentstack Response:');
  console.log(JSON.stringify(data, null, 2));
  
  console.log('\n🔍 Taxonomy Fields:');
  console.log('team_taxonomy:', data.entry.team_taxonomy);
  console.log('segment_taxonomy:', data.entry.segment_taxonomy);
  
  console.log('\n🎯 Expected:');
  console.log('team_taxonomy should be: ["Launch"]');
  console.log('segment_taxonomy should include: "High flyer" or "High-Flyer"');
});
```

## What This Will Show:

**Expected Output:**
```json
{
  "entry": {
    "title": "Advanced Launch Concepts",
    "team_taxonomy": ["Launch"],
    "segment_taxonomy": ["Rookie", "AT Risk", "High flyer"],
    ...
  }
}
```

**If you see:**
```json
{
  "entry": {
    "team_taxonomy": null,
    "segment_taxonomy": null,
    ...
  }
}
```
→ Taxonomy fields not configured correctly in Contentstack

**Or if you see:**
```json
{
  "entry": {
    "team_taxonomy": [],
    "segment_taxonomy": [],
    ...
  }
}
```
→ Taxonomy fields are empty (not tagged)

---

## Also Share:

1. **Complete console logs** when becoming HIGH_FLYER (all the 🔍 Filtering lines)
2. **Screenshot** of the Contentstack UI for entry `bltb26ef099037ee104` showing:
   - `team_taxonomy` field value
   - `segment_taxonomy` field value
3. **Result** of the above fetch script

This will help me see exactly what's wrong!

