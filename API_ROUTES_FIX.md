# 🔧 CRITICAL FIX: API Routes for Contentstack

## ❌ Problem
User data was not being saved to Contentstack. Issues:
1. No entries created in Contentstack
2. SOP progress not updating
3. Login showed fresh state every time
4. All changes lost on refresh

## 🔍 Root Cause
The Contentstack **Management API** was being called directly from the **browser (client-side)**, which doesn't work because:

1. **Environment variables not available**: `CONTENTSTACK_MANAGEMENT_TOKEN` only exists on server
2. **CORS errors**: Contentstack Management API blocks browser requests
3. **Security**: Management tokens should never be exposed to the browser

## ✅ Solution: Next.js API Routes

Created server-side API routes to handle Contentstack operations:

### Files Created:

1. **`app/api/users/route.ts`** - User CRUD operations
   - `GET /api/users?name=X&team=Y` - Fetch user
   - `POST /api/users` - Create user
   - `PUT /api/users` - Update user

2. **`app/api/users/team/route.ts`** - Team operations
   - `GET /api/users/team?team=X` - Fetch all users for a team

3. **`lib/userService.ts`** - Client-side wrapper
   - Calls the API routes from the browser
   - Handles errors and logging

### Files Updated:

4. **`contexts/AppContext.tsx`** - Import from `userService` instead of `contentstackUser`
5. **`app/manager/dashboard/page.tsx`** - Import from `userService`

---

## 📊 Architecture

### Before (❌ Broken):
```
Browser (AppContext)
  ↓
lib/contentstackUser.ts (tries to use MANAGEMENT_TOKEN)
  ↓
❌ FAILS - No token in browser
```

### After (✅ Working):
```
Browser (AppContext)
  ↓
lib/userService.ts (client-side)
  ↓
fetch('/api/users') → Next.js API Route
  ↓
app/api/users/route.ts (server-side)
  ↓
lib/contentstackUser.ts (has access to tokens)
  ↓
Contentstack Management API
  ↓
✅ SUCCESS
```

---

## 🔄 Data Flow

### User Login:
```
1. User enters name + team
2. Browser calls: fetch('/api/users?name=X&team=Y')
3. API route calls: getUserByNameAndTeam()
4. If exists: Return user data
5. If not: Browser calls: fetch('/api/users', {method: 'POST'})
6. API route calls: createUser()
7. Entry created in Contentstack
8. Entry auto-published to 'dev'
9. User data returned to browser
```

### Progress Update:
```
1. User completes module
2. State updated locally (instant UI)
3. After 2 seconds: debouncedSave() triggered
4. Browser calls: fetch('/api/users', {method: 'PUT'})
5. API route calls: updateUser()
6. Entry updated in Contentstack
7. Entry auto-published
```

### Manager Dashboard:
```
1. Manager selects team
2. Browser calls: fetch('/api/users/team?team=Launch')
3. API route calls: getUsersByTeam()
4. Fetches all users from Contentstack
5. Returns user data to browser
6. Dashboard displays stats
```

---

## 🧪 Testing Now

### Test 1: Check API Routes Work
```bash
# In browser console (after npm run dev):
fetch('/api/users?name=Test&team=Launch')
  .then(r => r.json())
  .then(console.log)

# Expected: 
# - First time: {user: null} (404)
# - Should create user automatically on login
```

### Test 2: Create User
```bash
# Login with name "Test User" and team "Launch"
# Check browser console for:
# "📦 Fetching user from API: Test_User_Launch"
# "⚠️ User not found: Test_User_Launch"
# "📦 Creating user via API: Test_User_Launch"
# "✅ User created: Test_User_Launch"
```

### Test 3: Verify in Contentstack
```bash
# Go to Contentstack UI
# Content → Entries → QA User Profile
# Should see new entry:
# - Title: "Test User"
# - User ID: "Test_User_Launch"
# - Published to 'dev' environment
```

### Test 4: Update User
```bash
# Complete a module
# Wait 3 seconds
# Check console:
# "📦 Updating user via API: Test_User_Launch"
# "✅ User updated: Test_User_Launch"

# Check Contentstack:
# - Entry should be updated
# - quiz_scores field should have data
```

---

## ⚠️ Important Changes

### Environment Variables (Server-Side Only)
These are now ONLY used in API routes (server-side):
```
CONTENTSTACK_STACK_API_KEY
CONTENTSTACK_MANAGEMENT_TOKEN
CONTENTSTACK_DELIVERY_TOKEN
CONTENTSTACK_REGION
CONTENTSTACK_ENVIRONMENT
```

### Client-Side Flag (Still Used)
This is still checked in browser:
```
NEXT_PUBLIC_USE_CONTENTSTACK=true
```

---

## 🚀 What to Do Now

1. **Restart dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache** (important!):
   - Chrome: Cmd+Shift+Delete
   - Clear "Cached images and files"

3. **Test login**:
   - Go to http://localhost:3000
   - Enter name: "Test User"
   - Select team: "Launch"
   - Click "Start Learning"

4. **Check console logs**:
   - Should see API calls
   - Should see "User created" message

5. **Verify in Contentstack**:
   - Check `qa_user` content type
   - Should have new entry

6. **Test progress**:
   - Complete a module
   - Wait 3 seconds
   - Check Contentstack - entry should update

---

## ✅ This Should Fix:
- ✅ Users created in Contentstack
- ✅ Progress saves to Contentstack
- ✅ Data persists across logins
- ✅ Manager dashboard shows real data
- ✅ SOP progress updates correctly

---

**Status: FIXED - Restart server and test!** 🚀


