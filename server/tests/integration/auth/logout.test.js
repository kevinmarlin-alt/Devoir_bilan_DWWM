import { describe, expect, it } from 'vitest';
import createApp from '../../../src/app';
import cookieParser from 'cookie-parser';
import request from 'supertest';

const app = createApp();

app.use(cookieParser());


describe('POST /api/auth/logout', () => {
    it('retourne status 204 lorsque le cookie est supprimé', async () => {
        const response = await request(app)
            .post('/api/auth/logout');
        console.log(response.headers['set-cookie'])

        const cookies = response.headers['set-cookie'];
        const sessionCookie = cookies.find(cookie => cookie.startsWith('hd_token='))

        expect(sessionCookie).toBeDefined()
        expect(response.status).toBe(204)
    })
})