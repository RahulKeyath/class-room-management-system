package auth

// demoPersona defines a demo account seeded for every institution.
type demoPersona struct {
	LocalPart  string
	Password   string
	Name       string
	RoleSlug   string
	Title      string
	Department string
}

// demoPersonas are seeded per institution on the institution's own domain.
var demoPersonas = []demoPersona{
	{
		LocalPart:  "e.vance",
		Password:   "Admin#2026",
		Name:       "Dr. Eleanor Vance",
		RoleSlug:   "admin",
		Title:      "Principal & Institutional Director",
		Department: "Office of the Principal",
	},
	{
		LocalPart:  "j.carter",
		Password:   "Teacher#2026",
		Name:       "Mr. James Carter",
		RoleSlug:   "teacher",
		Title:      "Senior Faculty • Mathematics",
		Department: "Department of Mathematics",
	},
	{
		LocalPart:  "a.sharma",
		Password:   "Student#2026",
		Name:       "Aarav Sharma",
		RoleSlug:   "student",
		Title:      "Scholar • Grade 10 - Section A",
		Department: "Senior Secondary Division",
	},
	{
		LocalPart:  "d.wilson",
		Password:   "Staff#2026",
		Name:       "Mr. David Wilson",
		RoleSlug:   "staff",
		Title:      "Senior Registrar • Campus Operations",
		Department: "Office of the Registrar",
	},
	{
		LocalPart:  "m.sharma",
		Password:   "Parent#2026",
		Name:       "Mrs. Meera Sharma",
		RoleSlug:   "parent",
		Title:      "Guardian • Grade 10 - Section A",
		Department: "Parent-Teacher Association",
	},
}
