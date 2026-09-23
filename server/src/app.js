import express from 'express'
import authRouter from './routes/auth.route.js';

const createApp = () => {

    const app = express();
    
    app.use(express.json())

    app.use('/api/auth', authRouter);
    
    app.get('/health', (req, res) => {
        res.status(200).send({
            status: "ok"
        })
    })

    return app;

};

export default createApp;