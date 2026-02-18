# 🏗️ Marina Dubson Platform - System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MARINA DUBSON PLATFORM                                │
│                     Three-Portal Integrated System                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  CLIENT PORTAL   │         │  ADMIN PORTAL    │         │ REPORTER PORTAL  │
│  (Attorney)      │         │  (Marina)        │         │  (Stenographer)  │
└────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                            │                            │
         │ 1. Submit Booking          │                            │
         ├───────────────────────────>│                            │
         │                            │                            │
         │                            │ 2. Push to Marketplace     │
         │                            ├───────────────────────────>│
         │                            │                            │
         │                            │         3. Submit Bid      │
         │                            │<───────────────────────────┤
         │                            │                            │
         │                            │ 4. Accept Bid & Assign     │
         │<───────────────────────────┤───────────────────────────>│
         │  (See Reporter Name)       │                            │
         │                            │                            │
         │ 5. Confirm Assignment      │                            │
         ├───────────────────────────>│───────────────────────────>│
         │                            │                            │
         │                            │      6. Complete Job       │
         │                            │<───────────────────────────┤
         │                            │                            │
         │  7. Receive Invoice        │ 8. Generate Invoice        │
         │<───────────────────────────┤                            │
         │                            │                            │
         │ 9. Pay Invoice             │                            │
         ├───────────────────────────>│                            │
         │                            │                            │
         │                            │ 10. Process Payout         │
         │                            ├───────────────────────────>│
         │                            │                            │
         └────────────────────────────┴────────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │   POSTGRESQL DATABASE   │
                        │                         │
                        │  ┌──────────────────┐   │
                        │  │ Users            │   │
                        │  │ Contacts         │   │
                        │  │ Bookings         │   │
                        │  │ Bids             │   │
                        │  │ Invoices         │   │
                        │  │ Messages         │   │
                        │  │ Documents        │   │
                        │  │ Confirmations    │   │
                        │  └──────────────────┘   │
                        └─────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │   EXTERNAL SERVICES     │
                        │                         │
                        │  • Zoho CRM             │
                        │  • Zoho Books           │
                        │  • Email (Resend)       │
                        │  • SMS (Twilio)         │
                        └─────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
CLIENT PORTAL                    ADMIN PORTAL                    REPORTER PORTAL
─────────────                    ────────────                    ───────────────

┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│ Dashboard   │                 │ Dashboard   │                 │ Dashboard   │
│             │                 │             │                 │             │
│ • Active: 1 │                 │ • Revenue   │                 │ • Jobs: 1   │
│ • Unpaid: $ │                 │ • Jobs      │                 │ • Earnings  │
│ • Files: 0  │                 │ • Reporters │                 │ • Market    │
└─────────────┘                 └─────────────┘                 └─────────────┘
       │                               │                               │
       │                               │                               │
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│ Bookings    │────────────────>│ Bookings    │<────────────────│ Assignments │
│             │  Submit         │             │  Bid            │             │
│ • New       │                 │ • All       │                 │ • Assigned  │
│ • Confirm   │                 │ • Review    │                 │ • Complete  │
└─────────────┘                 └─────────────┘                 └─────────────┘
       │                               │                               │
       │                               │                               │
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│ Invoices    │<────────────────│ Invoices    │                 │ Marketplace │
│             │  Generate       │             │                 │             │
│ • View      │                 │ • Create    │                 │ • Browse    │
│ • Pay       │                 │ • Send      │                 │ • Bid       │
└─────────────┘                 └─────────────┘                 └─────────────┘
       │                               │                               │
       │                               │                               │
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│ Messages    │<───────────────>│ Messages    │<───────────────>│ Messages    │
│             │  Communicate    │             │  Communicate    │             │
│ • Send      │                 │ • All       │                 │ • Send      │
│ • Receive   │                 │ • Threads   │                 │ • Receive   │
└─────────────┘                 └─────────────┘                 └─────────────┘
```

---

## 🎯 API Endpoints & Connections

```
CLIENT PORTAL CALLS:
├── GET  /api/auth/me              → Get user profile
├── GET  /api/bookings             → Get client's bookings (filtered)
├── POST /api/bookings             → Create new booking
├── GET  /api/services             → Get available services
├── GET  /api/invoices             → Get client's invoices (filtered)
├── GET  /api/documents            → Get client's documents (filtered)
├── GET  /api/messages             → Get client's messages (filtered)
└── POST /api/messages             → Send message to admin

ADMIN PORTAL CALLS:
├── GET    /api/auth/me            → Get admin profile
├── GET    /api/bookings           → Get ALL bookings
├── PATCH  /api/bookings/:id       → Update booking status/marketplace
├── GET    /api/admin/users        → Get all users (clients + reporters)
├── GET    /api/market/bids        → Get bids for booking
├── PATCH  /api/market/bids        → Accept/decline bid
├── POST   /api/invoices           → Generate invoice
├── GET    /api/invoices           → Get all invoices
├── GET    /api/messages           → Get all messages
└── POST   /api/messages           → Send message to anyone

