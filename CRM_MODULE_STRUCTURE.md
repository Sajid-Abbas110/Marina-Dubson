# CRM MODULE STRUCTURE - Marina Dubson Stenographic Services

## Overview
This document outlines the complete CRM module structure with all fields, relationships, and business logic.

---

## 3.1 CONTACTS (Clients)

### Purpose
Store all client, billing, and pricing data.

### Database Model: `Contact`

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `id` | String (CUID) | Unique identifier | ✅ Auto |
| `firstName` | String | Client's first name | ✅ |
| `lastName` | String | Client's last name | ✅ |
| `companyName` | String | Company/firm name | ❌ |
| `email` | String (Unique) | Primary email address | ✅ |
| `phone` | String | Contact phone number | ❌ |
| `clientType` | String | Type of client | ✅ |
| `billingContactName` | String | Billing contact person | ❌ |
| `billingContactEmail` | String | Billing email address | ❌ |
| `customPricingEnabled` | Boolean | Enable custom pricing | ✅ Default: false |
| `pricingNotes` | Text | Custom pricing notes | ❌ |
| `status` | String | Account status | ✅ Default: "Active" |
| `notes` | Text | General notes | ❌ |
| `createdAt` | DateTime | Record creation date | ✅ Auto |
| `updatedAt` | DateTime | Last update date | ✅ Auto |

### Client Types (Enum Values)
- `AGENCY` - Staffing/Court Reporting Agency
- `LAW_FIRM` - Law Firm
- `CORPORATE` - Corporate Legal Department
- `PRIVATE` - Private Individual
- `INSURANCE` - Insurance Company
- `GOVERNMENT` - Government Agency

### Status Values
- `Active` - Active client
- `Inactive` - Inactive client

### Relationships
- **One-to-Many**: Contact → Bookings
- **One-to-Many**: Contact → Invoices
- **One-to-Many**: Contact → CustomPricing
- **One-to-Many**: Contact → ClientConfirmations
- **One-to-Many**: Contact → Messages

### Indexes
- `email` (Unique)
- `clientType`

---

## 3.2 SERVICES (Custom Module)

### Purpose
Store base service definitions and pricing structure (not public pricing).

### Database Model: `Service`

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `id` | String (CUID) | Unique identifier | ✅ Auto |
| `serviceName` | String | Service display name | ✅ |
| `category` | String | Service category | ✅ |
| `subService` | String | Sub-service type | ✅ |
| `defaultMinimumFee` | Float | Base minimum fee | ✅ Default: $400 |
| `pageRate` | Float | Per-page rate | ✅ |
| `appearanceFeeRemote` | Float | Remote appearance fee | ✅ |
| `appearanceFeeInPerson` | Float | In-person appearance fee | ✅ |
| `realtimeFee` | Float | Realtime reporting fee | ✅ |
| `expediteImmediate` | Float | Immediate delivery rate | ✅ |
| `expedite1Day` | Float | 1-day delivery rate | ✅ |
| `expedite2Day` | Float | 2-day delivery rate | ✅ |
| `expedite3Day` | Float | 3-day delivery rate | ✅ |
| `description` | Text | Service description | ❌ |
| `active` | Boolean | Service availability | ✅ Default: true |
| `createdAt` | DateTime | Record creation date | ✅ Auto |
| `updatedAt` | DateTime | Last update date | ✅ Auto |

### Category Values
- `COURT_REPORTING` - Court Reporting Services
- `LEGAL_PROCEEDINGS` - Legal Proceedings

### Sub-Service Values
- `DEPOSITIONS` - Depositions
- `HEARINGS` - Hearings
- `ARBITRATIONS` - Arbitrations
- `EUO` - Examinations Under Oath
- `TRIALS` - Trials
- `ADMINISTRATIVE_HEARINGS` - Administrative Hearings
- `OTHER` - Other Services

### Relationships
- **One-to-Many**: Service → Bookings

### Indexes
- `category`
- `active`

---

## 3.3 BOOKINGS (Custom Module)

### Purpose
Manage booking requests and complete lifecycle from submission to completion.

