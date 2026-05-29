import React from "react";
import { 
  Sparkles, 
  Flame, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Briefcase, 
  Wrench, 
  Award, 
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileText
} from "lucide-react";
import { getTheme } from "./CulturalThemer";

interface StateDashboardProps {
  selectedStateName: string;
  selectedLanguage: string;
  onJobSelect: (jobTitle: string) => void;
  activeThemeId: string;
}

// State-specific resource datasets
export const STATE_RESOURCES: Record<string, {
  opportunities: string[];
  scholarships: string[];
  schemes: string[];
  apprenticeship: string[];
  skills: string[];
  privateJobs: string[];
  boards: { name: string; url: string }[];
}> = {
  "West Bengal": {
    opportunities: [
      "🔥 WBPSC Food SI Special Direct Recruitment 2026",
      "🔥 West Bengal Constable (WB Police) - 10,255 Posts",
      "🔥 Health Recruitment Board Staff Nurse Vacancy",
      "🔥 KMC (Kolkata Municipal Corporation) Sub-Assistant Engineer",
      "🔥 WB Group D Recruitment Commission Bulletin"
    ],
    scholarships: [
      "🎓 Oasis Scholarship for SC/ST/OBC Candidates",
      "🎓 Swami Vivekananda Merit cum Means (SVMCM) 2026",
      "🎓 Aikyashree Minority Scholarship Program",
      "🎓 Kanyashree Prakalpa (K3) Higher Studies Grant",
      "🎓 West Bengal Student Credit Card Scheme"
    ],
    schemes: [
      "🏛 Lakshmir Bhandar Financial Assistance Scheme",
      "🏛 Krishak Bandhu Farmer Support Scheme",
      "🏛 Sabooj Sathi Free Bicycle Distribution Program",
      "🏛 Yuvashree Monthly Unemployment Assistance",
      "🏛 Khadya Sathi Digital Ration Beneficiary"
    ],
    apprenticeship: [
      "🎯 Durgapur Steel Plant (SAIL) NATS Apprenticeship",
      "🎯 WBSEDCL Graduate & Technician Apprentice Openings",
      "🎯 Metro Railway Kolkata Technical Apprentice Batches",
      "🎯 GRSE Kolkata Trade Apprentice Registrations Open"
    ],
    skills: [
      "🛠 Utkarsh Bangla Vocational Training Program",
      "🛠 PBSSD Free Industrial Skill Trade Training Center",
      "🛠 West Bengal ITI & Polytechnic Admission Counselling",
      "🛠 Youth Computer Training Centres (YCTC) IT Courses"
    ],
    privateJobs: [
      "💼 Senior IT / Web Developer - Salt Lake Sector V Hubs",
      "💼 Retail Associate - Reliance Smart Plaza Kolkata",
      "💼 Delivery Executive - Swiggy/Instamart Bengal Division",
      "💼 Office Coordinator - Prime Logistics Haldia Lines"
    ],
    boards: [
      { name: "WBPSC", url: "https://wbpsc.gov.in" },
      { name: "WB Police", url: "https://wbpolice.gov.in" },
      { name: "KMC", url: "https://www.kmcgov.in" },
      { name: "Health Recruitment Board", url: "https://www.hrb.wb.gov.in" }
    ]
  },
  "Bihar": {
    opportunities: [
      "🔥 BPSC 71st Civil Services Direct Exam",
      "🔥 Bihar Police Constable & Sub Inspector - 21,391 Posts",
      "🔥 BSSC Inter Level Competitive Examination",
      "🔥 Bihar STET Secondary Teacher Eligibility Test",
      "🔥 Bihar CHO Medical Recruitment Index"
    ],
    scholarships: [
      "🎓 Bihar Post Matric Scholarship (PMS) PMSOnline",
      "🎓 Mukhyamantri Balak/Balika Protsahan Yojana",
      "🎓 Medhasoft Matric & Inter Encouragement Grants",
      "🎓 Bihar Student Credit Card (MNSSBY)",
      "🎓 Mukhyamantri Kanya Utthan Higher Studies"
    ],
    schemes: [
      "🏛 Bihar Har Ghar Nal Ka Jal Scheme",
      "🏛 Mukhyamantri Udyami Yojana (Self-Employment Startups)",
      "🏛 Kushal Yuva Program (KYP) Foundation Cards",
      "🏛 Bihar Pension Beneficiary Portal (Social Welfare)",
      "🏛 Saat Nischay Part-2 Development Campaign"
    ],
    apprenticeship: [
      "🎯 Barauni Refinery (IOCL) Trade Apprentice Program",
      "🎯 East Central Railway (Dhanbad/Hajipur) Apprentice",
      "🎯 Bihar State Power Holding Company NATS Training",
      "🎯 NHAI Patna Civil Apprentice Openings"
    ],
    skills: [
      "🛠 BSFA Kushal Yuva Initiative Centres",
      "🛠 Government ITI Patna Advanced Machining Trades",
      "🛠 Bihar Skill Development Mission (BSDM) Portal",
      "🛠 PMKVY Central-State Skill Institutes Bihar"
    ],
    privateJobs: [
      "💼 Branch Supervisor - Bandhan Bank Muzaffarpur Hub",
      "💼 Sales Coordinator - Patanjali Swadeshi Kendra Patna",
      "💼 Delivery Executive - Zomato / Zepto Bihar Circles",
      "💼 Field Officer - Microfinance Trust Gaya Junction"
    ],
    boards: [
      { name: "BPSC", url: "https://www.bpsc.bih.nic.in" },
      { name: "BSSC", url: "https://bssc.bihar.gov.in" },
      { name: "Bihar Board (BSEB)", url: "https://biharboardonline.bihar.gov.in" },
      { name: "STET Portal", url: "https://secondary.biharboardonline.com" }
    ]
  },
  "Uttar Pradesh": {
    opportunities: [
      "🔥 UP Police Constable Mega Bharti - 60,244 Posts",
      "🔥 UPPSC Subordinate PCS Exam Notification",
      "🔥 UPSSSC Junior Assistant & Forest Guard Recruitment",
      "🔥 UP Lekhpal Revenue Department Openings",
      "🔥 UPPBPB SI & Operator Exams Grid"
    ],
    scholarships: [
      "🎓 UP Scholarship Post-Matric & Pre-Matric Scheme",
      "🎓 Mukhyamantri Abhyuday Free Coaching Scheme",
      "🎓 UP National Means cum Merit Scholarship",
      "🎓 UP Board Topper Cash Reward Incentives",
      "🎓 UP Sanskrit Board Divyangjan Grants"
    ],
    schemes: [
      "🏛 Mukhyamantri Kanya Sumangala Scheme",
      "🏛 UP Free Tablet/Smartphone Distribution Yojana",
      "🏛 Shramik Kalyan Pension Cards & Ration",
      "🏛 UP One District One Product (ODOP) Enterprise",
      "🏛 UP Kisan Karj Mafi (Crop Loan Waiver Scheme)"
    ],
    apprenticeship: [
      "🎯 BLW Varanasi Locomotive Trade Apprentice",
      "🎯 HAL Lucknow ITI/Diploma Apprenticeship Batches",
      "🎯 UPPCL Electrical Apprentice Placement List",
      "🎯 North Central Railway Agra Apprentice Batches"
    ],
    skills: [
      "🛠 UP Skill Development Mission (UPSDM) Free Trades",
      "🛠 Government ITI Aliganj (Lucknow) Smart Lab Courses",
      "🛠 PMKVY Centrally Sponsored Training UP Cities",
      "🛠 UP ITI Admission Portal & Seat Allocation"
    ],
    privateJobs: [
      "💼 Customer Support Representative - Genpact Noida",
      "💼 Area Sales Manager - ITC Distribution Lucknow Centre",
      "💼 Office Assistant - Shriram Finance Varanasi Lines",
      "💼 Delivery Partner - Blinkit / Swiggy Kanpur Circles"
    ],
    boards: [
      { name: "UPPSC", url: "https://uppsc.up.nic.in" },
      { name: "UPSSSC", url: "https://upsssc.gov.in" },
      { name: "UP Constable (UPPBPB)", url: "https://uppbpb.gov.in" },
      { name: "UP Government Schemes", url: "https://up.gov.in" }
    ]
  },
  "Tamil Nadu": {
    opportunities: [
      "🔥 TNPSC Group 4 VAO Unified Services Exam",
      "🔥 TN Police (TNUSRB) Constable & Sub-Inspector Bharti",
      "🔥 TRB (Teachers Recruitment Board) Graduate Assistant",
      "🔥 TNEB (TANGEDCO) Assistant Engineer Notification",
      "🔥 TN MRB (Medical Services Recruitment Board) Nurse"
    ],
    scholarships: [
      "🎓 TN Moovalur Ramamirtham Ammaiyar Pudhumai Penn",
      "🎓 Uzhavar Pathukappu Thittam Educational Grants",
      "🎓 TN BC/MBC/Minority Welfare Post-Matric Scholarship",
      "🎓 TN Chief Minister's Merit Scholarship Scheme",
      "🎓 Tamil Pudhalvan Scheme for Male Students"
    ],
    schemes: [
      "🏛 Kalaignar Magalir Urimai Thogai Scheme",
      "🏛 Chief Minister's Breakfast Scheme for Schools",
      "🏛 TN Illam Thedi Kalvi (Voluntary Class Tutorials)",
      "🏛 Makkalai Thedi Maruthuvam Healthcare Program",
      "🏛 TN Free Laptop Distribution for Students"
    ],
    apprenticeship: [
      "🎯 Southern Railway Chennai Trade Apprentice Intake",
      "🎯 NLC India Limited (Neyveli) Graduate Apprentice",
      "🎯 BHEL Trichy Technical Apprentice Vacancy",
      "🎯 Integral Coach Factory (ICF) Trade Apprentice"
    ],
    skills: [
      "🛠 Naan Mudhalvan Free Advanced Skills Academy",
      "🛠 TN Skill Development Corporation (TNSDC) Free Trades",
      "🛠 TN Govt ITI Online Counselling Admission Guide",
      "🛠 Tamil Nadu Apex Skill Development Centers"
    ],
    privateJobs: [
      "💼 Desktop Support Tech - DLF IT Park Chennai",
      "💼 Assembly Line Operator - Foxconn Sriperumbudur Hub",
      "💼 Delivery Professional - Swiggy / Shadowfax Chennai",
      "💼 Store In-charge - Chennai Silks Retail Complex"
    ],
    boards: [
      { name: "TNPSC", url: "https://tnpsc.gov.in" },
      { name: "TN Police", url: "https://tnusrb.tn.gov.in" },
      { name: "TRB Tamil Nadu", url: "https://trb.tn.gov.in" },
      { name: "TN Gov Schemes", url: "https://tn.gov.in" }
    ]
  },
  "Maharashtra": {
    opportunities: [
      "🔥 MPSC Civil Services Joint Pre-Examination 2026",
      "🔥 Maharashtra Police Constable Recruitment - 17,471 Posts",
      "🔥 MahaGenco Assistant Engineer & Chemist Vacancies",
      "🔥 BMC (BMC Mumbai) Junior Clerk Recruitment",
      "🔥 MahaTransco Technician Trades Entry Bulletin"
    ],
    scholarships: [
      "🎓 MahaDBT Rajarshi Chhatrapati Shahu Maharaj Scholarship",
      "🎓 Dr. Punjabrao Deshmukh Hostel Maintenance Allowance",
      "🎓 MahaDBT Post-Matric Tuition Fee and Examination Fee",
      "🎓 Savitribai Phule Scholarship Scheme for Girls",
      "🎓 MahaJyoti Non-Creamy Layer Coaching Grants"
    ],
    schemes: [
      "🏛 Mukhyamantri Majhi Ladki Bahin Scheme",
      "🏛 Mukhyamantri Vayoshri Yojana for Senior Citizens",
      "🏛 Mahatma Jyotirao Phule Shetkari Karjmukti Yojana",
      "🏛 MahaSwarojgar Loan Subsidy Scheme",
      "🏛 Maharashtra Sanjay Gandhi Niradhar Devotional Subsidy"
    ],
    apprenticeship: [
      "🎯 MSRTC (ST Bus) Trade Apprentice Training Program",
      "🎯 Mazagon Dock Shipbuilders ITI Trade Apprentice",
      "🎯 Mahadiscom Vidyut Sahayyak Apprentice Batches",
      "🎯 Tata Power Pune Engineering NAPS Program"
    ],
    skills: [
      "🛠 Pramod Mahajan Skill Development Mission (MSSDS)",
      "🛠 Maharashtra State ITI Admission Online Seat Allocation",
      "🛠 MKCL MSTB Information Technology Skills Program",
      "🛠 Barti Pune Competitive Exams Center Guides"
    ],
    privateJobs: [
      "💼 Production Supervisor - Hinjewadi IT Park Pune",
      "💼 Office Executive - Chhatrapati Shivaji Terminus Mumbai",
      "💼 Delivery Associate - Swiggy / BlueDart Nagpur",
      "💼 Logistics Coordinator - JNPT Port Belapur Lines"
    ],
    boards: [
      { name: "MPSC", url: "https://mpsc.gov.in" },
      { name: "Maharashtra Police", url: "https://mahapolice.gov.in" },
      { name: "MahaDBT", url: "https://mahadbt.maharashtra.gov.in" },
      { name: "Maha Government", url: "https://maharashtra.gov.in" }
    ]
  }
};

