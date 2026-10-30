package institution

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

// ErrDuplicate is returned when the code or domain is already registered.
var ErrDuplicate = errors.New("institution code or domain already registered")

const defaultGradient = "from-blue-500 to-indigo-600"

const selectColumns = `id, name, short_name, code, type, city, campus, domain, established, COALESCE(motto, ''), gradient`

var nonAlphanumeric = regexp.MustCompile(`[^a-z0-9]+`)

// RoleSeeder creates the default roles of a newly registered institution.
type RoleSeeder interface {
	SeedInstitutionRoles(ctx context.Context, tx pgx.Tx, institutionID string) error
}

// Service encapsulates the business logic for institutions.
type Service struct {
	pool       *pgxpool.Pool
	roleSeeder RoleSeeder
}

// NewService creates a new institution service.
func NewService(pool *pgxpool.Pool, roleSeeder RoleSeeder) *Service {
	return &Service{pool: pool, roleSeeder: roleSeeder}
}

type rowQuerier interface {
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanInstitution(row rowScanner) (Institution, error) {
	var i Institution
	err := row.Scan(&i.ID, &i.Name, &i.ShortName, &i.Code, &i.Type, &i.City,
		&i.Campus, &i.Domain, &i.Established, &i.Motto, &i.Gradient)
	return i, err
}

// List retrieves all institutions ordered by name.
func (s *Service) List(ctx context.Context) ([]Institution, error) {
	rows, err := s.pool.Query(ctx, `SELECT `+selectColumns+` FROM institutions ORDER BY name ASC`)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch institutions: %w", err)
	}
	defer rows.Close()

	institutions := make([]Institution, 0)
	for rows.Next() {
		i, err := scanInstitution(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan institution: %w", err)
		}
		institutions = append(institutions, i)
	}
	return institutions, rows.Err()
}

func slugify(value string) string {
	return strings.Trim(nonAlphanumeric.ReplaceAllString(strings.ToLower(value), "-"), "-")
}

// uniqueID derives a slug from shortName/code and suffixes it until it is unused.
func (s *Service) uniqueID(ctx context.Context, req CreateInstitutionRequest) (string, error) {
	base := slugify(req.ShortName)
	if base == "" {
		base = slugify(req.Code)
	}
	if base == "" {
		base = "institution"
	}
	if len(base) > 50 {
		base = strings.Trim(base[:50], "-")
	}

	id := base
	for n := 2; ; n++ {
		var exists bool
		if err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM institutions WHERE id = $1)`, id).Scan(&exists); err != nil {
			return "", fmt.Errorf("failed to check institution id: %w", err)
		}
		if !exists {
			return id, nil
		}
		id = fmt.Sprintf("%s-%d", base, n)
	}
}

func (s *Service) insert(ctx context.Context, q rowQuerier, i Institution) (*Institution, error) {
	row := q.QueryRow(ctx, `
		INSERT INTO institutions (id, name, short_name, code, type, city, campus, domain, established, motto, gradient)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING `+selectColumns,
		i.ID, i.Name, i.ShortName, i.Code, i.Type, i.City, i.Campus, i.Domain, i.Established, i.Motto, i.Gradient)
	created, err := scanInstitution(row)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrDuplicate
		}
		return nil, fmt.Errorf("failed to create institution: %w", err)
	}
	return &created, nil
}

// Create registers a new institution with a generated slug ID and its default roles (transactional).
func (s *Service) Create(ctx context.Context, req CreateInstitutionRequest) (*Institution, error) {
	id, err := s.uniqueID(ctx, req)
	if err != nil {
		return nil, err
	}
	gradient := req.Gradient
	if gradient == "" {
		gradient = defaultGradient
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	created, err := s.insert(ctx, tx, Institution{
		ID:          id,
		Name:        req.Name,
		ShortName:   req.ShortName,
		Code:        req.Code,
		Type:        req.Type,
		City:        req.City,
		Campus:      req.Campus,
		Domain:      req.Domain,
		Established: req.Established,
		Motto:       req.Motto,
		Gradient:    gradient,
	})
	if err != nil {
		return nil, err
	}
	if err := s.roleSeeder.SeedInstitutionRoles(ctx, tx, created.ID); err != nil {
		return nil, fmt.Errorf("failed to seed roles for %s: %w", created.ID, err)
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit institution: %w", err)
	}
	return created, nil
}

// SeedDefaults inserts the canonical demo institutions when the table is empty.
func (s *Service) SeedDefaults(ctx context.Context) error {
	var count int
	if err := s.pool.QueryRow(ctx, `SELECT COUNT(*) FROM institutions`).Scan(&count); err != nil {
		return fmt.Errorf("failed to count institutions: %w", err)
	}
	if count > 0 {
		return nil
	}
	for _, inst := range defaultInstitutions {
		if _, err := s.insert(ctx, s.pool, inst); err != nil {
			return fmt.Errorf("failed to seed %s: %w", inst.ID, err)
		}
	}
	return nil
}
