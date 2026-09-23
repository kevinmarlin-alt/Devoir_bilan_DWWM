import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const hd_token = req.cookies.hd_token;

    if(!hd_token) {
        return res.status(401).send({
            message: 'Echec de l\'authentification'
        })
    }

    try {
        const decodedToken = jwt.verify(
            hd_token, 
            process.env.JWT_SECRET
        );

        req.user = decodedToken;

        next();

        
    } catch (error) {
        next(error);
    }
};