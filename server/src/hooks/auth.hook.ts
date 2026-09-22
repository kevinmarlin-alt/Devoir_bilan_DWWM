import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../shared/app-error.js";
import type { Role } from "../types/auth.type.js";

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify({ onlyCookie: true });
    } catch (error) {
        throw new AppError(
            "Authentification requise",
            401,
            "UNAUTHORIZED"
        );
    }
};

export const authorize = (...allowedRoles: Role[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const userRoles = request.user.roles;

        const hasAccess = userRoles.some(
            (role) => allowedRoles.includes(role)
        );

        if (!hasAccess) {
            throw new AppError(
                'Accès interdit',
                403,
                'FORBIDDEN'
            );
        }

    };
};


