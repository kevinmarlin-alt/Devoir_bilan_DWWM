import fastify, { type FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { authenticate, authorize } from '../../../src/hooks/auth.hook.js';
import { registrerErrorHandler } from '../../../src/shared/error-handler.js';
import type { Role } from '../../../src/types/auth.type.js';

describe('Authorization', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = fastify();

        await app.register(fastifyCookie);

        await app.register(fastifyJwt, {
            secret: 'test-jwt-secret',
            cookie: {
                cookieName: 'hd_token',
                signed: false
            }
        });

        registrerErrorHandler(app);

        app.get('/protected',
            {
                preHandler: [
                    authenticate,
                    authorize('admin')
                ]
            },
            async () => {
                return {
                    message: 'Accès autorisé'
                };
            }
        );

        app.get('/management',
            {
                preHandler: [
                    authenticate,
                    authorize(
                        'coordinator',
                        'sector_manager'
                    )
                ]
            },
            async () => {
                return {
                    message: 'Accès management autorisé'
                };
            }
        );

        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    function createAuthCookie(roles: Role[]) {
        const token = app.jwt.sign({
            userAccountId: 1,
            email: 'test@harmonie.test',
            roles
        });

        return `hd_token=${token}`;
    }

    it('retourne 401 si aucun utilisateur n’est authentifié', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/protected'
        });

        expect(response.statusCode).toBe(401);

        expect(response.json()).toMatchObject({
            code: 'UNAUTHORIZED'
        });
    });

    it('retourne 403 si le rôle utilisateur n’est pas autorisé', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/protected',
            headers: {
                cookie: createAuthCookie(['employee'])
            }
        });

        expect(response.statusCode).toBe(403);

        expect(response.json()).toMatchObject({
            code: 'FORBIDDEN'
        });
    });

    it('retourne 200 si le rôle utilisateur est autorisé', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/protected',
            headers: {
                cookie: createAuthCookie(['admin'])
            }
        });

        expect(response.statusCode).toBe(200);

        expect(response.json()).toEqual({
            message: 'Accès autorisé'
        });
    });

    it('retourne 403 si aucun des rôles utilisateur n’est autorisé', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/protected',
            headers: {
                cookie: createAuthCookie([
                    'coordinator',
                    'sector_manager'
                ])
            }
        });

        expect(response.statusCode).toBe(403);
    });

    it('autorise un utilisateur multi-rôles si au moins un rôle correspond', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/management',
            headers: {
                cookie: createAuthCookie([
                    'employee',
                    'coordinator'
                ])
            }
        });

        expect(response.statusCode).toBe(200);

        expect(response.json()).toEqual({
            message: 'Accès management autorisé'
        });
    });
});