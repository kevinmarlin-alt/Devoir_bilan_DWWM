-- =========================================================
-- Harmonie Domicile
-- Security rules for hd_sector_manager
-- =========================================================


-- =========================================================
-- SCHEMA ACCESS
-- =========================================================

GRANT USAGE ON SCHEMA public TO hd_sector_manager;


-- =========================================================
-- GLOBAL READ ACCESS
-- =========================================================


GRANT SELECT
ON
    skill,
    geographic_area,
    service_type
TO hd_sector_manager;


-- =========================================================
-- INTERVENTION
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON intervention TO hd_sector_manager;

-- =========================================================
-- BENEFICIARY
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON beneficiary TO hd_sector_manager;

-- =========================================================
-- LOCATION
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON location TO hd_sector_manager;

-- =========================================================
-- CONTRACT
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON contract TO hd_sector_manager;

-- =========================================================
-- EMPLOYEE SKILL
-- =========================================================

GRANT SELECT, INSERT, DELETE ON employee_skill TO hd_sector_manager;

-- =========================================================
-- EMPLOYEE GEOGRAPHIC AREA
-- =========================================================

GRANT SELECT, INSERT, DELETE ON employee_geographic_area TO hd_sector_manager;

-- =========================================================
-- INTERVENTION SKILL
-- =========================================================

GRANT SELECT, INSERT, DELETE ON intervention_skill TO hd_sector_manager;

-- =========================================================
-- CHANGE REQUEST
-- =========================================================

GRANT SELECT, UPDATE ON change_request TO hd_sector_manager;

-- =========================================================
-- EMPLOYEE
-- =========================================================

GRANT SELECT, UPDATE ON employee TO hd_sector_manager;
