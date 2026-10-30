package institution

// Institution is a campus tenant that users pick on the login screen.
type Institution struct {
	ID          int32  `json:"id"`
	Name        string `json:"name"`
	ShortName   string `json:"shortName"`
	Code        string `json:"code"`
	Type        string `json:"type"`
	City        string `json:"city"`
	Campus      string `json:"campus"`
	Domain      string `json:"domain"`
	Established int32  `json:"established"`
	Motto       string `json:"motto"`
	Gradient    string `json:"gradient"`
}

// CreateInstitutionRequest is the payload for POST /api/v1/institutions.
type CreateInstitutionRequest struct {
	Name        string `json:"name"`
	ShortName   string `json:"shortName"`
	Code        string `json:"code"`
	Type        string `json:"type"`
	City        string `json:"city"`
	Campus      string `json:"campus"`
	Domain      string `json:"domain"`
	Established int32  `json:"established"`
	Motto       string `json:"motto"`
	Gradient    string `json:"gradient"`
}
