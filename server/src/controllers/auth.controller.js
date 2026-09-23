import { authenticateUser } from "../services/auth.service.js";
import { createAuthToken } from "../services/token.service.js";

export const handleLogin = async (req, res, next) => {
    
    try {
        const { email, password } = req.body;

        const user = await authenticateUser(email, password);

        const token = createAuthToken(user);

        res.cookie('hd_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 8 * 60 * 60 * 1000
        })

        res.status(200).json({ user })

    } catch (error) {
        next(error)
    }
};

export default {
    handleLogin
}