package auth

import (
	"context"
	"net/http"
	"strings"
)

type contextKey string

const (
	userIDKey        contextKey = "user_id"
	institutionIDKey contextKey = "institution_id"
	roleSlugKey      contextKey = "role_slug"
)

// AuthMiddleware rejects requests without a valid bearer token and attaches
// the authenticated identity to the request context.
func AuthMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			scheme, token, found := strings.Cut(r.Header.Get("Authorization"), " ")
			if !found || !strings.EqualFold(scheme, "Bearer") {
				http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
				return
			}

			claims, err := ParseToken(strings.TrimSpace(token), jwtSecret)
			if err != nil {
				http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userIDKey, claims.UserID)
			ctx = context.WithValue(ctx, institutionIDKey, claims.InstitutionID)
			ctx = context.WithValue(ctx, roleSlugKey, claims.RoleSlug)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// UserIDFromContext returns the authenticated user's ID.
func UserIDFromContext(ctx context.Context) (int64, bool) {
	id, ok := ctx.Value(userIDKey).(int64)
	return id, ok
}

// InstitutionIDFromContext returns the authenticated user's institution ID.
func InstitutionIDFromContext(ctx context.Context) (int32, bool) {
	id, ok := ctx.Value(institutionIDKey).(int32)
	return id, ok
}

// RoleSlugFromContext returns the authenticated user's role slug.
func RoleSlugFromContext(ctx context.Context) (string, bool) {
	slug, ok := ctx.Value(roleSlugKey).(string)
	return slug, ok
}
