# 🧪 Portal Integration Testing Guide

## Quick Start: Test All Three Portals in 10 Minutes

### Prerequisites
1. Run the integration test script (already completed):
   ```bash
   npx tsx scripts/test-portal-integration.ts
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open browser to: `http://localhost:3000`

---

## 🎯 Test Scenario 1: Complete Booking Workflow

### Step 1: Login as Client
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `client@test.com`
   - Password: `client123`
3. Click "Sign In"

**✅ Expected Result:**
- Redirected to `/client/portal`
- See "Intelligence Overview" tab active
- Dashboard shows stats:
  - Active Cases: 1
  - Unpaid Ledger: $1,243
  - Vault Files: 0

### Step 2: View Existing Booking (Client Portal)
1. Look at "Recent Activity Feed"
2. Find booking: "BK-FLOW-XXXX"
3. Notice:
   - Assigned reporter badge: "Assigned: Jane Stenographer"
   - Status badge showing "COMPLETED"
4. Click on the booking row

**✅ Expected Result:**
- Booking details displayed or navigation occurs
- Reporter name clearly visible

### Step 3: Check Client Invoice
1. Click "Financial Ledger" tab
2. See invoice: "INV-XXXXX"
3. Notice:
   - Total: $1,243.00
   - Status: SENT
   - Due date displayed
4. Click "Pay Invoice" button

**✅ Expected Result:**
- Alert or payment modal appears
- Invoice marked for payment

### Step 4: Send Message to Admin
1. Click "Direct Messaging" tab
2. See existing message from admin
3. Type new message: "Thank you for the excellent service!"
4. Press Enter or click Send

**✅ Expected Result:**
- Message sent successfully
- Page refreshes showing new message
- Message appears in conversation thread

---

## 🎯 Test Scenario 2: Admin Management

### Step 1: Logout and Login as Admin
1. Click "Exit" button in client portal
2. Redirected to login page
3. Enter credentials:
   - Email: `admin@marinadubson.com`
   - Password: `admin123`
4. Click "Sign In"

**✅ Expected Result:**
- Redirected to `/admin/dashboard`
- See admin dashboard with metrics:
  - Total Revenue: $1,243
  - Upcoming Jobs: 0 (completed job)
  - Active Reporters: 1
  - Review Queue: 0

### Step 2: View All Bookings
1. Click "Bookings" in sidebar
2. Navigate to `/admin/bookings`
3. See list of all bookings
4. Find "BK-FLOW-XXXX"
5. Notice:
   - Client name: "Attorney & Associates LLC"
   - Reporter: "Jane Stenographer"
   - Status: "COMPLETED"

**✅ Expected Result:**
- All bookings visible
- Reporter assignment shown
- Status badges displayed correctly

### Step 3: View Booking Details
1. Click on a booking row
2. See expanded details:
   - Service type
   - Date and time
   - Location
   - Special requirements
3. Notice action buttons:
   - "Update Status"
   - "Toggle Marketplace"
   - "View Bids"
   - "Complete & Bill"

**✅ Expected Result:**
- All booking information displayed
- Action buttons functional

### Step 4: Check Users List
1. Click "Team" or navigate to users section
2. See list of all users:
   - Marina Dubson (Admin)
   - John Attorney (Client)
   - Jane Stenographer (Reporter)
3. Notice role badges

**✅ Expected Result:**
- All registered users visible
- Roles clearly indicated
- Client and reporter accounts shown

### Step 5: View Messages
1. Navigate to messages/communications
2. See message thread with client
3. See message thread with reporter
4. Send test message to reporter

**✅ Expected Result:**
- All conversations visible
- Messages properly threaded
- Can send new messages

---

## 🎯 Test Scenario 3: Reporter Workflow

### Step 1: Logout and Login as Reporter
1. Click logout
2. Return to login page
3. Enter credentials:
   - Email: `reporter@test.com`
   - Password: `reporter123`
4. Click "Sign In"

**✅ Expected Result:**
- Redirected to `/reporter/portal`
- See "Earnings Dashboard" (Overview tab)
- Dashboard shows metrics:
  - Jobs Scheduled: 01
  - Pending Delivery: 00 (completed)
  - Market Jobs: 00 (no new jobs)
  - Net Earnings: $525

### Step 2: View Assigned Jobs
1. Click "Jobs Scheduled" card OR
2. Click "Job Assignment Desk" in sidebar
3. See "Confirmed Assignments" section
4. Find "BK-FLOW-XXXX"
5. Notice:
   - Client: "Attorney & Associates LLC"
   - Date and time
   - Location
   - Status: "COMPLETED"

**✅ Expected Result:**
- Assigned job visible
- All details displayed
- Status badge shows completion

### Step 3: Check Earnings
1. Look at sidebar "Net Earnings" card
2. See: $525.00
3. Notice this matches accepted bid amount

**✅ Expected Result:**
- Earnings calculated from accepted bids
- Amount displayed correctly

### Step 4: View Marketplace
1. Scroll down to "Marketplace Opportunities"
2. Notice: "No marketplace opportunities available"
3. This is correct - no new jobs posted

**✅ Expected Result:**
- Empty state displayed
- Friendly message shown

### Step 5: Send Message to Admin
1. Click "Secure Messaging" tab
2. See existing messages from admin
3. Type: "Job completed successfully. Transcript uploaded."
4. Press Enter

**✅ Expected Result:**
- Message sent
- Appears in conversation thread
- Admin will see this message

