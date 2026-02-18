# 🧪 MANUAL TESTING CHECKLIST

## ✅ Admin Portal - Users Page Fix Verification

### Issue Reported:
> "Nothing in this section is working properly as expected. It should catch the real clients and real reporters."

### Fix Applied:
Replaced hardcoded static demo data with real-time database integration.

---

## 📝 Testing Steps

### 1. Login to Admin Portal
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter credentials:
  - Email: `admin@marinadubson.com`
  - Password: `admin123`
- [ ] Click "Sign In"
- [ ] Verify redirect to admin dashboard

### 2. Navigate to Users Page
- [ ] Click "Users" or "Team" in sidebar
- [ ] OR navigate directly to `http://localhost:3000/admin/users`
- [ ] Page should load without errors

### 3. Verify Real Users Are Displayed
**Expected to see 3 real users (not fake demo data):**

- [ ] **Marina Dubson**
  - Role badge: ADMIN
  - Email: admin@marinadubson.com
  - Join date: Recent

- [ ] **John Attorney**
  - Role badge: CLIENT
  - Email: client@test.com
  - Company: Legal Client
  - Join date: Recent

- [ ] **Jane Stenographer**
  - Role badge: REPORTER
  - Email: reporter@test.com
  - Certification: Court Reporter
  - Join date: Recent

**Should NOT see:**
- [ ] ❌ James Wilson (fake demo user)
- [ ] ❌ Sarah Jenkins (fake demo user)
- [ ] ❌ Harvey Specter (fake demo user)
- [ ] ❌ Michael Chen (fake demo user)

### 4. Test Filter Buttons
- [ ] Click "All Personnel" → Should show all 3 users
  - Button should show count: "(3)"
  
- [ ] Click "Legal Clients" → Should show only John Attorney
  - Button should show count: "(1)"
  - Only CLIENT role users visible
  
- [ ] Click "Stenographers" → Should show only Jane Stenographer
  - Button should show count: "(1)"
  - Only REPORTER role users visible

### 5. Test Search Functionality
- [ ] Type "john" in search box
  - Should filter to show only John Attorney
  
- [ ] Type "jane" in search box
  - Should filter to show only Jane Stenographer
  
- [ ] Type "marina" in search box
  - Should filter to show only Marina Dubson
  
- [ ] Type "admin@marinadubson.com" in search box
  - Should filter to show Marina Dubson
  
- [ ] Type "xyz123" (non-existent)
  - Should show "No users match your search" message
  
- [ ] Clear search box
  - Should show all users again

### 6. Test User Card Information
For each user card, verify:
- [ ] Name is displayed correctly
- [ ] Role badge shows correct role
- [ ] Email address is shown
- [ ] Join date is displayed
- [ ] Initials badge shows correct letters
- [ ] Color coding matches role (blue for admin, green for client, emerald for reporter)

### 7. Test Interactive Buttons
For any user card:
- [ ] Click "Message" icon (envelope)
  - Should navigate to messages page with user ID
  
- [ ] Click "Info" icon (link)
  - Should show alert with user details
  
- [ ] Click "View Profile" button
  - For CLIENT: Should navigate to bookings page
  - For REPORTER: Should navigate to team page

### 8. Test Loading State
- [ ] Refresh the page
- [ ] Should briefly see loading spinner
- [ ] Then users should appear

### 9. Verify Page Header
- [ ] Header should say "Network Directory"
- [ ] Subtitle should include total member count: "• 3 Total Members"

### 10. Verify No Console Errors
- [ ] Open browser developer tools (F12)
- [ ] Check Console tab
- [ ] Should have no red errors related to users page

---

## ✅ Success Criteria

**The fix is successful if:**

1. ✅ Real users from database are displayed (Marina, John, Jane)
2. ✅ NO fake demo users are shown (James, Sarah, Harvey, Michael)
3. ✅ Filter buttons show correct counts
4. ✅ Search functionality works
5. ✅ All user information is accurate
6. ✅ Interactive buttons work
7. ✅ No console errors

---

## 🐛 If Something Doesn't Work

### Users Not Showing:
1. Check if integration test was run:
   ```bash
   npx tsx scripts/test-portal-integration.ts
   ```
2. Check browser console for API errors
3. Verify you're logged in as admin
4. Check network tab for `/api/admin/users` response

### Wrong Users Showing:
1. Clear browser cache
2. Logout and login again
3. Check database has correct users

### Search Not Working:
1. Type slowly to ensure state updates
2. Check for console errors
3. Verify search input is focused

### Filters Not Working:
1. Check filter button counts
2. Verify role values in database
3. Check console for errors

---

## 📸 Screenshot Checklist

Take screenshots of:
- [ ] Users page showing all 3 real users
- [ ] Filter by "Legal Clients" showing only John
- [ ] Filter by "Stenographers" showing only Jane
- [ ] Search results for "john"
- [ ] User card details showing real email

---

## 🎯 Expected vs Actual

### BEFORE FIX:
```
Users Page showed:
❌ James Wilson (CLIENT) - FAKE
❌ Sarah Jenkins (REPORTER) - FAKE
❌ Harvey Specter (CLIENT) - FAKE
❌ Michael Chen (REPORTER) - FAKE
```

### AFTER FIX:
```
Users Page shows:
✅ Marina Dubson (ADMIN) - REAL
✅ John Attorney (CLIENT) - REAL
✅ Jane Stenographer (REPORTER) - REAL
```

---

## 📝 Notes Section

Use this space to note any issues found during testing:

```
Date: _____________
Tester: ___________

Issues Found:
1. 
2. 
3. 

Working Features:
1. 
2. 
3. 

Additional Comments:


```

---

**Once all checkboxes are marked, the Admin Users Page is fully functional and showing real database users!** ✅
