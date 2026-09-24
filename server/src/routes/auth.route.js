import { Router } from "express";
import { handleLogin, handleCurrentUser, handleLogout } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/login', handleLogin);
authRouter.get('/user', authenticate, handleCurrentUser);
authRouter.post('/logout', handleLogout);

export default authRouter;