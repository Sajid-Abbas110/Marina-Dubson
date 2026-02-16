/**
 * Zoho Books Integration
 * Handles invoicing and payment tracking
 */

interface ZohoTokenResponse {
    access_token: string
    expires_in: number
}

interface ZohoBooksCustomer {
    contact_name: string
    company_name?: string
    email: string
    phone?: string
}

interface ZohoBooksInvoice {
    customer_id: string
    invoice_number?: string
    date: string
    due_date: string
    line_items: Array<{
        item_id?: string
        name: string
        description?: string
        rate: number
        quantity: number
    }>
    notes?: string
    terms?: string
}

class ZohoBooks {
    private accessToken: string | null = null
    private tokenExpiry: number = 0

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken
        }

        const params = new URLSearchParams({
            refresh_token: process.env.ZOHO_BOOKS_REFRESH_TOKEN!,
            client_id: process.env.ZOHO_BOOKS_CLIENT_ID!,
            client_secret: process.env.ZOHO_BOOKS_CLIENT_SECRET!,
            grant_type: 'refresh_token'
        })

        const response = await fetch(
            `https://accounts.zoho.com/oauth/v2/token?${params}`,
            { method: 'POST' }
        )

        if (!response.ok) {
            throw new Error(`Zoho Books auth failed: ${response.statusText}`)
        }

        const data: ZohoTokenResponse = await response.json()
        this.accessToken = data.access_token
        this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000

        return this.accessToken
    }

    /**
     * Create or get customer in Zoho Books
     */
    async upsertCustomer(customerData: ZohoBooksCustomer): Promise<any> {
        const token = await this.getAccessToken()
        const orgId = process.env.ZOHO_BOOKS_ORG_ID!

        // Search for existing customer by email
        const searchResponse = await fetch(
            `${process.env.ZOHO_BOOKS_DOMAIN}/api/v3/contacts?email=${encodeURIComponent(customerData.email)}&organization_id=${orgId}`,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`
                }
            }
        )

        if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            if (searchData.contacts && searchData.contacts.length > 0) {
                return {
                    id: searchData.contacts[0].contact_id,
                    isNew: false,
                    data: searchData.contacts[0]
                }
            }
        }

        // Create new customer
        const response = await fetch(
            `${process.env.ZOHO_BOOKS_DOMAIN}/api/v3/contacts?organization_id=${orgId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Zoho Books customer creation failed: ${error}`)
        }

        const result = await response.json()
        return {
            id: result.contact.contact_id,
            isNew: true,
            data: result.contact
        }
    }

    /**
     * Create an invoice in Zoho Books
     */
    async createInvoice(invoiceData: ZohoBooksInvoice): Promise<any> {
        const token = await this.getAccessToken()
        const orgId = process.env.ZOHO_BOOKS_ORG_ID!

        const response = await fetch(
            `${process.env.ZOHO_BOOKS_DOMAIN}/api/v3/invoices?organization_id=${orgId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Zoho Books invoice creation failed: ${error}`)
        }

        const result = await response.json()
        return {
            id: result.invoice.invoice_id,
            invoice_number: result.invoice.invoice_number,
            total: result.invoice.total,
            data: result.invoice
        }
    }

    /**
     * Record a payment for an invoice
     */
    async recordPayment(invoiceId: string, paymentData: {
        amount: number
        payment_mode: string
        date: string
        reference_number?: string
        notes?: string
    }): Promise<any> {
        const token = await this.getAccessToken()
        const orgId = process.env.ZOHO_BOOKS_ORG_ID!

        const response = await fetch(
            `${process.env.ZOHO_BOOKS_DOMAIN}/api/v3/invoices/${invoiceId}/payments?organization_id=${orgId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Zoho Books payment recording failed: ${error}`)
        }

        return await response.json()
    }

    /**
     * Get invoice by ID
     */
    async getInvoice(invoiceId: string): Promise<any> {
        const token = await this.getAccessToken()
        const orgId = process.env.ZOHO_BOOKS_ORG_ID!

        const response = await fetch(
            `${process.env.ZOHO_BOOKS_DOMAIN}/api/v3/invoices/${invoiceId}?organization_id=${orgId}`,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Zoho Books get invoice failed: ${response.statusText}`)
        }

        const result = await response.json()
        return result.invoice
    }

    /**
     * Send invoice email to customer
     */
    async sendInvoiceEmail(invoiceId: string): Promise<any> {
        const token = await this.getAccessToken()
        const orgId = process.env.ZOHO_BOOKS_ORG_ID!

        const response = await fetch(
            `${process.env.ZOHO_BOOKS_DOMAIN}/api/v3/invoices/${invoiceId}/email?organization_id=${orgId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Zoho Books send invoice failed: ${response.statusText}`)
        }

        return await response.json()
    }
}

export const zohoBooks = new ZohoBooks()
export type { ZohoBooksCustomer, ZohoBooksInvoice }
