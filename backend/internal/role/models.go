package role

// Role represents a user role in the old user_roles table.
type Role struct {
	ID     int32  `json:"id"`
	Role   string `json:"role"`
	Status string `json:"status"`
}

type Department struct {
	ID   int32  `json:"id"`
	Name string `json:"name"`
}

type Permission struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

// RoleDetail is the full role representation returned by the API,
// including its granted permission IDs.
type RoleDetail struct {
	ID             int32    `json:"id"`
	Name           string   `json:"name"`
	Slug           string   `json:"slug"`
	DepartmentName string   `json:"department"`
	Description    string   `json:"description"`
	Status         string   `json:"status"`
	IsSystem       bool     `json:"isSystem"`
	Color          string   `json:"color"`
	IconName       string   `json:"iconName"`
	Permissions    []string `json:"permissions"`
	CreatedAt      string   `json:"createdAt"`
	UpdatedAt      string   `json:"updatedAt"`
	InstitutionID  string   `json:"institutionId"`
}

// CreateRoleRequest is the JSON body for POST /api/v1/roles
type CreateRoleRequest struct {
	Name          string   `json:"name"`
	Slug          string   `json:"slug"`
	Department    string   `json:"department"`
	Description   string   `json:"description"`
	Status        string   `json:"status"`
	Color         string   `json:"color"`
	IconName      string   `json:"iconName"`
	Permissions   []string `json:"permissions"`
	InstitutionID string   `json:"institutionId"`
}

// UpdateRoleRequest is the JSON body for PUT /api/v1/roles/{id}
type UpdateRoleRequest struct {
	Name          string   `json:"name"`
	Slug          string   `json:"slug"`
	Department    string   `json:"department"`
	Description   string   `json:"description"`
	Status        string   `json:"status"`
	Color         string   `json:"color"`
	IconName      string   `json:"iconName"`
	Permissions   []string `json:"permissions"`
	InstitutionID string   `json:"institutionId"`
}
