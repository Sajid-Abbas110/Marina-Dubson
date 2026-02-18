# Complete Portal Integration Workflow

## 🔗 Three-Portal Ecosystem Overview

The Marina Dubson platform consists of three interconnected portals that work seamlessly together:

1. **Client Portal** - For attorneys and legal professionals to request services
2. **Admin Portal** - For Marina and staff to manage operations
3. **Reporter Portal** - For court reporters to accept jobs and deliver transcripts

---

## 📋 Complete Workflow: From Request to Completion

### PHASE 1: Client Submits Service Request

**Client Portal Actions:**
1. Client logs in: `client@test.com / client123`
2. Navigates to "New Request" or "Visual Case Scheduler"
3. Fills out booking form:
   - Service type (Deposition, Hearing, etc.)
   - Date and time
   - Location
   - Special requirements
4. Submits request
5. **Status**: `SUBMITTED`

**What Happens:**
- Booking created in database
- Admin receives notification
- Booking appears in Admin dashboard "Review Queue"

---

### PHASE 2: Admin Reviews and Processes Request

**Admin Portal Actions:**
1. Admin logs in: `admin@marinadubson.com / admin123`
2. Views dashboard - sees "Review Queue" count
3. Navigates to "Bookings" page
4. Reviews new booking details:
   - Client information
   - Service requirements
   - Date/time/location
5. **Decision Point:**
   - **Option A**: Assign directly to a specific reporter
   - **Option B**: Push to marketplace for competitive bidding

**If Pushing to Marketplace:**
1. Click "Toggle Marketplace" button
2. **Status**: `SUBMITTED` + `isMarketplace: true`
3. Job now visible to all reporters

**What Happens:**
- Booking appears in Reporter Portal marketplace
- All reporters can see job details
- Reporters can submit bids

---

### PHASE 3: Reporter Views and Bids on Job

**Reporter Portal Actions:**
1. Reporter logs in: `reporter@test.com / reporter123`
2. Views "Earnings Dashboard" (Overview tab)
3. Sees "Market Jobs" count
4. Clicks "Market Jobs" card or navigates to "Job Assignment Desk"
5. Scrolls to "Marketplace Opportunities" section
6. Reviews job details:
   - Service type
   - Date and location
   - Client information
7. Clicks "Submit Deployment Bid"
8. Enters bid amount (e.g., $525.00)
9. Submits bid
10. **Status**: Bid `PENDING`

**What Happens:**
- Bid stored in database
- Admin can now see bid in Admin Portal
- Reporter sees bid in their "Net Earnings" calculation (pending)

---

### PHASE 4: Admin Reviews Bids and Assigns Reporter

**Admin Portal Actions:**
1. Returns to "Bookings" page
2. Finds booking with marketplace status
3. Clicks "View Bids" button
4. Modal opens showing all bids:
   - Reporter name and certification
   - Bid amount
   - Timeline/notes
5. Reviews bids and selects best option
6. Clicks "Accept" on chosen bid
7. **Status**: Booking `ACCEPTED`, Bid `ACCEPTED`

**What Happens:**
- Reporter automatically assigned to booking
- `reporterId` field populated
- Booking removed from marketplace
- Other bids automatically declined
- Reporter sees job in "Confirmed Assignments"
- Client sees reporter name in activity feed

---

### PHASE 5: Client Confirms Assignment

**Client Portal Actions:**
1. Client logs back in
2. Views "Intelligence Overview"
3. Sees booking with "ACTION REQUIRED" badge
4. Sees assigned reporter name: "Assigned: Jane Stenographer"
5. Clicks on booking row
6. Redirected to confirmation page: `/client/confirm/[bookingId]`
7. Reviews:
   - Scheduling details
   - Cancellation policy
   - Financial terms
8. Checks all confirmation boxes
9. Clicks "Confirm Booking"
10. **Status**: `CONFIRMED`

**What Happens:**
- ClientConfirmation record created
- Booking status updated to CONFIRMED
- Reporter notified of confirmation
- Admin sees confirmed status

---

### PHASE 6: Reporter Completes Job

**Reporter Portal Actions:**
1. Reporter attends proceeding on scheduled date
2. Logs back into portal
3. Navigates to "Job Assignment Desk"
4. Finds completed job
5. Navigates to "Transcript Delivery" tab
6. Selects job from dropdown
7. Uploads transcript file (future feature)
8. Marks job as complete
9. **Status**: `COMPLETED`

**What Happens:**
- Booking status updated
- Admin notified of completion
- Ready for billing

---

### PHASE 7: Admin Generates Invoice

**Admin Portal Actions:**
1. Views "Bookings" page
2. Filters by "COMPLETED" status
3. Finds completed booking
4. Clicks "Complete & Bill" button
5. Modal opens with billing form:
   - Number of pages
   - Copies
   - Additional services
6. Fills out billing details
7. Clicks "Generate Invoice"
8. **Status**: Invoice `SENT`

**What Happens:**
- Invoice created in database
- Invoice sent to client email
- Invoice appears in Client Portal "Financial Ledger"
- Invoice appears in Admin Portal "Invoices" section

---

