-- =========================================================
-- Harmonie Domicile
-- Security rules for hd_coordinator
-- =========================================================


-- =========================================================
-- SCHEMA ACCESS
-- =========================================================

GRANT USAGE ON SCHEMA public TO hd_coordinator;


-- =========================================================
-- GLOBAL READ ACCESS
-- =========================================================


GRANT SELECT
ON
    employee,
    contract,
    employee_skill,
    employee_geographic_area,
    skill,
    geographic_area,
    service_type,
    unavailability,
    beneficiary,
    location
TO hd_coordinator;


-- =========================================================
-- INTERVENTION
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON intervention TO hd_coordinator;

-- =========================================================
-- ASSIGNMENT
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON assignment TO hd_coordinator;

-- =========================================================
-- INTERVENTION SKILLS
-- =========================================================

GRANT SELECT, INSERT, DELETE ON intervention_skill TO hd_coordinator;