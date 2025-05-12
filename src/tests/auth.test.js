const request = require('supertest');
const app = require('../../src/server');

describe('Auth Endpoints', () => {
    it('deve registrar um novo usuário',async () => {
        const res = await request(app)
        .post('/api/auth/register')
        .send({
            name:'Usuaurio teste',
            email: `user${Date.now()}@test.com`,
            password: '123456'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email');
    });
    if('deve fazer login com usuário existente') async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@example.com',
            password: '123456'
        });
        expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    }
})