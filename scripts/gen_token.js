const jwt = require('jsonwebtoken');

const JWT_SECRET = 'dev-secret-key-change-in-production-12345';

const payload = {
    userId: 'debug-admin-id',
    id: 'debug-admin-id',
    email: 'admin@marinadubson.com',
    role: 'ADMIN',
    firstName: 'Debug'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
console.log(token);
