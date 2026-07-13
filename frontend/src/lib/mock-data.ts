export type Role = "admin" | "teacher" | "student";

export const CURRENT_USER = {
  admin: { name: "Dr. Eleanor Vance", title: "Principal", id: "ADM-001", avatar: "EV" },
  teacher: { name: "Mr. James Carter", title: "Mathematics Dept.", id: "TCH-014", avatar: "JC" },
  student: { name: "Aarav Sharma", title: "Grade 10 - Section A", id: "STU-2041", avatar: "AS" },
};

export const STATS = {
  totalStudents: 1248,
  totalStaff: 86,
  attendanceToday: 94.2,
  classesToday: 42,
};

export const STUDENTS = [
  { id: "STU-2041", name: "Aarav Sharma", grade: "10-A", attendance: 96, gpa: 3.8, status: "Present" },
  { id: "STU-2042", name: "Priya Patel", grade: "10-A", attendance: 98, gpa: 3.9, status: "Present" },
  { id: "STU-2043", name: "Marcus Johnson", grade: "10-A", attendance: 88, gpa: 3.4, status: "Absent" },
  { id: "STU-2044", name: "Sophia Chen", grade: "10-A", attendance: 92, gpa: 3.7, status: "Present" },
  { id: "STU-2045", name: "Liam O'Connor", grade: "10-A", attendance: 85, gpa: 3.2, status: "Late" },
  { id: "STU-2046", name: "Isabella Rossi", grade: "10-A", attendance: 99, gpa: 4.0, status: "Present" },
  { id: "STU-2047", name: "Noah Williams", grade: "10-B", attendance: 91, gpa: 3.5, status: "Present" },
  { id: "STU-2048", name: "Mia Garcia", grade: "10-B", attendance: 94, gpa: 3.6, status: "Present" },
  { id: "STU-2049", name: "Ethan Brown", grade: "10-B", attendance: 79, gpa: 2.9, status: "Absent" },
  { id: "STU-2050", name: "Ava Kim", grade: "10-B", attendance: 97, gpa: 3.85, status: "Present" },
];

export const STAFF = [
  { id: "TCH-014", name: "James Carter", dept: "Mathematics", attendance: 98, status: "Present" },
  { id: "TCH-015", name: "Sarah Mitchell", dept: "English", attendance: 95, status: "Present" },
  { id: "TCH-016", name: "Robert Kapoor", dept: "Physics", attendance: 92, status: "Present" },
  { id: "TCH-017", name: "Linda Park", dept: "Biology", attendance: 100, status: "Present" },
  { id: "TCH-018", name: "David Nguyen", dept: "History", attendance: 88, status: "On Leave" },
  { id: "TCH-019", name: "Maria Silva", dept: "Chemistry", attendance: 96, status: "Present" },
];

export const SUBJECTS = [
  "Mathematics",
  "English Literature",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Computer Science",
];

