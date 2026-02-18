const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // 1. Create Contact first (User depends on it via email)
    const adminContact = await prisma.contact.upsert({
        where: { email: 'admin@marinadubson.com' },
        update: {},
        create: {
            firstName: 'Marina',
            lastName: 'Dubson',
            email: 'admin@marinadubson.com',
            companyName: 'Marina Dubson Stenographic Services',
            phone: '555-0100',
            notes: 'System Admin Contact',
            clientType: 'LAW_FIRM'
        },
    });
    console.log('Admin contact created:', adminContact.email);

    // 2. Create Admin User
    const hashedPassword = await bcrypt.hash('SecurePassword123!', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@marinadubson.com' },
        update: {},
        create: {
            email: 'admin@marinadubson.com',
            password: hashedPassword,
            firstName: 'Marina',
            lastName: 'Dubson',
            role: 'ADMIN',
        },
    });
    console.log('Admin user created:', admin.email);

    // 3. Seed Services
    const services = [
        {
            serviceName: 'Premium Court Reporting',
            category: 'COURT_REPORTING',
            subService: 'DEPOSITIONS',
            defaultMinimumFee: 500,
            pageRate: 5.5,
            appearanceFeeRemote: 350,
            appearanceFeeInPerson: 400,
            realtimeFee: 2.0,
            expediteImmediate: 2.0,
            expedite1Day: 1.75,
            expedite2Day: 1.5,
            expedite3Day: 1.25,
            active: true,
        },
        {
            serviceName: 'Technical Deposition Node',
            category: 'COURT_REPORTING',
            subService: 'EXPERT_TESTIMONY',
            defaultMinimumFee: 600,
            pageRate: 6.0,
            appearanceFeeRemote: 400,
            appearanceFeeInPerson: 450,
            realtimeFee: 2.5,
            expediteImmediate: 2.5,
            expedite1Day: 2.0,
            expedite2Day: 1.75,
            expedite3Day: 1.5,
            active: true,
        }
    ];

    for (const s of services) {
        const res = await prisma.service.upsert({
            where: { id: 'seed-' + s.subService.toLowerCase() },
            update: {},
            create: {
                id: 'seed-' + s.subService.toLowerCase(),
                ...s
            }
        });
        console.log('Service created:', res.serviceName);
    }

    // 4. Seed some initial contacts/clients
    const contact = await prisma.contact.upsert({
        where: { email: 'client@example.com' },
        update: {},
        create: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'client@example.com',
            companyName: 'Elite Law Firm',
            phone: '555-0199',
            notes: 'High priority client',
            clientType: 'LAW_FIRM'
        }
    });
    console.log('Example contact created:', contact.email);

    console.log('Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
