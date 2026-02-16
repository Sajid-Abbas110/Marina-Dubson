# Booking Rules & Legal Enforcement Documentation

## Overview
This document outlines the booking rules, legal enforcement mechanisms, and confirmation processes for Marina Dubson Stenographic Services.

---

## 4.1 MINIMUM FEE ENFORCEMENT

### Rule
**$400 minimum booking fee enforced on all bookings**

### Implementation
- Calculated automatically during invoice generation
- Applied to all bookings regardless of actual charges
- Formula: `Total = Math.max(calculatedTotal, $400)`

### Where It's Mentioned
✅ **In Terms & Conditions** (not publicly displayed on pricing page)
✅ **In Confirmation Flow** (client must acknowledge)
✅ **In Invoice** (line item: "Minimum Booking Fee")
✅ **In Cancellation Policy** (late cancellation fee)

### Code Implementation
```typescript
// lib/booking-rules.ts
static calculateMinimumFee(calculatedTotal: number): number {
    return Math.max(calculatedTotal, MINIMUM_BOOKING_FEE) // $400
}
```

### Example Scenarios

| Calculated Total | Minimum Fee | Final Total | Notes |
|-----------------|-------------|-------------|-------|
| $250 | $400 | **$400** | Minimum applied |
| $400 | $400 | **$400** | Exactly at minimum |
| $650 | $400 | **$650** | Above minimum |

---

## 4.2 CANCELLATION POLICY

### Rule
**Cancel before 3 PM previous business day → No charge**
**Cancel after deadline → $400 minimum invoice auto-generated**

### Deadline Calculation

#### Formula
```
Booking Date → Go back 1 day → Skip weekends → Set time to 3:00 PM
```

#### Examples

| Booking Date | Cancellation Deadline | Notes |
|--------------|----------------------|-------|
| Monday, March 3 | Friday, March 1 at 3:00 PM | Previous business day |
| Tuesday, March 4 | Monday, March 3 at 3:00 PM | Previous business day |
| Monday, March 3 | Thursday, Feb 27 at 3:00 PM | Skips weekend |
| Tuesday after holiday | Thursday before holiday at 3:00 PM | Skips holiday Monday |

### Code Implementation
```typescript
// lib/booking-rules.ts
static calculateCancellationDeadline(bookingDate: Date): Date {
    const deadline = new Date(bookingDate)
    deadline.setDate(deadline.getDate() - 1)
    
    // Skip weekends
    while (deadline.getDay() === 0 || deadline.getDay() === 6) {
        deadline.setDate(deadline.getDate() - 1)
    }
    
    // Set to 3:00 PM
    deadline.setHours(15, 0, 0, 0)
    return deadline
}
```

### Automatic Invoice Generation

When a booking is cancelled **after** the deadline:

1. **System automatically generates invoice:**
   - Invoice Number: Auto-generated (e.g., INV-2026-00123)
   - Amount: $400.00 (minimum booking fee)
   - Line Item: "Cancellation Fee"
   - Due Date: 14 days from cancellation
   - Status: SENT

2. **Invoice includes detailed explanation:**
   ```
   CANCELLATION FEE - Booking cancelled after deadline.
   
   Original Booking: BK-2026-03-00045
   Booking Date: March 15, 2026
   Cancellation Deadline: March 14, 2026 at 3:00 PM
   Cancelled: March 14, 2026 at 4:30 PM
   
   Per our cancellation policy, cancellations made after 3 PM 
   on the previous business day are subject to the $400 minimum 
   booking fee.
   ```

3. **Booking status updated:**
   - `bookingStatus`: CANCELLED
   - `invoiceStatus`: SENT

### API Endpoints

#### Check Cancellation Status
```bash
GET /api/bookings/cancel?bookingId=xxx
Authorization: Bearer {token}
```

**Response:**
```json
{
  "cancellationInfo": {
    "canCancel": true,
    "deadline": "2026-03-14T15:00:00.000Z",
    "hoursRemaining": 18,
    "message": "You can cancel without fee until 3/14/2026, 3:00 PM. 18 hours remaining."
  },
  "canCancel": true,
  "currentStatus": "CONFIRMED"
}
```

#### Cancel Booking
```bash
POST /api/bookings/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "xxx",
  "reason": "Schedule conflict"
}
```

**Response (Before Deadline):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully. No cancellation fee applied.",
  "feeApplied": false,
  "booking": { ... }
}
```

**Response (After Deadline):**
```json
{
  "success": true,
  "message": "Booking cancelled. Cancellation fee of $400 has been applied and invoice generated.",
  "feeApplied": true,
  "invoice": {
    "invoiceNumber": "INV-2026-00123",
    "total": 400.00,
    ...
  },
  "booking": { ... }
}
```

---

## 4.3 LEGAL CONFIRMATION (MANDATORY)

### Rule
**Client must confirm all three sections under penalty of perjury:**
1. ✅ Scheduling details
2. ✅ Cancellation policy
3. ✅ Financial responsibility

### Confirmation Flow

```
Admin Approves Booking (ACCEPTED)
         ↓
