import pool from "../database/database.js"

export const findUserByEmail = async (email) => {
    const response = await pool.query(
        `
            SELECT * FROM user_account 
            WHERE email = $1
        `, [email]
    )

    if(response.rows.length === 0) {
        return null
    }

    return {
        userAccountId: response.rows[0].user_account_id,
        fisrtname: response.rows[0].first_name,
        lastname: response.rows[0].last_name,
        email: response.rows[0].email,
        passwordHash: response.rows[0].password_hash,
        isActive: response.rows[0].is_active
    }

}

export default {
    findUserByEmail
}