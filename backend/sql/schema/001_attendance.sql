-- ============================================================
-- 001_attendance.sql — Initial schema for Classroom Management
-- ============================================================

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
CREATE INDEX IF NOT EXISTS idx_attendance_class_date   ON attendance_records (class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student      ON attendance_records (student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher         ON classes (teacher_id);
