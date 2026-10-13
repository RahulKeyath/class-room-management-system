package attendance

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/RahulKeyath/class-room-management-system/backend/internal/db"
)

// Service encapsulates the business logic for the attendance domain.
type Service struct {
	pool *pgxpool.Pool
	q    *db.Queries
}

// NewService creates a new attendance service backed by the given
// PostgreSQL connection pool.
func NewService(pool *pgxpool.Pool) *Service {
	return &Service{pool: pool, q: db.New(pool)}
}

// List retrieves attendance records.
func (s *Service) List(ctx context.Context) ([]AttendanceResponse, error) {
	// If you want to list attendance across classes or use class/date filter:
	// For now, return an empty list or call your query
	return []AttendanceResponse{}, nil
}

// GetByID retrieves a single attendance record by its ID.
func (s *Service) GetByID(ctx context.Context, id int64) (*AttendanceResponse, error) {
	row, err := s.q.GetAttendanceByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch attendance record: %w", err)
	}
	return &AttendanceResponse{
		ID:          row.ID,
		ClassID:     row.ClassID,
		StudentID:   row.StudentID,
		StudentName: row.StudentName,
		Date:        row.Date.Time.Format("2006-01-02"),
		Status:      AttendanceStatus(row.Status),
	}, nil
}
// MarkAttendance creates or updates an attendance record in the database.
func (s *Service) MarkAttendance(ctx context.Context, req MarkAttendanceRequest) (*AttendanceResponse, error) {
	parsedDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, fmt.Errorf("invalid date format, expected YYYY-MM-DD: %w", err)
	}
	params := db.MarkPresentParams{
		ClassID:   req.ClassID,
		StudentID: req.StudentID,
		Date:      pgtype.Date{Time: parsedDate, Valid: true},
		Status:    string(req.Status),
	}
	if err := s.q.MarkPresent(ctx, params); err != nil {
		return nil, fmt.Errorf("failed to mark attendance: %w", err)
	}
	return &AttendanceResponse{
		ClassID:   req.ClassID,
		StudentID: req.StudentID,
		Date:      req.Date,
		Status:    req.Status,
	}, nil
}
