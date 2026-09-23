import pool from "../database/database.js"

export const findUserByEmail = async (email) => {
    const { rows } = await pool.query(
        `SELECT 
            user_account_id,
            email,
            password_hash,
            is_active
        FROM user_account 
        WHERE email = $1`
        , [email]
    )

    if(rows.length === 0) {
        return null
    }

    const user = rows[0];

    return {
        userAccountId: user.user_account_id,
        email: user.email,
        passwordHash: user.password_hash,
        isActive: user.is_active
    }

}

export const findRolesByUserId = async (userAccountId) => {
    const { rows } = await pool.query(
        `
        SELECT app_role.name FROM user_account_app_role
        INNER JOIN app_role
        ON user_account_app_role.app_role_id = app_role.app_role_id
        WHERE user_account_app_role.user_account_id = $1`
        , [userAccountId]
    )

    if(rows.length === 0) {
        return [];
    }

    const roles = rows.map((row) => row.name)

    return roles
};



export default {
    findUserByEmail,
    findRolesByUserId
}