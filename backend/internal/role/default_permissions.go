package role

// DefaultPermissions contains the canonical set of permissions for the system.
var DefaultPermissions = []Permission{
	// Attendance Domain
	{
		ID:          "attendance.view",
		Name:        "View Attendance Records",
		Description: "Inspect daily class attendance rolls, statistics, and trends.",
		Category:    "Attendance",
	},
	{
		ID:          "attendance.mark",
		Name:        "Mark & Submit Attendance",
		Description: "Take daily morning/evening attendance for assigned classes.",
		Category:    "Attendance",
	},
	{
		ID:          "attendance.edit",
		Name:        "Override Past Attendance",
		Description: "Modify attendance logs after submission with change audit.",
		Category:    "Attendance",
	},
	{
		ID:          "attendance.export",
		Name:        "Export Attendance Reports",
		Description: "Download CSV, Excel, and PDF attendance summaries.",
		Category:    "Attendance",
	},

	// Academics Domain
	{
		ID:          "academics.courses",
		Name:        "Course & Curriculum Management",
		Description: "Create course sections, syllabi, and assign teaching faculty.",
		Category:    "Academics",
	},
	{
		ID:          "academics.grades",
		Name:        "Grading & Performance Records",
		Description: "Enter test scores, semester grades, and calculate GPAs.",
		Category:    "Academics",
	},
	{
		ID:          "academics.timetable",
		Name:        "Timetable & Room Scheduling",
		Description: "Schedule class periods, labs, and allocate classroom facilities.",
		Category:    "Academics",
	},

	// Students Domain
	{
		ID:          "students.view",
		Name:        "View Student Roster",
		Description: "Access student personal records, enrollments, and guardians.",
		Category:    "Students",
	},
	{
		ID:          "students.edit",
		Name:        "Manage Student Profiles",
		Description: "Enroll new students, update contact details, and transfer classes.",
		Category:    "Students",
	},
	{
		ID:          "students.guardians",
		Name:        "Guardian Communications",
		Description: "Send broadcast notices, emails, and SMS alerts to sponsors.",
		Category:    "Students",
	},

	// System & Security Domain
	{
		ID:          "system.roles",
		Name:        "Roles & Access Control",
		Description: "Create, modify, and assign institutional security roles.",
		Category:    "System",
	},
	{
		ID:          "system.users",
		Name:        "User Account Provisioning",
		Description: "Create new user logins, reset passwords, and revoke access.",
		Category:    "System",
	},
	{
		ID:          "system.audit",
		Name:        "Security Audit Logs",
		Description: "Inspect detailed logs of user actions and sensitive overrides.",
		Category:    "System",
	},
}
