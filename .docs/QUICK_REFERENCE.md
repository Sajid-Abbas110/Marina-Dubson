# 🚀 Quick Reference Card - Marina Dubson Platform

## 🔐 Test Login Credentials

```
┌─────────────────────────────────────────────────────────┐
│ ADMIN PORTAL                                            │
│ Email:    admin@marinadubson.com                        │
│ Password: admin123                                      │
│ URL:      http://localhost:3000/admin/dashboard        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CLIENT PORTAL                                           │
│ Email:    client@test.com                               │
│ Password: client123                                     │
│ URL:      http://localhost:3000/client/portal          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ REPORTER PORTAL                                         │
│ Email:    reporter@test.com                             │
│ Password: reporter123                                   │
│ URL:      http://localhost:3000/reporter/portal        │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start Commands

```bash
# 1. Run integration test (creates test data)
npx tsx scripts/test-portal-integration.ts

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## 🎯 Common Tasks

### As CLIENT:
```
1. Submit new booking
   → Click "New Request" or "Visual Case Scheduler"
   
2. View assigned reporter
   → Check "Recent Activity Feed" for "Assigned: [Name]"
   
3. Confirm booking
   → Click booking with "ACTION REQUIRED" badge
   
4. Pay invoice
   → Navigate to "Financial Ledger" → Click invoice
   
5. Send message to admin
   → "Direct Messaging" tab → Type and send
```

### As ADMIN:
```
1. Review new bookings
   → "Bookings" page → Filter by "SUBMITTED"
   
2. Push to marketplace
   → Click "Toggle Marketplace" on booking
   
3. View bids
   → Click "View Bids" button on marketplace booking
   
4. Accept bid & assign reporter
   → In bids modal → Click "Accept" on chosen bid
   
5. Generate invoice
   → Click "Complete & Bill" on completed booking
   
6. View all users
   → Navigate to "Team" section
```

### As REPORTER:
```
1. View marketplace jobs
   → "Job Assignment Desk" → Scroll to "Marketplace"
   
2. Submit bid
   → Click "Submit Deployment Bid" → Enter amount
   
3. View assigned jobs
   → "Job Assignment Desk" → "Confirmed Assignments"
   
4. Check earnings
   → Sidebar "Net Earnings" card
   
5. Set availability
   → Click "Set Availability" button in header
   
6. Send message to admin
   → "Secure Messaging" tab → Type and send
```

---

## 📊 Dashboard Metrics Explained

### CLIENT PORTAL
| Metric | What It Shows | Click Action |
|--------|---------------|--------------|
| Active Cases | SUBMITTED/ACCEPTED/CONFIRMED bookings | → Bookings tab |
| Unpaid Ledger | Sum of unpaid invoices | → Invoices tab |
| Vault Files | Count of documents | → Documents tab |

### ADMIN PORTAL
| Metric | What It Shows | Click Action |
|--------|---------------|--------------|
| Total Revenue | Sum of PAID invoices | → Analytics |
| Upcoming Jobs | Active bookings count | → Bookings |
| Active Reporters | REPORTER role users | → Team |
| Review Queue | SUBMITTED bookings | → Bookings |

### REPORTER PORTAL
| Metric | What It Shows | Click Action |
|--------|---------------|--------------|
| Jobs Scheduled | Assigned bookings | → Job Desk |
| Pending Delivery | Non-completed jobs | → Transcript Delivery |
| Market Jobs | Open opportunities | → Job Desk |
| Net Earnings | Sum of accepted bids | → (Display only) |

---

## 🔄 Booking Status Flow

```
SUBMITTED → Client creates booking
    ↓
SUBMITTED + Marketplace → Admin pushes to marketplace
    ↓
ACCEPTED → Admin accepts reporter bid
    ↓
CONFIRMED → Client confirms assignment
    ↓
COMPLETED → Reporter finishes job
    ↓
INVOICED → Admin generates invoice
    ↓
PAID → Client pays invoice
```

---

## 🎨 Color-Coded Status Badges

```
🟢 CONFIRMED  - Green (Ready to proceed)
🟡 ACCEPTED   - Yellow (Awaiting client confirmation)
🔵 SUBMITTED  - Blue (Awaiting admin review)
⚪ COMPLETED  - Gray (Finished, awaiting billing)
🟣 PAID       - Purple (Payment received)
```

---

## 📱 Portal Features at a Glance

### CLIENT PORTAL
✅ Submit booking requests
✅ View assigned reporters
✅ Confirm assignments
✅ View invoices
✅ Pay invoices
✅ Upload documents
✅ Send messages
✅ View calendar

### ADMIN PORTAL
✅ View all bookings
✅ Manage marketplace
✅ Review bids
✅ Assign reporters
✅ Generate invoices
✅ View all users
✅ Send messages
✅ View analytics
✅ Manage team tasks

### REPORTER PORTAL
✅ View marketplace
✅ Submit bids
✅ View assignments
✅ Track earnings
✅ Set availability
✅ Upload transcripts
✅ Send messages
✅ View schedule

---

## 🐛 Troubleshooting

### "Cannot find token" error
```bash
# Clear browser localStorage and login again
localStorage.clear()
# Then refresh and login
```

### No data showing
```bash
# Re-run integration test
npx tsx scripts/test-portal-integration.ts
```

### Booking not appearing
```bash
# Check user role and permissions
# Refresh the page
# Verify booking was created successfully
```

### Bid not visible to admin
```bash
# Ensure booking has isMarketplace: true
# Click "View Bids" button on correct booking
# Check that bid status is PENDING
```

---

## 📚 Documentation Files

```
.docs/
├── INTEGRATION_SUMMARY.md       - Complete integration overview
├── PORTAL_INTEGRATION_WORKFLOW.md - Detailed workflow steps
├── TESTING_GUIDE.md             - Step-by-step testing
├── INTERACTIVE_FEATURES_AUDIT.md - All interactive features
├── SYSTEM_ARCHITECTURE.md       - Technical architecture
└── QUICK_REFERENCE.md           - This file
```

---

## 🎯 Key Integration Points

```
CLIENT → ADMIN
  ✓ Booking submission
  ✓ Invoice receipt
  ✓ Messaging

ADMIN → REPORTER
  ✓ Job assignment
  ✓ Bid management
  ✓ Messaging

CLIENT ← ADMIN → REPORTER
  ✓ Reporter name visible to client
  ✓ Client name visible to reporter
  ✓ Transparent workflow
```

---

## ✨ What's Working

✅ All three portals load without errors
✅ Users can login with test credentials
✅ Dashboards show real-time data
✅ Bookings flow through complete lifecycle
✅ Reporter assignment works automatically
✅ Client can see assigned reporter
✅ Admin can see all users and bookings
✅ Messages send and receive correctly
✅ Financial calculations are accurate
✅ All buttons and interactions work
✅ Role-based permissions enforced
✅ Data synchronizes across portals

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

**Client Portal:**
- Booking with "Assigned: Jane Stenographer"
- Invoice showing $1,243.00
- Message thread with admin

**Admin Portal:**
- 1 Active Reporter (Jane Stenographer)
- 1 Completed booking
- Total Revenue: $1,243
- All users visible in team section

**Reporter Portal:**
- Net Earnings: $525
- 1 Job Scheduled
- Completed assignment visible
- Message thread with admin

---

**Print this card for quick reference while testing!** 📋
