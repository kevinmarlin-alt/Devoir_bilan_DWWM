import { describe, expect, it } from "vitest";
import { findUserByEmail } from "../../../src/repositories/user.repository.js";

describe('User repositories', () => {

    it('retourne un utilisateur si l\'adresse e-mail est correct', async () => {
        const response = await findUserByEmail('alice.martin@harmonie.test');

        expect(response).toHaveProperty("userAccountId")
        expect(response.userAccountId).toBeTypeOf('number')

        expect(response).toHaveProperty("email")
        expect(response.email).toBeTypeOf('string')

        expect(response).toHaveProperty("passwordHash")
        expect(response.passwordHash).toBeTypeOf('string')
        
        expect(response).toHaveProperty("isActive")
        expect(response.isActive).toBeTypeOf('boolean')

    })
})