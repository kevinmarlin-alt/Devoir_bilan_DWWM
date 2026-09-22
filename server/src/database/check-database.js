import pool from "./database.js";

try {
    const res = await pool.query('SELECT NOW() AS current_time;');

    console.log(res.rows);

    
} catch (error) {
    console.error(error)
    
} finally {
    await pool.end()
}