---

## 🎯 Test Scenario 4: Create New Booking Flow

### Step 1: Login as Client
1. Login as `client@test.com`
2. Navigate to client portal

### Step 2: Create New Booking Request
1. Click "New Request" button OR
2. Navigate to "Visual Case Scheduler" tab
3. Fill out form:
   - Service: "Premium Court Reporting"
   - Date: [Future date]
   - Time: "10:00 AM"
   - Location: "123 Main St, Suite 200"
   - Proceeding Type: "Expert Witness Deposition"
4. Click "Submit Request"

**✅ Expected Result:**
- Booking created
- Status: SUBMITTED
- Appears in client's activity feed

### Step 3: Admin Reviews New Booking
1. Logout and login as admin
2. Navigate to bookings page
3. See new booking in list
4. Notice "Review Queue" count increased
5. Click "Toggle Marketplace" to push to marketplace

**✅ Expected Result:**
- Booking now has marketplace badge
- Visible to reporters

### Step 4: Reporter Bids on Job
1. Logout and login as reporter
2. Navigate to "Job Assignment Desk"
3. Scroll to "Marketplace Opportunities"
4. See new job card
5. Click "Submit Deployment Bid"
6. Enter amount: $450
7. Submit

**✅ Expected Result:**
- Bid submitted successfully
- Alert confirmation shown
- Bid appears in admin portal

### Step 5: Admin Accepts Bid
1. Logout and login as admin
2. Navigate to bookings
3. Find new booking
4. Click "View Bids"
5. See reporter's bid
6. Click "Accept"

**✅ Expected Result:**
- Bid accepted
- Reporter auto-assigned
- Booking removed from marketplace
- Client can now see reporter name

### Step 6: Client Confirms
1. Logout and login as client
2. See "ACTION REQUIRED" badge on booking
3. See "Assigned: Jane Stenographer"
4. Click booking to confirm
5. Complete confirmation process

**✅ Expected Result:**
- Booking status: CONFIRMED
- All parties notified
- Ready for proceeding

---

## 🔍 Verification Checklist

### Client Portal ✅
- [ ] Can login successfully
- [ ] Dashboard shows correct stats
- [ ] Can see assigned reporter names
- [ ] Can view invoices
- [ ] Can send messages
- [ ] Can create new bookings
- [ ] Can confirm assignments
- [ ] Stats cards navigate to correct tabs

### Admin Portal ✅
- [ ] Can login successfully
- [ ] Dashboard shows all metrics
- [ ] Can see all bookings
- [ ] Can see all users (clients + reporters)
- [ ] Can push bookings to marketplace
- [ ] Can view bids
- [ ] Can accept/decline bids
- [ ] Can generate invoices
- [ ] Can send messages to both clients and reporters
- [ ] Review queue count accurate

### Reporter Portal ✅
- [ ] Can login successfully
- [ ] Dashboard shows correct metrics
- [ ] Can see assigned jobs
- [ ] Can view marketplace opportunities
- [ ] Can submit bids
- [ ] Net earnings calculated correctly
- [ ] Can send messages to admin
- [ ] Can mark jobs as complete
- [ ] Metric cards navigate correctly

### Integration ✅
- [ ] Client booking appears in admin portal
- [ ] Admin marketplace push visible to reporters
- [ ] Reporter bid visible to admin
- [ ] Admin bid acceptance assigns reporter
- [ ] Client sees assigned reporter name
- [ ] Messages flow between all parties
- [ ] Status changes reflect in all portals
- [ ] Financial data syncs correctly

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find token" or "Unauthorized"
**Solution:** 
- Clear browser localStorage
- Login again
- Token should be stored automatically

### Issue: "No data showing in dashboard"
**Solution:**
- Run integration test script again
- Refresh the page
- Check browser console for errors

### Issue: "Booking not appearing in admin portal"
**Solution:**
- Ensure booking was created successfully
- Check that admin is logged in
- Refresh the bookings page

### Issue: "Reporter not seeing marketplace jobs"
**Solution:**
- Ensure admin toggled "isMarketplace" to true
- Check that booking status is SUBMITTED
- Refresh reporter portal

### Issue: "Bid not appearing for admin"
**Solution:**
- Ensure bid was submitted successfully
- Click "View Bids" button on correct booking
- Check that bookingId matches

---

## 📊 Expected Data After Integration Test

### Users Created:
1. Marina Dubson (Admin)
2. John Attorney (Client)
3. Jane Stenographer (Reporter)

### Bookings Created:
1. BK-FLOW-XXXX (Completed booking with full workflow)

### Invoices Created:
1. INV-XXXXX ($1,243.00 - SENT status)

### Bids Created:
1. $525.00 bid from Jane Stenographer (ACCEPTED)

### Messages Created:
1. Admin → Reporter (assignment confirmation)
2. Reporter → Admin (acknowledgment)
3. Admin → Client (booking confirmation)

---

## 🎉 Success Criteria

All tests pass if:
1. ✅ All three portals load without errors
2. ✅ Users can login with test credentials
3. ✅ Dashboards show correct real-time data
4. ✅ Bookings flow through complete lifecycle
5. ✅ Reporter assignment works automatically
6. ✅ Client can see assigned reporter
7. ✅ Admin can see all users and bookings
8. ✅ Messages send and receive correctly
9. ✅ Financial calculations are accurate
10. ✅ All buttons and interactions work

---

**Ready to test!** Start with Scenario 1 and work through each step systematically.
