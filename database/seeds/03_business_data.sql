BEGIN;

-- =========================================================
-- Harmonie Domicile
-- Seed 03 - Données métier
-- =========================================================

-- =========================================================
-- BENEFICIARIES
-- =========================================================

INSERT INTO beneficiary (
    first_name,
    last_name,
    phone,
    email,
    organisation_notes
)
SELECT
    'Jeanne',
    'Dupont',
    '0600000001',
    'jeanne.dupont@example.test',
    'Préfère les interventions le matin'
WHERE NOT EXISTS (
    SELECT 1
    FROM beneficiary
    WHERE email = 'jeanne.dupont@example.test'
);

INSERT INTO beneficiary (
    first_name,
    last_name,
    phone,
    email,
    organisation_notes
)
SELECT
    'Marc',
    'Leroy',
    '0600000002',
    'marc.leroy@example.test',
    'Accès par l''entrée principale'
WHERE NOT EXISTS (
    SELECT 1
    FROM beneficiary
    WHERE email = 'marc.leroy@example.test'
);

INSERT INTO beneficiary (
    first_name,
    last_name,
    phone,
    email,
    organisation_notes
)
SELECT
    'Lucie',
    'Bernard',
    '0600000003',
    'lucie.bernard@example.test',
    NULL
WHERE NOT EXISTS (
    SELECT 1
    FROM beneficiary
    WHERE email = 'lucie.bernard@example.test'
);


-- =========================================================
-- LOCATIONS
-- =========================================================

INSERT INTO location (
    label,
    address_line,
    postal_code,
    city,
    geographic_area_id,
    beneficiary_id
)
SELECT
    'Domicile',
    '12 rue Nationale',
    '72000',
    'Le Mans',
    ga.geographic_area_id,
    b.beneficiary_id
FROM beneficiary b
JOIN geographic_area ga
    ON ga.name = 'Le Mans Centre'
WHERE b.email = 'jeanne.dupont@example.test'
  AND NOT EXISTS (
      SELECT 1
      FROM location l
      WHERE l.beneficiary_id = b.beneficiary_id
        AND l.label = 'Domicile'
  );

INSERT INTO location (
    label,
    address_line,
    postal_code,
    city,
    geographic_area_id,
    beneficiary_id
)
SELECT
    'Domicile',
    '8 avenue des Maillets',
    '72000',
    'Le Mans',
    ga.geographic_area_id,
    b.beneficiary_id
FROM beneficiary b
JOIN geographic_area ga
    ON ga.name = 'Le Mans Nord'
WHERE b.email = 'marc.leroy@example.test'
  AND NOT EXISTS (
      SELECT 1
      FROM location l
      WHERE l.beneficiary_id = b.beneficiary_id
        AND l.label = 'Domicile'
  );

INSERT INTO location (
    label,
    address_line,
    postal_code,
    city,
    geographic_area_id,
    beneficiary_id
)
SELECT
    'Domicile',
    '25 rue Victor-Hugo',
    '72400',
    'La Ferté-Bernard',
    ga.geographic_area_id,
    b.beneficiary_id
FROM beneficiary b
JOIN geographic_area ga
    ON ga.name = 'La Ferté-Bernard'
WHERE b.email = 'lucie.bernard@example.test'
  AND NOT EXISTS (
      SELECT 1
      FROM location l
      WHERE l.beneficiary_id = b.beneficiary_id
        AND l.label = 'Domicile'
  );


-- =========================================================
-- INTERVENTIONS
-- Dates volontairement positionnées début octobre 2026
-- pour laisser le temps au développement du backend.
-- =========================================================

-- Jeanne Dupont : entretien du logement
INSERT INTO intervention (
    start_at,
    estimated_duration_minutes,
    status,
    notes,
    location_id,
    created_by_user_account_id,
    service_type_id
)
SELECT
    TIMESTAMPTZ '2026-10-05 09:00:00+02',
    120,
    'unplanned',
    'Entretien courant du domicile',
    l.location_id,
    creator.user_account_id,
    st.service_type_id
FROM location l
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
JOIN user_account creator
    ON creator.email = 'sophie.laurent@harmonie.test'
JOIN service_type st
    ON st.name = 'Entretien du domicile'
WHERE b.email = 'jeanne.dupont@example.test'
  AND l.label = 'Domicile'
  AND NOT EXISTS (
      SELECT 1
      FROM intervention i
      WHERE i.location_id = l.location_id
        AND i.start_at = TIMESTAMPTZ '2026-10-05 09:00:00+02'
  );

-- Marc Leroy : aide au repas
INSERT INTO intervention (
    start_at,
    estimated_duration_minutes,
    status,
    notes,
    location_id,
    created_by_user_account_id,
    service_type_id
)
SELECT
    TIMESTAMPTZ '2026-10-05 14:00:00+02',
    60,
    'unplanned',
    'Préparation du repas',
    l.location_id,
    creator.user_account_id,
    st.service_type_id
FROM location l
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
JOIN user_account creator
    ON creator.email = 'sophie.laurent@harmonie.test'
JOIN service_type st
    ON st.name = 'Aide au repas'
WHERE b.email = 'marc.leroy@example.test'
  AND l.label = 'Domicile'
  AND NOT EXISTS (
      SELECT 1
      FROM intervention i
      WHERE i.location_id = l.location_id
        AND i.start_at = TIMESTAMPTZ '2026-10-05 14:00:00+02'
  );

-- Lucie Bernard : accompagnement
INSERT INTO intervention (
    start_at,
    estimated_duration_minutes,
    status,
    notes,
    location_id,
    created_by_user_account_id,
    service_type_id
)
SELECT
    TIMESTAMPTZ '2026-10-06 10:00:00+02',
    90,
    'unplanned',
    'Accompagnement extérieur',
    l.location_id,
    creator.user_account_id,
    st.service_type_id
FROM location l
JOIN beneficiary b
    ON b.beneficiary_id = l.beneficiary_id
JOIN user_account creator
    ON creator.email = 'sophie.laurent@harmonie.test'
JOIN service_type st
    ON st.name = 'Accompagnement'
WHERE b.email = 'lucie.bernard@example.test'
  AND l.label = 'Domicile'
  AND NOT EXISTS (
      SELECT 1
      FROM intervention i
      WHERE i.location_id = l.location_id
        AND i.start_at = TIMESTAMPTZ '2026-10-06 10:00:00+02'
  );

COMMIT;
