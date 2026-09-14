-- =========================================================
-- Harmonie Domicile
-- Security rules for hd_app_admin
-- =========================================================


-- =========================================================
-- SCHEMA ACCESS
-- =========================================================

GRANT USAGE ON SCHEMA public TO hd_app_admin;


-- =========================================================
-- GLOBAL READ ACCESS
-- =========================================================


GRANT SELECT, INSERT, UPDATE
ON
    skill,
    geographic_area,
    service_type,
    user_account
TO hd_app_admin;


-- =========================================================
-- APPLICATION ROLES
-- =========================================================

GRANT SELECT ON app_role TO hd_app_admin;


-- =========================================================
-- USER ROLE ASSIGNMENTS
-- =========================================================

GRANT SELECT, INSERT, DELETE ON user_account_app_role TO hd_app_admin;


-- =========================================================
-- CONTRACT
-- =========================================================

GRANT SELECT, INSERT, UPDATE ON contract TO hd_app_admin;


-- =========================================================
-- EMPLOYEE
-- =========================================================

GRANT SELECT, UPDATE ON employee TO hd_app_admin;