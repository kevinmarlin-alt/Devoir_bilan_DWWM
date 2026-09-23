import { describe, expect, it, vi } from 'vitest';
import { authenticateUser } from '../../../src/services/auth.service.js';
import { findUserByEmail } from '../../../src/repositories/user.repository.js';

vi.mock('../../../src/repositories/user.repository.js', () => ({
    findUserByEmail: vi.fn()
}));

describe('authenticateUser', () => {

    it("refuse l'authentification si l'utilisateur n'existe pas", async () => {

        findUserByEmail.mockResolvedValue(null);

        await expect(
            authenticateUser(
                'inconnu@harmonie.test',
                'password'
            )
        ).rejects.toThrow('Identifiants incorrects');

    });

});