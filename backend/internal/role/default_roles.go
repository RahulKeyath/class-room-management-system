package role

// DefaultRoleDefinition defines the structure for initial institutional roles.
type DefaultRoleDefinition struct {
	Name        string
	Slug        string
	Department  string
	Description string
	Status      string
	IsSystem    bool
	Color       string
	IconName    string
	Permissions []string
}

// DefaultInitialRoles contains canonical initial roles to seed for each institution.
var DefaultInitialRoles = []DefaultRoleDefinition{
	{
		Name:        "Administrator",
		Slug:        "admin",
		Department:  "Administration",
		Description: "Full administrative oversight with authority over academic records, personnel, and institutional settings.",
		Status:      "active",
		IsSystem:    true,
		Color:       "indigo",
		IconName:    "ShieldCheck",
		Permissions: []string{
			"attendance.view", "attendance.mark", "attendance.edit", "attendance.export",
			"academics.courses", "academics.grades", "academics.timetable",
			"students.view", "students.edit", "students.guardians",
			"system.roles", "system.users", "system.audit",
		},
	},
	{
		Name:        "Faculty",
		Slug:        "teacher",
		Department:  "Academics",
		Description: "Teaching instructors, professors, and department heads responsible for classroom delivery and grading.",
		Status:      "active",
		IsSystem:    true,
		Color:       "violet",
		IconName:    "Users",
		Permissions: []string{
			"attendance.view", "attendance.mark", "attendance.export",
			"academics.courses", "academics.grades", "academics.timetable",
			"students.view",
		},
	},
	{
		Name:        "Student",
		Slug:        "student",
		Department:  "Student Affairs",
		Description: "Enrolled scholars with read access to personal timetables, submitted grades, and attendance track records.",
		Status:      "active",
		IsSystem:    true,
		Color:       "emerald",
		IconName:    "GraduationCap",
		Permissions: []string{"attendance.view", "academics.timetable"},
	},
	{
		Name:        "Staff",
		Slug:        "staff",
		Department:  "Operations",
		Description: "Operational, clerical, and registrar personnel managing student records, admissions, and campus services.",
		Status:      "active",
		IsSystem:    true,
		Color:       "sky",
		IconName:    "Briefcase",
		Permissions: []string{
			"attendance.view", "attendance.export",
			"students.view", "students.edit", "students.guardians",
		},
	},
	{
		Name:        "Parent",
		Slug:        "parent",
		Department:  "Student Affairs",
		Description: "Parents and sponsors accessing academic performance, attendance alerts, and institutional announcements.",
		Status:      "inactive",
		IsSystem:    false,
		Color:       "amber",
		IconName:    "HeartHandshake",
		Permissions: []string{"attendance.view"},
	},
	{
		Name:        "Exam Coordinator",
		Slug:        "exam_coordinator",
		Department:  "Academics",
		Description: "Specialized faculty overseeing exam hall logistics, invigilation duty rosters, and final report cards.",
		Status:      "active",
		IsSystem:    false,
		Color:       "rose",
		IconName:    "Award",
		Permissions: []string{
			"attendance.view", "academics.grades", "academics.timetable", "students.view",
		},
	},
}
