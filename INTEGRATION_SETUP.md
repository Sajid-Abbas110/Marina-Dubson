# Marina Dubson CRM - Full Integration Setup Guide

## Integration Flow Overview

```
Client Portal → Zoho CRM → Admin Approval → Zoho Books → Stripe/PayPal → Status Sync → Mailchimp
```

## Architecture

### 1. **Client Portal** (Your Next.js App)
- Clients submit booking requests
- Data stored in local SQLite database
- Triggers integration pipeline

### 2. **Zoho CRM**
- Stores contacts and deals (bookings)
- Tracks sales pipeline stages
- Synced automatically when booking is created

### 3. **Admin Approval**
- Admin reviews booking in portal
- Approves or declines
- Approval triggers invoice creation

### 4. **Zoho Books**
- Creates customers from contacts
- Generates invoices
- Sends invoice emails
- Tracks payments

### 5. **Stripe/PayPal**
- Processes payments
- Webhooks notify system of payment
- Payment recorded in Zoho Books

### 6. **Mailchimp**
- Subscribers tagged based on booking stage
- Automated email campaigns
- Customer segmentation

---

## Setup Instructions

### Step 1: Zoho CRM Setup

1. **Create Zoho CRM Account**
   - Go to https://www.zoho.com/crm/
   - Sign up for an account

2. **Create OAuth Client**
   - Go to https://api-console.zoho.com/
   - Click "Add Client"
   - Choose "Server-based Applications"
   - Set Redirect URI: `http://localhost:3000/api/zoho/callback`
   - Note your **Client ID** and **Client Secret**

3. **Generate Refresh Token**
   - Visit this URL (replace CLIENT_ID):
     ```
     https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/api/zoho/callback
     ```
   - Authorize the app
   - Copy the `code` from the redirect URL
   - Exchange code for refresh token:
     ```bash
     curl -X POST https://accounts.zoho.com/oauth/v2/token \
       -d "code=YOUR_CODE" \
       -d "client_id=YOUR_CLIENT_ID" \
       -d "client_secret=YOUR_CLIENT_SECRET" \
       -d "redirect_uri=http://localhost:3000/api/zoho/callback" \
       -d "grant_type=authorization_code"
     ```
   - Save the **refresh_token**

4. **Update .env**
   ```env
   ZOHO_CRM_CLIENT_ID="your_client_id"
   ZOHO_CRM_CLIENT_SECRET="your_client_secret"
   ZOHO_CRM_REFRESH_TOKEN="your_refresh_token"
   ```

---

### Step 2: Zoho Books Setup

1. **Create Zoho Books Account**
   - Go to https://www.zoho.com/books/
   - Sign up and create an organization

2. **Get Organization ID**
   - Go to Settings → Organization Profile
   - Copy the **Organization ID**

3. **Create OAuth Client** (same as CRM if using same Zoho account)
   - Use scope: `ZohoBooks.fullaccess.all`

4. **Update .env**
   ```env
   ZOHO_BOOKS_ORG_ID="your_organization_id"
   ZOHO_BOOKS_CLIENT_ID="your_client_id"
   ZOHO_BOOKS_CLIENT_SECRET="your_client_secret"
   ZOHO_BOOKS_REFRESH_TOKEN="your_refresh_token"
   ```

---

### Step 3: Stripe Setup

1. **Create Stripe Account**
   - Go to https://stripe.com/
   - Sign up

2. **Get API Keys**
   - Go to Developers → API Keys
   - Copy **Secret Key** and **Publishable Key**

3. **Set Up Webhook**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `charge.succeeded`
   - Copy **Webhook Secret**

