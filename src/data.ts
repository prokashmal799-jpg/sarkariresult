import { StateItem, CategoryCard, JobRow, ResultLink, AdmitCardLink, CalendarEntry } from "./types";

export const statesData: StateItem[] = [
  { code: "UP", name: "Uttar Pradesh", jobsCount: 1240 },
  { code: "BR", name: "Bihar", jobsCount: 845 },
  { code: "RJ", name: "Rajasthan", jobsCount: 612 },
  { code: "MP", name: "Madhya Pradesh", jobsCount: 520 },
  { code: "MH", name: "Maharashtra", jobsCount: 1410 },
  { code: "DL", name: "Delhi", jobsCount: 890 },
  { code: "WB", name: "West Bengal", jobsCount: 1020 },
  { code: "TN", name: "Tamil Nadu", jobsCount: 1150 },
  { code: "KA", name: "Karnataka", jobsCount: 980 },
  { code: "AP", name: "Andhra Pradesh", jobsCount: 1142 },
  { code: "TG", name: "Telangana", jobsCount: 720 },
  { code: "GJ", name: "Gujarat", jobsCount: 710 },
  { code: "KL", name: "Kerala", jobsCount: 840 },
  { code: "PB", name: "Punjab", jobsCount: 480 },
  { code: "HR", name: "Haryana", jobsCount: 395 },
  { code: "OD", name: "Odisha", jobsCount: 615 },
  { code: "JH", name: "Jharkhand", jobsCount: 512 },
  { code: "CG", name: "Chhattisgarh", jobsCount: 432 },
  { code: "AS", name: "Assam", jobsCount: 620 },
  { code: "JK", name: "Jammu & Kashmir", jobsCount: 415 },
  { code: "UK", name: "Uttarakhand", jobsCount: 310 },
  { code: "HP", name: "Himachal Pradesh", jobsCount: 224 },
  { code: "TR", name: "Tripura", jobsCount: 145 },
  { code: "GA", name: "Goa", jobsCount: 88 },
  { code: "AR", name: "Arunachal Pradesh", jobsCount: 124 },
  { code: "MN", name: "Manipur", jobsCount: 110 },
  { code: "ML", name: "Meghalaya", jobsCount: 95 },
  { code: "NL", name: "Nagaland", jobsCount: 82 },
  { code: "MZ", name: "Mizoram", jobsCount: 78 },
  { code: "SK", name: "Sikkim", jobsCount: 60 },
  { code: "CH", name: "Chandigarh", jobsCount: 105 },
  { code: "PY", name: "Puducherry", jobsCount: 119 },
  { code: "AN", name: "Andaman & Nicobar", jobsCount: 65 },
  { code: "DN", name: "Dadra & Nagar Haveli", jobsCount: 42 },
  { code: "LA", name: "Ladakh", jobsCount: 52 },
  { code: "LD", name: "Lakshadweep", jobsCount: 30 },
  { code: "CI", name: "Central Govt (All-India)", jobsCount: 1980 }
];