System sends confirmation request to client
         ↓
Client reviews three sections:
  1. Scheduling Details
  2. Cancellation Policy
  3. Financial Terms
         ↓
Client checks all three boxes
         ↓
Client submits confirmation
         ↓
System validates (all three must be checked)
         ↓
System creates timestamped record with IP & User Agent
         ↓
Booking status → CONFIRMED
         ↓
Cancellation deadline calculated and stored
         ↓
Invoice can now be generated
```

### Confirmation Sections

#### 1. Scheduling Details
```
I confirm that the following scheduling details are accurate:

• Booking Number: BK-2026-03-00045
• Service: Court Reporting - Deposition
• Date: Monday, March 15, 2026
• Time: 10:00 AM
• Type: In-Person
• Location: 123 Main St, Suite 400, New York, NY

I understand that I am responsible for ensuring all parties 
are present and ready at the scheduled time.

☐ I confirm the scheduling details
```

#### 2. Cancellation Policy
```
I acknowledge and agree to the following cancellation policy:

• Cancellations must be made before 3:00 PM on the previous business day
• Cancellation Deadline for this booking: Friday, March 14, 2026 at 3:00 PM
• Cancellations made after this deadline will incur the minimum 
  booking fee of $400.00
• This fee will be invoiced immediately upon late cancellation
• Payment is due within 14 days of invoice date

I understand that this policy is in place because court reporters 
reserve their time exclusively for scheduled proceedings and cannot 
accept other assignments during that time.

☐ I acknowledge the cancellation policy
```

#### 3. Financial Responsibility
```
I acknowledge and agree to the following financial terms:

• Estimated Total: $650.00
• Minimum Booking Fee: $400.00 (enforced on all bookings)
• Payment due within 14 days of invoice date
• Late payments subject to 1.5% monthly interest charge
• I am financially responsible for all charges related to this booking

UNDER PENALTY OF PERJURY, I declare that:
1. I have the authority to bind my organization to this agreement
2. I will ensure payment of all invoices within the stated terms
3. I understand the cancellation policy and associated fees
4. All information provided is true and accurate

I understand that this confirmation creates a legally binding 
agreement between myself/my organization and Marina Dubson 
Stenographic Services.

☐ I confirm financial responsibility under penalty of perjury
```

### Database Record

**Table:** `ClientConfirmation`

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier |
| `bookingId` | String | Booking reference |
| `contactId` | String | Client reference |
| `confirmedScheduling` | Boolean | Scheduling confirmed |
| `confirmedCancellation` | Boolean | Cancellation policy confirmed |
| `confirmedFinancial` | Boolean | Financial terms confirmed |
| `ipAddress` | String | Client IP address |
| `userAgent` | String | Client browser/device info |
| `confirmedAt` | DateTime | Timestamp of confirmation |

**Example Record:**
```json
{
  "id": "clm123abc",
  "bookingId": "clm456def",
  "contactId": "clm789ghi",
  "confirmedScheduling": true,
  "confirmedCancellation": true,
  "confirmedFinancial": true,
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "confirmedAt": "2026-03-10T14:30:45.123Z"
}
```

### API Endpoints

#### Get Confirmation Terms
```bash
GET /api/confirmations?bookingId=xxx
Authorization: Bearer {token}
```

**Response:**
```json
{
  "booking": { ... },
  "terms": {
    "schedulingTerms": "I confirm that the following...",
    "cancellationTerms": "I acknowledge and agree...",
    "financialTerms": "I acknowledge and agree..."
  },
  "cancellationInfo": {
    "canCancel": true,
    "deadline": "2026-03-14T15:00:00.000Z",
    "hoursRemaining": 96
  },
  "requiresConfirmation": true
}
```

#### Submit Confirmation
```bash
POST /api/confirmations
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "xxx",
  "confirmedScheduling": true,
  "confirmedCancellation": true,
  "confirmedFinancial": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "confirmation": {
    "id": "clm123abc",
    "confirmedAt": "2026-03-10T14:30:45.123Z",
    ...
  },
  "booking": {
    "bookingStatus": "CONFIRMED",
    "confirmedAt": "2026-03-10T14:30:45.123Z",
    "cancellationDeadline": "2026-03-14T15:00:00.000Z",
    ...
  }
}
```

### Validation Rules

1. **All three checkboxes must be checked**
   - If any is false, API returns error
   - Error: "All confirmations required"

2. **Booking must be in ACCEPTED status**
   - Cannot confirm if not yet approved
   - Cannot confirm if already confirmed
   - Cannot confirm if cancelled/declined

3. **Client must own the booking**
   - Verified via contact email
   - Admins can confirm on behalf of client

4. **One confirmation per booking**
   - Unique constraint on `bookingId`
   - Cannot re-confirm

### Legal Enforceability

This confirmation system provides:

✅ **Timestamped proof** of client agreement
✅ **IP address** for verification
✅ **User agent** for device tracking
✅ **Explicit acknowledgment** of all terms
✅ **Penalty of perjury** declaration
✅ **Immutable record** in database

This creates a **legally binding agreement** that can be used to:
- Enforce cancellation fees
- Collect unpaid invoices
- Prove client acknowledgment of terms
- Defend against disputes

---

## Integration with Booking Lifecycle

### Status Flow with Confirmations

```
SUBMITTED
    ↓
