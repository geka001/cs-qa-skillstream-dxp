# Quick Start Guide - Contentstack Advanced Features

**Last Updated:** November 28, 2025  
**Estimated Setup Time:** 30-60 minutes

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies (2 min)

```bash
cd /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp
npm install
```

### Step 2: Configure Environment (3 min)

Ensure your `.env.local` has:

```bash
CONTENTSTACK_STACK_API_KEY=blt8202119c48319b1d
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token_here
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
CONTENTSTACK_ENVIRONMENT=dev
CONTENTSTACK_REGION=na

NEXT_PUBLIC_CONTENTSTACK_API_KEY=blt8202119c48319b1d
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=dev
NEXT_PUBLIC_CONTENTSTACK_REGION=na
```

### Step 3: Run Setup Scripts (10-15 min)

```bash
# Option A: Run all at once
npm run cs:setup-all

# Option B: Run individually (recommended for troubleshooting)
npm run cs:taxonomy            # Create taxonomies (~2 min)
npm run cs:taxonomy-fields     # Add taxonomy fields (~2 min)
npm run cs:taxonomy-tag        # Tag existing entries (~3 min)
npm run cs:variants            # Add variant fields (~2 min)
npm run cs:variants-create     # Create variant entries (~2 min)
```

### Step 4: Manual Steps in Contentstack UI (10-15 min)

#### 4.1 Verify Taxonomies
1. Go to: https://app.contentstack.com → Your Stack → Settings → Taxonomies
2. Verify 5 taxonomies exist:
   - ✅ QA Skills
   - ✅ Learning Paths
   - ✅ Tool Categories
   - ✅ Difficulty Levels
   - ✅ User Segments

#### 4.2 Create Personalize Audiences

Go to: Personalize → Audiences → Create New

**Audience 1:**
- Name: `Rookie Learners`
- UID: `rookie_learners`
- Condition: `segment` equals `ROOKIE`

**Audience 2:**
- Name: `At-Risk Learners`
- UID: `at_risk_learners`
- Condition: `segment` equals `AT_RISK`

**Audience 3:**
- Name: `High-Flyer Learners`
- UID: `high_flyer_learners`
- Condition: `segment` equals `HIGH_FLYER`

#### 4.3 Create Personalize Experiences

Go to: Personalize → Experiences → Create New

**Experience 1:**
- Name: `Rookie Onboarding`
- Audience: Rookie Learners
- Priority: Medium

**Experience 2:**
- Name: `Remedial Support`
- Audience: At-Risk Learners
- Priority: High

**Experience 3:**
- Name: `Advanced Learning`
- Audience: High-Flyer Learners
- Priority: Medium

**Experience 4:**
- Name: `Default Experience`
- Audience: All Users
- Priority: Low

### Step 5: Test Your Setup (5-10 min)

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Login as different user segments and verify:
```

**Test Checklist:**
- [ ] ROOKIE user sees beginner modules
- [ ] AT_RISK user sees remedial modules
- [ ] HIGH_FLYER user sees advanced modules
- [ ] Taxonomy filtering works (if implemented in UI)
- [ ] Variants load correctly for each segment

---

## ✅ Verification Checklist

### Taxonomy Verification

```typescript
// In browser console or test file:
import { getModulesBySkill } from '@/lib/contentstack';

// Should return modules tagged with 'automation_testing'
const modules = await getModulesBySkill('automation_testing');
console.log('Automation modules:', modules.length);
```

**Expected Results:**
- ✅ Returns array of modules
- ✅ All modules have automation skill tag
- ✅ No errors in console

### Personalize Verification

```typescript
import { getPersonalizedModules } from '@/lib/contentstack';

// Test ROOKIE personalization
const rookieModules = await getPersonalizedModules({
  segment: 'ROOKIE',
  completedModules: [],
  avgScore: 0
});

console.log('ROOKIE modules:', rookieModules.length);
console.log('Segments:', rookieModules.map(m => m.targetSegments));
```

**Expected Results:**
- ✅ Returns modules appropriate for ROOKIE
- ✅ No advanced modules in results
- ✅ All modules target ROOKIE segment

### Variants Verification

```typescript
import { getModuleVariant } from '@/lib/contentstack';

// Test variant selection
const rookieVariant = await getModuleVariant('automation-base', 'ROOKIE');
const highFlyerVariant = await getModuleVariant('automation-base', 'HIGH_FLYER');

