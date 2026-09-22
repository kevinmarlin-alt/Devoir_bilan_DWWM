import pool from "../database/database.js"

export const findUserByEmail = async (email) => {
    const response = await pool.query(
        `SELECT 
            user_account_id,
            email,
            password_hash,
            is_active
        FROM user_account 
        WHERE email = $1`
        , [email]
    )

    if(response.rows.length === 0) {
        return null
    }

    const user = response.rows[0];

    return {
        userAccountId: user.user_account_id,
        email: user.email,
        passwordHash: user.password_hash,
        isActive: user.is_active
    }

}

export default {
    findUserByEmail
}