# 🔐 FIX: Contentstack Credentials Not Found

## Problem
The script can't find your Contentstack credentials in `.env.local`

## Solution

### Step 1: Check if .env.local exists
```bash
ls -la .env.local
```

### Step 2: Create or update .env.local file

**Option A: Use the terminal**
```bash
cat > .env.local << 'EOF'
CONTENTSTACK_STACK_API_KEY=YOUR_API_KEY_HERE
CONTENTSTACK_MANAGEMENT_TOKEN=YOUR_MANAGEMENT_TOKEN_HERE
CONTENTSTACK_DELIVERY_TOKEN=YOUR_DELIVERY_TOKEN_HERE
CONTENTSTACK_REGION=NA
CONTENTSTACK_ENVIRONMENT=dev
NEXT_PUBLIC_USE_CONTENTSTACK=false
EOF
```

**Option B: Manually create the file**
1. Create a file named `.env.local` in the project root
2. Add these lines (replace with your actual credentials):

```env
CONTENTSTACK_STACK_API_KEY=blt1234567890abcdef
CONTENTSTACK_MANAGEMENT_TOKEN=cs1234567890abcdef1234567890abcdef
CONTENTSTACK_DELIVERY_TOKEN=cs9876543210fedcba9876543210fedcba
CONTENTSTACK_REGION=NA
CONTENTSTACK_ENVIRONMENT=dev
NEXT_PUBLIC_USE_CONTENTSTACK=false
```

### Step 3: Get your Contentstack credentials

#### API Key (Stack API Key):
1. Go to Contentstack Dashboard
2. Click on **Settings** → **Stack Settings**
3. Copy the **API Key** (starts with `blt`)

#### Management Token:
1. Go to **Settings** → **Tokens** → **Management Tokens**
2. Click **+ New Token**
3. Give it a name (e.g., "SkillStream Setup")
4. Enable these scopes:
   - ✅ Content Type (Read & Write)
   - ✅ Entry (Read & Write)
   - ✅ Taxonomy (Read & Write)
5. Click **Generate Token**
6. **Copy the token immediately** (starts with `cs`) - you won't see it again!

#### Delivery Token (optional for now):
1. Go to **Settings** → **Tokens** → **Delivery Tokens**
2. Click **+ New Token**
3. Give it a name and select `dev` environment
4. Copy the token

### Step 4: Test your credentials
```bash
npm run cs:test-creds
```

You should see:
```
✅ Credentials are valid!
Found X existing content types in your stack.
✅ Ready to run Phase 1 setup!
```

### Step 5: Run Phase 1 setup
```bash
npm run cs:phase1
```

---

## Troubleshooting

### Error: "API Key: ❌ NOT SET"
**Fix**: Check that your `.env.local` file has `CONTENTSTACK_STACK_API_KEY=blt...`

### Error: "Management Token: ❌ NOT SET"
**Fix**: Check that your `.env.local` file has `CONTENTSTACK_MANAGEMENT_TOKEN=cs...`

### Error: "authorization is not valid" (401)
**Fix**: 
1. Your management token is invalid or expired
2. Generate a new management token in Contentstack UI
3. Update `.env.local` with the new token

### Error: "You're not allowed" (403)
**Fix**: Your management token needs more permissions. Regenerate it with Content Type, Entry, and Taxonomy permissions.

### Wrong Region?
If your stack is in a different region, update in `.env.local`:
- `CONTENTSTACK_REGION=NA` (North America)
- `CONTENTSTACK_REGION=EU` (Europe)
- `CONTENTSTACK_REGION=AZURE_NA` (Azure North America)
- `CONTENTSTACK_REGION=AZURE_EU` (Azure Europe)

---

## Quick Check

Run this to see if .env.local is being read:
```bash
node -e "require('dotenv').config({path:'.env.local'}); console.log('API Key:', process.env.CONTENTSTACK_STACK_API_KEY ? 'Found ✅' : 'Missing ❌')"
```

---

**Once credentials are set up, run:**
```bash
npm run cs:test-creds  # Test credentials
npm run cs:phase1      # Run Phase 1 setup
```

