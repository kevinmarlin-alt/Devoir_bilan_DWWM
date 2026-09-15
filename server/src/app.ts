import fastify from "fastify";
import { prisma } from "./plugings/prisma.plugin.js";

export function buildApp() {
    const app = fastify({
        logger: true
    });

    app.get('/health', async () => {
        return {
            status: 'ok'
        };
    });

    app.get('/health/database', async () => {
        await prisma.$queryRaw`SELECT 1`;

        return {
            status: 'ok',
            database: 'connected'
        }
    })

    return app;
}