### Database Model: `Booking`

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `id` | String (CUID) | Unique identifier | ✅ Auto |
| `bookingNumber` | String (Unique) | Auto-generated booking ID | ✅ Auto |
| `contactId` | String | Client reference | ✅ |
| `serviceId` | String | Service reference | ✅ |
| `userId` | String | Admin who created | ✅ |
| `reporterId` | String | Assigned reporter | ❌ |
| `proceedingType` | String | Type of proceeding | ✅ |
| `jurisdiction` | String | Legal jurisdiction | ❌ |
| `state` | String | State/Province | ❌ |
| `bookingDate` | DateTime | Scheduled date | ✅ |
| `bookingTime` | String | Scheduled time | ✅ |
| `location` | String | Physical location | ❌ |
| `venue` | String | Venue name | ❌ |
| `appearanceType` | String | Remote or In-Person | ✅ |
| `turnaroundTime` | String | Delivery timeframe | ❌ |
| `specialRequirements` | Text | Special requests | ❌ |
| `bookingStatus` | String | Current status | ✅ Default: "SUBMITTED" |
| `invoiceStatus` | String | Invoice status | ❌ |
| `notes` | Text | Internal notes | ❌ |
| `cancellationDeadline` | DateTime | Cancellation cutoff | ❌ |
| `confirmedAt` | DateTime | Client confirmation time | ❌ |
| `isMarketplace` | Boolean | Available in marketplace | ✅ Default: false |
| `createdAt` | DateTime | Record creation date | ✅ Auto |
| `updatedAt` | DateTime | Last update date | ✅ Auto |

### Booking Status Lifecycle

```
SUBMITTED (default)
    ↓
PENDING_REVIEW (Admin reviewing)
    ↓
MAYBE (Tentative - awaiting info)
    ↓
ACCEPTED (Admin approved)
    ↓
[Client Confirmation Required]
    ↓
CONFIRMED (Client confirmed)
    ↓
COMPLETED (Service delivered)

OR

DECLINED (Admin rejected)
CANCELLED (Cancelled by client/admin)
```

### Status Values
- `SUBMITTED` - Initial submission (default)
- `PENDING_REVIEW` - Under admin review
- `MAYBE` - Tentative/awaiting information
- `ACCEPTED` - Approved by admin (awaiting client confirmation)
- `CONFIRMED` - Client confirmed booking
- `DECLINED` - Rejected by admin
- `CANCELLED` - Cancelled
- `COMPLETED` - Service completed

### Appearance Type Values
- `REMOTE` - Remote/Virtual appearance
- `IN_PERSON` - Physical in-person appearance

### Invoice Status Values
- `NOT_SENT` - No invoice created
- `DRAFT` - Invoice drafted
- `SENT` - Invoice sent to client
- `PAID` - Invoice paid
- `OVERDUE` - Payment overdue
- `CANCELLED` - Invoice cancelled

### ⚠️ Important Business Rules

1. **No Invoice Until Accepted + Confirmed**
   - Invoice creation only occurs after:
     - Admin sets status to `ACCEPTED`
     - Client provides confirmation via `ClientConfirmation`
   - Status must be `CONFIRMED` before invoice generation

2. **No Calendar Block Until Confirmed**
   - Calendar events only created when:
     - `bookingStatus` = `CONFIRMED`
     - `confirmedAt` is set
   - Prevents blocking time for unconfirmed bookings

3. **Cancellation Deadline**
   - Set when booking is confirmed
   - Typically 48-72 hours before booking date
   - After deadline, cancellation fees may apply

### Relationships
- **Many-to-One**: Booking → Contact
- **Many-to-One**: Booking → Service
- **Many-to-One**: Booking → User (Creator)
- **Many-to-One**: Booking → User (Reporter)
- **One-to-One**: Booking → Invoice
- **One-to-One**: Booking → ClientConfirmation
- **One-to-Many**: Booking → Tasks
- **One-to-Many**: Booking → Bids (Marketplace)

### Indexes
- `bookingNumber` (Unique)
- `contactId`
- `bookingStatus`
- `bookingDate`

---

## 3.4 CUSTOM PRICING (Supporting Module)

### Purpose
Store client-specific pricing overrides.

