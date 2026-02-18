import { generateToken } from '../lib/auth'

const token = generateToken({
    userId: 'cmlpgrg7o000011ciw3y2n1th',
    id: 'cmlpgrg7o000011ciw3y2n1th',
    email: 'admin@marinadubson.com',
    role: 'ADMIN',
    firstName: 'Marina'
})

console.log(token)
