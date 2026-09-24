import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { authenticate } from '../../../src/middlewares/auth.middleware.js';
import { errorHandler } from '../../../src/shared/error-handler.js';

const JWT_SECRET = 'integration-test-jwt-secret';
const originalJwtSecret = process.env.JWT_SECRET;

const app = express();

app.use(cookieParser());
app.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ user: req.user });
});
app.use(errorHandler);

describe('middleware authenticate', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = JWT_SECRET;
    });

    afterAll(() => {
        if (originalJwtSecret === undefined) {
            delete process.env.JWT_SECRET;
            return;
        }

        process.env.JWT_SECRET = originalJwtSecret;
    });

    it('retourne 401 lorsque le cookie d’authentification est absent', async () => {
        const response = await request(app).get('/protected');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentification requise'
            }
        });
    });

    it('retourne 401 lorsque le jeton est malformé', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Cookie', 'hd_token=jeton-invalide');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentification invalide'
            }
        });
    });

    it('retourne 401 lorsque le jeton est signé avec une autre clé', async () => {
        const token = jwt.sign(
            {
                userAccountId: 1,
                email: 'admin@harmonie.test',
                roles: ['admin']
            },
            'wrong-jwt-secret'
        );

        const response = await request(app)
            .get('/protected')
            .set('Cookie', `hd_token=${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toEqual({
            code: 'UNAUTHORIZED',
            message: 'Authentification invalide'
        });
    });

    it('retourne 401 lorsque le jeton est expiré', async () => {
        const token = jwt.sign(
            {
                userAccountId: 1,
                email: 'admin@harmonie.test',
                roles: ['admin']
            },
            JWT_SECRET,
            { expiresIn: -1 }
        );

        const response = await request(app)
            .get('/protected')
            .set('Cookie', `hd_token=${token}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toEqual({
            code: 'UNAUTHORIZED',
            message: 'Authentification invalide'
        });
    });

    it('autorise la requête et transmet le payload pour un jeton valide', async () => {
        const user = {
            userAccountId: 1,
            email: 'admin@harmonie.test',
            roles: ['admin']
        };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });

        const response = await request(app)
            .get('/protected')
            .set('Cookie', `hd_token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.user).toMatchObject(user);
        expect(response.body.user).toEqual(expect.objectContaining({
            iat: expect.any(Number),
            exp: expect.any(Number)
        }));
    });
});
