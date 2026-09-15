BEGIN;

-- =========================================================
-- Harmonie Domicile
-- Seed 01 - Données de référence
-- =========================================================

-- =========================================================
-- APPLICATION ROLES
-- =========================================================

INSERT INTO app_role (name, label, description)
VALUES
    ('employee', 'Intervenant', 'Intervenant à domicile'),
    ('coordinator', 'Coordinateur', 'Organisation et gestion du planning'),
    ('sector_manager', 'Responsable de secteur', 'Gestion métier du secteur'),
    ('admin', 'Administrateur', 'Administration de l''application')
ON CONFLICT (name) DO NOTHING;


-- =========================================================
-- SKILLS
-- =========================================================

INSERT INTO skill (name, description)
VALUES
    ('Entretien du logement', 'Entretien courant du domicile'),
    ('Préparation des repas', 'Préparation et organisation des repas'),
    ('Accompagnement extérieur', 'Accompagnement pour les sorties et rendez-vous'),
    ('Aide administrative', 'Assistance pour les démarches administratives courantes')
ON CONFLICT (name) DO NOTHING;


-- =========================================================
-- GEOGRAPHIC AREAS
-- =========================================================

INSERT INTO geographic_area (name, description)
VALUES
    ('Le Mans Centre', 'Secteur centre-ville du Mans'),
    ('Le Mans Nord', 'Secteur nord du Mans'),
    ('La Ferté-Bernard', 'Secteur de La Ferté-Bernard')
ON CONFLICT (name) DO NOTHING;


-- =========================================================
-- SERVICE TYPES
-- =========================================================

INSERT INTO service_type (name, description)
VALUES
    ('Entretien du domicile', 'Intervention d''entretien du logement'),
    ('Aide au repas', 'Préparation ou assistance autour du repas'),
    ('Accompagnement', 'Accompagnement extérieur du bénéficiaire')
ON CONFLICT (name) DO NOTHING;

COMMIT;
