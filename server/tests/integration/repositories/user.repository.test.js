import { afterAll, describe, expect, it } from "vitest";
import { findUserByEmail } from "../../../src/repositories/user.repository.js";
import pool from "../../../src/database/database.js";

describe('User repositories', () => {


    afterAll(async () => {
        await pool.end()
    })


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