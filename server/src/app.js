import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRouter from './routes/auth.route.js';
import { errorHandler } from './shared/error-handler.js';

const createApp = () => {

    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }))

    app.use('/api/auth', authRouter);

    app.use(errorHandler);

    return app;

};

export default createApp;