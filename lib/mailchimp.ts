/**
 * Mailchimp Integration
 * Handles email list management and campaign automation
 */

interface MailchimpMember {
    email_address: string
    status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending'
    merge_fields: {
        FNAME: string
        LNAME: string
        PHONE?: string
        COMPANY?: string
    }
    tags?: string[]
}

class Mailchimp {
    private apiKey: string
    private serverPrefix: string
    private audienceId: string

    constructor() {
        this.apiKey = process.env.MAILCHIMP_API_KEY || ''
        this.serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us1'
        this.audienceId = process.env.MAILCHIMP_AUDIENCE_ID || ''
    }

    private get baseUrl(): string {
        return `https://${this.serverPrefix}.api.mailchimp.com/3.0`
    }

    private get authHeader(): string {
        return `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString('base64')}`
    }

    /**
     * Add or update a subscriber
     */
    async upsertMember(memberData: MailchimpMember): Promise<any> {
        const subscriberHash = this.getSubscriberHash(memberData.email_address)

        const response = await fetch(
            `${this.baseUrl}/lists/${this.audienceId}/members/${subscriberHash}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': this.authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email_address: memberData.email_address,
                    status_if_new: memberData.status,
                    merge_fields: memberData.merge_fields
                })
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Mailchimp member upsert failed: ${error}`)
        }

        const result = await response.json()

        // Add tags if provided
        if (memberData.tags && memberData.tags.length > 0) {
            await this.addTags(memberData.email_address, memberData.tags)
        }

        return result
    }

    /**
     * Add tags to a member
     */
    async addTags(email: string, tags: string[]): Promise<any> {
        const subscriberHash = this.getSubscriberHash(email)

        const response = await fetch(
            `${this.baseUrl}/lists/${this.audienceId}/members/${subscriberHash}/tags`,
            {
                method: 'POST',
                headers: {
                    'Authorization': this.authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tags: tags.map(name => ({ name, status: 'active' }))
                })
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Mailchimp add tags failed: ${error}`)
        }

        return await response.json()
    }

    /**
     * Remove tags from a member
     */
    async removeTags(email: string, tags: string[]): Promise<any> {
        const subscriberHash = this.getSubscriberHash(email)

        const response = await fetch(
            `${this.baseUrl}/lists/${this.audienceId}/members/${subscriberHash}/tags`,
            {
                method: 'POST',
                headers: {
                    'Authorization': this.authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tags: tags.map(name => ({ name, status: 'inactive' }))
                })
            }
        )

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Mailchimp remove tags failed: ${error}`)
        }

        return await response.json()
    }

    /**
     * Update member status based on booking stage
     */
    async updateMemberForBookingStage(
        email: string,
        firstName: string,
        lastName: string,
        stage: 'submitted' | 'approved' | 'invoiced' | 'paid' | 'completed'
    ): Promise<any> {
        const tagMap: Record<string, string[]> = {
            submitted: ['New Booking'],
            approved: ['Booking Approved'],
            invoiced: ['Invoice Sent'],
            paid: ['Payment Received'],
            completed: ['Service Completed']
        }

        // Upsert member
        await this.upsertMember({
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        })

        // Add appropriate tag
        const tags = tagMap[stage] || []
        if (tags.length > 0) {
            await this.addTags(email, tags)
        }

        return { success: true, stage, tags }
    }

    /**
     * Generate MD5 hash for subscriber (required by Mailchimp API)
     */
    private getSubscriberHash(email: string): string {
        const crypto = require('crypto')
        return crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
    }
}

export const mailchimp = new Mailchimp()
export type { MailchimpMember }
