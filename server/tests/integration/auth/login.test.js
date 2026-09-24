import { afterAll, describe, expect, it } from 'vitest';
import createApp from '../../../src/app.js';
import request from 'supertest';
import pool from '../../../src/database/database.js';

const app = createApp();

afterAll(async () => {
    await pool.end();
})

describe('POST /api/auth/login', () => {
  it('doit valider l\'utilisateur en BDD et transmettre le cookie natif res.cookie() avec Max-Age et SameSite', async () => {
    // 1. Envoyer la requête de connexion via le formulaire
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@harmonie.test', password: 'Password123!' })

    // 2. Vérifications de la réponse HTTP
    expect(response.status).toBe(200)
    expect(response.headers['set-cookie']).toBeDefined()

    expect(response.body.user).toEqual({
        userAccountId: expect.any(Number),
        email: 'admin@harmonie.test',
        roles: ['admin']
    })

    // 3. Extraction du cookie généré par res.cookie()
    const cookies = response.headers['set-cookie'];
    const sessionCookie = cookies.find(cookie => cookie.startsWith('hd_token='))

    expect(sessionCookie).toBeDefined()

    // 4. Validation précise des directives et des valeurs exigées
    expect(sessionCookie).toMatch(/Max-Age=28800/)
    expect(sessionCookie).toMatch(/SameSite=Strict/i)
    expect(sessionCookie).toContain('HttpOnly')
  })
});