import { authenticateUser } from "../services/auth.service.js";

export const handleLogin = async (req, res, next) => {
    
    try {
        const { email, password } = req.body;
        
        const user = await authenticateUser(email, password);

        res.status(200).json({ user })

    } catch (error) {
        next(error)
    }
};

export default {
    handleLogin
}