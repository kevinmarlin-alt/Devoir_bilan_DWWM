import { findUserByEmail }  from "../repositories/user.repository.js"
import { AppError } from "../shared/app-error.js";
import bcrypt from "bcrypt";

export const userLogin = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail)

    if(!user || !user.is_active) {
        throw new AppError(
            "Identifiants incorrect",
            401,
            "INVALID_CREDENTIALS"
        );
    }
    
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if(!passwordMatches) {
        throw new AppError(
            "Identifiants incorrect",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    const roles = user.user_account_app_role.map(({ app_role }) => app_role.name)

    if(roles.length === 0) {
        throw new AppError(
            "Aucun rôle applicatif n'est associé à ce compte",
            403,
            "NO_APPLICATION_ROLE"
        )
    }

    return {
        userAccountId: user.user_account_id,
        email: user.email,
        roles
    };
};

export default {
    userLogin
}