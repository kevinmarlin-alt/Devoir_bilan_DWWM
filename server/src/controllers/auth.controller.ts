import type { FastifyReply, FastifyRequest } from "fastify";
import userService from "../services/user.service.js";

type AuthLoginRequest = FastifyRequest<{ 
    Body: { 
        email: string, 
        password: string 
    } 
}>

const handleLogin = async (request: AuthLoginRequest, reply: FastifyReply) => {
    const { email, password } = request.body;
    const user = await userService.userLogin(email, password);

    const token = await reply.jwtSign({
        userAccountId: user.userAccountId,
        email: user.email,
        roles: user.roles
    }, {
        expiresIn: '8h'
    });

    reply.setCookie(
        "hd_token",
        token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 8 * 60 * 60
        } 
    )

    reply.status(200).send({
        user
    })
};

export default {
    handleLogin
}; 
