-- ============================================================
-- 004_roles_institution_id.sql — Scope roles to an institution
-- Safe to re-run. Global roles (and their permissions) are copied
-- to every institution, then the global originals are removed.
-- ============================================================

BEGIN;

DO $$
BEGIN
    -- Some databases carry an untracked INTEGER institution_id; it cannot reference institutions(id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'roles'
          AND column_name = 'institution_id' AND data_type <> 'character varying'
    ) THEN
        IF EXISTS (SELECT 1 FROM roles WHERE institution_id IS NOT NULL) THEN
            RAISE EXCEPTION 'roles.institution_id holds non-varchar values; map them to institutions.id first';
        END IF;
        ALTER TABLE roles DROP COLUMN institution_id;
    END IF;

    -- Removing global roles must not silently lose data that cannot be mapped to one institution
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'user_roles' AND column_name = 'role_id'
    ) THEN
        IF EXISTS (SELECT 1 FROM user_roles) THEN
            RAISE EXCEPTION 'user_roles has assignments to global roles; reassign them before scoping roles';
        END IF;
    END IF;
END $$;

ALTER TABLE roles ADD COLUMN IF NOT EXISTS institution_id VARCHAR(60) REFERENCES institutions(id) ON DELETE CASCADE;

ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_slug_key;
ALTER TABLE roles DROP CONSTRAINT IF EXISTS uq_roles_institution_slug;

INSERT INTO roles (name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id)
SELECT r.name, r.slug, r.department_name, r.description, r.status, r.is_system, r.color, r.icon_name, r.created_at, r.updated_at, i.id
FROM roles r
CROSS JOIN institutions i
WHERE r.institution_id IS NULL;

INSERT INTO role_permissions (role_id, permission_id)
SELECT scoped.id, rp.permission_id
FROM roles global_role
JOIN role_permissions rp ON rp.role_id = global_role.id
JOIN roles scoped ON scoped.slug = global_role.slug AND scoped.institution_id IS NOT NULL
WHERE global_role.institution_id IS NULL
ON CONFLICT DO NOTHING;

DELETE FROM roles WHERE institution_id IS NULL;

ALTER TABLE roles ALTER COLUMN institution_id SET NOT NULL;
ALTER TABLE roles ADD CONSTRAINT uq_roles_institution_slug UNIQUE (institution_id, slug);

CREATE INDEX IF NOT EXISTS idx_roles_institution_status ON roles(institution_id, status);

COMMIT;
