BEGIN;

-- =========================================================
-- Harmonie Domicile
-- Seed 04 - Données de planning et scénarios de test
-- =========================================================

-- =========================================================
-- REQUIRED SKILLS
-- =========================================================

-- Jeanne : entretien du logement
INSERT INTO intervention_skill (
    intervention_id,
    skill_id
)
SELECT
    i.intervention_id,
    s.skill_id
FROM intervention i
JOIN location l
    ON l.location_id = i.location_id
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
JOIN skill s
    ON s.name = 'Entretien du logement'
WHERE b.email = 'jeanne.dupont@example.test'
  AND i.start_at = TIMESTAMPTZ '2026-10-05 09:00:00+02'
ON CONFLICT DO NOTHING;

-- Marc : préparation des repas
INSERT INTO intervention_skill (
    intervention_id,
    skill_id
)
SELECT
    i.intervention_id,
    s.skill_id
FROM intervention i
JOIN location l
    ON l.location_id = i.location_id
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
JOIN skill s
    ON s.name = 'Préparation des repas'
WHERE b.email = 'marc.leroy@example.test'
  AND i.start_at = TIMESTAMPTZ '2026-10-05 14:00:00+02'
ON CONFLICT DO NOTHING;

-- Lucie : accompagnement
INSERT INTO intervention_skill (
    intervention_id,
    skill_id
)
SELECT
    i.intervention_id,
    s.skill_id
FROM intervention i
JOIN location l
    ON l.location_id = i.location_id
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
JOIN skill s
    ON s.name = 'Accompagnement extérieur'
WHERE b.email = 'lucie.bernard@example.test'
  AND i.start_at = TIMESTAMPTZ '2026-10-06 10:00:00+02'
ON CONFLICT DO NOTHING;


-- =========================================================
-- UNAVAILABILITY
-- =========================================================
-- Alice est indisponible pendant l'intervention de Marc.
-- Ce scénario servira à tester le blocage métier.

INSERT INTO unavailability (
    start_at,
    end_at,
    reason,
    employee_id
)
SELECT
    TIMESTAMPTZ '2026-10-05 13:30:00+02',
    TIMESTAMPTZ '2026-10-05 16:00:00+02',
    'Indisponibilité urgente',
    e.employee_id
FROM employee e
JOIN user_account u
    ON u.user_account_id = e.user_account_id
WHERE u.email = 'alice.martin@harmonie.test'
  AND NOT EXISTS (
      SELECT 1
      FROM unavailability un
      WHERE un.employee_id = e.employee_id
        AND un.start_at = TIMESTAMPTZ '2026-10-05 13:30:00+02'
  );


-- =========================================================
-- EXISTING ASSIGNMENT
-- =========================================================
-- Alice est affectée à l'intervention de Jeanne.

INSERT INTO assignment (
    employee_id,
    assigned_by_user_account_id,
    intervention_id
)
SELECT
    e.employee_id,
    coordinator.user_account_id,
    i.intervention_id
FROM intervention i
JOIN location l
    ON l.location_id = i.location_id
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
JOIN user_account employee_user
    ON employee_user.email = 'alice.martin@harmonie.test'
JOIN employee e
    ON e.user_account_id = employee_user.user_account_id
JOIN user_account coordinator
    ON coordinator.email = 'claire.dubois@harmonie.test'
WHERE b.email = 'jeanne.dupont@example.test'
  AND i.start_at = TIMESTAMPTZ '2026-10-05 09:00:00+02'
  AND NOT EXISTS (
      SELECT 1
      FROM assignment a
      WHERE a.intervention_id = i.intervention_id
        AND a.end_at IS NULL
  );

-- L'intervention de Jeanne devient planifiée.
UPDATE intervention i
SET status = 'planned'
FROM location l
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
WHERE i.location_id = l.location_id
  AND b.email = 'jeanne.dupont@example.test'
  AND i.start_at = TIMESTAMPTZ '2026-10-05 09:00:00+02';


-- =========================================================
-- CHANGE REQUEST
-- =========================================================

INSERT INTO change_request (
    subject,
    message,
    employee_id
)
SELECT
    'Évolution de ma zone d''intervention',
    'Je souhaiterais pouvoir intervenir également sur un autre secteur.',
    e.employee_id
FROM employee e
JOIN user_account u
    ON u.user_account_id = e.user_account_id
WHERE u.email = 'karim.benali@harmonie.test'
  AND NOT EXISTS (
      SELECT 1
      FROM change_request cr
      WHERE cr.employee_id = e.employee_id
        AND cr.subject = 'Évolution de ma zone d''intervention'
  );

COMMIT;
