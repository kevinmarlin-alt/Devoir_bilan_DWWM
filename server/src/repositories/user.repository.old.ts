import { prisma } from "../plugings/prisma.plugin.js";

export const findUserByEmail = async (email: string) => {
    return await prisma.user_account.findUnique({
        where: { email },
        select: {
            user_account_id: true,
            email: true,
            password_hash: true,
            is_active: true,
            user_account_app_role: {
                select: {
                    app_role: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
};

export default {
    findUserByEmail
}

