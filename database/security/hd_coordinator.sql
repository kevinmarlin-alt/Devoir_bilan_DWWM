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
    location,
    intervention,
    intervention_skill
TO hd_coordinator;


-- =========================================================
-- ASSIGNMENT
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON assignment TO hd_coordinator;