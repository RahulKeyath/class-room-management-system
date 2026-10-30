CREATE TABLE IF NOT EXISTS institutions (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    short_name  VARCHAR(100) NOT NULL,
    code        VARCHAR(50) NOT NULL UNIQUE,
    type        VARCHAR(50) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    campus      VARCHAR(100) NOT NULL,
    domain      VARCHAR(255) NOT NULL UNIQUE,
    established INTEGER NOT NULL,
    motto       TEXT DEFAULT '',
    gradient    VARCHAR(100) NOT NULL DEFAULT 'from-blue-500 to-indigo-600',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_institutions_domain ON institutions(domain);
CREATE INDEX IF NOT EXISTS idx_institutions_code ON institutions(code);