REPORTER PORTAL CALLS:
├── GET  /api/auth/me              → Get reporter profile
├── GET  /api/bookings             → Get assigned bookings (filtered)
├── GET  /api/market               → Get marketplace opportunities
├── GET  /api/market/bids          → Get reporter's bids (filtered)
├── POST /api/market/bids          → Submit bid
├── GET  /api/messages             → Get reporter's messages (filtered)
└── POST /api/messages             → Send message to admin
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────┐
│   LOGIN     │
│   /login    │
└──────┬──────┘
       │
       ├─ Email + Password
       │
       ▼
┌─────────────────┐
│ POST /api/auth  │
│                 │
│ 1. Verify creds │
│ 2. Generate JWT │
│ 3. Return token │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│ localStorage.token │
└────────┬───────────┘
         │
         ├─ Included in all API requests
         │  as Authorization: Bearer {token}
         │
         ▼
┌─────────────────────┐
│ API Middleware      │
│                     │
│ 1. Verify JWT       │
│ 2. Extract userId   │
│ 3. Extract role     │
│ 4. Check permissions│
└─────────┬───────────┘
          │
          ├─ ADMIN    → Full access
          ├─ CLIENT   → Own data only
          └─ REPORTER → Own data only
```

---

## 📊 Database Relationships

```
User (Admin/Client/Reporter)
  │
  ├─ 1:Many → Bookings (as userId - admin who manages)
  ├─ 1:Many → Bookings (as reporterId - assigned reporter)
  ├─ 1:Many → Bids (reporter's bids)
  ├─ 1:Many → Messages (sent messages)
  └─ 1:Many → Messages (received messages)

Contact (Client contact info)
  │
  ├─ 1:Many → Bookings
  ├─ 1:Many → Invoices
  └─ 1:Many → ClientConfirmations

Booking (Core entity)
  │
  ├─ Many:1 → User (admin)
  ├─ Many:1 → User (reporter)
  ├─ Many:1 → Contact (client)
  ├─ Many:1 → Service
  ├─ 1:Many → Bids
  ├─ 1:1    → Invoice
  ├─ 1:1    → ClientConfirmation
  └─ 1:Many → Documents

Bid (Reporter's bid on marketplace job)
  │
  ├─ Many:1 → Booking
  └─ Many:1 → User (reporter)

Invoice (Billing)
  │
  ├─ Many:1 → Booking
  └─ Many:1 → Contact (client)
```

---

## 🎨 Component Architecture

```
CLIENT PORTAL
├── app/client/portal/page.tsx (Main dashboard)
├── app/client/bookings/new/page.tsx (Create booking)
├── app/client/confirm/[id]/page.tsx (Confirm assignment)
└── app/client/components/
    ├── ClientCalendar.tsx
    └── BookingRequest.tsx

ADMIN PORTAL
├── app/admin/dashboard/page.tsx (Main dashboard)
├── app/admin/bookings/page.tsx (Booking management)
├── app/admin/calendar/page.tsx (Calendar view)
└── app/admin/team/page.tsx (Team management)

REPORTER PORTAL
└── app/reporter/portal/page.tsx (All-in-one dashboard)

SHARED COMPONENTS
├── app/components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
└── app/api/ (API routes)
    ├── auth/
    ├── bookings/
    ├── market/
    ├── invoices/
    ├── messages/
    └── admin/
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
└─────────────────────────────────────────────────────────┘

┌──────────────┐
│   VERCEL     │  (Frontend + API Routes)
│              │
│  • Next.js   │
│  • React     │
│  • API       │
└──────┬───────┘
       │
       ├─ HTTPS
       │
       ▼
┌──────────────┐
│   SUPABASE   │  (Database)
│              │
│  • PostgreSQL│
│  • Backups   │
│  • Scaling   │
└──────┬───────┘
       │
       ├─ Connection Pool
       │
       ▼
┌──────────────┐
│   ZOHO       │  (External Services)
│              │
│  • CRM       │
│  • Books     │
│  • Email     │
└──────────────┘
```

---

## 📈 Scalability Considerations

```
CURRENT SETUP (MVP):
├── Single Next.js app
├── All portals in one codebase
├── Shared database
└── JWT authentication

FUTURE SCALING:
├── Separate microservices per portal
├── Redis caching layer
├── CDN for static assets
├── Load balancer
├── Database read replicas
└── WebSocket for real-time updates
```

---

## 🎯 Key Integration Points Summary

1. **Database** - Single source of truth
2. **API Routes** - Shared endpoints with role-based filtering
3. **JWT Tokens** - Secure authentication across portals
4. **Real-time Updates** - Automatic data synchronization
5. **Message System** - Bidirectional communication
6. **Status Tracking** - Booking lifecycle management
7. **Financial Flow** - Invoice generation and payment
8. **Assignment Logic** - Automatic reporter assignment on bid acceptance

---

**This architecture ensures all three portals work together as a unified, seamless system!** 🎉
