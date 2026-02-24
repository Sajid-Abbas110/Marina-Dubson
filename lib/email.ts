import nodemailer from 'nodemailer'
import prisma from './prisma'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@marinadubson.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    // Log email
    await prisma.emailLog.create({
      data: {
        recipient: options.to,
        subject: options.subject,
        body: options.html,
        emailType: 'general',
        status: 'sent',
      },
    })

    return true
  } catch (error) {
    console.error('Email send error:', error)

    // Log failed email
    await prisma.emailLog.create({
      data: {
        recipient: options.to,
        subject: options.subject,
        body: options.html,
        emailType: 'general',
        status: 'failed',
        errorMsg: error instanceof Error ? error.message : 'Unknown error',
      },
    })

    return false
  }
}

export const emailTemplates = {
  bookingPending: (bookingNumber: string, clientName: string) => ({
    subject: 'Booking Inquiry Received - Marina Dubson Stenographic Services',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Marina Dubson</h1>
          <p style="color: white; margin: 5px 0;">Stenographic Services, LLC</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Thank you! Your inquiry has been received.</h2>
          
          <p>Dear ${clientName},</p>
          
          <p>We have received your booking request <strong>#${bookingNumber}</strong>.</p>
          
          <p>We value your business and will respond shortly with confirmation details.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #6b7280;">Your request is currently being processed by our team.</p>
          </div>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Marina Dubson Stenographic Services</strong><br>
            (917) 494-1859<br>
            MarinaDubson@gmail.com
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p style="margin: 0;">"Committed to accuracy, high quality and excellent customer service"</p>
          <p style="margin: 10px 0 0 0;">12A Saturn Lane, Staten Island, NY 10314</p>
        </div>
      </div>
    `,
  }),

  bookingAccepted: (
    bookingNumber: string,
    clientName: string,
    bookingDetails: any,
    confirmationLink: string
  ) => ({
    subject: `Booking Accepted #${bookingNumber} - Confirmation Required`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Marina Dubson</h1>
          <p style="color: white; margin: 5px 0;">Stenographic Services, LLC</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #059669;">✓ Booking Accepted</h2>
          
          <p>Dear ${clientName},</p>
          
          <p>Great news! Your booking request <strong>#${bookingNumber}</strong> has been accepted.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Time:</td>
                <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Service:</td>
                <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Location:</td>
                <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.location}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ Confirmation Required</p>
            <p style="margin: 10px 0 0 0; color: #92400e;">Please confirm this booking to finalize your reservation.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" style="display: inline-block; background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Confirm Booking
            </a>
          </div>
          
          <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">Cancellation Policy</p>
            <p style="margin: 10px 0 0 0; color: #991b1b; font-size: 14px;">
              Cancellations must be made before 3 PM the previous business day to avoid the $400 minimum booking fee.
            </p>
          </div>

          <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0369a1;">
            <p style="margin: 0; font-weight: bold; color: #075985;">Financial Responsibility</p>
            <p style="margin: 10px 0 0 0; color: #075985; font-size: 14px;">
              By confirming, you acknowledge financial responsibility for all charges. Payment is due within 14 days of invoice date.
            </p>
          </div>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Marina Dubson Stenographic Services</strong><br>
            (917) 494-1859<br>
            MarinaDubson@gmail.com
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p style="margin: 0;">"Committed to accuracy, high quality and excellent customer service"</p>
          <p style="margin: 10px 0 0 0;">12A Saturn Lane, Staten Island, NY 10314</p>
        </div>
      </div>
    `,
  }),

  bookingDeclined: (bookingNumber: string, clientName: string) => ({
    subject: `Booking Update #${bookingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Marina Dubson</h1>
          <p style="color: white; margin: 5px 0;">Stenographic Services, LLC</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Booking Update</h2>
          
          <p>Dear ${clientName},</p>
          
          <p>Thank you for your interest in our services. Unfortunately, we are unable to accommodate your booking request <strong>#${bookingNumber}</strong> at this time.</p>
          
          <p>We appreciate your understanding and hope to serve you in the future.</p>
          
          <p>Please feel free to contact us if you have any questions or would like to discuss alternative arrangements.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Marina Dubson Stenographic Services</strong><br>
            (917) 494-1859<br>
            MarinaDubson@gmail.com
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p style="margin: 0;">"Committed to accuracy, high quality and excellent customer service"</p>
          <p style="margin: 10px 0 0 0;">12A Saturn Lane, Staten Island, NY 10314</p>
        </div>
      </div>
    `,
  }),

  invoiceGenerated: (
    clientName: string,
    invoiceNumber: string,
    total: number,
    invoiceLink: string,
    paymentLink: string
  ) => ({
    subject: `Invoice #${invoiceNumber} - Marina Dubson Stenographic Services`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Marina Dubson</h1>
          <p style="color: white; margin: 5px 0;">Stenographic Services, LLC</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Invoice Generated</h2>
          
          <p>Dear ${clientName},</p>
          
          <p>Your invoice has been generated and is ready for payment.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Invoice Number</p>
            <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #1f2937;">#${invoiceNumber}</p>
            <p style="margin: 15px 0 0 0; font-size: 32px; font-weight: bold; color: #0284c7;">$${total.toFixed(2)}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invoiceLink}" style="display: inline-block; background: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 5px;">
              View Invoice
            </a>
            <a href="${paymentLink}" style="display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 5px;">
              Pay Now
            </a>
          </div>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Marina Dubson Stenographic Services</strong><br>
            (917) 494-1859<br>
            MarinaDubson@gmail.com
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p style="margin: 0;">"Committed to accuracy, high quality and excellent customer service"</p>
          <p style="margin: 10px 0 0 0;">12A Saturn Lane, Staten Island, NY 10314</p>
        </div>
      </div>
    `,
  }),

  welcomeEmail: (firstName: string, role: string, loginLink: string) => ({
    subject: `Welcome to Marina Dubson Stenographic Services`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Marina Dubson</h1>
          <p style="color: white; margin: 5px 0;">Stenographic Services, LLC</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Welcome, ${firstName}!</h2>
          
          <p>Thank you for registering as a <strong>${role}</strong> with Marina Dubson Stenographic Services.</p>
          
          <p>Your account has been successfully created and is ready for use.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginLink}" style="display: inline-block; background: #0284c7; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Login to Portal
            </a>
          </div>
          
          <p>If you have any questions or require assistance, please contact our support team.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Marina Dubson Stenographic Services</strong><br>
            (917) 494-1859<br>
            MarinaDubson@gmail.com
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p style="margin: 0;">"Committed to accuracy, high quality and excellent customer service"</p>
          <p style="margin: 10px 0 0 0;">12A Saturn Lane, Staten Island, NY 10314</p>
        </div>
      </div>
    `,
  }),
  adminInvoiceNotification: (
    adminName: string,
    clientName: string,
    invoiceNumber: string,
    total: number,
    invoiceLink: string
  ) => ({
    subject: `ALERT: New Invoice Generated - #${invoiceNumber} (${clientName})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Marina Dubson Admin</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1f2937;">New Invoice Signal Detected</h2>
          
          <p>Hello ${adminName},</p>
          
          <p>A new invoice has been generated for <strong>${clientName}</strong>.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #4b5563;">Voucher: <strong>#${invoiceNumber}</strong></p>
            <p style="margin: 5px 0; color: #4b5563;">Amount: <strong>$${total.toFixed(2)}</strong></p>
          </div>
          
          <p>View the tactical details in the admin registry:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invoiceLink}" style="display: inline-block; background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Open Admin Portal
            </a>
          </div>
          
          <p style="font-size: 11px; color: #9ca3af;">This is an automated system notification from the Marina Dubson CRM Node.</p>
        </div>
      </div>
    `,
  }),
  taskAssigned: (name: string, taskTitle: string, priority: string, dueDate: string) => ({
    subject: `New Mission Assignment: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Marina Dubson Ops</h1>
          <p style="color: #9ca3af; margin: 5px 0;">Strategic Personnel Update</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">✓ New Tasking Assigned</h2>
          
          <p>Hello ${name},</p>
          
          <p>A new operational requirement has been assigned to your portal profile.</p>
          
          <div style="background: white; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #111827;">${taskTitle}</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Priority:</td>
                <td style="padding: 8px 0; font-weight: bold; color: ${priority === 'URGENT' ? '#dc2626' : priority === 'HIGH' ? '#d97706' : '#1f2937'};">${priority}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Target Date:</td>
                <td style="padding: 8px 0; font-weight: bold;">${dueDate || 'No specified deadline'}</td>
              </tr>
            </table>
          </div>
          
          <p>Please log in to your portal to review the full details and update the task status upon completion.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="display: inline-block; background: #1f2937; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px;">
              View Task Matrix
            </a>
          </div>
          
          <p style="margin-top: 30px; border-top: 1px solid #e5e7eb; pt-20px; font-size: 12px; color: #6b7280;">
            Best regards,<br>
            <strong>Operational Intelligence | MD Services</strong>
          </p>
        </div>
      </div>
    `,
  }),
}
