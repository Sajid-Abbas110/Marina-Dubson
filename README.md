# Marina Dubson Stenographic Services - CRM System

A comprehensive court reporting booking, invoicing, and automation system built with Next.js, TypeScript, and Tailwind CSS. This application works seamlessly across web, mobile, and desktop platforms.

## 🚀 Features

### Core Functionality
- ✅ **Client Portal** - Self-service booking and invoice management
- ✅ **Admin Dashboard** - Complete CRM management interface
- ✅ **Automated Booking Workflow** - Request → Review → Accept/Decline → Confirm
- ✅ **Smart Invoicing** - Automatic invoice generation with custom pricing
- ✅ **Payment Integration** - Stripe and PayPal support
- ✅ **Email Automation** - Professional email templates for all workflows
- ✅ **Document Management** - Secure file storage and access
- ✅ **Calendar Integration** - Visual booking calendar with conflict detection
- ✅ **Reporting & Analytics** - Revenue tracking and client insights

### Legal Compliance
- ✅ **$400 Minimum Fee Enforcement**
- ✅ **Cancellation Policy Automation** (3 PM previous business day)
- ✅ **Client Confirmation Under Penalty of Perjury**
- ✅ **No Public Pricing Exposure**
- ✅ **Per-Client Custom Pricing**

### Technical Features
- 🌐 **Cross-Platform** - Works on web, mobile (PWA), and desktop
- 📱 **Responsive Design** - Optimized for all screen sizes
- 🎨 **Premium UI/UX** - Modern, professional interface with animations
- 🔒 **Secure Authentication** - JWT-based auth with role-based access
- 📊 **Real-time Updates** - Live status tracking and notifications
- 🚀 **Performance Optimized** - Fast loading and smooth interactions

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)
- PayPal account (for payments)
- SMTP email service (Gmail, SendGrid, etc.)
- Mailchimp account (optional, for marketing)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd Maria-Dubson
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/maria_dubson_crm"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Marina Dubson <noreply@dubsonstenoservices.com>"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. Create Admin User

```bash
# You can create an admin user via API or Prisma Studio
npx prisma studio
```

Or use the registration API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dubsonstenoservices.com",
    "password": "SecurePassword123!",
    "firstName": "Marina",
    "lastName": "Dubson",
    "role": "ADMIN"
  }'
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Building for Production

### Web Application

```bash
npm run build
npm start
```

### Progressive Web App (PWA)

The application is already configured as a PWA. Users can install it on their mobile devices or desktop by clicking the "Install" button in their browser.

### Desktop Application (Electron - Optional)

To create a desktop application:

```bash
npm install -D electron electron-builder
```

Create `electron/main.js` and configure electron-builder in `package.json`.

## 🗂️ Project Structure

```
Maria-Dubson/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── bookings/     # Booking management
│   │   ├── invoices/     # Invoice generation
│   │   ├── contacts/     # Client management
│   │   └── services/     # Service definitions
│   ├── admin/            # Admin dashboard pages
│   ├── client/           # Client portal pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
├── lib/                  # Utility functions
│   ├── prisma.ts        # Database client
│   ├── auth.ts          # Authentication helpers
│   └── email.ts         # Email service
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
├── .env.example         # Environment template
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS config
└── package.json         # Dependencies
```

## 🔑 User Roles

### Admin
- Full system access
- Approve/decline bookings
- Generate invoices
- Manage clients and services
- View all reports

### Manager
- Operations access
- View bookings and invoices
- Limited client management

### Staff
- View bookings only
- Create booking requests

## 📊 Database Schema

### Key Models

- **Contact** - Client information and custom pricing
- **Service** - Service definitions and base pricing
- **Booking** - Booking requests and lifecycle
- **Invoice** - Automated invoice generation
- **ClientConfirmation** - Legal confirmation tracking
- **EmailLog** - Email audit trail

## 🔄 Booking Workflow

1. **Client Submits Request** → Email sent (Pending)
2. **Admin Reviews** → Status: Maybe/Pending Review
3. **Admin Accepts** → Email sent with confirmation link
4. **Client Confirms** → Booking confirmed
5. **Invoice Generated** → Automatic calculation with custom pricing
6. **Payment Processed** → Stripe/PayPal webhook updates status
7. **Booking Completed** → Status updated

## 💰 Pricing System

### No Public Rates
- Rates never displayed publicly
- Delivered via email or PDF only

### Custom Pricing
- Per-client custom rates
- Overrides default service pricing
- Historical rate tracking

### Minimum Fee
- $400 minimum enforced on all bookings
- Applied to cancellations after deadline

## 📧 Email Automation

Automated emails for:
- Booking submission (pending)
- Booking acceptance (with confirmation link)
- Booking decline
- Invoice generation
- Payment confirmation

## 🎨 Customization

### Branding

Edit `app/page.tsx` and `app/globals.css` to customize:
- Colors and theme
- Logo and branding
- Contact information

### Invoice Template

Customize invoice layout in `app/admin/invoices/[id]/print/page.tsx`

### Email Templates

Edit templates in `lib/email.ts`

## 🔒 Security

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with Zod
- SQL injection protection via Prisma
- XSS protection via React

## 📈 Analytics & Reporting

Access reports for:
- Total bookings by status
- Revenue tracking
- Client activity
- Payment status
- Cancellation rates
- Agency vs. Direct revenue

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
npx prisma db push
```

### Email Not Sending

- Verify SMTP credentials
- Check email logs in database
- Enable "Less secure app access" for Gmail

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Support

For issues or questions:
- Email: MarinaDubson@gmail.com
- Phone: (917) 494-1859

## 📄 License

© 2026 Marina Dubson Stenographic Services, LLC. All rights reserved.

---

**"Committed to accuracy, high quality and excellent customer service"**
