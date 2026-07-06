package attendance

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Service encapsulates the business logic for the attendance domain.
type Service struct {
	pool *pgxpool.Pool
}

// NewService creates a new attendance service backed by the given
// PostgreSQL connection pool.
func NewService(pool *pgxpool.Pool) *Service {
	return &Service{pool: pool}
}

// List retrieves all attendance records.
// TODO: Add pagination, filtering by class/date, and sorting.
func (s *Service) List(ctx context.Context) ([]AttendanceResponse, error) {
	// TODO: Replace with sqlc-generated query call.
	return []AttendanceResponse{}, nil
}

// GetByID retrieves a single attendance record by its ID.
func (s *Service) GetByID(ctx context.Context, id int64) (*AttendanceResponse, error) {
	// TODO: Replace with sqlc-generated query call.
	return nil, nil
}

// MarkAttendance creates or updates an attendance record.
func (s *Service) MarkAttendance(ctx context.Context, req MarkAttendanceRequest) (*AttendanceResponse, error) {
	// TODO: Validate input, call sqlc-generated insert, return result.
	return &AttendanceResponse{
		ClassID:   req.ClassID,
		StudentID: req.StudentID,
		Date:      req.Date,
		Status:    req.Status,
	}, nil
}
