/**
 * Zoho CRM Integration
 * Handles authentication and API calls to Zoho CRM
 */

interface ZohoTokenResponse {
    access_token: string
    expires_in: number
    api_domain: string
    token_type: string
}

interface ZohoContact {
    First_Name: string
    Last_Name: string
    Email: string
    Phone?: string
    Account_Name?: string
    Description?: string
}

interface ZohoDeal {
    Deal_Name: string
    Stage: string
    Amount: number
    Closing_Date: string
    Contact_Name: {
        id: string
    }
    Description?: string
    Type?: string
}

class ZohoCRM {
    private accessToken: string | null = null
    private tokenExpiry: number = 0

    private async getAccessToken(): Promise<string> {
        // Check if we have a valid token
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken
        }

        // Refresh the access token
        const params = new URLSearchParams({
            refresh_token: process.env.ZOHO_CRM_REFRESH_TOKEN!,
            client_id: process.env.ZOHO_CRM_CLIENT_ID!,
            client_secret: process.env.ZOHO_CRM_CLIENT_SECRET!,
            grant_type: 'refresh_token'
        })

        const response = await fetch(
            `${process.env.ZOHO_CRM_ACCOUNTS_URL}/oauth/v2/token?${params}`,
            { method: 'POST' }
        )

        if (!response.ok) {
            throw new Error(`Zoho CRM auth failed: ${response.statusText}`)
        }

        const data: ZohoTokenResponse = await response.json()
        this.accessToken = data.access_token
        this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 min early

        return this.accessToken
    }

    /**
     * Create or update a contact in Zoho CRM
     */
    async upsertContact(contactData: ZohoContact): Promise<any> {
        const token = await this.getAccessToken()

        // First, search for existing contact by email
        const searchResponse = await fetch(
            `${process.env.ZOHO_CRM_DOMAIN}/crm/v2/Contacts/search?email=${encodeURIComponent(contactData.Email)}`,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        let contactId: string | null = null

        if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            if (searchData.data && searchData.data.length > 0) {
                contactId = searchData.data[0].id
            }
        }

        // Create or update contact
        const endpoint = contactId
            ? `${process.env.ZOHO_CRM_DOMAIN}/crm/v2/Contacts/${contactId}`
            : `${process.env.ZOHO_CRM_DOMAIN}/crm/v2/Contacts`

        const method = contactId ? 'PUT' : 'POST'

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [contactData]
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Zoho CRM contact upsert failed: ${error}`)
        }

        const result = await response.json()
        return {
            id: contactId || result.data[0].details.id,
            isNew: !contactId,
            data: result
        }
    }

    /**
     * Create a deal (booking) in Zoho CRM
     */
    async createDeal(dealData: ZohoDeal): Promise<any> {
        const token = await this.getAccessToken()

        const response = await fetch(
            `${process.env.ZOHO_CRM_DOMAIN}/crm/v2/Deals`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: [dealData]
                })
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Zoho CRM deal creation failed: ${error}`)
        }

        const result = await response.json()
        return {
            id: result.data[0].details.id,
            data: result
        }
    }

    /**
     * Update deal stage
     */
    async updateDealStage(dealId: string, stage: string): Promise<any> {
        const token = await this.getAccessToken()

        const response = await fetch(
            `${process.env.ZOHO_CRM_DOMAIN}/crm/v2/Deals/${dealId}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: [{
                        Stage: stage
                    }]
                })
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Zoho CRM deal update failed: ${error}`)
        }

        return await response.json()
    }

    /**
     * Get deal by ID
     */
    async getDeal(dealId: string): Promise<any> {
        const token = await this.getAccessToken()

        const response = await fetch(
            `${process.env.ZOHO_CRM_DOMAIN}/crm/v2/Deals/${dealId}`,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Zoho CRM get deal failed: ${response.statusText}`)
        }

        const result = await response.json()
        return result.data[0]
    }

    /**
     * Add a note to a record (Contact or Deal)
     */
    async addNote(parentId: string, module: 'Contacts' | 'Deals', content: string): Promise<any> {
        const token = await this.getAccessToken()

        const response = await fetch(
            `${process.env.ZOHO_CRM_DOMAIN}/crm/v2/Notes`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: [{
                        Parent_Id: parentId,
                        se_module: module,
                        Note_Content: content,
                        Note_Title: `Portal Message - ${new Date().toLocaleString()}`
                    }]
                })
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Zoho CRM note creation failed: ${error}`)
        }

        return await response.json()
    }
}

export const zohoCRM = new ZohoCRM()
export type { ZohoContact, ZohoDeal }
