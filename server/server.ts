import type { FastifyInstance, FastifyServerOptions } from "fastify";
import App from "./src/app.js";

const option: FastifyServerOptions = {
    logger: true
}

// Application
const app: FastifyInstance = App(option);

// Server
const port = Number(process.env.PORT ?? 3000);

try {
    await app.listen({
        port
    });

    app.log.info(`server listening on ${port}`)
} catch (error) {
    app.log.error(error);
    process.exit(1);
}