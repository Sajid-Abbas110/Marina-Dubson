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

async function test() {
    console.log('Testing /api/invoices...');
    try {
        const response = await fetch('http://localhost:3000/api/invoices', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Invoices count:', data.invoices ? data.invoices.length : 'N/A');
        if (data.error) console.log('Error:', data.error);
    } catch (e) {
        console.log('Fetch error:', e.message);
    }
}

test();
