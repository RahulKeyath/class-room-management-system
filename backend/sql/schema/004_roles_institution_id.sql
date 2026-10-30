-- ============================================================
-- 004_roles_institution_id.sql — Scope roles to an institution
-- Safe to re-run. Roles reference institutions(id) INTEGER.
-- ============================================================

BEGIN;

ALTER TABLE roles ADD COLUMN IF NOT EXISTS institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE;

ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_institution_id_fkey;
ALTER TABLE roles DROP CONSTRAINT IF EXISTS uq_roles_institution_slug;
DROP INDEX IF EXISTS idx_roles_institution_status;

ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_slug_key;

-- Populate roles for any institutions that don't have scoped roles yet
INSERT INTO roles (name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id)
SELECT r.name, r.slug, r.department_name, r.description, r.status, r.is_system, r.color, r.icon_name, r.created_at, r.updated_at, i.id
FROM roles r
CROSS JOIN institutions i
WHERE r.institution_id IS NULL;

DELETE FROM roles WHERE institution_id IS NULL;

ALTER TABLE roles ALTER COLUMN institution_id SET NOT NULL;
ALTER TABLE roles ADD CONSTRAINT roles_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
ALTER TABLE roles ADD CONSTRAINT uq_roles_institution_slug UNIQUE (institution_id, slug);

CREATE INDEX IF NOT EXISTS idx_roles_institution_status ON roles(institution_id, status);

COMMIT;
