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

GRANT SELECT (user_account_id, email, password_hash, is_active)
ON TABLE public.user_account
TO hd_api;

GRANT SELECT (user_account_id, app_role_id)
ON TABLE public.user_account_app_role
TO hd_api;

GRANT SELECT (app_role_id, name)
ON TABLE public.app_role
TO hd_api;