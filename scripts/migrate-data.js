const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');

async function migrate() {
    console.log('--- Starting Data Migration ---');
    const sqliteDb = new sqlite3.Database('prisma/dev.db');
    const prisma = new PrismaClient();

    const tables = [
        'User',
        'Contact',
        'Service',
        'CustomPricing',
        'Booking',
        'ClientConfirmation',
        'Invoice',
        'Bid',
        'Message',
        'Task'
    ];

    async function getRows(table) {
        return new Promise((resolve, reject) => {
            sqliteDb.all(`SELECT * FROM "${table}"`, [], (err, rows) => {
                if (err) {
                    console.warn(`⚠️ Table ${table} not found or error:`, err.message);
                    resolve([]);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // 1. Pre-fetch all emails to ensure they exist as contacts
    const rawContacts = await getRows('Contact');
    const rawUsers = await getRows('User');

    const allEmails = new Set();
    rawContacts.forEach(c => allEmails.add(c.email.toLowerCase()));
    rawUsers.forEach(u => allEmails.add(u.email.toLowerCase()));

    console.log(`Ensuring ${allEmails.size} unique contacts exist...`);

    // First, migrate all actual contacts
    for (const contact of rawContacts) {
        try {
            await prisma.contact.upsert({
                where: { email: contact.email.toLowerCase() },
                update: {},
                create: {
                    ...contact,
                    email: contact.email.toLowerCase(),
                    customPricingEnabled: contact.customPricingEnabled === 1 || contact.customPricingEnabled === true,
                    createdAt: contact.createdAt ? new Date(contact.createdAt) : new Date(),
                    updatedAt: contact.updatedAt ? new Date(contact.updatedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed pre-migrating contact ${contact.email}:`, e.message);
        }
    }

    // Then, ensure any user who wasn't in contacts also has a contact entry
    for (const user of rawUsers) {
        try {
            await prisma.contact.upsert({
                where: { email: user.email.toLowerCase() },
                update: {},
                create: {
                    email: user.email.toLowerCase(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    clientType: 'INTERNAL',
                    status: 'Active'
                }
            });
        } catch (e) {
            console.error(`❌ Failed ensuring contact entry for user ${user.email}:`, e.message);
        }
    }

    // 2. Users
    console.log(`Migrating ${rawUsers.length} users...`);
    for (const user of rawUsers) {
        try {
            await prisma.user.upsert({
                where: { email: user.email.toLowerCase() },
                update: {},
                create: {
                    ...user,
                    email: user.email.toLowerCase(),
                    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
                    updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating user ${user.email}:`, e.message);
        }
    }

    // 3. Services
    const services = await getRows('Service');
    console.log(`Migrating ${services.length} services...`);
    for (const service of services) {
        try {
            await prisma.service.upsert({
                where: { id: service.id },
                update: {},
                create: {
                    ...service,
                    active: service.active === 1 || service.active === true,
                    createdAt: service.createdAt ? new Date(service.createdAt) : new Date(),
                    updatedAt: service.updatedAt ? new Date(service.updatedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating service ${service.id}:`, e.message);
        }
    }

    // 4. CustomPricing
    const customPricings = await getRows('CustomPricing');
    console.log(`Migrating ${customPricings.length} custom pricings...`);
    for (const cp of customPricings) {
        try {
            await prisma.customPricing.upsert({
                where: { id: cp.id },
                update: {},
                create: {
                    ...cp,
                    effectiveDate: cp.effectiveDate ? new Date(cp.effectiveDate) : new Date(),
                    createdAt: cp.createdAt ? new Date(cp.createdAt) : new Date(),
                    updatedAt: cp.updatedAt ? new Date(cp.updatedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating custom pricing ${cp.id}:`, e.message);
        }
    }

    // 5. Bookings
    const bookings = await getRows('Booking');
    console.log(`Migrating ${bookings.length} bookings...`);
    for (const b of bookings) {
        try {
            await prisma.booking.upsert({
                where: { id: b.id },
                update: {},
                create: {
                    ...b,
                    isMarketplace: b.isMarketplace === 1 || b.isMarketplace === true,
                    bookingDate: new Date(b.bookingDate),
                    cancellationDeadline: b.cancellationDeadline ? new Date(b.cancellationDeadline) : null,
                    confirmedAt: b.confirmedAt ? new Date(b.confirmedAt) : null,
                    createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
                    updatedAt: b.updatedAt ? new Date(b.updatedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating booking ${b.id}:`, e.message);
        }
    }

    // 6. ClientConfirmation
    const confirmations = await getRows('ClientConfirmation');
    console.log(`Migrating ${confirmations.length} confirmations...`);
    for (const c of confirmations) {
        try {
            await prisma.clientConfirmation.upsert({
                where: { id: c.id },
                update: {},
                create: {
                    ...c,
                    confirmedScheduling: c.confirmedScheduling === 1 || c.confirmedScheduling === true,
                    confirmedCancellation: c.confirmedCancellation === 1 || c.confirmedCancellation === true,
                    confirmedFinancial: c.confirmedFinancial === 1 || c.confirmedFinancial === true,
                    confirmedAt: c.confirmedAt ? new Date(c.confirmedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating confirmation ${c.id}:`, e.message);
        }
    }

    // 7. Invoices
    const invoices = await getRows('Invoice');
    console.log(`Migrating ${invoices.length} invoices...`);
    for (const inv of invoices) {
        try {
            await prisma.invoice.upsert({
                where: { id: inv.id },
                update: {},
                create: {
                    ...inv,
                    invoiceDate: inv.invoiceDate ? new Date(inv.invoiceDate) : new Date(),
                    dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
                    paidAt: inv.paidAt ? new Date(inv.paidAt) : null
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating invoice ${inv.id}:`, e.message);
        }
    }

    // 8. Bids
    const bids = await getRows('Bid');
    console.log(`Migrating ${bids.length} bids...`);
    for (const bid of bids) {
        try {
            await prisma.bid.upsert({
                where: { id: bid.id },
                update: {},
                create: {
                    ...bid,
                    isAccepted: bid.isAccepted === 1 || bid.isAccepted === true,
                    createdAt: bid.createdAt ? new Date(bid.createdAt) : new Date(),
                    updatedAt: bid.updatedAt ? new Date(bid.updatedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating bid ${bid.id}:`, e.message);
        }
    }

    // 9. Messages
    const messages = await getRows('Message');
    console.log(`Migrating ${messages.length} messages...`);
    for (const msg of messages) {
        try {
            await prisma.message.upsert({
                where: { id: msg.id },
                update: {},
                create: {
                    ...msg,
                    isRead: msg.isRead === 1 || msg.isRead === true,
                    createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating message ${msg.id}:`, e.message);
        }
    }

    // 10. Tasks
    const tasks = await getRows('Task');
    console.log(`Migrating ${tasks.length} tasks...`);
    for (const task of tasks) {
        try {
            await prisma.task.upsert({
                where: { id: task.id },
                update: {},
                create: {
                    ...task,
                    deadline: task.deadline ? new Date(task.deadline) : null,
                    completedAt: task.completedAt ? new Date(task.completedAt) : null,
                    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
                    updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date()
                }
            });
        } catch (e) {
            console.error(`❌ Failed migrating task ${task.id}:`, e.message);
        }
    }

    console.log('--- Migration Complete ---');
    sqliteDb.close();
    await prisma.$disconnect();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
