import { findUserByEmail } from '../repositories/user.repository.js'
import bcrypt from 'bcrypt'
const authentificateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if(!user) {
        throw new Error(
            'Identifiants incorrect'
        )
    }

    const isActived = user.isActive;

    if(!isActived) {
        throw new Error(
            'Le compte utilisateur n\'est plus actif'
        )
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if(!passwordMatch) {
        throw new Error(
            'Identifiants incorrect'
        )
    }
    
    return user;

}

export default {
    authentificateUser
}