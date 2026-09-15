BEGIN;

-- =========================================================
-- Harmonie Domicile
-- Seed 02 - Utilisateurs et intervenants
-- =========================================================

-- =========================================================
-- USER ACCOUNTS
-- =========================================================
-- Les valeurs password_hash sont temporaires.
-- Elles seront remplacées par de vrais hashes lors de la mise en place
-- de l'authentification du backend.

INSERT INTO user_account (
    first_name,
    last_name,
    email,
    password_hash
)
VALUES
    ('Alice', 'Martin', 'alice.martin@harmonie.test', 'DEV_HASH_TO_REPLACE'),
    ('Karim', 'Benali', 'karim.benali@harmonie.test', 'DEV_HASH_TO_REPLACE'),
    ('Léa', 'Moreau', 'lea.moreau@harmonie.test', 'DEV_HASH_TO_REPLACE'),
    ('Claire', 'Dubois', 'claire.dubois@harmonie.test', 'DEV_HASH_TO_REPLACE'),
    ('Sophie', 'Laurent', 'sophie.laurent@harmonie.test', 'DEV_HASH_TO_REPLACE'),
    ('Alex', 'Admin', 'admin@harmonie.test', 'DEV_HASH_TO_REPLACE')
ON CONFLICT (email) DO NOTHING;


-- =========================================================
-- APPLICATION ROLE ASSIGNMENTS
-- =========================================================
-- Sophie cumule les rôles sector_manager + coordinator
-- afin de tester la gestion multi-rôles.

INSERT INTO user_account_app_role (
    user_account_id,
    app_role_id
)
SELECT
    u.user_account_id,
    r.app_role_id
FROM (
    VALUES
        ('alice.martin@harmonie.test', 'employee'),
        ('karim.benali@harmonie.test', 'employee'),
        ('lea.moreau@harmonie.test', 'employee'),
        ('claire.dubois@harmonie.test', 'coordinator'),
        ('sophie.laurent@harmonie.test', 'sector_manager'),
        ('sophie.laurent@harmonie.test', 'coordinator'),
        ('admin@harmonie.test', 'admin')
) AS roles(email, role_name)
JOIN user_account u
    ON u.email = roles.email
JOIN app_role r
    ON r.name = roles.role_name
ON CONFLICT DO NOTHING;


-- =========================================================
-- EMPLOYEES
-- =========================================================

INSERT INTO employee (user_account_id)
SELECT user_account_id
FROM user_account
WHERE email IN (
    'alice.martin@harmonie.test',
    'karim.benali@harmonie.test',
    'lea.moreau@harmonie.test'
)
ON CONFLICT (user_account_id) DO NOTHING;


-- =========================================================
-- CONTRACTS
-- =========================================================

INSERT INTO contract (
    type,
    start_date,
    weekly_reference_minutes,
    employee_id
)
SELECT
    'CDI',
    DATE '2026-01-01',
    2100,
    e.employee_id
FROM employee e
JOIN user_account u
    ON u.user_account_id = e.user_account_id
WHERE u.email = 'alice.martin@harmonie.test'
  AND NOT EXISTS (
      SELECT 1
      FROM contract c
      WHERE c.employee_id = e.employee_id
        AND c.start_date = DATE '2026-01-01'
  );

INSERT INTO contract (
    type,
    start_date,
    weekly_reference_minutes,
    employee_id
)
SELECT
    'CDI',
    DATE '2026-03-01',
    1680,
    e.employee_id
FROM employee e
JOIN user_account u
    ON u.user_account_id = e.user_account_id
WHERE u.email = 'karim.benali@harmonie.test'
  AND NOT EXISTS (
      SELECT 1
      FROM contract c
      WHERE c.employee_id = e.employee_id
        AND c.start_date = DATE '2026-03-01'
  );

INSERT INTO contract (
    type,
    start_date,
    weekly_reference_minutes,
    employee_id
)
SELECT
    'CDI',
    DATE '2026-02-01',
    2100,
    e.employee_id
FROM employee e
JOIN user_account u
    ON u.user_account_id = e.user_account_id
WHERE u.email = 'lea.moreau@harmonie.test'
  AND NOT EXISTS (
      SELECT 1
      FROM contract c
      WHERE c.employee_id = e.employee_id
        AND c.start_date = DATE '2026-02-01'
  );


-- =========================================================
-- EMPLOYEE SKILLS
-- =========================================================

INSERT INTO employee_skill (employee_id, skill_id)
SELECT
    e.employee_id,
    s.skill_id
FROM (
    VALUES
        ('alice.martin@harmonie.test', 'Entretien du logement'),
        ('alice.martin@harmonie.test', 'Préparation des repas'),
        ('karim.benali@harmonie.test', 'Préparation des repas'),
        ('karim.benali@harmonie.test', 'Accompagnement extérieur'),
        ('lea.moreau@harmonie.test', 'Entretien du logement'),
        ('lea.moreau@harmonie.test', 'Accompagnement extérieur')
) AS data(email, skill_name)
JOIN user_account u
    ON u.email = data.email
JOIN employee e
    ON e.user_account_id = u.user_account_id
JOIN skill s
    ON s.name = data.skill_name
ON CONFLICT DO NOTHING;


-- =========================================================
-- EMPLOYEE GEOGRAPHIC AREAS
-- =========================================================

INSERT INTO employee_geographic_area (
    employee_id,
    geographic_area_id
)
SELECT
    e.employee_id,
    ga.geographic_area_id
FROM (
    VALUES
        ('alice.martin@harmonie.test', 'Le Mans Centre'),
        ('alice.martin@harmonie.test', 'Le Mans Nord'),
        ('karim.benali@harmonie.test', 'Le Mans Centre'),
        ('karim.benali@harmonie.test', 'Le Mans Nord'),
        ('lea.moreau@harmonie.test', 'La Ferté-Bernard')
) AS data(email, area_name)
JOIN user_account u
    ON u.email = data.email
JOIN employee e
    ON e.user_account_id = u.user_account_id
JOIN geographic_area ga
    ON ga.name = data.area_name
ON CONFLICT DO NOTHING;

COMMIT;