export const centralCategories: CategoryCard[] = [
  {
    id: "cat-banking",
    name: "Banking & Finance",
    iconName: "Landmark",
    accentColor: "#1a56db",
    badge: "HOT",
    totalPosts: "15,000+ Posts",
    jobs: [
      { title: "SBI Clerk Recuitment 2025", count: "13,735 Posts", hot: true },
      { title: "IBPS PO XII Notification", count: "4,455 Posts", new: true },
      { title: "RBI Grade B Officers Phase 1", count: "210 Posts" },
      { title: "NABARD Development Assistant", count: "175 Posts" },
      { title: "IPPB GDS Executive Recruitment", count: "650 Posts" }
    ]
  },
  {
    id: "cat-railway",
    name: "Railway Jobs",
    iconName: "Train",
    accentColor: "#0e9f6e",
    badge: "HOT",
    totalPosts: "25,000+ Posts",
    jobs: [
      { title: "RRB NTPC Graduate Level", count: "11,558 Posts", hot: true },
      { title: "RRB Assistant Loco Pilot (ALP)", count: "5,696 Posts" },
      { title: "RCF Kapurthala Apprentice", count: "550 Posts", new: true },
      { title: "RRB Group D Expected Vacancy", count: "10,000+ Posts" },
      { title: "Central Railway Assistant Station Master", count: "120 Posts" }
    ]
  },
  {
    id: "cat-defence",
    name: "Defence & Police",
    iconName: "ShieldAlert",
    accentColor: "#e3a008",
    badge: "NEW",
    totalPosts: "75,000+ Posts",
    jobs: [
      { title: "UP Police Constable Recruitment", count: "60,244 Posts", hot: true },
      { title: "CRPF Constable Technical & Trades", count: "9,212 Posts" },
      { title: "Indian Army Agniveer Rally 2025", count: "25,000+ Posts" },
      { title: "NDA & NA (II) Examination", count: "404 Posts", new: true },
      { title: "CISF ASI & Head Constable", count: "1,147 Posts" }
    ]
  },
  {
    id: "cat-upsc",
    name: "UPSC Civil Services",
    iconName: "Scale",
    accentColor: "#7e3af2",
    badge: "HOT",
    totalPosts: "1,500+ Posts",
    jobs: [
      { title: "UPSC Civil Services (IAS) 2025", count: "1,056 Posts", hot: true },
      { title: "UPSC Indian Forest Service (IFS)", count: "150 Posts" },
      { title: "UPSC Combined Defence Services (CDS)", count: "450 Posts", new: true },
      { title: "UPSC Geoscientist Recruitment", count: "56 Posts" },
      { title: "UPSC CAPF AC Assistant Commandant", count: "322 Posts" }
    ]
  },
  {
    id: "cat-ssc",
    name: "SSC Jobs",
    iconName: "FileCheck",
    accentColor: "#e02424",
    badge: "HOT",
    totalPosts: "35,000+ Posts",
    jobs: [
      { title: "SSC Combined Graduate Level (CGL)", count: "17,727 Posts", hot: true },
      { title: "SSC GD Constable Recruitment 2025", count: "26,146 Posts" },
      { title: "SSC CHSL (10+2) Vacancy", count: "3,712 Posts", new: true },
      { title: "SSC Multi Tasking Staff (MTS)", count: "8,326 Posts" },
      { title: "SSC Stenographer Grade C & D", count: "1,207 Posts" }
    ]
  },
  {
    id: "cat-teaching",
    name: "Teaching Bharti",
    iconName: "BookOpen",
    accentColor: "#057a55",
    badge: "NEW",
    totalPosts: "40,000+ Posts",
    jobs: [
      { title: "Bihar STET Application Form", count: "22,000 Posts", hot: true },
      { title: "KVS TGT, PGT & PRT Recruitment", count: "6,414 Posts" },
      { title: "CTET July 2025 Exam Online", count: "National Exam", new: true },
      { title: "NVS Teacher Vacancies", count: "1,377 Posts" },
      { title: "Eklavya Model Residential Schools (EMRS)", count: "4,062 Posts" }
    ]
  },
  {
    id: "cat-medical",
    name: "Medical & Health",
    iconName: "HeartPulse",
    accentColor: "#c81e1e",
    totalPosts: "8,000+ Posts",
    jobs: [
      { title: "AIIMS Nursing Officer (NORCET-6)", count: "3,520 Posts", hot: true },
      { title: "NHM UP Community Health Officer", count: "5,582 Posts" },
      { title: "ESIC Nursing & Paramedical Posts", count: "1,930 Posts", new: true },
      { title: "SGPGI Lucknow Staff Nurse Online", count: "905 Posts" },
      { title: "CGHS Pharmacist & Doctor Jobs", count: "112 Posts" }
    ]
  },
  {
    id: "cat-it-tech",
    name: "IT & Technical",
    iconName: "Cpu",
    accentColor: "#1c64f2",
    totalPosts: "5,500+ Posts",
    jobs: [
      { title: "DRDO CEPTAM 11 Technical Officer", count: "1,506 Posts", hot: true },
      { title: "ISRO Scientist/Engineer 'SC'", count: "320 Posts", new: true },
      { title: "BARC Scientific Assistant", count: "105 Posts" },
      { title: "NIC Scientific Officer Scientist B", count: "598 Posts" },
      { title: "BEL Project Engineer I Services", count: "230 Posts" }
    ]
  },
  {
    id: "cat-post",
    name: "India Post",
    iconName: "Mail",
    accentColor: "#d97706",
    badge: "HOT",
    totalPosts: "44,228 Posts",
    jobs: [
      { title: "India Post GDS Recruitment 2025", count: "44,228 Posts", hot: true },
      { title: "India Post Mail Guard & Postman", count: "Expected Soon" },
      { title: "Post Office Staff Car Driver Scheme", count: "56 Posts", new: true },
      { title: "Postal Circle MTS Skill Entry", count: "140 Posts" },
      { title: "Branch Post Master GDS Merit List", count: "Auto Merit" }
    ]
  },
  {
    id: "cat-judiciary",
    name: "Judiciary",
    iconName: "Scale",
    accentColor: "#4b5563",
    totalPosts: "1,200+ Posts",
    jobs: [
      { title: "Delhi Higher Judicial Service Exam", count: "16 Posts" },
      { title: "UP PCS J Civil Judge Junior Div", count: "395 Posts", hot: true },
      { title: "Bihar Judicial Civil Services (BJS)", count: "155 Posts" },
      { title: "Rajasthan High Court Junior Assistant", count: "230 Posts", new: true },
      { title: "MP High Court Stenographer Clerk", count: "89 Posts" }
    ]
  },
  {
    id: "cat-research",
    name: "Research & Science",
    iconName: "Atom",
    accentColor: "#0891b2",
    totalPosts: "1,800+ Posts",
    jobs: [
      { title: "CSIR NET June 2025 Fellowship", count: "National Scope", hot: true },
      { title: "ICAR JRF/SRF Entry Programme", count: "450 Posts" },
      { title: "TIFR Research Associate Scheme", count: "45 Posts", new: true },
      { title: "ICMR Scientist-B (Medical/Non-Med)", count: "120 Posts" },
      { title: "IIT Kanpur Technical Assistant", count: "85 Posts" }
    ]
  },
  {
    id: "cat-psu",
    name: "PSU Jobs",
    iconName: "Briefcase",
    accentColor: "#92400e",
    totalPosts: "6,000+ Posts",
    jobs: [
      { title: "NTPC Executive (Engineering & IT)", count: "220 Posts", new: true },
      { title: "IOCL Apprentice 2025 Technical", count: "1,720 Posts", hot: true },
      { title: "ONGC Graduate Trainee GATE Exam", count: "985 Posts" },
      { title: "HPCL Engineer Recruitment 2025", count: "248 Posts" },
      { title: "GAIL Executive Trainee Positions", count: "140 Posts" }
    ]
  }
];

