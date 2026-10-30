package role

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

// ErrInstitutionMismatch is returned when an update names a different institution than the role's.
var ErrInstitutionMismatch = errors.New("role does not belong to institution")

// Service encapsulates the business logic for roles.
type Service struct {
	pool *pgxpool.Pool
	q    *db.Queries
}

// NewService creates a new role service.
func NewService(pool *pgxpool.Pool) *Service {
	return &Service{pool: pool, q: db.New(pool)}
}

// ListActive retrieves all active roles using sqlc.
func (s *Service) ListActive(ctx context.Context) ([]Role, error) {
	rows, err := s.q.ListActiveRoles(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch active roles: %w", err)
	}

	roles := make([]Role, 0, len(rows))
	for _, r := range rows {
		roles = append(roles, Role{
			ID:     r.ID,
			Role:   r.Role,
			Status: r.Status,
		})
	}
	return roles, nil
}

func (s *Service) ListDepartments(ctx context.Context) ([]Department, error) {
	rows, err := s.q.ListDepartments(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch departments: %w", err)
	}
	departments := make([]Department, 0, len(rows))
	for _, r := range rows {
		departments = append(departments, Department{
			ID:   r.ID,
			Name: r.Name,
		})
	}
	return departments, nil
}

func (s *Service) CreateDepartment(ctx context.Context, name string) (*Department, error) {
	row, err := s.q.CreateDepartment(ctx, name)
	if err != nil {
		return nil, fmt.Errorf("failed to create department: %w", err)
	}
	return &Department{
		ID:   row.ID,
		Name: row.Name,
	}, nil
}

func (s *Service) DeleteDepartment(ctx context.Context, name string) error {
	if err := s.q.DeleteDepartment(ctx, name); err != nil {
		return fmt.Errorf("failed to delete department: %w", err)
	}
	return nil
}

// ListPermissions retrieves all permissions ordered by category and id.
func (s *Service) ListPermissions(ctx context.Context) ([]Permission, error) {
	rows, err := s.q.ListPermissions(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch permissions: %w", err)
	}
	permissions := make([]Permission, 0, len(rows))
	for _, r := range rows {
		desc := ""
		if r.Description.Valid {
			desc = r.Description.String
		}
		permissions = append(permissions, Permission{
			ID:          r.ID,
			Name:        r.Name,
			Description: desc,
			Category:    r.Category,
		})
	}
	return permissions, nil
}

// SeedPermissions ensures all default permissions exist in the database.
func (s *Service) SeedPermissions(ctx context.Context) error {
	for _, p := range DefaultPermissions {
		_, err := s.q.UpsertPermission(ctx, db.UpsertPermissionParams{
			ID:          p.ID,
			Name:        p.Name,
			Description: pgtype.Text{String: p.Description, Valid: p.Description != ""},
			Category:    p.Category,
		})
		if err != nil {
			return fmt.Errorf("failed to seed permission %s: %w", p.ID, err)
		}
	}
	return nil
}

// dbRoleToDetail converts a sqlc db.Role + permission IDs into a RoleDetail.
func dbRoleToDetail(r db.Role, permIDs []string) RoleDetail {
	dept := ""
	if r.DepartmentName.Valid {
		dept = r.DepartmentName.String
	}
	desc := ""
	if r.Description.Valid {
		desc = r.Description.String
	}
	createdAt := ""
	if r.CreatedAt.Valid {
		createdAt = r.CreatedAt.Time.Format(time.DateOnly)
	}
	updatedAt := ""
	if r.UpdatedAt.Valid {
		updatedAt = r.UpdatedAt.Time.Format(time.DateOnly)
	}
	if permIDs == nil {
		permIDs = []string{}
	}
	return RoleDetail{
		ID:             r.ID,
		Name:           r.Name,
		Slug:           r.Slug,
		DepartmentName: dept,
		Description:    desc,
		Status:         r.Status,
		IsSystem:       r.IsSystem,
		Color:          r.Color,
		IconName:       r.IconName,
		Permissions:    permIDs,
		CreatedAt:      createdAt,
		UpdatedAt:      updatedAt,
		InstitutionID:  r.InstitutionID,
	}
}