export const TIMETABLE = {
  periods: ["08:30 - 09:20", "09:25 - 10:15", "10:20 - 11:10", "11:30 - 12:20", "12:25 - 13:15", "14:00 - 14:50"],
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  schedule: [
    // Monday
    [
      { subject: "Mathematics", teacher: "Mr. Carter", room: "201" },
      { subject: "Physics", teacher: "Mr. Kapoor", room: "Lab 1" },
      { subject: "English", teacher: "Ms. Mitchell", room: "105" },
      { subject: "History", teacher: "Mr. Nguyen", room: "302" },
      { subject: "Biology", teacher: "Ms. Park", room: "Lab 2" },
      { subject: "Computer Sci.", teacher: "Mr. Lee", room: "Lab 3" },
    ],
    // Tuesday
    [
      { subject: "Chemistry", teacher: "Ms. Silva", room: "Lab 4" },
      { subject: "Mathematics", teacher: "Mr. Carter", room: "201" },
      { subject: "English", teacher: "Ms. Mitchell", room: "105" },
      { subject: "P.E.", teacher: "Coach Reed", room: "Gym" },
      { subject: "Physics", teacher: "Mr. Kapoor", room: "Lab 1" },
      { subject: "Library", teacher: "Ms. Hart", room: "Lib" },
    ],
    // Wednesday
    [
      { subject: "Biology", teacher: "Ms. Park", room: "Lab 2" },
      { subject: "History", teacher: "Mr. Nguyen", room: "302" },
      { subject: "Mathematics", teacher: "Mr. Carter", room: "201" },
      { subject: "Computer Sci.", teacher: "Mr. Lee", room: "Lab 3" },
      { subject: "Chemistry", teacher: "Ms. Silva", room: "Lab 4" },
      { subject: "Art", teacher: "Ms. Quinn", room: "Studio" },
    ],
    // Thursday
    [
      { subject: "English", teacher: "Ms. Mitchell", room: "105" },
      { subject: "Mathematics", teacher: "Mr. Carter", room: "201" },
      { subject: "Physics", teacher: "Mr. Kapoor", room: "Lab 1" },
      { subject: "Biology", teacher: "Ms. Park", room: "Lab 2" },
      { subject: "Music", teacher: "Mr. Adler", room: "Music Hall" },
      { subject: "History", teacher: "Mr. Nguyen", room: "302" },
    ],
    // Friday
    [
      { subject: "Computer Sci.", teacher: "Mr. Lee", room: "Lab 3" },
      { subject: "Chemistry", teacher: "Ms. Silva", room: "Lab 4" },
      { subject: "Mathematics", teacher: "Mr. Carter", room: "201" },
      { subject: "English", teacher: "Ms. Mitchell", room: "105" },
      { subject: "P.E.", teacher: "Coach Reed", room: "Gym" },
      { subject: "Assembly", teacher: "All Staff", room: "Hall" },
    ],
  ],
};

export const RESULTS = [
  { subject: "Mathematics", marks: 92, max: 100, grade: "A", remarks: "Excellent" },
  { subject: "English Literature", marks: 86, max: 100, grade: "A", remarks: "Very Good" },
  { subject: "Physics", marks: 88, max: 100, grade: "A", remarks: "Very Good" },
  { subject: "Chemistry", marks: 79, max: 100, grade: "B+", remarks: "Good" },
  { subject: "Biology", marks: 91, max: 100, grade: "A", remarks: "Excellent" },
  { subject: "History", marks: 74, max: 100, grade: "B", remarks: "Satisfactory" },
  { subject: "Computer Science", marks: 95, max: 100, grade: "A+", remarks: "Outstanding" },
];

export const PERFORMANCE_TREND = [
  { term: "Term 1", score: 78 },
  { term: "Term 2", score: 82 },
  { term: "Mid-Year", score: 85 },
  { term: "Term 3", score: 84 },
  { term: "Term 4", score: 88 },
  { term: "Final", score: 86.4 },
];

export const SUBJECT_BREAKDOWN = [
  { subject: "Math", score: 92, class: 78 },
  { subject: "English", score: 86, class: 80 },
  { subject: "Physics", score: 88, class: 75 },
  { subject: "Chemistry", score: 79, class: 76 },
  { subject: "Biology", score: 91, class: 82 },
  { subject: "History", score: 74, class: 79 },
  { subject: "CS", score: 95, class: 84 },
];

