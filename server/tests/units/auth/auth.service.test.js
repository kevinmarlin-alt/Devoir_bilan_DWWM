import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { authenticateUser } from '../../../src/services/auth.service.js';
import { findUserByEmail } from '../../../src/repositories/user.repository.js';


vi.mock('../../../src/repositories/user.repository.js', () => ({
    findUserByEmail: vi.fn()
}));


vi.mock('bcrypt', () => ({
    default: {
        compare: vi.fn()
    }
}));

describe('authenticateUser', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("refuse l'authentification si l'utilisateur n'existe pas", async () => {

        findUserByEmail.mockResolvedValue(null);

        await expect(
            authenticateUser(
                'inconnu@harmonie.test',
                'password'
            )
        ).rejects.toThrow('Identifiants incorrects');

    });

    it("refuse l'authentification si l'utilisateur est inactif", async () => {

        findUserByEmail.mockResolvedValue({
            userAccountId: 1,
            email: "inconnu@harmonie.test",
            passwordHash: "5xtcFcjs....",
            isActive: false

        });

        await expect(
            authenticateUser(
                'inconnu@harmonie.test',
                'password'
            )
        ).rejects.toThrow('Identifiants incorrects');

    });

    it("refuse l'authentification si le mot de passe est incorrect", async () => {

        findUserByEmail.mockResolvedValue({
            userAccountId: 1,
            email: "inconnu@harmonie.test",
            passwordHash: "5xtcFcjs....",
            isActive: true

        });

        bcrypt.compare.mockResolvedValue(false);

        await expect(
            authenticateUser(
                'inconnu@harmonie.test',
                'password'
            )
        ).rejects.toThrow('Identifiants incorrects');

         expect(bcrypt.compare).toHaveBeenCalledWith(
            'password',
            '5xtcFcjs....'
        );

    });

    it("confirme l'authentification et retourne les informations utiles de l'utilisateur", async () => {

        findUserByEmail.mockResolvedValue({
            userAccountId: 1,
            email: "inconnu@harmonie.test",
            passwordHash: "5xtcFcjs....",
            isActive: true

        });

        bcrypt.compare.mockResolvedValue(true);

        expect(
            await authenticateUser(
                'inconnu@harmonie.test',
                'password'
            )
        ).toEqual({
            userAccountId: 1,
            email: 'inconnu@harmonie.test',
            isActive: true
        })

    });
});