### PHASE 8: Client Pays Invoice

**Client Portal Actions:**
1. Client navigates to "Financial Ledger" tab
2. Sees unpaid invoice
3. Reviews invoice details
4. Clicks "Pay Invoice" (future: Stripe integration)
5. **Status**: Invoice `PAID`

**What Happens:**
- Payment processed
- Invoice marked as paid
- Revenue added to Admin dashboard
- Reporter payout can be processed

---

## 🔄 Communication Flow Throughout Process

### Admin ↔ Reporter
- Admin assigns job → Reporter receives notification
- Reporter completes job → Admin receives notification
- Admin can message reporter directly via "Secure Messaging"

### Admin ↔ Client
- Client submits request → Admin receives notification
- Admin confirms assignment → Client receives notification
- Admin sends invoice → Client receives notification

### Reporter ↔ Admin (via Client)
- Client sees reporter name in portal
- Client can request specific reporter for future jobs
- Reporter reputation builds through successful completions

---

## 📊 Real-Time Dashboard Updates

### Admin Dashboard Shows:
- **Total Revenue**: Sum of all PAID invoices
- **Upcoming Jobs**: Count of SUBMITTED/ACCEPTED/CONFIRMED bookings
- **Active Reporters**: Count of users with REPORTER role
- **Review Queue**: Count of SUBMITTED bookings needing review

### Client Dashboard Shows:
- **Active Cases**: Count of SUBMITTED/ACCEPTED/CONFIRMED bookings
- **Unpaid Ledger**: Sum of unpaid invoice totals
- **Vault Files**: Count of uploaded documents

### Reporter Dashboard Shows:
- **Jobs Scheduled**: Count of assigned bookings
- **Pending Delivery**: Count of non-completed assignments
- **Market Jobs**: Count of marketplace opportunities
- **Net Earnings**: Sum of ACCEPTED bid amounts

---

## 🔐 User Visibility & Permissions

### What Admin Can See:
- ✅ All bookings from all clients
- ✅ All reporters in the network
- ✅ All bids on marketplace jobs
- ✅ All invoices and payments
- ✅ All messages between parties
- ✅ Complete system analytics

### What Client Can See:
- ✅ Only their own bookings
- ✅ Assigned reporter names
- ✅ Their own invoices
- ✅ Their own documents
- ✅ Messages with admin
- ❌ Cannot see other clients
- ❌ Cannot see reporter bids

### What Reporter Can See:
- ✅ Only their assigned jobs
- ✅ Marketplace opportunities
- ✅ Their own bids
- ✅ Their own earnings
- ✅ Messages with admin
- ❌ Cannot see other reporters' bids
- ❌ Cannot see client financial details

---

## 🧪 Testing the Complete Flow

### Test Credentials:
```
Admin:    admin@marinadubson.com / admin123
Client:   client@test.com / client123
Reporter: reporter@test.com / reporter123
```

### Step-by-Step Test:
1. **As Client**: Submit a new booking request
2. **As Admin**: Review and push to marketplace
3. **As Reporter**: View marketplace and submit bid
4. **As Admin**: Accept bid and assign reporter
5. **As Client**: Confirm the assignment
6. **As Reporter**: Mark job as completed
7. **As Admin**: Generate and send invoice
8. **As Client**: View and pay invoice

### Expected Results:
- ✅ All status changes reflected in real-time
- ✅ All parties see relevant updates
- ✅ Communication flows correctly
- ✅ Financial calculations accurate
- ✅ No data leaks between users

---

## 🚀 Key Features Ensuring Seamless Integration

### 1. Automatic Status Updates
- When admin accepts bid → Reporter auto-assigned
- When client confirms → All parties notified
- When reporter completes → Ready for billing

### 2. Real-Time Data Sync
- All dashboards pull from same database
- Changes in one portal immediately visible in others
- No manual refresh needed

### 3. Role-Based Access Control
- API endpoints check user role
- Data filtered based on permissions
- Secure token-based authentication

### 4. Bidirectional Communication
- Admin can message both clients and reporters
- Clients can message admin
- Reporters can message admin
- All messages stored and threaded

### 5. Audit Trail
- All actions timestamped
- Status changes tracked
- User actions logged
- Complete history available

---

## 📱 Portal URLs

```
Admin Portal:    http://localhost:3000/admin/dashboard
Client Portal:   http://localhost:3000/client/portal
Reporter Portal: http://localhost:3000/reporter/portal
Login Page:      http://localhost:3000/login
```

---

## ✅ Integration Checklist

- [x] Client can submit bookings
- [x] Admin can review submissions
- [x] Admin can push to marketplace
- [x] Reporter can view marketplace
- [x] Reporter can submit bids
- [x] Admin can view bids
- [x] Admin can accept/decline bids
- [x] Reporter auto-assigned on bid acceptance
- [x] Client can see assigned reporter
- [x] Client can confirm assignment
- [x] Reporter can complete jobs
- [x] Admin can generate invoices
- [x] Client can view invoices
- [x] All parties can communicate
- [x] Dashboards show real-time data
- [x] Permissions properly enforced

---

**Status**: ✅ All three portals are fully integrated and functional!
