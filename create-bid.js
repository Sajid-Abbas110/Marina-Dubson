const fetch = global.fetch || require('node-fetch');
const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return { status: res.status, error: text };
        }
        return { status: res.status, data };
    } catch (error) {
        console.error(`Request failed: ${method} ${endpoint}`, error);
        return { status: 500, error: error.message };
    }
}

async function main() {
    console.log('🚀 Creating a Bid as Reporter...');

    // 1. Login as Reporter
    console.log('Logging in as reporter@mariadubson.com...');
    const loginRes = await request('/auth/login', 'POST', {
        email: 'reporter@mariadubson.com',
        password: 'password123'
    });

    if (loginRes.status !== 200) {
        console.error('Login failed:', loginRes);
        return;
    }
    const token = loginRes.data.token;
    console.log('✅ Reporter Authenticated');

    // 2. Find a Booking
    // Ideally, reporter sees "Marketplace" bookings.
    // We'll search for one.
    // GET /api/bookings?status=SUBMITTED?? No, likely specific endpoint or filter.
    // Admin page uses /api/bookings.
    // Let's assume we can fetch bookings with the token. But reporter might be restricted?
    // Let's try fetching bookings transparently to find an ID.

    // Actually, we can just use the Admin endpoint if Reporter has permission, OR use the public/marketplace endpoint if it exists?
    // Let's try the recently created admin booking.
    // We'll use a direct DB query to find the booking ID to be safe, then post via API.
    // Actually, let's use the API to list bookings available to reporter?
    // GET /api/bookings might return assignments.
    // GET /api/market/bookings? might exist?

    // Let's just query the *latest* booking via API using the Reporter token, assuming they can see it or we can just find it via another way.
    // Actually, I'll use the prisma client directly to get the ID, then use API to bid. This ensures the API logic is tested but ID is correct.

    // Wait, I can't import prisma in this script easily without transpile if I use `import`.
    // I'll use `require`.

    // Alternative: Login as Admin to get booking ID?
    // No, I'll use `client@mariadubson.com` to get their booking?
    // Valid.

    console.log('Logging in as Client to find booking...');
    const clientLogin = await request('/auth/login', 'POST', {
        email: 'client@mariadubson.com',
        password: 'password123'
    });

    let bookingId;
    if (clientLogin.status === 200) {
        const bookings = await request('/api/bookings', 'GET', null, clientLogin.data.token);
        if (bookings.data.bookings && bookings.data.bookings.length > 0) {
            bookingId = bookings.data.bookings[0].id;
            console.log(`Found Booking ID: ${bookingId} (from Client view)`);
        }
    }

    // If client has no bookings (register-users didn't create one), checking 'test_client2'
    if (!bookingId) {
        console.log('Logging in as test_client2 to find booking...');
        const testClientLogin = await request('/auth/login', 'POST', {
            email: 'test_client2@example.com',
            password: 'password123'
        });
        if (testClientLogin.status === 200) {
            const bookings = await request('/api/bookings', 'GET', null, testClientLogin.data.token);
            if (bookings.data.bookings && bookings.data.bookings.length > 0) {
                bookingId = bookings.data.bookings[0].id;
                console.log(`Found Booking ID: ${bookingId} (from test_client2 view)`);
            }
        }
    }

    if (!bookingId) {
        console.error('❌ No booking found to bid on. Please create a booking first.');
        return;
    }

    // 3. Place Bid
    console.log(`\nPlacing Bid on Booking ${bookingId}...`);
    const bidRes = await request('/api/market/bids', 'POST', {
        bookingId: bookingId,
        amount: 550.00,
        timeline: '24 Hours',
        notes: 'I am available and certified for this proceeding.'
    }, token);

    if (bidRes.status === 201) {
        console.log('✅ Bid Placed Successfully!');
        console.log('   Amount: $550.00');
        console.log('   Timeline: 24 Hours');
    } else {
        console.error('❌ Failed to place bid:', bidRes);
    }
}

main();
