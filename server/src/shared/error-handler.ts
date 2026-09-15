import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "./app-error.js";

export function registrerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler(
        (
            error: FastifyError,
            request: FastifyRequest,
            reply: FastifyReply
        ) => {
            if(error instanceof AppError) {
                return reply.status(error.statusCode).send({
                    statusCode: error.statusCode,
                    code: error.code,
                    message: error.message
                });
            }

            if(error.validation) {
                return reply.status(400).send({
                    statusCode: 400,
                    code: "VALIDATION_ERROR",
                    message: "Les données envoyées sont invalides",
                    details: error.validation
                });
            }

            request.log.error(error);

            return reply.status(500).send({
                statusCode: 500,
                code: "INTERNAL_SERVER_ERROR",
                message: "Une erreur interne est survenue"
            }); 
        }
    );
}