import 'dotenv/config';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_ADMIN_URL;

if (!connectionString) {
    throw new Error(
        "La variable DATABASE_ADMIN_URL est obligatoire"
    );
}

const pool = new Pool({
    connectionString
});

const sqlFilePath = process.argv[2];

if (!sqlFilePath) {
    throw new Error(
        'Le chemin du fichier SQL est obligatoire'
    );
}

const absolutePath = path.resolve(
    process.cwd(),
    sqlFilePath
);

const client = await pool.connect();

try {
    const sql = await readFile(
        absolutePath,
        'utf-8'
    );

    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log(`SQL exécuté : ${sqlFilePath}`);

} catch (error) {
    await client.query('ROLLBACK');

    console.error(
        `Erreur pendant l'exécution de ${sqlFilePath}`
    );

    console.error(error);

    process.exitCode = 1;

} finally {
    client.release();
    await pool.end();
}