-- ============================================================
-- attendance.sql — sqlc queries for the attendance domain
-- ============================================================

-- name: ListAttendanceByClassAndDate :many
-- Retrieve all attendance records for a given class on a specific date.
SELECT
    ar.id,
    ar.class_id,
    ar.student_id,
    u.full_name AS student_name,
    ar.date,
    ar.status,
    ar.created_at
FROM attendance_records ar
JOIN users u ON u.id = ar.student_id
WHERE ar.class_id = $1
  AND ar.date = $2
ORDER BY u.full_name;

-- name: GetAttendanceByID :one
-- Retrieve a single attendance record by its primary key.
SELECT
    ar.id,
    ar.class_id,
    ar.student_id,
    u.full_name AS student_name,
    ar.date,
    ar.status,
    ar.created_at
FROM attendance_records ar
JOIN users u ON u.id = ar.student_id
WHERE ar.id = $1;

-- name: MarkPresent :exec
-- Insert or update an attendance record for a student in a class on a date.
INSERT INTO attendance_records (class_id, student_id, date, status)
VALUES ($1, $2, $3, $4)
ON CONFLICT (class_id, student_id, date)
DO UPDATE SET status = EXCLUDED.status;

-- name: DeleteAttendance :exec
-- Remove an attendance record by ID.
DELETE FROM attendance_records
WHERE id = $1;

-- name: ListStudentsByClass :many
-- Retrieve all students enrolled in a given class.
SELECT
    u.id,
    u.full_name,
    u.email,
    u.role,
    u.created_at
FROM users u
JOIN class_enrolments ce ON ce.student_id = u.id
WHERE ce.class_id = $1
ORDER BY u.full_name;
