package attendance

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// Handler exposes HTTP endpoints for the attendance domain.
type Handler struct {
	service *Service
}

// NewHandler creates a new attendance HTTP handler.
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// List handles GET /api/v1/attendance
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	records, err := h.service.List(r.Context())
	if err != nil {
		http.Error(w, `{"error":"failed to list attendance"}`, http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusOK, records)
}

// GetByID handles GET /api/v1/attendance/{id}
func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	record, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, `{"error":"failed to get attendance record"}`, http.StatusInternalServerError)
		return
	}
	if record == nil {
		http.Error(w, `{"error":"not found"}`, http.StatusNotFound)
		return
	}
	writeJSON(w, http.StatusOK, record)
}

// MarkAttendance handles POST /api/v1/attendance
func (h *Handler) MarkAttendance(w http.ResponseWriter, r *http.Request) {
	var req MarkAttendanceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	record, err := h.service.MarkAttendance(r.Context(), req)
	if err != nil {
		http.Error(w, `{"error":"failed to mark attendance"}`, http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusCreated, record)
}

// writeJSON is a helper to send a JSON response.
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
