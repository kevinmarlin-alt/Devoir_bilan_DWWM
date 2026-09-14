CREATE TYPE change_request_status AS ENUM ('pending', 'approved', 'refused');
CREATE TYPE intervention_status AS ENUM ('unplanned', 'planned', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS user_account (
    user_account_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS app_role (
    app_role_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS user_account_app_role (
    app_role_id INTEGER NOT NULL,
    user_account_id INTEGER NOT NULL,

    PRIMARY KEY (app_role_id, user_account_id),

    FOREIGN KEY (app_role_id)
        REFERENCES app_role (app_role_id),

    FOREIGN KEY (user_account_id)
        REFERENCES user_account (user_account_id)
);

CREATE TABLE IF NOT EXISTS employee (
	employee_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	is_active BOOLEAN NOT NULL DEFAULT true,
	user_account_id INTEGER NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

	FOREIGN KEY (user_account_id)
        REFERENCES user_account (user_account_id)
);

CREATE TABLE IF NOT EXISTS change_request ( 
	change_request_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	subject VARCHAR(255) NOT NULL,
	message TEXT NOT NULL,
	status change_request_status NOT NULL DEFAULT 'pending',
	reviewed_at TIMESTAMPTZ,
	decision_reason TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ,

	reviewed_by_user_account_id INTEGER, 
	employee_id  INTEGER NOT NULL, 

    CHECK (
        (
            status = 'pending'
            AND reviewed_at IS NULL
            AND reviewed_by_user_account_id IS NULL
        )
        OR
        (
            status IN ('approved', 'refused')
            AND reviewed_at IS NOT NULL
            AND reviewed_by_user_account_id IS NOT NULL
        )
    ),

	FOREIGN KEY (reviewed_by_user_account_id)
        REFERENCES user_account (user_account_id),

	FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS unavailability (
    unavailability_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    employee_id INTEGER NOT NULL,

    CONSTRAINT unavailability_end_later_than_start CHECK (end_at > start_at),

    FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS contract (
    contract_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE CHECK (end_date IS NULL OR end_date >= start_date),
    weekly_reference_minutes INTEGER NOT NULL CONSTRAINT contract_reference_positive CHECK (weekly_reference_minutes > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    employee_id INTEGER NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS skill (
    skill_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS employee_skill (
    employee_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,

    PRIMARY KEY (employee_id, skill_id),

    FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id),

    FOREIGN KEY (skill_id)
        REFERENCES skill (skill_id)
);

CREATE TABLE IF NOT EXISTS geographic_area (
	geographic_area_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS employee_geographic_area (
    employee_id INTEGER NOT NULL,
    geographic_area_id INTEGER NOT NULL,

    PRIMARY KEY (employee_id, geographic_area_id),

    FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id),

    FOREIGN KEY (geographic_area_id)
        REFERENCES geographic_area (geographic_area_id)
);

CREATE TABLE IF NOT EXISTS beneficiary (
    beneficiary_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    organisation_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS service_type (
    service_type_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS location (
    location_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    postal_code VARCHAR(5) NOT NULL,
    city VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,

    geographic_area_id INTEGER NOT NULL,
    beneficiary_id INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    FOREIGN KEY (geographic_area_id)
        REFERENCES geographic_area (geographic_area_id),

    FOREIGN KEY (beneficiary_id)
        REFERENCES beneficiary (beneficiary_id)
);



CREATE TABLE IF NOT EXISTS intervention (
    intervention_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    start_at TIMESTAMPTZ NOT NULL,
    estimated_duration_minutes INTEGER NOT NULL CONSTRAINT positive_duration CHECK (estimated_duration_minutes > 0),
    status intervention_status NOT NULL DEFAULT 'unplanned',
    notes TEXT,

    location_id INTEGER NOT NULL,
    created_by_user_account_id INTEGER NOT NULL,
    service_type_id INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    FOREIGN KEY (location_id)
        REFERENCES location (location_id),

    FOREIGN KEY (created_by_user_account_id)
        REFERENCES user_account (user_account_id),

    FOREIGN KEY (service_type_id)
        REFERENCES service_type (service_type_id)

);

CREATE TABLE IF NOT EXISTS assignment (
    assignment_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMPTZ,
    end_reason TEXT,

    employee_id INTEGER NOT NULL,
    assigned_by_user_account_id INTEGER NOT NULL,
    intervention_id INTEGER NOT NULL,

    updated_at TIMESTAMPTZ,

    CONSTRAINT assignment_end_later_than_start
        CHECK (end_at IS NULL OR end_at > assigned_at),

    FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id),
        
    FOREIGN KEY (assigned_by_user_account_id)
        REFERENCES user_account (user_account_id),

    FOREIGN KEY (intervention_id)
        REFERENCES intervention (intervention_id)
);

CREATE TABLE IF NOT EXISTS intervention_skill (
    intervention_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,

    PRIMARY KEY (intervention_id, skill_id),

    FOREIGN KEY (intervention_id)
        REFERENCES intervention (intervention_id),

    FOREIGN KEY (skill_id)
        REFERENCES skill (skill_id)
);

CREATE UNIQUE INDEX uq_assignment_current_intervention 
    ON assignment (intervention_id)
    WHERE end_at IS NULL
;