export const SYLLABUS: Record<string, { unit: string; topics: string[]; progress: number }[]> = {
  Mathematics: [
    { unit: "Unit 1: Real Numbers", topics: ["Euclid's Algorithm", "Rational & Irrational Numbers", "Decimal Expansions"], progress: 100 },
    { unit: "Unit 2: Polynomials", topics: ["Zeroes of a Polynomial", "Division Algorithm", "Geometric Meaning"], progress: 100 },
    { unit: "Unit 3: Linear Equations", topics: ["Pair of Equations", "Substitution", "Elimination", "Cross-Multiplication"], progress: 80 },
    { unit: "Unit 4: Trigonometry", topics: ["Trig Ratios", "Identities", "Heights & Distances"], progress: 55 },
    { unit: "Unit 5: Statistics & Probability", topics: ["Mean, Median, Mode", "Cumulative Frequency", "Probability"], progress: 20 },
  ],
  "English Literature": [
    { unit: "Prose: First Flight", topics: ["A Letter to God", "Nelson Mandela", "Two Stories About Flying"], progress: 90 },
    { unit: "Poetry", topics: ["Dust of Snow", "Fire and Ice", "A Tiger in the Zoo"], progress: 75 },
    { unit: "Drama", topics: ["The Proposal"], progress: 40 },
    { unit: "Writing Skills", topics: ["Letter Writing", "Analytical Paragraph"], progress: 60 },
  ],
  Physics: [
    { unit: "Light - Reflection & Refraction", topics: ["Spherical Mirrors", "Lens Formula", "Power of Lens"], progress: 100 },
    { unit: "Human Eye & Colourful World", topics: ["Defects of Vision", "Dispersion", "Scattering"], progress: 70 },
    { unit: "Electricity", topics: ["Ohm's Law", "Resistance", "Circuit Diagrams"], progress: 50 },
    { unit: "Magnetic Effects", topics: ["Magnetic Field", "Electromagnetic Induction"], progress: 10 },
  ],
  Chemistry: [
    { unit: "Chemical Reactions & Equations", topics: ["Types of Reactions", "Balancing", "Oxidation"], progress: 100 },
    { unit: "Acids, Bases and Salts", topics: ["pH Scale", "Indicators", "Salts"], progress: 80 },
    { unit: "Metals and Non-metals", topics: ["Reactivity Series", "Extraction", "Corrosion"], progress: 45 },
    { unit: "Carbon and its Compounds", topics: ["Covalent Bonding", "Hydrocarbons", "Functional Groups"], progress: 15 },
  ],
  Biology: [
    { unit: "Life Processes", topics: ["Nutrition", "Respiration", "Transportation", "Excretion"], progress: 95 },
    { unit: "Control & Coordination", topics: ["Nervous System", "Hormones in Animals & Plants"], progress: 70 },
    { unit: "Reproduction", topics: ["Asexual & Sexual Reproduction"], progress: 40 },
    { unit: "Heredity & Evolution", topics: ["Mendel's Laws", "Evolution"], progress: 10 },
  ],
  History: [
    { unit: "Rise of Nationalism in Europe", topics: ["French Revolution", "Unification of Germany & Italy"], progress: 100 },
    { unit: "Nationalism in India", topics: ["Non-Cooperation", "Civil Disobedience"], progress: 65 },
    { unit: "The Making of a Global World", topics: ["Pre-modern World", "19th Century"], progress: 30 },
  ],
  "Computer Science": [
    { unit: "Python Fundamentals", topics: ["Data Types", "Operators", "Control Flow"], progress: 100 },
    { unit: "Functions & Modules", topics: ["Defining Functions", "Scope", "Modules"], progress: 90 },
    { unit: "Data Structures", topics: ["Lists", "Tuples", "Dictionaries", "Sets"], progress: 70 },
    { unit: "File Handling", topics: ["Text Files", "Binary Files", "CSV"], progress: 30 },
  ],
};

export const RECENT_ACTIVITY = [
  { time: "10 min ago", text: "Math test scores published for Grade 10-A", type: "result" },
  { time: "1 hr ago", text: "Mr. Nguyen marked on leave today", type: "attendance" },
  { time: "3 hr ago", text: "New syllabus uploaded for Chemistry Unit 4", type: "syllabus" },
  { time: "Yesterday", text: "Timetable updated for Friday assembly", type: "timetable" },
  { time: "Yesterday", text: "Parent-Teacher meeting scheduled for Nov 18", type: "event" },
];