4. **Update .env**
   ```env
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_PUBLISHABLE_KEY="pk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

---

### Step 4: PayPal Setup

1. **Create PayPal Business Account**
   - Go to https://www.paypal.com/
   - Sign up for business account

2. **Get API Credentials**
   - Go to Developer Dashboard
   - Create REST API app
   - Copy **Client ID** and **Secret**

3. **Update .env**
   ```env
   PAYPAL_CLIENT_ID="your_client_id"
   PAYPAL_CLIENT_SECRET="your_client_secret"
   PAYPAL_MODE="live"  # or "sandbox" for testing
   ```

---

### Step 5: Mailchimp Setup

1. **Create Mailchimp Account**
   - Go to https://mailchimp.com/
   - Sign up

2. **Get API Key**
   - Go to Account → Extras → API Keys
   - Create new key
   - Note the **server prefix** (e.g., "us1" from "us1.api.mailchimp.com")

3. **Create Audience**
   - Go to Audience → All contacts
   - Create new audience
   - Copy **Audience ID** from Settings

4. **Update .env**
   ```env
   MAILCHIMP_API_KEY="your_api_key"
   MAILCHIMP_SERVER_PREFIX="us1"
   MAILCHIMP_AUDIENCE_ID="your_audience_id"
   ```

---

## Integration Flow Details

### When Client Creates Booking:

1. **Client Portal**
   - Client fills out booking form
   - Booking saved to local database
   - Status: `SUBMITTED`

2. **Auto-Sync to Zoho CRM**
   ```typescript
   // Triggered automatically in booking API
   await integrationOrchestrator.syncToZohoCRM({
     bookingId: booking.id,
     contactEmail: contact.email,
     // ... other data
   })
   ```
   - Creates/updates contact in Zoho CRM
   - Creates deal with stage "Qualification"
   - Adds subscriber to Mailchimp with tag "New Booking"

### When Admin Approves Booking:

1. **Admin Portal**
   - Admin reviews booking
   - Clicks "Approve"
   - Status changes to `ACCEPTED`

2. **Auto-Create Invoice**
   ```typescript
   await integrationOrchestrator.createInvoiceAfterApproval({
     // booking data
   })
   ```
   - Creates customer in Zoho Books
   - Generates invoice
   - Sends invoice email to client
   - Updates CRM deal stage to "Proposal/Price Quote"
   - Updates Mailchimp tag to "Invoice Sent"

### When Client Pays:

1. **Payment Gateway**
   - Client pays via Stripe or PayPal
   - Webhook sent to your server

2. **Auto-Record Payment**
   ```typescript
   await integrationOrchestrator.recordPayment(bookingId, {
     amount: 500,
     paymentMethod: 'stripe',
     transactionId: 'pi_xxx',
     paidAt: new Date().toISOString()
   })
   ```
   - Records payment in Zoho Books
   - Marks invoice as paid
   - Updates CRM deal to "Closed Won"
   - Updates Mailchimp tag to "Payment Received"

### When Service is Completed:

1. **Admin Portal**
   - Admin marks booking as complete

2. **Auto-Update All Systems**
   ```typescript
   await integrationOrchestrator.completeBooking(bookingId)
   ```
   - Updates local database to `COMPLETED`
   - Updates CRM deal
   - Updates Mailchimp tag to "Service Completed"

---

## Testing the Integration

### 1. Test Zoho CRM Connection
```bash
# Create a test booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "...",
    "bookingDate": "2026-03-01",
    "bookingTime": "10:00",
    ...
  }'

# Check Zoho CRM for new contact and deal
```

### 2. Test Invoice Creation
```bash
# Approve the booking in admin portal
# Check Zoho Books for new invoice
# Check email for invoice notification
```

### 3. Test Payment Webhook
```bash
# Use Stripe CLI to test webhook
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

---

## Troubleshooting

### Zoho Token Expired
- Refresh tokens are valid for 1 year
- System auto-refreshes access tokens
- If refresh token expires, regenerate it

### Invoice Not Created
- Check Zoho Books organization ID
- Verify customer exists
- Check API logs for errors

### Mailchimp Sync Failed
- Verify API key and audience ID
- Check subscriber hash generation
- Ensure email is valid

---

## API Endpoints

### Trigger Manual Sync
```bash
POST /api/integrations/sync-to-crm
POST /api/integrations/create-invoice
POST /api/integrations/record-payment
```

### Webhooks
```bash
POST /api/webhooks/stripe
POST /api/webhooks/paypal
```

---

## Monitoring

- Check `EmailLog` table for email delivery status
- Monitor Zoho CRM for deal pipeline
- Review Zoho Books for invoice status
- Check Mailchimp for subscriber tags

---

## Security Notes

1. **Never commit .env file** - Add to .gitignore
2. **Use environment variables** in production
3. **Validate webhook signatures** (Stripe, PayPal)
4. **Rotate API keys** regularly
5. **Use HTTPS** in production

---

## Support

For issues with:
- **Zoho**: https://help.zoho.com/
- **Stripe**: https://support.stripe.com/
- **PayPal**: https://www.paypal.com/us/smarthelp/
- **Mailchimp**: https://mailchimp.com/help/

---

## Next Steps

1. Fill in all `.env` variables with real credentials
2. Test each integration individually
3. Test the complete flow end-to-end
4. Set up production webhooks
5. Configure Mailchimp automation campaigns
6. Monitor and optimize