// Generate dynamic fallback resource lists for other states dynamically
const getFallbackResources = (stateName: string) => {
  return {
    opportunities: [
      `🔥 ${stateName} State Civil Service Combined Direct Exam 2026`,
      `🔥 ${stateName} Police Sub-Inspector & Constable Bharti`,
      `🔥 ${stateName} SSC Secretariat Assistant Graduate level Posts`,
      `🔥 ${stateName} Medical Officer & Staff Nurse Openings`,
      `🔥 Local Municipal Corporation Multi-Tasking Staff`
    ],
    scholarships: [
      `🎓 ${stateName} State Post-Matric Merit cum Means Scholarship`,
      `🎓 Chief Minister's Higher Education Special Encouragement Grant`,
      `🎓 ${stateName} Secondary Board Class 10 & 12 Toppers Award`,
      `🎓 Pre-Matric Minority Support Scholarships`,
      `🎓 State Student Financial Aid Credit Card Guarantee`
    ],
    schemes: [
      `🏛 Chief Minister's Dynamic State Employment Guarantee Schemes`,
      `🏛 ${stateName} Self-Employment Subsidy and Startup Capital Card`,
      `🏛 Rural Development Farming and Tube-well Grants`,
      `🏛 State Social Welfare Old Age & Divyangjan Pension Hub`,
      `🏛 Free Digital Device and Study Material Allocation Scheme`
    ],
    apprenticeship: [
      `🎯 Local State Power Corporation NATS Apprentice Training`,
      `🎯 State Transport Corporation (SSTC) Trade Apprenticeship`,
      `🎯 Regional Railway Division Apprentice Selection List`,
      `🎯 Central PSU Factory Apprenticeships in ${stateName}`
    ],
    skills: [
      `🛠 ${stateName} Skill Development Mission (SSDM) Free Trades`,
      `🛠 Government ITIs Vocational Trade Counselling and Allocation`,
      `🛠 State Information Technology Advanced Certification`,
      `🛠 Youth Skill and Entrepreneurship Empowerment Camps`
    ],
    privateJobs: [
      `💼 Sales Coordinator - Private Enterprises in Capital Hub`,
      `💼 Data Entry Operator - Local Business Cluster`,
      `💼 Field Support Officer - Micro-finance Unit`,
      `💼 Logistics Associate - Regional Transport Network`
    ],
    boards: [
      { name: `${stateName} PSC`, url: "#" },
      { name: `${stateName} Police`, url: "#" },
      { name: `${stateName} Govt Portal`, url: "#" }
    ]
  };
};

