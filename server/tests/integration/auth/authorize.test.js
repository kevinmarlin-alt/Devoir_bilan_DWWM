import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
    authenticate,
    authorize
} from '../../../src/middlewares/auth.middleware.js';
import { errorHandler } from '../../../src/shared/error-handler.js';

const JWT_SECRET = 'integration-test-jwt-secret';
const originalJwtSecret = process.env.JWT_SECRET;

const app = express();

app.use(cookieParser());

app.get(
    '/admin',
    authenticate,
    authorize('admin'),
    (req, res) => {
        res.status(200).json({ message: 'Accès administrateur autorisé' });
    }
);

app.get(
    '/management',
    authenticate,
    authorize('coordinator', 'sector_manager'),
    (req, res) => {
        res.status(200).json({ message: 'Accès management autorisé' });
    }
);

app.use(errorHandler);

const createAuthCookie = (roles) => {
    const token = jwt.sign(
        {
            userAccountId: 1,
            email: 'test@harmonie.test',
            roles
        },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    return `hd_token=${token}`;
};

describe('middleware authorize', () => {
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

    it('retourne 401 lorsque l’utilisateur n’est pas authentifié', async () => {
        const response = await request(app).get('/admin');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentification requise'
            }
        });
    });

    it('retourne 403 lorsque le rôle utilisateur n’est pas autorisé', async () => {
        const response = await request(app)
            .get('/admin')
            .set('Cookie', createAuthCookie(['employee']));

        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            error: {
                code: 'FORBIDDEN',
                message: 'Accès interdit'
            }
        });
    });

    it('autorise l’accès lorsque le rôle utilisateur correspond', async () => {
        const response = await request(app)
            .get('/admin')
            .set('Cookie', createAuthCookie(['admin']));

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Accès administrateur autorisé'
        });
    });

    it('retourne 403 lorsqu’aucun des rôles utilisateur n’est autorisé', async () => {
        const response = await request(app)
            .get('/admin')
            .set('Cookie', createAuthCookie([
                'coordinator',
                'sector_manager'
            ]));

        expect(response.status).toBe(403);
        expect(response.body.error).toEqual({
            code: 'FORBIDDEN',
            message: 'Accès interdit'
        });
    });

    it('autorise un utilisateur multi-rôles si au moins un rôle correspond', async () => {
        const response = await request(app)
            .get('/management')
            .set('Cookie', createAuthCookie([
                'employee',
                'coordinator'
            ]));

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Accès management autorisé'
        });
    });
});
