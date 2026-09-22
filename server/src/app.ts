import fastify, { type FastifyServerOptions } from "fastify";
import authRouter from "./routes/auth.route.js";
import { registrerErrorHandler } from "./shared/error-handler.js";
import fastifyJwt from "@fastify/jwt"
import cors from '@fastify/cors'


import { prisma } from "./plugings/prisma.plugin.js";
import { AppError } from "./shared/app-error.js";
import fastifyCookie from "@fastify/cookie";

const App = (option: FastifyServerOptions) => {
    const app = fastify(option);

    const jwtSecret = process.env.JWT_SECRET;

    if(!jwtSecret) {
        throw new Error("La variable d'environnement JWT_SECRET est obligatoire");
    }
    // PLugins de sécurité & authentification
    app.register(cors, {
        origin: 'http://localhost:5173',
        credentials: true
    })
    app.register(fastifyCookie)
    app.register(fastifyJwt, { 
        secret: jwtSecret,
        cookie: {
            cookieName: "hd_token",
            signed: false
        } 
    });

    // Routes
    app.register(authRouter, { prefix: "/api/auth"});

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