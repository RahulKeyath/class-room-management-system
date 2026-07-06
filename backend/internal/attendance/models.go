package attendance

import "time"

// AttendanceStatus represents the possible states for an attendance record.
type AttendanceStatus string

const (
	StatusPresent AttendanceStatus = "present"
	StatusAbsent  AttendanceStatus = "absent"
	StatusLate    AttendanceStatus = "late"
	StatusExcused AttendanceStatus = "excused"
)

// User represents a person (student or teacher) in the system.
type User struct {
	ID        int64     `json:"id"`
	FullName  string    `json:"full_name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"` // "student" | "teacher"
	CreatedAt time.Time `json:"created_at"`
}

// Class represents a scheduled class or course section.
type Class struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	TeacherID int64     `json:"teacher_id"`
	CreatedAt time.Time `json:"created_at"`
}

// AttendanceRecord represents a single attendance entry linking
// a student to a class on a specific date.
type AttendanceRecord struct {
	ID        int64            `json:"id"`
	ClassID   int64            `json:"class_id"`
	StudentID int64            `json:"student_id"`
	Date      time.Time        `json:"date"`
	Status    AttendanceStatus `json:"status"`
	CreatedAt time.Time        `json:"created_at"`
}

// MarkAttendanceRequest is the payload for marking a student's attendance.
type MarkAttendanceRequest struct {
	ClassID   int64            `json:"class_id"`
	StudentID int64            `json:"student_id"`
	Date      string           `json:"date"` // YYYY-MM-DD
	Status    AttendanceStatus `json:"status"`
}

// AttendanceResponse is the API response shape for attendance records.
type AttendanceResponse struct {
	ID          int64            `json:"id"`
	ClassID     int64            `json:"class_id"`
	StudentID   int64            `json:"student_id"`
	StudentName string           `json:"student_name,omitempty"`
	Date        string           `json:"date"`
	Status      AttendanceStatus `json:"status"`
}