export const stateCategories: CategoryCard[] = [
  {
    id: "state-psc",
    name: "State PSC (Public Service)",
    iconName: "Award",
    accentColor: "#7e3af2",
    totalPosts: "1,500+ State Jobs",
    jobs: [
      { title: "PCS General Combined Exam", count: "350 Posts", hot: true },
      { title: "Naib Tehsildar Entry Exam", count: "80 Posts", new: true },
      { title: "State Forest Ranger Grade-II", count: "45 Posts" },
      { title: "Assistant Conservator of Forest", count: "12 Posts" },
      { title: "State Administrative Service Main", count: "Merit Based" }
    ]
  },
  {
    id: "state-police",
    name: "State Police & Excise",
    iconName: "ShieldAlert",
    accentColor: "#FF6B00",
    totalPosts: "8,500+ State Jobs",
    jobs: [
      { title: "Excise Sub Inspector Recruitment", count: "240 Posts", new: true },
      { title: "Police Constable Physical Test Entry", count: "4,500 Posts", hot: true },
      { title: "Home Guard Volunteer Bharti", count: "1,800 Posts" },
      { title: "Assistant Sub Inspector Wireless", count: "95 Posts" },
      { title: "State Commandos Special Squad", count: "150 Posts" }
    ]
  },
  {
    id: "state-teacher",
    name: "Teacher Bharti & Primary",
    iconName: "BookOpen",
    accentColor: "#057a55",
    totalPosts: "12,000+ State Jobs",
    jobs: [
      { title: "Primary School Teacher (PRT)", count: "6,800 Posts", hot: true },
      { title: "Graduated Trained Teacher (TGT)", count: "3,200 Posts" },
      { title: "Lecturer PGT Schools Level", count: "1,450 Posts", new: true },
      { title: "Physical Education PTI Teacher", count: "540 Posts" },
      { title: "Music & Art Instructor Jobs", count: "210 Posts" }
    ]
  },
  {
    id: "state-health",
    name: "Health Dept & ANM GNM",
    iconName: "HeartPulse",
    accentColor: "#c81e1e",
    totalPosts: "4,300+ State Jobs",
    jobs: [
      { title: "ANM Multi-Purpose Health Worker", count: "2,200 Posts", hot: true },
      { title: "Community Hospital Technician", count: "650 Posts" },
      { title: "Operation Theatre Assistant", count: "180 Posts", new: true },
      { title: "District Medical Officer", count: "45 Posts" },
      { title: "State Lab Pharmacist Class-III", count: "340 Posts" }
    ]
  },
  {
    id: "state-revenue",
    name: "Patwari / Revenue",
    iconName: "FileSpreadsheet",
    accentColor: "#d97706",
    totalPosts: "3,100+ State Jobs",
    jobs: [
      { title: "Lekhpal / Patwari Exam 2025", count: "1,500 Posts", hot: true },
      { title: "Kanungo Revenue Inspector", count: "120 Posts" },
      { title: "Assistant Record Officer Exam", count: "45 Posts", new: true },
      { title: "Tehsil Registrar Assistant Clerks", count: "320 Posts" },
      { title: "Land Survey Draftsman Vacancy", count: "140 Posts" }
    ]
  },
  {
    id: "state-pwd",
    name: "PWD / Engineering",
    iconName: "Wrench",
    accentColor: "#1c64f2",
    totalPosts: "1,800+ State Jobs",
    jobs: [
      { title: "Junior Engineer (Civil) PWD", count: "450 Posts", hot: true },
      { title: "Assistant Engineer (Mechanical)", count: "110 Posts" },
      { title: "Surveyor Section Officer Grade I", count: "85 Posts", new: true },
      { title: "Electrical Overseer Board", count: "65 Posts" },
      { title: "Road Inspector Auxiliary Craftsman", count: "180 Posts" }
    ]
  },
  {
    id: "state-agriculture",
    name: "Agriculture Dept",
    iconName: "Sprout",
    accentColor: "#00c48c",
    totalPosts: "1,200+ State Jobs",
    jobs: [
      { title: "Agriculture Extension Officer", count: "550 Posts", hot: true },
      { title: "Horticulture Supervisor Exam", count: "135 Posts", new: true },
      { title: "Soil Conservation Inspector", count: "90 Posts" },
      { title: "District Seed Analyst Expert", count: "24 Posts" },
      { title: "Dairy Development Fieldman", count: "150 Posts" }
    ]
  },
  {
    id: "state-forest",
    name: "Forest Dept & Guard",
    iconName: "Trees",
    accentColor: "#1e3a5f",
    totalPosts: "2,000+ State Jobs",
    jobs: [
      { title: "Forest Guard General Duty", count: "1,240 Posts", hot: true },
      { title: "Forester Grade I Ranger Assist", count: "180 Posts" },
      { title: "Wildlife Guard Sanctuary Ranger", count: "210 Posts", new: true },
      { title: "Forest Survey Officer Class C", count: "45 Posts" },
      { title: "Social Forestry Inspector Guide", count: "115 Posts" }
    ]
  },
  {
    id: "state-panchayat",
    name: "Panchayat & Block",
    iconName: "Users",
    accentColor: "#057a55",
    totalPosts: "5,000+ State Jobs",
    jobs: [
      { title: "Gram Panchayat Adhikari (VDO)", count: "1,890 Posts", hot: true },
      { title: "Block Development Assistant Clerks", count: "430 Posts" },
      { title: "Panchayat Accounts Accountant", count: "620 Posts", new: true },
      { title: "Rural Sanitation Supervisor", count: "330 Posts" },
      { title: "Gram Sevak Support Helper Scheme", count: "1,500 Posts" }
    ]
  },
  {
    id: "state-municipal",
    name: "Municipal / Nagar Nigam",
    iconName: "Building2",
    accentColor: "#4b5563",
    totalPosts: "2,400+ State Jobs",
    jobs: [
      { title: "Chief Municipal Executive Officer", count: "30 Posts" },
      { title: "Tax Collector & Assessor Class II", count: "180 Posts", hot: true },
      { title: "Nagar Nigam Junior Assistant Town", count: "560 Posts", new: true },
      { title: "Sanitation Inspector Grade IV", count: "420 Posts" },
      { title: "Urban Infrastructure Supervisor", count: "110 Posts" }
    ]
  },
  {
    id: "state-electricity",
    name: "Electricity Board",
    iconName: "Zap",
    accentColor: "#FFB800",
    totalPosts: "4,100+ State Jobs",
    jobs: [
      { title: "Assistant Lineman (ALM)", count: "2,500 Posts", hot: true },
      { title: "Sub Station Attendant (SSA)", count: "890 Posts" },
      { title: "Electricity Board Junior Clerk Office", count: "450 Posts", new: true },
      { title: "Account Officer State Discoms", count: "65 Posts" },
      { title: "Technical Tester Safety Officer", count: "140 Posts" }
    ]
  },
  {
    id: "state-transport",
    name: "Transport & RTO",
    iconName: "Car",
    accentColor: "#1c64f2",
    totalPosts: "1,500+ State Jobs",
    jobs: [
      { title: "RTO Assistant Sub Inspector", count: "112 Posts", hot: true },
      { title: "State Transport Bus Conductor", count: "980 Posts" },
      { title: "RTO Junior Clerk Desk Operator", count: "210 Posts", new: true },
      { title: "State Road Depot Manager", count: "16 Posts" },
      { title: "Heavy Vehicle Driver State Bus", count: "440 Posts" }
    ]
  }
];

