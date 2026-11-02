package auth

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const testSecret = "test-secret"

func testClaims() Claims {
	return Claims{UserID: 7, InstitutionID: 3, RoleID: 11, RoleSlug: "admin", Email: "e.vance@northgate.edu"}
}

func signClaims(t *testing.T, method jwt.SigningMethod, key any, claims Claims) string {
	t.Helper()
	signed, err := jwt.NewWithClaims(method, claims).SignedString(key)
	if err != nil {
		t.Fatalf("sign token: %v", err)
	}
	return signed
}

func TestPasswordHashRoundTrip(t *testing.T) {
	hash, err := HashPassword("Admin#2026")
	if err != nil {
		t.Fatalf("HashPassword: %v", err)
	}
	if !VerifyPassword("Admin#2026", hash) {
		t.Error("correct password was rejected")
	}
	if VerifyPassword("admin#2026", hash) {
		t.Error("wrong password was accepted")
	}
	if VerifyPassword("Admin#2026", "") {
		t.Error("empty hash was accepted")
	}
}

func TestTokenRoundTrip(t *testing.T) {
	token, err := GenerateToken(testClaims(), testSecret)
	if err != nil {
		t.Fatalf("GenerateToken: %v", err)
	}
	claims, err := ParseToken(token, testSecret)
	if err != nil {
		t.Fatalf("ParseToken: %v", err)
	}
	want := testClaims()
	if claims.UserID != want.UserID || claims.InstitutionID != want.InstitutionID ||
		claims.RoleID != want.RoleID || claims.RoleSlug != want.RoleSlug || claims.Email != want.Email {
		t.Errorf("claims = %+v, want %+v", claims, want)
	}
}

func TestParseTokenRejects(t *testing.T) {
	valid, err := GenerateToken(testClaims(), testSecret)
	if err != nil {
		t.Fatalf("GenerateToken: %v", err)
	}

	expired := testClaims()
	expired.ExpiresAt = jwt.NewNumericDate(time.Now().Add(-time.Minute))

	future := jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour))}
	wrongAlg := testClaims()
	wrongAlg.RegisteredClaims = future

	tests := map[string]string{
		"garbage":      "not-a-token",
		"tampered":     valid + "x",
		"wrong secret": signClaims(t, jwt.SigningMethodHS256, []byte("other-secret"), withExpiry(testClaims())),
		"expired":      signClaims(t, jwt.SigningMethodHS256, []byte(testSecret), expired),
		"no expiry":    signClaims(t, jwt.SigningMethodHS256, []byte(testSecret), testClaims()),
		"wrong alg":    signClaims(t, jwt.SigningMethodHS512, []byte(testSecret), wrongAlg),
		"alg none":     signClaims(t, jwt.SigningMethodNone, jwt.UnsafeAllowNoneSignatureType, withExpiry(testClaims())),
	}
	for name, token := range tests {
		t.Run(name, func(t *testing.T) {
			if _, err := ParseToken(token, testSecret); err == nil {
				t.Error("token was accepted")
			}
		})
	}
}

func withExpiry(c Claims) Claims {
	c.ExpiresAt = jwt.NewNumericDate(time.Now().Add(time.Hour))
	return c
}

func TestAuthMiddlewareRejects(t *testing.T) {
	handler := AuthMiddleware(testSecret)(http.HandlerFunc(func(http.ResponseWriter, *http.Request) {
		t.Error("next handler was called")
	}))

	for name, header := range map[string]string{
		"missing":      "",
		"wrong scheme": "Basic abc",
		"no token":     "Bearer",
		"invalid":      "Bearer not-a-token",
	} {
		t.Run(name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/", nil)
			if header != "" {
				req.Header.Set("Authorization", header)
			}
			rec := httptest.NewRecorder()
			handler.ServeHTTP(rec, req)
			if rec.Code != http.StatusUnauthorized {
				t.Errorf("status = %d, want 401", rec.Code)
			}
		})
	}
}

func TestAuthMiddlewareAttachesIdentity(t *testing.T) {
	token, err := GenerateToken(testClaims(), testSecret)
	if err != nil {
		t.Fatalf("GenerateToken: %v", err)
	}

	called := false
	handler := AuthMiddleware(testSecret)(http.HandlerFunc(func(_ http.ResponseWriter, r *http.Request) {
		called = true
		if id, ok := UserIDFromContext(r.Context()); !ok || id != 7 {
			t.Errorf("user id = %d, %v", id, ok)
		}
		if id, ok := InstitutionIDFromContext(r.Context()); !ok || id != 3 {
			t.Errorf("institution id = %d, %v", id, ok)
		}
		if slug, ok := RoleSlugFromContext(r.Context()); !ok || slug != "admin" {
			t.Errorf("role slug = %q, %v", slug, ok)
		}
	}))

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if !called || rec.Code != http.StatusOK {
		t.Errorf("called = %v, status = %d", called, rec.Code)
	}
}