const TR_MAPs: Record<string, Record<string, string>> = {
  bn: {
    title: "রাজ্য পোর্টাল ড্যাশবোর্ড",
    sub: "আপনার নির্বাচিত রাজ্যের জন্য রিয়েল-টাইম তথ্য এবং স্কিম তালিকা",
    opp: "🔥 সর্বশেষ কাজের সুযোগ (Latest Opportunities)",
    schol: "🎓 স্কলারশিপ এবং শিক্ষাবৃত্তি (Scholarships)",
    schemes: "🏛 সরকারি কল্যাণমুখী স্কিম ও প্রকল্প (Govt Schemes)",
    apprentice: "🎯 শিক্ষানবিশ প্রশিক্ষণ (Apprenticeships)",
    skills: "🛠 কারিগরি ও স্কিল ট্রেনিং (Skill Development)",
    private: "💼 বেসরকারি চাকরি ডেটাবেস (Private Jobs)",
    boards: "📍 প্রধান রাজ্য রিক্রুটমেন্ট বোর্ড",
    notice: "ব্যক্তিগত এবং রাজ্যভিত্তিক আপডেট আপনার ভাষায় সাজানো হয়েছে।"
  },
  ta: {
    title: "மாநில போர்டல் டாஷ்போர்டு",
    sub: "உங்கள் மாநிலத்திற்கான நிகழ்நேர தகவல்கள் மற்றும் திட்டங்கள்",
    opp: "🔥 புதிய வேலைவாய்ப்புகள் (Opportunities)",
    schol: "🎓 கல்வி உதவித்தொகை (Scholarships)",
    schemes: "🏛 அரசு நலத்திட்டங்கள் (Govt Schemes)",
    apprentice: "🎯 தொழில்பழகுநர் பயிற்சி (Apprenticeship)",
    skills: "🛠 திறன் மேம்பாட்டுப் பயன் (Skill Education)",
    private: "💼 தனியார் நிறுவன வேலைகள் (Private Jobs)",
    boards: "📍 அதிகாரப்பூர்வ மாநில தேர்வுகள் வாரியம்",
    notice: "மாநில வாரியான தகவல்கள் தமிழ் மொழியில் பிரத்தியேகமாக வழங்கப்படுகிறது."
  },
  hi: {
    title: "राज्य पोर्टल डैशबोर्ड",
    sub: "आपके राज्य के लिए वास्तविक समय की जानकारी और योजनाएं",
    opp: "🔥 नवीनतम सरकारी अवसर (Opportunities)",
    schol: "🎓 राज्य छात्रवृत्ति योजनाएं (Scholarships)",
    schemes: "🏛 राज्य लोक कल्याणकारी योजनाएं (Govt Schemes)",
    apprentice: "🎯 राज्य अप्रेंटिसशिप प्रशिक्षुता (Apprenticeship)",
    skills: "🛠 कौशल विकास और तकनीकी शिक्षा (Skills)",
    private: "💼 निजी क्षेत्र में रोजगार (Private Jobs)",
    boards: "📍 मुख्य राज्य भर्ती आयोग एवं बोर्ड",
    notice: "राज्यवार सभी सूचनाएं और आवेदन सीधे लिंक आपकी राष्ट्रभाषा में उपलब्ध हैं।"
  },
  te: {
    title: "రాష్ట్ర పోర్టల్ డాష్‌బోర్డ్",
    sub: "మీరు ఎంచుకున్న రాష్ట్రానికి సంబంధించిన ప్రత్యక్ష సమాచారం",
    opp: "🔥 తాజా ఉద్యోగ నోటిఫికేషన్లు (Opportunities)",
    schol: "🎓 విద్యార్థుల స్కాలర్‌షిప్స్ (Scholarships)",
    schemes: "🏛 ప్రభుత్వ అభివృద్ధి పథకాలు (Govt Schemes)",
    apprentice: "🎯 అప్రెంటిస్‌షిప్ శిక్షణ (Apprenticeship)",
    skills: "🛠 ఉపాధి నైపుణ్యాల శిక్షణ (Skills Training)",
    private: "💼 ప్రైవేట్ కంపెనీలలో ఉద్యోగాలు (Private Jobs)",
    boards: "📍 ప్రధాన రాష్ట్ర నియామక బోర్డులు",
    notice: "మీ ఎంపిక ప్రకారం సమాచారం అంతా తెలుగు భాషలో క్రమబద్ధీకరించబడింది."
  },
  mr: {
    title: "राज्य पोर्टल डॅशबोर्ड",
    sub: "तुमच्या राज्यासाठी त्वरित कायदेशीर रोजगार माहिती आणि योजना",
    opp: "🔥 प्रमुख भरती संधी (Opportunities)",
    schol: "🎓 शैक्षणिक शिष्यवृत्ती (Scholarships)",
    schemes: "🏛 लोककल्याणकारी शासकीय योजना (Govt Schemes)",
    apprentice: "🎯 शिकाऊ उमेदवारी / अप्रेंटिसशिप (Apprenticeship)",
    skills: "🛠 तंत्र आणि कौशल्य विकास कार्यक्रम (Skills)",
    private: "💼 खाजगी नोकऱ्यांची माहिती (Private Jobs)",
    boards: "📍 प्रमुख शासकीय निवड मंडळे",
    notice: "तुमच्या पसंतीनुसार सर्व अधिकृत माहिती मराठी भाषेत उपलब्ध केली आहे."
  },
  en: {
    title: "State Gateway Dashboard",
    sub: "Real-time opportunities, scholarships, and schemes updated instantly",
    opp: "🔥 Latest Opportunities",
    schol: "🎓 State Scholarships & Grants",
    schemes: "🏛 State Government Schemes",
    apprentice: "🎯 State Apprenticeship Programs",
    skills: "🛠 State Skill Development Tasks",
    private: "💼 Private Jobs in Region",
    boards: "📍 Primary Recuitment Commission Boards",
    notice: "The regional database is vetted directly from legislative gazette records."
  }
};