export const latestJobsList: JobRow[] = [
  {
    id: "ssc-cgl-2025",
    title: "SSC CGL 2025 Online Form",
    department: "Staff Selection Commission (SSC)",
    vacancy: "17,727",
    lastDate: "31-05-2026",
    qualification: "Graduate",
    tag: "HOT",
    jobLocation: "All India (Anywhere in India)",
    applyMode: "Online Mode Only (through SSC website)",
    ageLimit: "18 to 30 Years (Age relaxation available dynamically)",
    payScale: "Rs. 25,500 - Rs. 1,51,100 (Pay Level 4 to Level 8)",
    jobType: "Central Government Jobs (Group B & Group C)",
    feeGen: "Rs. 100/-",
    feeOBC: "Rs. 100/-",
    feeSCST: "Rs. 0/- (Exempted)",
    feeFemale: "Rs. 0/- (Exempted)",
    startDate: "01-05-2026",
    officialNotificationUrl: "https://ssc.gov.in",
    applyOnlineUrl: "https://ssc.gov.in/login",
    fullRequirements: "Must possess a Bachelor's Degree in any discipline from a recognized University or Institute. Age relaxation applies as per Govt rules (OBC: 3 Yrs, SC/ST: 5 Yrs, PwD: 10 Yrs)."
  },
  {
    id: "up-police-const-2025",
    title: "UP Police Constable Recruitment",
    department: "Uttar Pradesh Police Recruitment Board",
    vacancy: "60,244",
    lastDate: "20-05-2026",
    qualification: "12th Pass",
    tag: "NEW",
    jobLocation: "Uttar Pradesh Only",
    applyMode: "Online Mode",
    ageLimit: "18 to 22 Years for Male, 18 to 25 Years for Female",
    payScale: "Rs. 21,700 (Pay Matrix Level-3) plus standard allowances",
    jobType: "State Police Services (Government of Uttar Pradesh)",
    feeGen: "Rs. 400/-",
    feeOBC: "Rs. 400/-",
    feeSCST: "Rs. 400/-",
    feeFemale: "Rs. 400/-",
    startDate: "15-04-2026",
    officialNotificationUrl: "https://uppbpb.gov.in",
    applyOnlineUrl: "https://uppbpb.gov.in/applyonline",
    fullRequirements: "Must have passed Intermediate (12th Class) from any recognized Board. Physical Standards: Male height 168 cm, Female height 152 cm. Running test required."
  },
  {
    id: "india-post-gds-2025",
    title: "India Post GDS Recruitment",
    department: "Department of Posts (India Post)",
    vacancy: "44,228",
    lastDate: "30-04-2026",
    qualification: "10th Pass",
    tag: "HOT",
    jobLocation: "All India Circles",
    applyMode: "Online Merit Selection",
    ageLimit: "18 to 40 Years (Relaxation as per rules)",
    payScale: "Rs. 12,000 - Rs. 29,380 (BPM / ABPM Salaries)",
    jobType: "Postal GDS Services",
    feeGen: "Rs. 100/-",
    feeOBC: "Rs. 100/-",
    feeSCST: "Rs. 0/-",
    feeFemale: "Rs. 0/-",
    startDate: "01-04-2026",
    officialNotificationUrl: "https://indiapostgdsonline.gov.in",
    applyOnlineUrl: "https://indiapostgdsonline.gov.in/reg",
    fullRequirements: "Passed 10th Standard with Mathematics and English as compulsory/elective subjects. Knowledge of local language of the applied circle is mandatory. Computer competency certificate required."
  },
  {
    id: "rrb-ntpc-2025",
    title: "RRB NTPC Graduate & UG Posts",
    department: "Railway Recruitment Boards",
    vacancy: "11,558",
    lastDate: "15-05-2026",
    qualification: "12th Pass / Graduate",
    tag: "NEW",
    jobLocation: "All Indian Railways Zones",
    applyMode: "Online via Regional RRB website",
    ageLimit: "18 to 33 Years (UG), 18 to 36 Years (Graduate)",
    payScale: "Rs. 19,900 - Rs. 35,400 depending on Level 2, 3, 4, 5, 6",
    jobType: "Indian Railways Group C Services",
    feeGen: "Rs. 500/- (Rs. 400 refundable after Stage-I CBT)",
    feeOBC: "Rs. 500/- (Rs. 400 refundable after Stage-I CBT)",
    feeSCST: "Rs. 250/- (Fully refundable after Stage-I CBT)",
    feeFemale: "Rs. 250/- (Fully refundable after Stage-I CBT)",
    startDate: "10-04-2026",
    officialNotificationUrl: "https://indianrailways.gov.in",
    applyOnlineUrl: "https://rrbapply.gov.in",
    fullRequirements: "Typing efficiency or computer aptitude depending on sub-preference. Medical standards (A2, A3, B2 etc.) must be met relative to specific posts like Goods Guard, TC or Station Master."
  },
  {
    id: "bihar-stet-2025",
    title: "Bihar STET Teacher Eligibility Test",
    department: "Bihar School Examination Board (BSEB)",
    vacancy: "22,000 Expected",
    lastDate: "18-05-2026",
    qualification: "Graduation + B.Ed",
    tag: "NEW",
    jobLocation: "Bihar Schools",
    applyMode: "Online Examination Form",
    ageLimit: "21 to 37 Years (Relaxation up to 40 for females/OBC)",
    payScale: "Eligibility Certificate (State TGT/PGT standard pay scale is Rs 35,000+)",
    jobType: "State Level Eligibility Certification Test",
    feeGen: "Rs. 960/- (Single Paper) or Rs. 1440/- (Both)",
    feeOBC: "Rs. 960/- (Single Paper) or Rs. 1440/- (Both)",
    feeSCST: "Rs. 760/- (Single Paper) or Rs. 1140/- (Both)",
    feeFemale: "Rs. 960/-",
    startDate: "25-04-2026",
    officialNotificationUrl: "https://secondary.biharboardonline.com",
    applyOnlineUrl: "https://secondary.biharboardonline.com/stet2025",
    fullRequirements: "Bachelor's/Master's degree along with a professional B.Ed degree. Paper-I validates qualification for secondary levels (Classes 9-10) and Paper-II for Higher Secondary (Classes 11-12)."
  },
  {
    id: "sbi-clerk-2025",
    title: "SBI Junior Associates (Clerk)",
    department: "State Bank of India (SBI)",
    vacancy: "13,735",
    lastDate: "10-05-2026",
    qualification: "Graduate in any discipline",
    tag: "HOT",
    jobLocation: "Branches Across India",
    applyMode: "Online Only (IBPS interface)",
    ageLimit: "20 to 28 Years",
    payScale: "Rs. 17,900 - Rs. 47,920 plus allowance benefits",
    jobType: "Public Sector Banking (Junior Associates Class-III)",
    feeGen: "Rs. 750/-",
    feeOBC: "Rs. 750/-",
    feeSCST: "Rs. 0/- (Exempted)",
    feeFemale: "Rs. 750/-",
    startDate: "15-04-2026",
    officialNotificationUrl: "https://sbi.co.in/careers",
    applyOnlineUrl: "https://ibpsonline.ibps.in/sbijamar25",
    fullRequirements: "Degree in layout or discipline. Candidates in the final semester/year may apply provisionally. Local language test (reading, writing, speaking) is required."
  },
  {
    id: "crpf-constable-2025",
    title: "CRPF Tradesman & Technical recruitment",
    department: "Central Reserve Police Force (CRPF)",
    vacancy: "9,212",
    lastDate: "28-04-2026",
    qualification: "10th Pass / ITI",
    tag: "NEW",
    jobLocation: "Anywhere in India",
    applyMode: "Online Only",
    ageLimit: "18 to 23 Years (21 to 27 for Drivers)",
    payScale: "Rs. 21,700 - Rs. 69,100 (Pay Level-3)",
    jobType: "Central Armed Police Forces (CAPF)",
    feeGen: "Rs. 100/-",
    feeOBC: "Rs. 100/-",
    feeSCST: "Rs. 0/- (Exempted)",
    feeFemale: "Rs. 0/- (Exempted)",
    startDate: "27-03-2026",
    officialNotificationUrl: "https://rect.crpf.gov.in",
    applyOnlineUrl: "https://crpf.gov.in/recruitment",
    fullRequirements: "Passed matriculation. Technical professions (for example, Mechanic Motor Vehicle) require appropriate ITI credentials. Physical standards must be certified strictly."
  },
  {
    id: "ibps-po-2025",
    title: "IBPS PO/MT XII Executive Officer",
    department: "Institute of Banking Personnel Selection",
    vacancy: "4,455",
    lastDate: "08-05-2026",
    qualification: "Graduate",
    tag: "NEW",
    jobLocation: "Participant Public Sector Banks",
    applyMode: "Online Portal Scheme",
    ageLimit: "20 to 30 Years",
    payScale: "Basic starting Rs. 36,000 (Gross Rs. 55,000+ per month)",
    jobType: "Officer Cadet Grade Scale A",
    feeGen: "Rs. 850/-",
    feeOBC: "Rs. 850/-",
    feeSCST: "Rs. 175/-",
    feeFemale: "Rs. 850/-",
    startDate: "12-04-2026",
    officialNotificationUrl: "https://ibps.in",
    applyOnlineUrl: "https://ibps.in/po-selection-2025",
    fullRequirements: "High class degree from Central/State Government recognized university. Normal computer operations certification needed. Successful candidates placed across participating PSBs based on final merit."
  },
  {
    id: "rajasthan-police-2025",
    title: "Rajasthan Police Constable Recruitment",
    department: "Rajasthan Police Department",
    vacancy: "3,578",
    lastDate: "05-05-2026",
    qualification: "10th Pass / 12th Pass",
    tag: "NEW",
    jobLocation: "Rajasthan State Circles",
    applyMode: "Online (via SSO Portal ID)",
    ageLimit: "18 to 23 Years for General/OBC",
    payScale: "Rs. 14,600 during probation, then Level-5 scales",
    jobType: "State Police Cadre",
    feeGen: "Rs. 600/-",
    feeOBC: "Rs. 600/- (UR), Rs 400 for local Rajasthan NCL",
    feeSCST: "Rs. 400/-",
    feeFemale: "Rs. 400/-",
    startDate: "10-04-2026",
    officialNotificationUrl: "https://police.rajasthan.gov.in",
    applyOnlineUrl: "https://sso.rajasthan.gov.in",
    fullRequirements: "Must possess certificate of 12th class for general/district police; 10th standard for RAC/MBC battalions. Valid LMV/HMV driving license is required ONLY for driver posts."
  },
  {
    id: "bpsc-71st-exam",
    title: "BPSC 71st Civil Services Combined Exam",
    department: "Bihar Public Service Commission",
    vacancy: "1,929",
    lastDate: "25-05-2026",
    qualification: "Graduate",
    tag: "NEW",
    jobLocation: "Bihar State Administration",
    applyMode: "Online (BPSC Portal)",
    ageLimit: "20, 21, or 22 to 37 Years for Males, 40 to Females",
    payScale: "Pay Level 9 starting Rs. 53,100 basic + DA",
    jobType: "State Elite Gazette Services (SDM, DSP, Revenue Officer)",
    feeGen: "Rs. 600/-",
    feeOBC: "Rs. 600/-",
    feeSCST: "Rs. 150/- (Local resident rates)",
    feeFemale: "Rs. 150/- (Local resident rates)",
    startDate: "01-05-2026",
    officialNotificationUrl: "https://bpsc.bih.nic.in",
    applyOnlineUrl: "https://onlinebpsc.bihar.gov.in",
    fullRequirements: "Graduation (Bachelor's degree equivalent) from any UGC recognized college. Physical measurement required exclusively for Bihar Police Service posts."
  },
  {
    id: "aiims-nursing-2025",
    title: "AIIMS Nursing Officer (NORCET-6)",
    department: "All India Institute of Medical Sciences",
    vacancy: "3,520",
    lastDate: "12-05-2026",
    qualification: "GNM / B.Sc Nursing",
    tag: "HOT",
    jobLocation: "AIIMS campuses across India",
    applyMode: "Online AIIMS Portal",
    ageLimit: "18 to 30 Years",
    payScale: "Pay Level 7: Rs. 44,900 - Rs. 1,42,400 Group B",
    jobType: "Central Medical Institution Staff",
    feeGen: "Rs. 3000/-",
    feeOBC: "Rs. 3000/-",
    feeSCST: "Rs. 2400/-",
    feeFemale: "Rs. 2400/-",
    startDate: "20-04-2026",
    officialNotificationUrl: "https://aiimsexams.ac.in",
    applyOnlineUrl: "https://norcet6.aiimsexams.ac.in/apply",
    fullRequirements: "B.Sc (Hons.) Nursing / B.Sc Nursing or Post-Basic B.Sc Nursing with registered nurse status. Alternatively, GNM with 2 years experience in min 50-bedded hospital."
  },
  {
    id: "drdo-ceptam-2025",
    title: "DRDO CEPTAM 11 Technical Officers",
    department: "Defence Research & Development Organisation",
    vacancy: "1,506",
    lastDate: "22-05-2026",
    qualification: "Graduate / ITI / Diploma",
    tag: "NEW",
    jobLocation: "DRDO Laboratories Nationwide",
    applyMode: "Online CEP Administration Portal",
    ageLimit: "18 to 28 Years",
    payScale: "Rs. 19,900 to Rs. 1,12,400 (Level-2 to Level-6)",
    jobType: "Central Scientific Cadre Group B/C",
    feeGen: "Rs. 100/-",
    feeOBC: "Rs. 100/-",
    feeSCST: "Rs. 0/- (Exempt)",
    feeFemale: "Rs. 0/- (Exempt)",
    startDate: "28-04-2026",
    officialNotificationUrl: "https://drdo.gov.in",
    applyOnlineUrl: "https://drdorectt.gov.in",
    fullRequirements: "Degree in physics, mathematics, computer science OR engineering diploma. Trades must correspond to certified lists from NCVE/SCVE streams."
  },
  {
    id: "kvs-tgt-pgt-2025",
    title: "KVS TGT, PGT & PRT Recruitment",
    department: "Kendriya Vidyalaya Sangathan",
    vacancy: "6,414",
    lastDate: "28-05-2026",
    qualification: "Graduate + B.Ed + CTET",
    tag: "HOT",
    jobLocation: "Central Schools of India",
    applyMode: "Online KVS Portal",
    ageLimit: "30 Years (PRT), 35 Years (TGT), 40 Years (PGT)",
    payScale: "Rs. 35,400 - Rs. 1,51,100",
    jobType: "Central Government Teaching Unit",
    feeGen: "Rs. 1500/-",
    feeOBC: "Rs. 1500/-",
    feeSCST: "Rs. 0/- (Exempt)",
    feeFemale: "Rs. 0/- (Exempt)",
    startDate: "03-05-2026",
    officialNotificationUrl: "https://kvsangathan.nic.in",
    applyOnlineUrl: "https://kvsangathan.nic.in/recruit2025",
    fullRequirements: "Bachelor's or Master's in the specified subject with at least 50% marks. B.Ed or equivalent is essential, along with passing CTET Paper-II (for TGT)."
  },
  {
    id: "nvs-teacher-2025",
    title: "NVS Trained Graduate Teacher Scheme",
    department: "Navodaya Vidyalaya Samiti",
    vacancy: "1,377",
    lastDate: "30-05-2026",
    qualification: "Graduate + B.Ed",
    tag: "NEW",
    jobLocation: "Residential JNVs Regionally",
    applyMode: "Online SAMS Entry",
    ageLimit: "Upper age Limit of 35 Years",
    payScale: "Rs. 44,900 to Rs. 1,42,400 Level-7 Scale",
    jobType: "Central Secondary Residential Schools Group B",
    feeGen: "Rs. 1500/-",
    feeOBC: "Rs. 1500/-",
    feeSCST: "Rs. 0/- (Exempt)",
    feeFemale: "Rs. 0/- (Exempt)",
    startDate: "05-05-2026",
    officialNotificationUrl: "https://navodaya.gov.in",
    applyOnlineUrl: "https://navodaya.gov.in/nvsrec2025",
    fullRequirements: "Relevant Bachelor Degree with 50% aggregate score and B.Ed. Passing standard CTET state criteria yields preference during final listing evaluations."
  },
  {
    id: "ntpc-executive-2025",
    title: "NTPC Executive Trainee (Engineering)",
    department: "National Thermal Power Corporation",
    vacancy: "220",
    lastDate: "25-05-2026",
    qualification: "Engineering Graduate (B.E/B.Tech)",
    tag: "NEW",
    jobLocation: "NTPC Plant Stations nationwide",
    applyMode: "Online GATE Merit Submission",
    ageLimit: "Upper limit of 27 Years",
    payScale: "E1 Grade Scale Rs. 40,000 - Rs. 1,40,000 basic",
    jobType: "PSU Maharatna Trainee Level",
    feeGen: "Rs. 300/-",
    feeOBC: "Rs. 300/-",
    feeSCST: "Rs. 0/-",
    feeFemale: "Rs. 0/-",
    startDate: "02-05-2026",
    officialNotificationUrl: "https://careers.ntpc.co.in",
    applyOnlineUrl: "https://careers.ntpc.co.in/etapply2025",
    fullRequirements: "Full-time Engineering degree (B.E / B.Tech / B.Sc Engg) in Electrical, Mechanical, Electronics, Instrumentation disciplines with minimum 65% aggregate marks. GATE scorecard is required."
  }
];

