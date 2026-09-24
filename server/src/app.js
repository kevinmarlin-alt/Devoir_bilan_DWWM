import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRouter from './routes/auth.route.js';
import { errorHandler } from './shared/error-handler.js';
import pool from './database/database.js';

const createApp = () => {

    const app = express();

    app.use(cookieParser());
    
    app.use(express.json());

    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }))

    app.use('/api/auth', authRouter);
    
    app.get('/health', (req, res) => {
        res.status(200).send({
            status: "ok"
        })
    })

    app.get('/health/database', async (req, res) => {
        try {
            await pool.query('SELECT 1')
            
            res.status(200).send({
                status: "ok",
                database: "connected"
            })
        } catch (error) {
            next(error)
        }
    })

    app.use(errorHandler);

    return app;

};

export default createApp;