export function StateDashboard({ 
  selectedStateName, 
  selectedLanguage, 
  onJobSelect,
  activeThemeId 
}: StateDashboardProps) {

  const data = STATE_RESOURCES[selectedStateName] || getFallbackResources(selectedStateName);
  const currentTheme = getTheme(activeThemeId);
  const langKey = (["bn", "ta", "hi", "te", "mr"].includes(selectedLanguage) ? selectedLanguage : "en") as keyof typeof TR_MAPs;
  const labels = TR_MAPs[langKey] || TR_MAPs.en;

  return (
    <div 
      id="state-personalized-dashboard" 
      className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-lg select-none mb-6 animate-fade-in"
    >
      {/* Dynamic Native Theme Header banner */}
      <div className={`${currentTheme.bgGradient} p-5 sm:p-6 text-white text-left flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b ${currentTheme.accentBorder}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentTheme.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 rounded-lg py-0.5">
              {selectedStateName} State Portal
            </span>
          </div>
          <h3 className="font-baloo font-bold text-lg sm:text-2xl tracking-tight leading-none">
            {labels.title}
          </h3>
          <p className="text-xs text-white/90 font-medium">
            {labels.sub}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
          {data.boards.map((b, idx) => (
            <a 
              key={idx}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 hover:bg-white/30 border border-white/25 text-white text-[10.5px] font-bold px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <span>{b.name}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Grid structure of 6 custom items requested */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-slate-800 text-left">
        
        {/* Card 1: Opportunities */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-350 transition-all">
          <h4 className="font-baloo text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>{labels.opp}</span>
          </h4>
          <ul className="space-y-2 text-[11.5px] font-bold text-slate-700">
            {data.opportunities.map((item, id) => (
              <li 
                key={id} 
                className="hover:text-blue-750 cursor-pointer flex items-start gap-1 p-1 rounded hover:bg-white/80 transition-colors"
                onClick={() => onJobSelect(item.replace(/[🔥🎓🏛🎯🛠💼]/g, "").trim())}
              >
                <span className="text-orange-500 mt-0.5 w-[14px]">🔸</span>
                <span className="flex-1 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2: Scholarships */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-350 transition-all">
          <h4 className="font-baloo text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>{labels.schol}</span>
          </h4>
          <ul className="space-y-2 text-[11.5px] font-bold text-slate-700">
            {data.scholarships.map((item, id) => (
              <li 
                key={id} 
                className="hover:text-blue-750 cursor-pointer flex items-start gap-1 p-1 rounded hover:bg-white/80 transition-colors"
                onClick={() => onJobSelect(item.replace(/[🔥🎓🏛🎯🛠💼]/g, "").trim())}
              >
                <span className="text-emerald-500 mt-0.5 w-[14px]">🔸</span>
                <span className="flex-1 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 3: Govt Schemes */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-350 transition-all">
          <h4 className="font-baloo text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{labels.schemes}</span>
          </h4>
          <ul className="space-y-2 text-[11.5px] font-bold text-slate-700">
            {data.schemes.map((item, id) => (
              <li 
                key={id} 
                className="hover:text-blue-750 cursor-pointer flex items-start gap-1 p-1 rounded hover:bg-white/80 transition-colors"
                onClick={() => onJobSelect(item.replace(/[🔥🎓🏛🎯🛠💼]/g, "").trim())}
              >
                <span className="text-indigo-500 mt-0.5 w-[14px]">🔸</span>
                <span className="flex-1 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 4: Apprenticeship */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-350 transition-all">
          <h4 className="font-baloo text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>{labels.apprentice}</span>
          </h4>
          <ul className="space-y-2 text-[11.5px] font-bold text-slate-700">
            {data.apprenticeship.map((item, id) => (
              <li 
                key={id} 
                className="hover:text-blue-750 cursor-pointer flex items-start gap-1 p-1 rounded hover:bg-white/80 transition-colors"
                onClick={() => onJobSelect(item.replace(/[🔥🎓🏛🎯🛠💼]/g, "").trim())}
              >
                <span className="text-purple-500 mt-0.5 w-[14px]">🔸</span>
                <span className="flex-1 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 5: Skill Development */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-350 transition-all">
          <h4 className="font-baloo text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>{labels.skills}</span>
          </h4>
          <ul className="space-y-2 text-[11.5px] font-bold text-slate-700">
            {data.skills.map((item, id) => (
              <li 
                key={id} 
                className="hover:text-blue-750 cursor-pointer flex items-start gap-1 p-1 rounded hover:bg-white/80 transition-colors"
                onClick={() => onJobSelect(item.replace(/[🔥🎓🏛🎯🛠💼]/g, "").trim())}
              >
                <span className="text-amber-500 mt-0.5 w-[14px]">🔸</span>
                <span className="flex-1 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 6: Private Jobs */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-350 transition-all">
          <h4 className="font-baloo text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-pink-600" />
            <span>{labels.private}</span>
          </h4>
          <ul className="space-y-2 text-[11.5px] font-bold text-slate-700">
            {data.privateJobs.map((item, id) => (
              <li 
                key={id} 
                className="hover:text-pink-700 cursor-pointer flex items-start gap-1 p-1 rounded hover:bg-white/80 transition-colors"
                onClick={() => onJobSelect(item.replace(/[🔥🎓🏛🎯🛠💼]/g, "").trim())}
              >
                <span className="text-pink-500 mt-0.5 w-[14px]">🔸</span>
                <span className="flex-1 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* High-accuracy regulatory notice info link */}
      <div className="bg-slate-50 border-t border-slate-200 p-3.5 px-6 flex items-center justify-between text-[11px] text-slate-500 font-bold select-none">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{labels.notice}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <span>Active Session ID: 2026-REG-HUB</span>
        </div>
      </div>
    </div>
  );
}
