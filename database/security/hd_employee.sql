-- =========================================================
-- Harmonie Domicile
-- Security rules for hd_employee
-- =========================================================


-- =========================================================
-- SCHEMA ACCESS
-- =========================================================

GRANT USAGE ON SCHEMA public TO hd_employee;


-- =========================================================
-- READ ACCESS
-- =========================================================

-- Tables required to display the employee's own information
-- and planning.
--
-- The backend remains responsible for filtering the data
-- according to the authenticated application user.

GRANT SELECT
ON
    employee,
    contract,
    employee_skill,
    employee_geographic_area,
    skill,
    geographic_area,
    assignment,
    intervention,
    intervention_skill,
    service_type,
    location,
    beneficiary
TO hd_employee;


-- =========================================================
-- CHANGE REQUEST
-- =========================================================

-- An employee may create a request and consult their own
-- requests 
--
-- UPDATE and DELETE are intentionally not granted.

GRANT SELECT, INSERT ON change_request TO hd_employee;


-- =========================================================
-- UNAVAILABILITY
-- =========================================================

-- An employee may declare an unavailability and consult
-- their own declarations.
--
-- Once created, an unavailability cannot be modified or
-- deleted directly by the employee.

GRANT SELECT, INSERT ON unavailability TO hd_employee;


-- =========================================================
-- RLS : CHANGE REQUEST
-- =========================================================

CREATE POLICY employee_select_own_change_request
ON change_request
FOR SELECT
TO hd_employee
USING (
    employee_id =
    current_setting('app.employee_id', true)::INTEGER
);


CREATE POLICY employee_insert_own_change_request
ON change_request
FOR INSERT
TO hd_employee
WITH CHECK (
    employee_id =
    current_setting('app.employee_id', true)::INTEGER
);


-- =========================================================
-- RLS : UNAVAILABILITY
-- =========================================================

CREATE POLICY employee_select_own_unavailability
ON unavailability
FOR SELECT
TO hd_employee
USING (
    employee_id =
    current_setting('app.employee_id', true)::INTEGER
);


CREATE POLICY employee_insert_own_unavailability
ON unavailability
FOR INSERT
TO hd_employee
WITH CHECK (
    employee_id =
    current_setting('app.employee_id', true)::INTEGER
);