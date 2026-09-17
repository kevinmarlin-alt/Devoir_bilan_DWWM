-- =========================================================
-- Harmonie Domicile
-- Technical permissions for hd_api
-- =========================================================

GRANT SELECT (
    user_account_id,
    email,
    password_hash,
    is_active
)
ON user_account
TO hd_api;