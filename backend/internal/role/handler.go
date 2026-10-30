package role

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)


// Handler exposes HTTP endpoints for the role domain.
type Handler struct {
	service *Service
}

// NewHandler creates a new role HTTP handler.
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// List handles GET /api/v1/roles (legacy user_roles table)
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	roles, err := h.service.ListActive(r.Context())
	if err != nil {
		http.Error(w, `{"error":"failed to list roles"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(roles); err != nil {
		http.Error(w, `{"error":"failed to encode roles"}`, http.StatusInternalServerError)
	}
}

func (h *Handler) ListDepartments(w http.ResponseWriter, r *http.Request) {
	departments, err := h.service.ListDepartments(r.Context())
	if err != nil {
		http.Error(w, `{"error":"failed to list departments"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(departments)
}

type CreateDepartmentRequest struct {
	Name string `json:"name"`
}

func (h *Handler) CreateDepartment(w http.ResponseWriter, r *http.Request) {
	var req CreateDepartmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" {
		http.Error(w, `{"error":"invalid department name"}`, http.StatusBadRequest)
		return
	}

	created, err := h.service.CreateDepartment(r.Context(), req.Name)
	if err != nil {
		http.Error(w, `{"error":"failed to create department"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func (h *Handler) DeleteDepartment(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "name")
	if name == "" {
		http.Error(w, `{"error":"department name required"}`, http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteDepartment(r.Context(), name); err != nil {
		http.Error(w, `{"error":"failed to delete department"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// ListPermissions handles GET /api/v1/permissions
func (h *Handler) ListPermissions(w http.ResponseWriter, r *http.Request) {
	permissions, err := h.service.ListPermissions(r.Context())
	if err != nil {
		http.Error(w, `{"error":"failed to list permissions"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(permissions); err != nil {
		http.Error(w, `{"error":"failed to encode permissions"}`, http.StatusInternalServerError)
	}
}

// SeedPermissions handles POST /api/v1/permissions/seed
func (h *Handler) SeedPermissions(w http.ResponseWriter, r *http.Request) {
	if err := h.service.SeedPermissions(r.Context()); err != nil {
		http.Error(w, `{"error":"failed to seed permissions"}`, http.StatusInternalServerError)
		return
	}

	permissions, err := h.service.ListPermissions(r.Context())
	if err != nil {
		http.Error(w, `{"error":"failed to list seeded permissions"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(permissions)
}

// ListAllRoles handles GET /api/v1/institutional-roles. With ?institution_id it
// returns that institution's active roles; otherwise every role (for super-admin).
func (h *Handler) ListAllRoles(w http.ResponseWriter, r *http.Request) {
	var (
		roles []RoleDetail
		err   error
	)
	if instStr := r.URL.Query().Get("institution_id"); instStr != "" {
		instID, parseErr := strconv.Atoi(instStr)
		if parseErr != nil || instID <= 0 {
			http.Error(w, `{"error":"invalid institution_id parameter"}`, http.StatusBadRequest)
			return
		}
		roles, err = h.service.ListByInstitution(r.Context(), int32(instID))
	} else {
		roles, err = h.service.ListAllRoles(r.Context())
	}
	if err != nil {
		http.Error(w, `{"error":"failed to list roles"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(roles)
}

// CreateRole handles POST /api/v1/institutional-roles
func (h *Handler) CreateRole(w http.ResponseWriter, r *http.Request) {
	var req CreateRoleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		http.Error(w, `{"error":"role name is required"}`, http.StatusBadRequest)
		return
	}
	if req.InstitutionID <= 0 {
		http.Error(w, `{"error":"valid institution id is required"}`, http.StatusBadRequest)
		return
	}
	req.Slug = strings.TrimSpace(req.Slug)
	if req.Slug == "" {
		req.Slug = strings.ToLower(strings.ReplaceAll(req.Name, " ", "_"))
	}

	created, err := h.service.CreateRole(r.Context(), req)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") || strings.Contains(err.Error(), "uq_roles_institution_slug") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "A role with the system key '" + req.Slug + "' already exists. Please choose a different identifier.",
			})
			return
		}
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

// UpdateRole handles PUT /api/v1/institutional-roles/{id}
func (h *Handler) UpdateRole(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		http.Error(w, `{"error":"invalid role id"}`, http.StatusBadRequest)
		return
	}

	var req UpdateRoleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		http.Error(w, `{"error":"role name is required"}`, http.StatusBadRequest)
		return
	}
	req.Slug = strings.TrimSpace(req.Slug)
	if req.Slug == "" {
		req.Slug = strings.ToLower(strings.ReplaceAll(req.Name, " ", "_"))
	}

	updated, err := h.service.UpdateRole(r.Context(), int32(id), req)
	if err != nil {
		if errors.Is(err, ErrInstitutionMismatch) {
			http.Error(w, `{"error":"role does not belong to this institution"}`, http.StatusBadRequest)
			return
		}
		if strings.Contains(err.Error(), "duplicate key value") || strings.Contains(err.Error(), "uq_roles_institution_slug") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "A role with the system key '" + req.Slug + "' already exists. Please choose a different identifier.",
			})
			return
		}
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updated)
}

// DeleteRole handles DELETE /api/v1/institutional-roles/{id}
func (h *Handler) DeleteRole(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		http.Error(w, `{"error":"invalid role id"}`, http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteRole(r.Context(), int32(id)); err != nil {
		http.Error(w, `{"error":"failed to delete role"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}