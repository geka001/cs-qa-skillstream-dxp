# ✅ Personalize Project UID Added - Next Steps

## ✅ What's Done:
- Personalize SDK installed
- Code updated to use Personalize
- Project UID added: `68a6ec844875734317267dcf`

---

## 🎯 Next Steps (In Contentstack UI):

### Step 1: Create Audiences (5 min)

**Go to: Contentstack → Personalize → Audiences → Create Audience**

#### Audience 1: Rookie Learners
1. Click **"Create Audience"**
2. **Name:** `Rookie Learners`
3. **UID:** `rookie_learners` (auto-generated, you can edit)
4. **Description:** `New QA team members in onboarding`
5. **Add Attribute Rule:**
   - Click **"Add Rule"** or **"Add Attribute"**
   - **Attribute:** `segment`
   - **Condition:** `equals` or `is`
   - **Value:** `rookie`
6. **Save Audience**

#### Audience 2: At-Risk Learners
1. Click **"Create Audience"**
2. **Name:** `At-Risk Learners`
3. **UID:** `at_risk_learners`
4. **Description:** `QA members needing additional support`
5. **Add Attribute Rule:**
   - **Attribute:** `segment`
   - **Condition:** `equals` or `is`
   - **Value:** `at_risk`
6. **Save Audience**

#### Audience 3: High-Flyer Learners
1. Click **"Create Audience"**
2. **Name:** `High-Flyer Learners`
3. **UID:** `high_flyer_learners`
4. **Description:** `Advanced QA members`
5. **Add Attribute Rule:**
   - **Attribute:** `segment`
   - **Condition:** `equals` or `is`
   - **Value:** `high_flyer`
6. **Save Audience**

---

### Step 2: Link Variants to Audiences (10 min)

**Go to: Contentstack → Settings → Variants**

#### Find Your Variant Group:
- Look for **"Learner Level Variants"** (or whatever you named it)
- Click to **Edit**

#### For Each Variant:

**Variant 1: rookie_version**
1. Click **Edit** on `rookie_version`
2. Look for **"Target Audience"** or **"Linked Audience"**
3. Select **"Rookie Learners"** from dropdown
4. **Save**

**Variant 2: at_risk_version**
1. Click **Edit** on `at_risk_version`
2. Select **"At-Risk Learners"**
3. **Save**

**Variant 3: high_flyer_version**
1. Click **Edit** on `high_flyer_version`
2. Select **"High-Flyer Learners"**
3. **Save**

---

### Step 3: Verify Entry Content

**Go to: Content → qa_training_module → "Introduction to Contentstack Launch"**

**Check that ALL 3 variants have content:**
- ✅ `rookie_version` - Basic introduction content
- ✅ `at_risk_version` - Step-by-step guide content
- ✅ `high_flyer_version` - Advanced concepts content

**If any variant is empty, fill it in!**

**Make sure entry is PUBLISHED to `dev` environment.**

---

### Step 4: Create a Personalize Experience (Optional but Recommended)

**Go to: Contentstack → Personalize → Experiences → Create Experience**

1. **Name:** `QA Training Personalization`
2. **Description:** `Deliver personalized content based on learner segment`
3. **Add Rule:**
   - **Audience:** `Rookie Learners`
   - **Action:** Show content with `rookie_version` variant
4. **Add Rule:**
   - **Audience:** `At-Risk Learners`
   - **Action:** Show content with `at_risk_version` variant
5. **Add Rule:**
   - **Audience:** `High-Flyer Learners`
   - **Action:** Show content with `high_flyer_version` variant
6. **Activate Experience**

**Note:** The exact UI may vary depending on your Contentstack version.

---

## 🚀 After Configuration:

### Restart Dev Server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Check Browser Console:
You should see:
```
🎭 Using Personalize SDK to fetch modules with variants
✅ Personalize SDK initialized with attributes: { segment: 'ROOKIE', team: 'Launch' }
🔍 Fetching entries with Personalize: { contentTypeUid: 'qa_training_module', segment: 'ROOKIE' }
✅ Personalized 5 entries
```

---

## 🧪 Testing:

### Test 1: Login as Rookie (Launch Team)
**Expected:**
- Should see `rookie_version` content
- Console: `✅ Personalize SDK initialized with attributes: { segment: 'ROOKIE', team: 'Launch' }`

### Test 2: Complete modules, become High-Flyer
**Expected:**
- Should see `high_flyer_version` content
- Console: `✅ Personalize SDK initialized with attributes: { segment: 'HIGH_FLYER', team: 'Launch' }`

### Test 3: Fail a quiz, become At-Risk
**Expected:**
- Should see `at_risk_version` content
- Console: `✅ Personalize SDK initialized with attributes: { segment: 'AT_RISK', team: 'Launch' }`

---

## 🚨 Troubleshooting:

### If you see: `⚠️ Personalize SDK not configured`
**Check:**
- Project UID is in `.env.local`
- Dev server was restarted after adding UID
- No typos in the UID

### If you see: `📦 Using standard Delivery API (variants not supported)`
**Check:**
- `NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID` is set
- Value matches exactly: `68a6ec844875734317267dcf`
- File is `.env.local` (not `env.local`)

### If variants still not showing:
**Check:**
- Audiences are created with correct attribute rules (`segment` = `rookie`/`at_risk`/`high_flyer`)
- Variants are linked to audiences
- Entry is published to `dev` environment
- All 3 variants have content filled in

---

## 📋 Checklist:

### In Contentstack UI:
- [ ] Create Audience: "Rookie Learners" (segment = rookie)
- [ ] Create Audience: "At-Risk Learners" (segment = at_risk)
- [ ] Create Audience: "High-Flyer Learners" (segment = high_flyer)
- [ ] Link `rookie_version` → "Rookie Learners"
- [ ] Link `at_risk_version` → "At-Risk Learners"
- [ ] Link `high_flyer_version` → "High-Flyer Learners"
- [ ] Verify entry has content in all 3 variants
- [ ] Entry is published to `dev`
- [ ] (Optional) Create Personalize Experience

### In Code:
- [x] SDK installed
- [x] Code updated
- [x] Project UID added to `.env.local`
- [ ] Dev server restarted
- [ ] Test in browser

---

## 🎯 Current Status:

**✅ Code Side:** COMPLETE
**⏳ Contentstack Side:** Waiting for you to configure audiences and link variants

**Estimated time to complete:** 15-20 minutes

---

## 📞 Next Action:

1. **Create the 3 audiences** (as described in Step 1)
2. **Link variants to audiences** (as described in Step 2)
3. **Verify entry content** (as described in Step 3)
4. **Restart dev server**
5. **Test!**

**Let me know when you've created the audiences and I'll help you test! 🚀**

