const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await res.json();
        return { status: res.status, data };
    } catch (error) {
        console.error(`Request failed: ${method} ${endpoint}`, error);
        return { status: 500, error };
    }
}

async function main() {
    console.log('🚀 Starting System Test Workflow...');

    // 1. Register Client
    console.log('\n--- 1. Registering Client ---');
    let clientRes = await request('/auth/register', 'POST', {
        email: 'test_client@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Client',
        role: 'CLIENT',
        company: 'Test Law Firm',
        phone: '555-0100'
    });

    if (clientRes.status === 409) {
        console.log('Client already exists, logging in...');
        clientRes = await request('/auth/login', 'POST', {
            email: 'test_client@example.com',
            password: 'password123'
        });
    }

    if (clientRes.status !== 201 && clientRes.status !== 200) {
        console.error('Client registration/login failed:', clientRes);
        return;
    }

    const clientToken = clientRes.data.token || (await request('/auth/login', 'POST', {
        email: 'test_client@example.com',
        password: 'password123'
    })).data.token;

    console.log('✅ Client Authenticated');

    // 2. Register Reporter
    console.log('\n--- 2. Registering Reporter ---');
    let reporterRes = await request('/auth/register', 'POST', {
        email: 'test_reporter@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Reporter',
        role: 'REPORTER',
        certification: 'CSR-1234'
    });

    if (reporterRes.status === 409) {
        console.log('Reporter already exists, logging in...');
        reporterRes = await request('/auth/login', 'POST', {
            email: 'test_reporter@example.com',
            password: 'password123'
        });
    }

    const reporterToken = reporterRes.data.token || (await request('/auth/login', 'POST', {
        email: 'test_reporter@example.com',
        password: 'password123'
    })).data.token;

    console.log('✅ Reporter Authenticated');

    // 3. Get Services (needed for booking)
    console.log('\n--- 3. Fetching Services ---');
    // Services endpoint requires auth? Let's try with client token
    const servicesRes = await request('/services', 'GET', null, clientToken);

    let serviceId;
    if (servicesRes.data.services && servicesRes.data.services.length > 0) {
        serviceId = servicesRes.data.services[0].id;
        console.log(`✅ Found Service: ${servicesRes.data.services[0].serviceName} (ID: ${serviceId})`);
    } else {
        // If no services, we might need to seed them or Create one if allowed (but usually seed)
        console.log('⚠️ No services found. Cannot proceed with booking creation properly without service ID.');
        // Try to proceed anyway if we can't seed, but it will likely fail.
        // Ideally we would run seed script.
    }

    if (serviceId) {
        // 4. Create Booking
        console.log('\n--- 4. Creating Booking as Client ---');
        const bookingData = {
            contactId: '', // Will be inferred from token email in backend logic
            serviceId: serviceId,
            proceedingType: 'Deposition',
            bookingDate: '2026-03-20',
            bookingTime: '10:00 AM', // Check format expected?
            appearanceType: 'REMOTE',
            location: 'Zoom',
            specialRequirements: 'Realtime needed'
        };

        const bookingRes = await request('/bookings', 'POST', bookingData, clientToken);

        if (bookingRes.status === 201) {
            console.log('✅ Booking Created Successfully:', bookingRes.data.bookingNumber);
            console.log('   Status:', bookingRes.data.bookingStatus);

            // 5. Verify Email Log (via Prisma check script later, or just assume success if 201)
            console.log('   (Email notification should have been sent to client)');
        } else {
            console.error('❌ Booking Creation Failed:', bookingRes);
        }
    }

    console.log('\n✅ Test Workflow Complete.');
}

main();