export const resultsLinks: ResultLink[] = [
  { title: "UPSC IAS 2024 Final Result & Merit List Out", tag: "HOT" },
  { title: "SSC CHSL Final Result Phase Declared", tag: "NEW" },
  { title: "IBPS PO Mains Stage 2 Exam Marks & List" },
  { title: "RRB Group D Regional Merit Cut Off PDF", tag: "HOT" },
  { title: "Bihar Police Constable Physical Test Qualifying List", tag: "NEW" },
  { title: "BPSC 70th Competitive Combined Main Merit PDF" },
  { title: "SBI PO Combined Phase 3 Ultimate Result Out", tag: "HOT" },
  { title: "UP Police Sub Inspector SI Scorecard 2024", tag: "NEW" },
  { title: "CTET January 2025 Scorecard Link Checked" },
  { title: "Rajasthan Police Constable PET Level Final List" }
];

export const admitCardsLinks: AdmitCardLink[] = [
  { title: "SSC CGL Tier 2 Descriptive Level admit Card 2025", tag: "HOT" },
  { title: "UPSC NDA Executive Entrance Hall Ticket 2025", tag: "NEW" },
  { title: "IBPS PO Mains Direct Examination Hall Ticket" },
  { title: "RRB Assistant Loco Pilot (ALP) Admit Sheet", tag: "HOT" },
  { title: "UP Lekhpal Document Verification DV Letter 2025", tag: "NEW" },
  { title: "Bihar Police SI Main Written Exam Admit Card" },
  { title: "KVS TGT PGT Secondary Interview Panel Letter" },
  { title: "CTET Central Board Entrance Verification slip 2025" },
  { title: "DRDO CEPTAM 11 Technical Hall Ticket download" },
  { title: "NVS Teacher Examination Centre Allotment Slips" }
];

