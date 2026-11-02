-- ============================================================
-- 00001_initial_schema.sql — Consolidated baseline schema
-- Safe on both empty databases and databases created by the
-- legacy 001-004 schema files.
-- ============================================================

-- +goose Up
CREATE TABLE IF NOT EXISTS institutions (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    short_name  VARCHAR(100) NOT NULL,
    code        VARCHAR(50) NOT NULL UNIQUE,
    type        VARCHAR(50) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    campus      VARCHAR(100) NOT NULL,
    domain      VARCHAR(255) NOT NULL UNIQUE,
    established INTEGER NOT NULL,
    motto       TEXT DEFAULT '',
    gradient    VARCHAR(100) NOT NULL DEFAULT 'from-blue-500 to-indigo-600',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id          VARCHAR(50) PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    category    VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(50) NOT NULL,
    department_name VARCHAR(100) REFERENCES departments(name) ON UPDATE CASCADE ON DELETE SET NULL,
    description     TEXT DEFAULT '',
    status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    color           VARCHAR(30) NOT NULL DEFAULT 'indigo',
    icon_name       VARCHAR(50) NOT NULL DEFAULT 'ShieldCheck',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    CONSTRAINT uq_roles_institution_slug UNIQUE (institution_id, slug)
);

-- Databases that never applied the legacy 004 file still have global roles:
-- copy them to every institution, as that file did.
-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'roles' AND column_name = 'institution_id'
    ) THEN
        ALTER TABLE roles ADD COLUMN institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE;
        ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_slug_key;

        INSERT INTO roles (name, slug, department_name, description, status, is_system, color, icon_name, created_at, updated_at, institution_id)
        SELECT r.name, r.slug, r.department_name, r.description, r.status, r.is_system, r.color, r.icon_name, r.created_at, r.updated_at, i.id
        FROM roles r
        CROSS JOIN institutions i
        WHERE r.institution_id IS NULL;

        DELETE FROM roles WHERE institution_id IS NULL;

        ALTER TABLE roles ALTER COLUMN institution_id SET NOT NULL;
        ALTER TABLE roles ADD CONSTRAINT uq_roles_institution_slug UNIQUE (institution_id, slug);
    END IF;
END $$;
-- +goose StatementEnd

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(50) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
    id     SERIAL PRIMARY KEY,
    role   VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
);

-- Users table: stores students and teachers
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    full_name   TEXT      NOT NULL,
    email       TEXT      NOT NULL UNIQUE,
    role        TEXT      NOT NULL CHECK (role IN ('student', 'teacher')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Classes table: represents a course section taught by a teacher
CREATE TABLE IF NOT EXISTS classes (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT      NOT NULL,
    teacher_id  BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Class enrolments: many-to-many between students and classes
CREATE TABLE IF NOT EXISTS class_enrolments (
    id          BIGSERIAL PRIMARY KEY,
    class_id    BIGINT    NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id  BIGINT    NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (class_id, student_id)
);

-- Attendance records: one row per student per class per date
CREATE TABLE IF NOT EXISTS attendance_records (
    id          BIGSERIAL PRIMARY KEY,
    class_id    BIGINT    NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id  BIGINT    NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    date        DATE      NOT NULL,
    status      TEXT      NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (class_id, student_id, date)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_institutions_domain ON institutions(domain);
CREATE INDEX IF NOT EXISTS idx_institutions_code ON institutions(code);
CREATE INDEX IF NOT EXISTS idx_roles_department ON roles(department_name);
CREATE INDEX IF NOT EXISTS idx_roles_status ON roles(status);
CREATE INDEX IF NOT EXISTS idx_roles_institution_status ON roles(institution_id, status);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance_records (class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records (student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes (teacher_id);

-- +goose Down
DROP TABLE IF EXISTS attendance_records;
DROP TABLE IF EXISTS class_enrolments;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS institutions;