import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { findUserByEmail, findRolesByUserId } from "../../../src/repositories/user.repository.js";
import pool from "../../../src/database/database.js";

afterAll(async () => {
    await pool.end()
})

describe('User repositories', () => {

    it('retourne un utilisateur si l\'adresse e-mail est correcte', async () => {
        const response = await findUserByEmail('alice.martin@harmonie.test');

        expect(response).toHaveProperty("userAccountId")
        expect(response.userAccountId).toBeTypeOf('number')

        expect(response).toHaveProperty("email")
        expect(response.email).toBeTypeOf('string')

        expect(response).toHaveProperty("passwordHash")
        expect(response.passwordHash).toBeTypeOf('string')

        expect(response).toHaveProperty("isActive")
        expect(response.isActive).toBeTypeOf('boolean')

    });

    it('retourne null si l\'adresse email est incorrecte', async () => {
        const response = await findUserByEmail('unknow@harmonie.test');

        expect(response).toBeNull();
    })
})

describe('User roles', () => {

    it('retourne la liste du ou des roles d\'un utilisateur', async () => {
        const roles = await findRolesByUserId(5);
        
        expect(roles).toHaveLength(2);
        expect(roles).toEqual(
            expect.arrayContaining([
                'sector_manager',
                'coordinator'
            ])
        )
    })

    it('retourne un tableau vide si l\identifiant est inconnu', async () => {
        const roles = await findRolesByUserId(9999999);
        expect(roles).toEqual([]);
    })
})