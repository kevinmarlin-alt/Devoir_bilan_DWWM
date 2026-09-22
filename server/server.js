import createApp from './src/app.js';
import dotenv from 'dotenv';

dotenv.config()

const PORT = Number(process.env.PORT ?? 3010);

const app = createApp();

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})