-- name: ListActiveRoles :many
SELECT id, role, status FROM user_roles WHERE status = 'active' ORDER BY id ASC;


-- name: ListDepartments :many
SELECT id, name FROM departments ORDER BY id ASC;

-- name: CreateDepartment :one
INSERT INTO departments (name) VALUES ($1) RETURNING id, name;

-- name: DeleteDepartment :exec
DELETE FROM departments WHERE name = $1;

-- name: ListPermissions :many
SELECT id, name, description, category FROM permissions ORDER BY category ASC, id ASC;

-- name: GetPermissionByID :one
SELECT id, name, description, category FROM permissions WHERE id = $1;

-- name: UpsertPermission :one
INSERT INTO permissions (id, name, description, category)
VALUES ($1, $2, $3, $4)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category
RETURNING id, name, description, category;

-- name: CreateRole :one
INSERT INTO roles (name, slug, department_name, description, status, is_system, color, icon_name, institution_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id, name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id;

-- name: ListAllRoles :many
SELECT id, name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id
FROM roles
ORDER BY created_at DESC;

-- name: ListRolesByInstitution :many
SELECT id, name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id
FROM roles
WHERE institution_id = $1 AND status = 'active'
ORDER BY is_system DESC, id ASC;

-- name: GetRoleByID :one
SELECT id, name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id
FROM roles
WHERE id = $1;

-- name: UpdateRole :one
UPDATE roles SET
    name = $2,
    slug = $3,
    department_name = $4,
    description = $5,
    status = $6,
    color = $7,
    icon_name = $8,
    updated_at = NOW()
WHERE id = $1
RETURNING id, name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id;

-- name: DeleteRole :exec
DELETE FROM roles WHERE id = $1;

-- name: AddRolePermission :exec
INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;

-- name: DeleteRolePermissions :exec
DELETE FROM role_permissions WHERE role_id = $1;

-- name: ListRolePermissions :many
SELECT permission_id FROM role_permissions WHERE role_id = $1;

-- name: ListAllRolePermissions :many
SELECT role_id, permission_id FROM role_permissions;

-- name: ListInstitutionsWithoutRoles :many
SELECT i.id FROM institutions i
WHERE NOT EXISTS (SELECT 1 FROM roles r WHERE r.institution_id = i.id)
ORDER BY i.id ASC;