### Database Model: `CustomPricing`

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | String (CUID) | Unique identifier |
| `contactId` | String | Client reference |
| `serviceId` | String | Service reference (optional) |
| `pageRate` | Float | Custom page rate |
| `appearanceFeeRemote` | Float | Custom remote fee |
| `appearanceFeeInPerson` | Float | Custom in-person fee |
| `realtimeFee` | Float | Custom realtime fee |
| `minimumFee` | Float | Custom minimum fee |
| `expediteImmediate` | Float | Custom immediate rate |
| `expedite1Day` | Float | Custom 1-day rate |
| `expedite2Day` | Float | Custom 2-day rate |
| `expedite3Day` | Float | Custom 3-day rate |
| `notes` | Text | Pricing notes |
| `effectiveDate` | DateTime | When pricing takes effect |
| `createdAt` | DateTime | Record creation date |
| `updatedAt` | DateTime | Last update date |

### Usage
- Applied when `Contact.customPricingEnabled` = true
- Overrides default `Service` pricing
- Can be service-specific or global per contact

---

## 3.5 CLIENT CONFIRMATION (Supporting Module)

### Purpose
Track client confirmations for bookings.

### Database Model: `ClientConfirmation`

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | String (CUID) | Unique identifier |
| `bookingId` | String (Unique) | Booking reference |
| `contactId` | String | Client reference |
| `confirmedScheduling` | Boolean | Confirmed date/time |
| `confirmedCancellation` | Boolean | Confirmed cancellation policy |
| `confirmedFinancial` | Boolean | Confirmed pricing/payment |
| `ipAddress` | String | Client IP address |
| `userAgent` | String | Client browser info |
| `confirmedAt` | DateTime | Confirmation timestamp |

### Confirmation Flow
1. Admin accepts booking (`ACCEPTED`)
2. System sends confirmation request to client
3. Client reviews and confirms:
   - Scheduling details
   - Cancellation policy
   - Financial terms
4. All three checkboxes must be checked
5. System updates `Booking.bookingStatus` to `CONFIRMED`
6. System sets `Booking.confirmedAt`
7. Invoice can now be generated

---

## API Endpoints

### Contacts
- `GET /api/contacts` - List all contacts
- `GET /api/contacts/:id` - Get contact details
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Custom Pricing
- `GET /api/contacts/:id/pricing` - Get custom pricing
- `POST /api/contacts/:id/pricing` - Set custom pricing
- `PUT /api/pricing/:id` - Update pricing
- `DELETE /api/pricing/:id` - Remove pricing

---

## Integration Points

### Zoho CRM Sync
- **Contact** → Zoho CRM Contact
- **Booking** → Zoho CRM Deal
- Synced on booking creation

### Zoho Books Sync
- **Contact** → Zoho Books Customer
- **Booking** → Zoho Books Invoice
- Synced after confirmation

### Mailchimp Sync
- **Contact** → Mailchimp Subscriber
- Tags updated based on booking status

---

## Validation Rules

### Contact
- Email must be unique
- Email must be valid format
- Client type must be from enum
- Status must be "Active" or "Inactive"

### Service
- All fee fields must be positive numbers
- Default minimum fee ≥ $400
- Service name must be unique per category

### Booking
- Booking date must be in the future
- Contact must exist and be active
- Service must exist and be active
- Appearance type must be REMOTE or IN_PERSON
- Status transitions must follow lifecycle

---

## Reports & Analytics

### Available Reports
1. **Bookings by Status** - Pipeline view
2. **Revenue by Client** - Top clients
3. **Service Utilization** - Most booked services
4. **Turnaround Time Analysis** - Delivery metrics
5. **Custom Pricing Impact** - Pricing analysis

---

## Security & Permissions

### Admin Users
- Full CRUD on all modules
- Can approve/decline bookings
- Can set custom pricing
- Can generate invoices

### Client Users
- View own bookings
- Create new bookings
- Confirm bookings
- View own invoices

### Reporter Users
- View assigned bookings
- Update booking status
- Upload transcripts
- Submit bids (marketplace)

---

## Next Steps

1. ✅ Database schema is complete
2. ✅ API endpoints are implemented
3. ✅ Integration libraries created
4. 🔄 Configure Zoho CRM custom modules
5. 🔄 Set up Zoho Books invoice templates
6. 🔄 Configure Mailchimp automation
7. 🔄 Test complete integration flow
