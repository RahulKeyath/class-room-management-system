-- name: GetUserByEmail :one
SELECT id, institution_id, role_id, role, email, password_hash, full_name, title, department, status, created_at
FROM users
WHERE email = $1 LIMIT 1;

-- name: GetUserByID :one
SELECT id, institution_id, role_id, role, email, password_hash, full_name, title, department, status, created_at
FROM users
WHERE id = $1 LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (
    institution_id, role_id, email, password_hash, full_name, title, department, status, role
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role_id = EXCLUDED.role_id,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    title = EXCLUDED.title,
    department = EXCLUDED.department,
    status = EXCLUDED.status
RETURNING id, institution_id, role_id, role, email, full_name, title, department, status, created_at;

-- name: ListUsersByInstitution :many
SELECT id, institution_id, role_id, role, email, full_name, title, department, status, created_at
FROM users
WHERE institution_id = $1
ORDER BY id;

-- name: ListInstitutionDomains :many
SELECT id, domain FROM institutions ORDER BY id ASC;

-- name: GetRoleIDByInstitutionAndSlug :one
SELECT id FROM roles WHERE institution_id = $1 AND slug = $2;
