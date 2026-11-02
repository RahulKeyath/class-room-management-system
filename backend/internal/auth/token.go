package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// tokenTTL is how long an issued JWT stays valid.
const tokenTTL = 24 * time.Hour

// Claims is the JWT payload issued at login.
type Claims struct {
	UserID        int64  `json:"user_id"`
	InstitutionID int32  `json:"institution_id"`
	RoleID        int32  `json:"role_id"`
	RoleSlug      string `json:"role_slug"`
	Email         string `json:"email"`
	jwt.RegisteredClaims
}

// GenerateToken signs the given claims with an expiry of tokenTTL from now.
func GenerateToken(claims Claims, secret string) (string, error) {
	now := time.Now()
	claims.RegisteredClaims = jwt.RegisteredClaims{
		IssuedAt:  jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(tokenTTL)),
	}
	signed, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}
	return signed, nil
}

// ParseToken validates the signature, algorithm and expiry of a JWT and returns its claims.
func ParseToken(tokenString, secret string) (*Claims, error) {
	claims := &Claims{}
	_, err := jwt.ParseWithClaims(tokenString, claims, func(*jwt.Token) (any, error) {
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}), jwt.WithExpirationRequired())
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}
	return claims, nil
}
