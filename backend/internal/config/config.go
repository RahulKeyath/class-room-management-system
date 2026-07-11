package config

import "os"

// Config holds application-wide configuration values loaded from
// environment variables.
type Config struct {
	// DatabaseURL is the PostgreSQL connection string.
	// Example: postgres://user:pass@localhost:5432/classroom_db?sslmode=disable
	DatabaseURL string

	// Port is the HTTP port the API server listens on.
	Port string
}

// Load reads configuration from environment variables, falling back
// to sensible defaults for local development.
func Load() Config {
	return Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://crm_user:crm_password@localhost:5432/classroom_db?sslmode=disable"),
		Port:        getEnv("PORT", "8000"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
