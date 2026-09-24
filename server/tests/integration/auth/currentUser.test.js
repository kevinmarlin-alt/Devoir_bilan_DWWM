import { describe, expect, it } from 'vitest';
import createApp from '../../../src/app.js';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';


const app = createApp();

app.use(cookieParser());


describe('GET /api/auth/user', () => {
    it('retourne un status 401 si l\'utilisateur n\'est pas authentifié', async () => {
        const response = await request(app).get('/api/auth/user');

        expect(response.status).toBe(401)
    })

    it('retourne un status 401 si le token est invalide', async () => {

        const response = await request(app)
            .get('/api/auth/user')
            .set('Cookie', 'hd_token=jeton_invalide');

        expect(response.status).toBe(401)
    })

    it('retourne le status 200 si token valide', async () => {
        const user = {
            email: 'admin@harmonie.test',
            roles: ['admin']
        }
        const token = jwt.sign(user, process.env.JWT_SECRET)

        const response = await request(app)
            .get('/api/auth/user')
            .set('Cookie', `hd_token=${token}`);

        expect(response.status).toBe(200)
        expect(response.body.user).toMatchObject(user)
    })


})