import '@fastify/jwt';

import type { AuthUser } from './auth.type.ts';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        playload: AuthUser;
        user: AuthUser;
    }
}