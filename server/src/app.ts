import fastify, { type FastifyServerOptions } from "fastify";
import { prisma } from "./plugings/prisma.plugin.js";
import { registrerErrorHandler } from "./shared/error-handler.js";
import { AppError } from "./shared/app-error.js";

const App = (option: FastifyServerOptions) => {
    const app = fastify(option);

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

    app.get("/test-error", async () => {
        throw new AppError(
            "Erreur de test",
            409,
            "TEST_ERROR"
        );
    });

    registrerErrorHandler(app);

    return app;
}

export default App;