PENDING_REVIEW
    ↓
ACCEPTED (Admin approves)
    ↓
[Confirmation Request Sent]
    ↓
CONFIRMED (Client confirms - all 3 boxes checked)
    ↓
[Cancellation Deadline Set]
    ↓
[Invoice Can Be Generated]
    ↓
COMPLETED
```

### Business Rules

1. **No invoice until CONFIRMED**
   - Status must be CONFIRMED
   - Confirmation record must exist
   - All three confirmations must be true

2. **No calendar block until CONFIRMED**
   - Prevents blocking time for unconfirmed bookings
   - Reporter assignment only after confirmation

3. **Cancellation deadline set on confirmation**
   - Calculated when status → CONFIRMED
   - Stored in `booking.cancellationDeadline`

4. **Late cancellation fee automatic**
   - If cancelled after deadline
   - If status was CONFIRMED
   - Invoice auto-generated immediately

---

## Testing Scenarios

### Scenario 1: On-Time Cancellation
1. Booking created: March 15, 10:00 AM
2. Deadline: March 14, 3:00 PM
3. Client cancels: March 14, 2:00 PM
4. **Result:** No fee, booking cancelled

### Scenario 2: Late Cancellation
1. Booking created: March 15, 10:00 AM
2. Deadline: March 14, 3:00 PM
3. Client cancels: March 14, 4:00 PM
4. **Result:** $400 invoice generated automatically

### Scenario 3: Weekend Booking
1. Booking created: Monday, March 17
2. Deadline: Thursday, March 13, 3:00 PM (skips weekend)
3. Client cancels: Friday, March 14, 10:00 AM
4. **Result:** $400 invoice (past deadline)

### Scenario 4: Incomplete Confirmation
1. Client checks only 2 of 3 boxes
2. Submits confirmation
3. **Result:** Error - "All confirmations required"

### Scenario 5: Minimum Fee Application
1. Service cost: $250
2. Minimum fee: $400
3. **Result:** Invoice total = $400

---

## Admin Tools

### Check Booking Cancellation Status
Admins can check if a cancellation fee would apply:

```typescript
const info = await BookingRulesService.canCancelWithoutFee(bookingId)
console.log(info.message)
// "You can cancel without fee until 3/14/2026, 3:00 PM. 18 hours remaining."
```

### Manual Invoice Generation
If automatic generation fails, admins can manually trigger:

```typescript
const invoice = await BookingRulesService.generateCancellationInvoice(bookingId)
```

### View Confirmation Record
Admins can view the legal confirmation record:

```sql
SELECT * FROM ClientConfirmation WHERE bookingId = 'xxx'
```

---

## Compliance & Legal

### Data Retention
- Confirmation records: **Permanent**
- IP addresses: **Permanent** (for legal purposes)
- User agents: **Permanent** (for legal purposes)

### GDPR Considerations
- IP addresses are necessary for contract enforcement
- Stored under "legitimate interest" basis
- Cannot be deleted while contract is active

### Audit Trail
Every confirmation creates an immutable audit trail:
1. Who confirmed (contactId)
2. When confirmed (confirmedAt)
3. From where (ipAddress)
4. Using what device (userAgent)
5. What they confirmed (all three booleans)

---

## Support & Troubleshooting

### Common Issues

**Q: Client says they didn't see cancellation deadline**
**A:** Confirmation record shows they explicitly acknowledged it under penalty of perjury

**Q: Client disputes cancellation fee**
**A:** Show confirmation record with timestamp, IP, and explicit acknowledgment

**Q: Booking stuck in ACCEPTED status**
**A:** Client hasn't completed confirmation - resend confirmation request

**Q: Invoice not generating**
**A:** Check booking status is CONFIRMED and confirmation record exists

---

## Next Steps

1. ✅ Booking rules service created
2. ✅ Confirmation API created
3. ✅ Cancellation API created
4. 🔄 Create client-facing confirmation UI
5. 🔄 Add email notifications for confirmations
6. 🔄 Add admin dashboard for confirmation tracking
7. 🔄 Test complete flow end-to-end
