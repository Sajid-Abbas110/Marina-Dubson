const jwt = require('jsonwebtoken');

const JWT_SECRET = "dev-secret-key-change-in-production-12345";
const payload = {
    userId: 'cmlpgrg7o000011ciw3y2n1th',
    id: 'cmlpgrg7o000011ciw3y2n1th',
    email: 'admin@marinadubson.com',
    role: 'ADMIN',
    firstName: 'Marina'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
console.log('TOKEN:', token);

async function test() {
    console.log('\nTesting /api/bookings...');
    try {
        const response = await fetch('http://localhost:3000/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Bookings count:', data.bookings ? data.bookings.length : 'N/A');
        if (data.error) console.log('Error:', data.error);
    } catch (e) {
        console.log('Fetch error:', e.message);
    }

    console.log('\nTesting /api/admin/users...');
    try {
        const response = await fetch('http://localhost:3000/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Users count:', data.users ? data.users.length : 'N/A');
    } catch (e) {
        console.log('Fetch error:', e.message);
    }
}

test();
