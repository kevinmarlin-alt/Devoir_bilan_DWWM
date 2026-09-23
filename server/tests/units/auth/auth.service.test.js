import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';

import { authenticateUser } from '../../../src/services/auth.service.js';
import {
    findUserByEmail,
    findRolesByUserId
} from '../../../src/repositories/user.repository.js';


vi.mock('../../../src/repositories/user.repository.js', () => ({
    findUserByEmail: vi.fn(),
    findRolesByUserId: vi.fn()
}));


vi.mock('bcrypt', () => ({
    default: {
        compare: vi.fn()
    }
}));


describe('authenticateUser', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("refuse l'authentification si l'utilisateur n'existe pas", async () => {

        findUserByEmail.mockResolvedValue(null);

        await expect(
            authenticateUser(
                'inconnu@harmonie.test',
                'password'
            )
        ).rejects.toThrow('Identifiants incorrects');

        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(findRolesByUserId).not.toHaveBeenCalled();
    });


    it("refuse l'authentification si l'utilisateur est inactif", async () => {

        findUserByEmail.mockResolvedValue({
            userAccountId: 1,
            email: 'user@harmonie.test',
            passwordHash: 'hash-test',
            isActive: false
        });

        await expect(
            authenticateUser(
                'user@harmonie.test',
                'password'
            )
        ).rejects.toThrow('Identifiants incorrects');

        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(findRolesByUserId).not.toHaveBeenCalled();
    });


    it("refuse l'authentification si le mot de passe est incorrect", async () => {

        findUserByEmail.mockResolvedValue({
            userAccountId: 1,
            email: 'user@harmonie.test',
            passwordHash: 'hash-test',
            isActive: true
        });

        bcrypt.compare.mockResolvedValue(false);

        await expect(
            authenticateUser(
                'user@harmonie.test',
                'password'
            )
        ).rejects.toThrow('Identifiants incorrects');

        expect(bcrypt.compare).toHaveBeenCalledWith(
            'password',
            'hash-test'
        );

        expect(findRolesByUserId).not.toHaveBeenCalled();
    });


    it("refuse l'authentification si aucun rôle n'est associé au compte", async () => {

        findUserByEmail.mockResolvedValue({
            userAccountId: 1,
            email: 'user@harmonie.test',
            passwordHash: 'hash-test',
            isActive: true
        });

        bcrypt.compare.mockResolvedValue(true);

        findRolesByUserId.mockResolvedValue([]);

        await expect(
            authenticateUser(
                'user@harmonie.test',
                'password'
            )
        ).rejects.toThrow();

        expect(findRolesByUserId).toHaveBeenCalledWith(1);
    });


    it("authentifie l'utilisateur et retourne ses rôles", async () => {

        findUserByEmail.mockResolvedValue({
            userAccountId: 1,
            email: 'user@harmonie.test',
            passwordHash: 'hash-test',
            isActive: true
        });

        bcrypt.compare.mockResolvedValue(true);

        findRolesByUserId.mockResolvedValue([
            'employee',
            'coordinator'
        ]);

        const result = await authenticateUser(
            'user@harmonie.test',
            'password'
        );

        expect(result).toEqual({
            userAccountId: 1,
            email: 'user@harmonie.test',
            roles: [
                'employee',
                'coordinator'
            ]
        });

        expect(findUserByEmail).toHaveBeenCalledWith(
            'user@harmonie.test'
        );

        expect(bcrypt.compare).toHaveBeenCalledWith(
            'password',
            'hash-test'
        );

        expect(findRolesByUserId).toHaveBeenCalledWith(1);
    });

});