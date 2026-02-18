import { generateToken } from '../lib/auth'

async function testApi() {
    const token = generateToken({
        userId: 'cmlpgrg7o000011ciw3y2n1th', // The ID from our integrity check
        id: 'cmlpgrg7o000011ciw3y2n1th',
        email: 'admin@marinadubson.com',
        role: 'ADMIN',
        firstName: 'Marina'
    })

    console.log('Testing /api/bookings with ADMIN token...')
    try {
        const res = await fetch('http://localhost:3000/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        console.log('Bookings:', data.bookings?.length || 0)
        if (data.error) console.log('Error:', data.error)
    } catch (e) {
        console.error('Failed to connect to API:', e.message)
    }

    console.log('\nTesting /api/admin/users with ADMIN token...')
    try {
        const res = await fetch('http://localhost:3000/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        console.log('Users:', data.users?.length || 0)
    } catch (e) {
        console.error('Failed to connect to API:', e.message)
    }
}

testApi()
