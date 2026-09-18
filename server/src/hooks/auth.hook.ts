import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../shared/app-error.js";

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


