package auth

// LoginRequest is the expected JSON payload for POST /api/v1/auth/login.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse is the JSON returned after a successful login.
type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// UserResponse is the JSON representation of an authenticated user.
type UserResponse struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	Role          string `json:"role"`
	Title         string `json:"title"`
	Department    string `json:"department"`
	InstitutionID int32  `json:"institution_id"`
}
