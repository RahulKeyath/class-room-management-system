package institution

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"
)

var domainPattern = regexp.MustCompile(`^[a-z0-9-]+(\.[a-z0-9-]+)+$`)

var validTypes = map[string]bool{
	"K-12 Campus":          true,
	"University":           true,
	"Autonomous":           true,
	"International School": true,
}

// Handler exposes HTTP endpoints for the institution domain.
type Handler struct {
	service *Service
}

// NewHandler creates a new institution HTTP handler.
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// List handles GET /api/v1/institutions
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	institutions, err := h.service.List(r.Context())
	if err != nil {
		http.Error(w, `{"error":"failed to list institutions"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(institutions)
}

// Create handles POST /api/v1/institutions
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateInstitutionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	if msg := normalizeAndValidate(&req); msg != "" {
		http.Error(w, fmt.Sprintf(`{"error":%q}`, msg), http.StatusBadRequest)
		return
	}

	created, err := h.service.Create(r.Context(), req)
	if errors.Is(err, ErrDuplicate) {
		http.Error(w, `{"error":"campus code or domain is already registered"}`, http.StatusConflict)
		return
	}
	if err != nil {
		http.Error(w, `{"error":"failed to create institution"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

// normalizeAndValidate trims/canonicalizes the request and returns the first problem found.
func normalizeAndValidate(req *CreateInstitutionRequest) string {
	req.Name = strings.TrimSpace(req.Name)
	req.ShortName = strings.TrimSpace(req.ShortName)
	req.Code = strings.ToUpper(strings.TrimSpace(req.Code))
	req.City = strings.TrimSpace(req.City)
	req.Campus = strings.TrimSpace(req.Campus)
	req.Domain = strings.ToLower(strings.TrimSpace(req.Domain))
	req.Motto = strings.TrimSpace(req.Motto)
	req.Gradient = strings.TrimSpace(req.Gradient)

	switch {
	case req.Name == "":
		return "name is required"
	case req.ShortName == "":
		return "shortName is required"
	case req.Code == "":
		return "code is required"
	case req.City == "" || req.Campus == "":
		return "city and campus are required"
	case !validTypes[req.Type]:
		return "type is invalid"
	case !domainPattern.MatchString(req.Domain):
		return "domain is invalid"
	case req.Established < 1800 || int(req.Established) > time.Now().Year():
		return "established year is out of range"
	}
	return ""
}