// CreateRole creates a new role in the database with its permissions (transactional).
func (s *Service) CreateRole(ctx context.Context, req CreateRoleRequest) (*RoleDetail, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	deptName := pgtype.Text{}
	if req.Department != "" {
		// Ensure the department exists to satisfy the foreign key constraint
		if _, err := tx.Exec(ctx, "INSERT INTO departments (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", req.Department); err != nil {
			return nil, fmt.Errorf("failed to ensure department %s: %w", req.Department, err)
		}
		deptName = pgtype.Text{String: req.Department, Valid: true}
	}

	status := req.Status
	if status == "" {
		status = "active"
	}

	color := req.Color
	if color == "" {
		color = "indigo"
	}

	iconName := req.IconName
	if iconName == "" {
		iconName = "ShieldCheck"
	}

	slug := req.Slug
	if slug == "" {
		slug = req.Name
	}

	dbRole, err := qtx.CreateRole(ctx, db.CreateRoleParams{
		Name:           req.Name,
		Slug:           slug,
		DepartmentName: deptName,
		Description:    pgtype.Text{String: req.Description, Valid: req.Description != ""},
		Status:         status,
		IsSystem:       false,
		Color:          color,
		IconName:       iconName,
		InstitutionID:  req.InstitutionID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create role: %w", err)
	}

	// Insert permission assignments into role_permissions table
	for _, permID := range req.Permissions {
		if err := qtx.AddRolePermission(ctx, db.AddRolePermissionParams{
			RoleID:       dbRole.ID,
			PermissionID: permID,
		}); err != nil {
			return nil, fmt.Errorf("failed to assign permission %s: %w", permID, err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	result := dbRoleToDetail(dbRole, req.Permissions)
	return &result, nil
}

// ListAllRoles returns all roles with their permissions efficiently.
func (s *Service) ListAllRoles(ctx context.Context) ([]RoleDetail, error) {
	dbRoles, err := s.q.ListAllRoles(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list roles: %w", err)
	}
	return s.withPermissions(ctx, dbRoles)
}

// ListByInstitution returns the active roles of one institution with their permissions.
func (s *Service) ListByInstitution(ctx context.Context, institutionID string) ([]RoleDetail, error) {
	dbRoles, err := s.q.ListRolesByInstitution(ctx, institutionID)
	if err != nil {
		return nil, fmt.Errorf("failed to list roles for institution %s: %w", institutionID, err)
	}
	return s.withPermissions(ctx, dbRoles)
}

func (s *Service) withPermissions(ctx context.Context, dbRoles []db.Role) ([]RoleDetail, error) {
	allPerms, err := s.q.ListAllRolePermissions(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list role permissions: %w", err)
	}

	// Group permissions by role_id
	permMap := make(map[int32][]string, len(dbRoles))
	for _, p := range allPerms {
		permMap[p.RoleID] = append(permMap[p.RoleID], p.PermissionID)
	}

	roles := make([]RoleDetail, 0, len(dbRoles))
	for _, r := range dbRoles {
		perms := permMap[r.ID]
		if perms == nil {
			perms = []string{}
		}
		roles = append(roles, dbRoleToDetail(r, perms))
	}
	return roles, nil
}

// UpdateRole updates a role and replaces its permissions (transactional).
func (s *Service) UpdateRole(ctx context.Context, id int32, req UpdateRoleRequest) (*RoleDetail, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	if req.InstitutionID != "" {
		existing, err := qtx.GetRoleByID(ctx, id)
		if err != nil {
			return nil, fmt.Errorf("failed to load role: %w", err)
		}
		if existing.InstitutionID != req.InstitutionID {
			return nil, ErrInstitutionMismatch
		}
	}

	deptName := pgtype.Text{}
	if req.Department != "" {
		// Ensure the department exists in departments table
		if _, err := tx.Exec(ctx, "INSERT INTO departments (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", req.Department); err != nil {
			return nil, fmt.Errorf("failed to ensure department %s: %w", req.Department, err)
		}
		deptName = pgtype.Text{String: req.Department, Valid: true}
	}

	status := req.Status
	if status == "" {
		status = "active"
	}

	color := req.Color
	if color == "" {
		color = "indigo"
	}

	iconName := req.IconName
	if iconName == "" {
		iconName = "ShieldCheck"
	}

	slug := req.Slug
	if slug == "" {
		slug = req.Name
	}

	dbRole, err := qtx.UpdateRole(ctx, db.UpdateRoleParams{
		ID:             id,
		Name:           req.Name,
		Slug:           slug,
		DepartmentName: deptName,
		Description:    pgtype.Text{String: req.Description, Valid: req.Description != ""},
		Status:         status,
		Color:          color,
		IconName:       iconName,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update role: %w", err)
	}

	// Replace permissions: delete all then re-insert into role_permissions
	if err := qtx.DeleteRolePermissions(ctx, id); err != nil {
		return nil, fmt.Errorf("failed to clear old permissions: %w", err)
	}
	for _, permID := range req.Permissions {
		if err := qtx.AddRolePermission(ctx, db.AddRolePermissionParams{
			RoleID:       id,
			PermissionID: permID,
		}); err != nil {
			return nil, fmt.Errorf("failed to assign permission %s: %w", permID, err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	result := dbRoleToDetail(dbRole, req.Permissions)
	return &result, nil
}

// DeleteRole removes a role from the database (role_permissions cascade automatically).
func (s *Service) DeleteRole(ctx context.Context, id int32) error {
	if err := s.q.DeleteRole(ctx, id); err != nil {
		return fmt.Errorf("failed to delete role: %w", err)
	}
	return nil
}

// SeedRoles gives every institution that has no roles yet the canonical default roles.
func (s *Service) SeedRoles(ctx context.Context) error {
	institutionIDs, err := s.q.ListInstitutionsWithoutRoles(ctx)
	if err != nil {
		return fmt.Errorf("failed to list institutions without roles: %w", err)
	}

	for _, institutionID := range institutionIDs {
		tx, err := s.pool.Begin(ctx)
		if err != nil {
			return fmt.Errorf("failed to begin seed tx: %w", err)
		}
		if err := s.SeedInstitutionRoles(ctx, tx, institutionID); err != nil {
			tx.Rollback(ctx)
			return err
		}
		if err := tx.Commit(ctx); err != nil {
			return fmt.Errorf("failed to commit seed roles for %s: %w", institutionID, err)
		}
	}

	return nil
}

// SeedInstitutionRoles creates the canonical default roles for one institution within tx.
func (s *Service) SeedInstitutionRoles(ctx context.Context, tx pgx.Tx, institutionID string) error {
	qtx := s.q.WithTx(tx)

	for _, dr := range DefaultInitialRoles {
		deptName := pgtype.Text{}
		if dr.Department != "" {
			if _, err := tx.Exec(ctx, "INSERT INTO departments (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", dr.Department); err != nil {
				return fmt.Errorf("failed to seed department %s: %w", dr.Department, err)
			}
			deptName = pgtype.Text{String: dr.Department, Valid: true}
		}

		createdRole, err := qtx.CreateRole(ctx, db.CreateRoleParams{
			Name:           dr.Name,
			Slug:           dr.Slug,
			DepartmentName: deptName,
			Description:    pgtype.Text{String: dr.Description, Valid: dr.Description != ""},
			Status:         dr.Status,
			IsSystem:       dr.IsSystem,
			Color:          dr.Color,
			IconName:       dr.IconName,
			InstitutionID:  institutionID,
		})
		if err != nil {
			return fmt.Errorf("failed to seed role %s for %s: %w", dr.Name, institutionID, err)
		}

		for _, permID := range dr.Permissions {
			if err := qtx.AddRolePermission(ctx, db.AddRolePermissionParams{
				RoleID:       createdRole.ID,
				PermissionID: permID,
			}); err != nil {
				return fmt.Errorf("failed to assign seed permission %s to role %d: %w", permID, createdRole.ID, err)
			}
		}
	}

	return nil
}
