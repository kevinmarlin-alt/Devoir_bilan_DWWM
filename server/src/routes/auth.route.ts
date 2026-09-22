import type { FastifyInstance } from "fastify";
import authController from "../controllers/auth.controller.js"
import { authenticate, authorize } from "../hooks/auth.hook.js"

const loginSchema = {
    body: {
        type: "object",
        additionalProperties: false,
        required: ["email", "password"],
        properties: {
            email: {
                type: "string",
                minLength: 3,
                maxLength: 255
            },
            password: {
                type: "string",
                minLength: 1,
                maxLength: 255
            }
        }
    }
}

const authRouter = async (app: FastifyInstance) => {
    app.post("/login", { schema: loginSchema }, authController.handleLogin)
    app.post("/logout", authController.handleLogout)
    app.get('/user', 
        { 
            preHandler: [authenticate] 
        }, authController.handleConnectedUser
    )
};




export default authRouter;