export const examCalendarData: CalendarEntry[] = [
  { name: "UPSC Prelims Exam 2026", dateStr: "26 MAY" },
  { name: "SSC CGL Tier 1 CBT", dateStr: "12 JUN" },
  { name: "IBPS PO Prelims", dateStr: "18 JUL" },
  { name: "RRB NTPC CBT Stage 1", dateStr: "24 AUG" },
  { name: "NDA & NA II exam", dateStr: "03 SEP" },
  { name: "BPSC 71st Prelims", dateStr: "30 SEP" },
  { name: "Kendriya Vidyalaya TGT", dateStr: "15 OCT" },
  { name: "CTET Summer Stage Test", dateStr: "05 JUL" }
];

export const nationalAlerts = [
  "🔴 LIVE: SSC CGL 2025 Notification - Apply for 17,727 Posts right now!",
  "🔴 HIGH ALERT: UP Police Constable 60,244 post deadline approaching - Apply on/before May 20!",
  "🔴 RECENT UPDATE: India Post Gramin Dak Sevak state-wise merit list PDF downloads active.",
  "🔴 TRENDING: RRB NTPC Graduate Level exams announced - 11,558 post exams starting shortly."
];
export const trendingSearches = [
  "SSC CGL 2025", "UPSC IAS 2025", "UP Police Constable", "Railway Group D",
  "SBI Clerk 2025", "India Post GDS Circles", "Bihar Teacher Eligibility STET",
  "CRPF Technical Trainee", "NDA II Entrance", "KVS TGT PGT Bharti", "Rajasthan SI Exam"
];
export const importantGovtSites = [
  { name: "🏛️ National Career Service (NCS)", url: "https://www.ncs.gov.in" },
  { name: "🏛️ Union Public Service Commission", url: "https://upsc.gov.in" },
  { name: "🏛️ Staff Selection Commission Portal", url: "https://ssc.gov.in" },
  { name: "🏛️ Indian Post Office Careers", url: "https://indiapostgdsonline.gov.in" },
  { name: "🏛️ Railway Recruitment Control Board", url: "https://indianrailways.gov.in" },
  { name: "🏛️ Digilocker Government Wallet", url: "https://digilocker.gov.in" }
];
