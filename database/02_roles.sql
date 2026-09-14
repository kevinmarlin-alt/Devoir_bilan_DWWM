-- =========================================================
-- Harmonie Domicile
-- PostgreSQL roles
-- =========================================================


-- ---------------------------------------------------------
-- Business roles
-- ---------------------------------------------------------

CREATE ROLE hd_employee
NOLOGIN;

CREATE ROLE hd_coordinator
NOLOGIN;

CREATE ROLE hd_sector_manager
NOLOGIN;

CREATE ROLE hd_app_admin
NOLOGIN;


-- ---------------------------------------------------------
-- Technical roles
-- ---------------------------------------------------------

CREATE ROLE hd_db_owner
NOLOGIN;

CREATE ROLE hd_api
LOGIN
NOINHERIT;


-- ---------------------------------------------------------
-- hd_api may temporarily assume business roles
-- ---------------------------------------------------------

GRANT hd_employee
TO hd_api;

GRANT hd_coordinator
TO hd_api;

GRANT hd_sector_manager
TO hd_api;

GRANT hd_app_admin
TO hd_api;