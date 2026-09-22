import pg from 'pg'
const { Pool } = pg

const connectionString = process.env.DATABASE_URL;

if(!connectionString) {
    throw new Error(
        "L'URL de connexion à la base de donnée est manquante."
    )
}

const pool = new Pool({
        connectionString
    });

export default pool;

