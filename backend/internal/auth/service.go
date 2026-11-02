package auth

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"sync"

	"github.com/alexedwards/argon2id"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/RahulKeyath/class-room-management-system/backend/internal/db"
)

// ErrInvalidCredentials is returned when a login cannot be authenticated.
var ErrInvalidCredentials = errors.New("invalid email or password")

// ErrUserNotFound is returned when a token's user no longer exists or is not active.
var ErrUserNotFound = errors.New("user not found")

const statusActive = "active"

// dummyHash is verified against when an account has no usable password, so
// unknown emails take as long to reject as wrong passwords.
var dummyHash = sync.OnceValue(func() string {
	hash, err := HashPassword("timing-equalizer")
	if err != nil {
		log.Printf("⚠️ Warning: could not create dummy password hash: %v", err)
	}
	return hash
})

// HashPassword derives an argon2id hash of the given password.
func HashPassword(password string) (string, error) {
	hash, err := argon2id.CreateHash(password, argon2id.DefaultParams)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return hash, nil
}

// VerifyPassword reports whether password matches the argon2id hash.
func VerifyPassword(password, hash string) bool {
	match, err := argon2id.ComparePasswordAndHash(password, hash)
	return err == nil && match
}

// Service encapsulates the business logic for authentication.
type Service struct {
	q         *db.Queries
	jwtSecret string
}

// NewService creates a new auth service.
func NewService(pool *pgxpool.Pool, jwtSecret string) *Service {
	return &Service{q: db.New(pool), jwtSecret: jwtSecret}
}

// Login verifies the credentials and issues a signed JWT.
func (s *Service) Login(ctx context.Context, email, password string) (*LoginResponse, error) {
	row, err := s.q.GetUserByEmail(ctx, strings.ToLower(strings.TrimSpace(email)))
	if errors.Is(err, pgx.ErrNoRows) {
		VerifyPassword(password, dummyHash())
		return nil, ErrInvalidCredentials
	}
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	// Users from before authentication have no password, institution or role
	if row.PasswordHash == "" {
		VerifyPassword(password, dummyHash())
		return nil, ErrInvalidCredentials
	}
	if !VerifyPassword(password, row.PasswordHash) {
		return nil, ErrInvalidCredentials
	}
	if row.Status != statusActive || !row.InstitutionID.Valid || !row.RoleID.Valid {
		return nil, ErrInvalidCredentials
	}

	token, err := GenerateToken(Claims{
		UserID:        row.ID,
		InstitutionID: row.InstitutionID.Int32,
		RoleID:        row.RoleID.Int32,
		RoleSlug:      row.Role,
		Email:         row.Email,
	}, s.jwtSecret)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token: token,
		User: UserResponse{
			ID:            strconv.FormatInt(row.ID, 10),
			Name:          row.FullName,
			Email:         row.Email,
			Role:          row.Role,
			Title:         row.Title,
			Department:    row.Department,
			InstitutionID: row.InstitutionID.Int32,
		},
	}, nil
}

// GetProfile returns the profile of an active user.
func (s *Service) GetProfile(ctx context.Context, id int64) (*UserResponse, error) {
	row, err := s.q.GetUserByID(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	if row.Status != statusActive {
		return nil, ErrUserNotFound
	}
	return &UserResponse{
		ID:            strconv.FormatInt(row.ID, 10),
		Name:          row.FullName,
		Email:         row.Email,
		Role:          row.Role,
		Title:         row.Title,
		Department:    row.Department,
		InstitutionID: row.InstitutionID.Int32,
	}, nil
}

// SeedUsers gives every institution the demo personas on its own domain.
// Accounts that already have a password are left untouched, so restarting
// the API does not reset them.
func (s *Service) SeedUsers(ctx context.Context) error {
	institutions, err := s.q.ListInstitutionDomains(ctx)
	if err != nil {
		return fmt.Errorf("failed to list institutions: %w", err)
	}

	for _, inst := range institutions {
		for _, p := range demoPersonas {
			if err := s.seedPersona(ctx, inst, p); err != nil {
				return fmt.Errorf("failed to seed %s@%s: %w", p.LocalPart, inst.Domain, err)
			}
		}
	}
	return nil
}

func (s *Service) seedPersona(ctx context.Context, inst db.ListInstitutionDomainsRow, p demoPersona) error {
	email := p.LocalPart + "@" + inst.Domain

	existing, err := s.q.GetUserByEmail(ctx, email)
	if err == nil && existing.PasswordHash != "" {
		return nil
	}
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return err
	}

	roleID, err := s.q.GetRoleIDByInstitutionAndSlug(ctx, db.GetRoleIDByInstitutionAndSlugParams{
		InstitutionID: inst.ID,
		Slug:          p.RoleSlug,
	})
	// Institutions may delete non-system roles, leaving nothing to attach the persona to
	if errors.Is(err, pgx.ErrNoRows) {
		log.Printf("⚠️ Skipping demo user %s: institution %d has no %q role", email, inst.ID, p.RoleSlug)
		return nil
	}
	if err != nil {
		return err
	}

	hash, err := HashPassword(p.Password)
	if err != nil {
		return err
	}

	_, err = s.q.CreateUser(ctx, db.CreateUserParams{
		InstitutionID: pgtype.Int4{Int32: inst.ID, Valid: true},
		RoleID:        pgtype.Int4{Int32: roleID, Valid: true},
		Email:         email,
		PasswordHash:  hash,
		FullName:      p.Name,
		Title:         p.Title,
		Department:    p.Department,
		Status:        statusActive,
		Role:          p.RoleSlug,
	})
	return err
}