console.log('ROOKIE variant:', rookieVariant?.title);
console.log('HIGH_FLYER variant:', highFlyerVariant?.title);
```

**Expected Results:**
- ✅ ROOKIE gets "Let's Start Simple!" variant
- ✅ HIGH_FLYER gets "Advanced Concepts" variant
- ✅ Different content/time for each segment

---

## 🐛 Troubleshooting

### Issue: Taxonomies not created

**Check:**
```bash
# Verify management token has permissions
curl -H "api_key: YOUR_API_KEY" \
     -H "authorization: YOUR_MANAGEMENT_TOKEN" \
     https://api.contentstack.io/v3/taxonomies
```

**Fix:** Regenerate management token in Contentstack UI with full permissions

### Issue: Personalize not working

**Check:**
1. Audiences created in UI? ✓
2. Experiences created and published? ✓
3. Header `x-cs-personalize` being sent? ✓

**Debug:**
```typescript
// Check if header is sent
console.log('Personalize context:', {
  segment: user.segment,
  completedModules: user.completedModules.length,
  avgScore: user.avgScore
});
```

### Issue: Variants always return base module

**Check:**
1. Variant entries exist? Check Contentstack UI → Entries → QA Module
2. `is_variant` flag set to `true`? 
3. `base_entry_ref` linked correctly?
4. Entries published?

**Fix:** Re-run `npm run cs:variants-create`

---

## 📊 Feature Usage Examples

### Example 1: Filter by Skill (Taxonomy)

```typescript
// In your component
import { getModulesBySkill } from '@/lib/contentstack';

export default function AutomationModules() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    async function loadModules() {
      const data = await getModulesBySkill('automation_testing');
      setModules(data);
    }
    loadModules();
  }, []);

  return (
    <div>
      <h2>Automation Testing Modules</h2>
      {modules.map(module => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
```

### Example 2: Personalized Content (Personalize)

```typescript
// In your dashboard
import { getAllPersonalizedContent } from '@/lib/contentstack';
import { useApp } from '@/contexts/AppContext';

export default function Dashboard() {
  const { user } = useApp();
  const [content, setContent] = useState(null);

  useEffect(() => {
    async function loadPersonalized() {
      const data = await getAllPersonalizedContent({
        segment: user.segment,
        completedModules: user.completedModules,
        avgScore: calculateAverage(user.quizScores)
      });
      setContent(data);
    }
    loadPersonalized();
  }, [user.segment]);

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <ModuleGrid modules={content?.modules || []} />
    </div>
  );
}
```

### Example 3: Variant Selection (Variants)

```typescript
// In your module viewer
import { getBestModuleForUser } from '@/lib/contentstack';
import { useApp } from '@/contexts/AppContext';

export default function ModuleViewer({ baseModuleId }) {
  const { user } = useApp();
  const [module, setModule] = useState(null);

  useEffect(() => {
    async function loadBestVariant() {
      const data = await getBestModuleForUser(baseModuleId, {
        segment: user.segment,
        completedModules: user.completedModules,
        avgScore: calculateAverage(user.quizScores)
      });
      setModule(data);
    }
    loadBestVariant();
  }, [baseModuleId, user.segment]);

  if (!module) return <div>Loading...</div>;

  return (
    <div>
      <h1>{module.title}</h1>
      <p>Estimated time: {module.estimatedTime} minutes</p>
      <div dangerouslySetInnerHTML={{ __html: module.content }} />
    </div>
  );
}
```

---

## 📖 Additional Resources

- **Full Documentation:** `CONTENTSTACK_ADVANCED_FEATURES.md`
- **API Reference:** See "API Reference" section in full docs
- **Contentstack Docs:** https://www.contentstack.com/docs/
- **Personalize Guide:** https://www.contentstack.com/docs/developers/personalize/

---

## 🎯 Success Criteria

Your setup is complete when:

✅ All 6 scripts run without errors  
✅ 5 taxonomies visible in Contentstack UI  
✅ Content types have taxonomy fields  
✅ Existing entries are tagged with taxonomy terms  
✅ 3 audiences created in Personalize  
✅ 4 experiences created in Personalize  
✅ Variant fields added to content types  
✅ 4 variant entries created (1 base + 3 variants)  
✅ Application queries work without errors  
✅ Different segments see different content  

---

## 🚀 Next Steps

1. **Integrate into UI:**
   - Add taxonomy filters to module browsing
   - Display variant-specific content
   - Show personalized recommendations

2. **Create More Variants:**
   - Use `create-variant-entries.js` as template
   - Create variants for more modules
   - Test with real users

3. **Enhance Personalization:**
   - Add more audience conditions (e.g., quiz score, time spent)
   - Create A/B test experiences
   - Track experience analytics

4. **Scale Taxonomy:**
   - Add more skills and categories
   - Create deeper hierarchies
   - Tag all content comprehensively

---

**Questions?** Check the full documentation or Contentstack support!

**Ready to go?** Run `npm run cs:setup-all` and let's get started! 🎉

