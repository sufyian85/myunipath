/**
 * unitenAdvantage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * "Your UNITEN Advantage" feature data.
 *
 * Each persona maps to a set of personalised proof cards that explain *why*
 * UNITEN CCI is a good fit for that type of learner — not generic marketing,
 * but evidence tied to the student\'s character.
 *
 * CONTENT INTEGRITY RULES (for whoever maintains this file):
 *  • Do NOT promise a certification unless it is currently offered.
 *  • Use the exact programme/module name as it appears in the CCI handbook.
 *  • Update `lastVerified` whenever you confirm accuracy with CCI.
 *  • Do not remove the disclaimer: "availability may vary by cohort."
 */

import type { ProgramId } from './data';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProofCardCategory =
  | 'curriculum'
  | 'certification'
  | 'activity'
  | 'career'
  | 'scholarship'
  | 'event';

export interface ProofCard {
  /** Category controls the icon colour and badge label */
  category: ProofCardCategory;
  /** Emoji icon shown on the card */
  icon: string;
  /** Short card title */
  title: string;
  /** 1–2 sentences: why this matters to THIS character type */
  why: string;
  /** Which programme, year, or module this appears in */
  where: string;
  /** Official UNITEN source name (link is in the component) */
  source: string;
  /** Month + year this card was last verified against CCI content */
  lastVerified: string;
  /** Optional: callout text for a highlighted/premium card */
  highlight?: string;
}

export interface UnitenAdvantage {
  personaId: ProgramId;
  /** Opening line shown directly below the badge, personalised to character */
  opener: string;
  /** 2-sentence framing paragraph */
  intro: string;
  proofCards: ProofCard[];
  cta: {
    primary: { label: string; url: string };
    secondary: { label: string; url: string };
  };
}

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_META: Record<
  ProofCardCategory,
  { label: string; color: string; bg: string }
> = {
  curriculum:    { label: 'Curriculum',    color: '#3b82f6', bg: 'rgba(59,130,246,0.15)'  },
  certification: { label: 'Certification', color: '#a855f7', bg: 'rgba(168,85,247,0.15)'  },
  activity:      { label: 'Hands-on',      color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'   },
  career:        { label: 'Career',        color: '#10b981', bg: 'rgba(16,185,129,0.15)'  },
  scholarship:   { label: 'Scholarship',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)'  },
  event:         { label: 'Get Involved',  color: '#ec4899', bg: 'rgba(236,72,153,0.15)'  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

export const UNITEN_ADVANTAGE: Record<ProgramId, UnitenAdvantage> = {

  // ── Code Architect ──────────────────────────────────────────────────────────
  'software-engineering': {
    personaId: 'software-engineering',
    opener: 'You build things. UNITEN gives you the materials.',
    intro:
      'Code Architects thrive when they can move from concept to working product fast. ' +
      'CCI\'s Software Engineering programme is structured around exactly that — real projects, ' +
      'industry-reviewed modules, and electives that let you go deep into the stack you care about.',
    proofCards: [
      {
        category: 'curriculum',
        icon: '🏗️',
        title: 'Software Engineering Core + Electives',
        why:
          'You will cover software design, data structures, algorithms, and object-oriented development — ' +
          'then choose electives in mobile development, cloud engineering, or DevOps. You pick your speciality.',
        where: 'Bachelor of Computer Science (Software Engineering) — all years',
        source: 'CCI Programme Handbook, Software Engineering',
        lastVerified: 'September 2026',
        highlight: 'Best Match',
      },
      {
        category: 'curriculum',
        icon: '☁️',
        title: 'Cloud Engineering & DevOps Track',
        why:
          'Industry input shaped these modules. You will work with cloud deployment pipelines and ' +
          'containerisation tools — the same stack used in production at tech companies.',
        where: 'Year 3 electives — Cloud Computing & DevOps modules',
        source: 'CCI Industry-Guided Curriculum Review',
        lastVerified: 'September 2026',
      },
      {
        category: 'certification',
        icon: '📜',
        title: 'Industry Certification Opportunities',
        why:
          'CCI programmes are reviewed with industry input and may incorporate certifications ' +
          'such as Google Cloud and Microsoft Azure fundamentals. Availability varies by cohort — ' +
          'confirm with your programme coordinator.',
        where: 'Selected modules, Years 2–3',
        source: 'CCI Programme Overview — UNITEN Why Study Here',
        lastVerified: 'September 2026',
      },
      {
        category: 'activity',
        icon: '🔨',
        title: 'Capstone Software Project',
        why:
          'Your final-year project is built with a real scope — some cohorts partner with industry ' +
          'clients. This gives you portfolio work that proves your skills, not just a transcript.',
        where: 'Year 3 / Final Year Project (FYP)',
        source: 'CCI Academic Structure',
        lastVerified: 'September 2026',
      },
      {
        category: 'career',
        icon: '💼',
        title: 'Software & DevOps Career Pathways',
        why:
          'Software engineers are among the highest-demand graduates in Malaysia. ' +
          'UNITEN alumni have joined firms in fintech, government tech, and regional startups.',
        where: 'UNITEN Career Services / CCI Alumni Network',
        source: 'UNITEN Graduate Outcomes Report',
        lastVerified: 'September 2026',
      },
      {
        category: 'scholarship',
        icon: '🎓',
        title: 'Scholarship & Financial Aid Options',
        why:
          'UNITEN offers merit-based scholarships, TNB bursaries, and PTPTN eligibility. ' +
          'Strong SPM results or co-curricular achievements may qualify you for reduced fees.',
        where: 'UNITEN Scholarship Office',
        source: 'uniten.edu.my/scholarship',
        lastVerified: 'September 2026',
      },
      {
        category: 'event',
        icon: '🚀',
        title: 'Hackathons & Tech Career Day',
        why:
          'CCI runs coding competitions and industry networking events throughout the year. ' +
          'These are the fastest ways to get recruiter attention before you even graduate.',
        where: 'UNITEN Campus — check the CCI events calendar',
        source: 'CCI Student Events',
        lastVerified: 'September 2026',
      },
    ],
    cta: {
      primary:   { label: 'Apply to Software Engineering',  url: 'https://www.uniten.edu.my/programme/bachelor-of-computer-science-software-engineering/' },
      secondary: { label: 'Register for Open Day', url: 'https://www.uniten.edu.my/openday' },
    },
  },

  // ── Pixel Maestro ───────────────────────────────────────────────────────────
  'graphics-multimedia': {
    personaId: 'graphics-multimedia',
    opener: 'You see the world in design. UNITEN helps you build it.',
    intro:
      'Pixel Maestros need a programme that treats creativity as a technical skill, not an afterthought. ' +
      'CCI\'s Graphics & Multimedia programme blends design thinking with the technical tools that ' +
      'studios, agencies, and game companies actually hire for.',
    proofCards: [
      {
        category: 'curriculum',
        icon: '🖼️',
        title: 'UI/UX, Digital Content & Multimedia Systems',
        why:
          'You will move through visual design principles, user experience research, digital storytelling, ' +
          'and multimedia systems — building a portfolio across every discipline that matters.',
        where: 'Bachelor of Computer Science (Graphics & Multimedia) — all years',
        source: 'CCI Programme Handbook, Graphics & Multimedia',
        lastVerified: 'September 2026',
        highlight: 'Best Match',
      },
      {
        category: 'curriculum',
        icon: '🎮',
        title: '3D Animation & Game Design Modules',
        why:
          'Technical artistry is the rare skill. These modules teach industry-standard 3D tools ' +
          'alongside game design logic — so your work is both beautiful and functional.',
        where: 'Years 2–3, Graphics & Multimedia specialisation',
        source: 'CCI Programme Structure',
        lastVerified: 'September 2026',
      },
      {
        category: 'activity',
        icon: '🗂️',
        title: 'Portfolio-Ready Project Work',
        why:
          'Every major assessment is designed to produce portfolio output — not just exam marks. ' +
          'You graduate with work you can show to agencies, studios, or clients.',
        where: 'Integrated across all years',
        source: 'CCI Academic Structure',
        lastVerified: 'September 2026',
      },
      {
        category: 'certification',
        icon: '📜',
        title: 'Industry Tools & Software Proficiency',
        why:
          'The programme incorporates training in industry-standard creative tools. ' +
          'Specific certifications may be available depending on your cohort — ask your coordinator.',
        where: 'Selected studio modules, Years 2–3',
        source: 'CCI Industry-Guided Curriculum',
        lastVerified: 'September 2026',
      },
      {
        category: 'career',
        icon: '🎨',
        title: 'Creative Tech Career Pathways',
        why:
          'UI/UX designers, 3D artists, game designers, and multimedia developers are in demand ' +
          'across Malaysian tech, advertising, e-commerce, and game studios.',
        where: 'UNITEN Career Services / CCI Alumni Network',
        source: 'UNITEN Graduate Outcomes',
        lastVerified: 'September 2026',
      },
      {
        category: 'scholarship',
        icon: '🎓',
        title: 'Merit & Talent Scholarships',
        why:
          'Students with strong creative portfolios or academic merit may qualify for UNITEN ' +
          'scholarships or industry-linked bursaries. PTPTN applies to all eligible students.',
        where: 'UNITEN Scholarship Office',
        source: 'uniten.edu.my/scholarship',
        lastVerified: 'September 2026',
      },
      {
        category: 'event',
        icon: '🖼️',
        title: 'Digital Design Exhibition & Portfolio Day',
        why:
          'CCI showcases student multimedia work at end-of-year exhibitions. ' +
          'Industry guests attend — this is your first professional networking moment.',
        where: 'UNITEN Campus — CCI annual exhibition',
        source: 'CCI Student Events',
        lastVerified: 'September 2026',
      },
    ],
    cta: {
      primary:   { label: 'Apply to Graphics & Multimedia', url: 'https://www.uniten.edu.my/programme/bachelor-of-computer-science-graphics-and-multimedia/' },
      secondary: { label: 'Register for Open Day', url: 'https://www.uniten.edu.my/openday' },
    },
  },

  // ── Cyber Sentinel ──────────────────────────────────────────────────────────
  'cybersecurity': {
    personaId: 'cybersecurity',
    opener: 'You think like an attacker. UNITEN trains you to defend.',
    intro:
      'Cyber Sentinels need more than theory — they need labs, adversarial thinking, and credentials ' +
      'that prove their skills under pressure. CCI\'s Cybersecurity programme is built around exactly that, ' +
      'with hands-on defence and ethical hacking work baked into the curriculum.',
    proofCards: [
      {
        category: 'curriculum',
        icon: '🛡️',
        title: 'Cyber Defence, Ethical Hacking & Digital Forensics',
        why:
          'You will study how systems are attacked and how to stop them — network intrusion, ' +
          'malware analysis, digital forensics, and security architecture. This is the full spectrum.',
        where: 'Bachelor of Computer Science (Cybersecurity) — all years',
        source: 'CCI Programme Handbook, Cybersecurity',
        lastVerified: 'September 2026',
        highlight: 'Best Match',
      },
      {
        category: 'certification',
        icon: '🔐',
        title: 'Penetration Tester Certification Opportunity',
        why:
          'CCI programmes may incorporate a Penetration Tester credential — one of the most ' +
          'sought-after certifications in cybersecurity hiring. Availability varies by cohort; ' +
          'confirm with your programme coordinator before enrolling.',
        where: 'Selected Year 3 modules — confirm with CCI',
        source: 'CCI Industry Certification Review — UNITEN Why Study Here',
        lastVerified: 'September 2026',
        highlight: 'High Value',
      },
      {
        category: 'activity',
        icon: '🚩',
        title: 'Capture The Flag (CTF) Competitions',
        why:
          'CTF events are the proving ground for cybersecurity talent. UNITEN students participate ' +
          'in regional competitions — these results go directly on your CV.',
        where: 'CCI co-curricular activities, open to all years',
        source: 'CCI Student Events',
        lastVerified: 'September 2026',
      },
      {
        category: 'activity',
        icon: '🔬',
        title: 'Dedicated Security Labs',
        why:
          'Cyber skills need a safe environment to practise in. CCI provides lab access for ' +
          'network scanning, vulnerability testing, and incident response simulation.',
        where: 'CCI Security Lab facilities — Years 2–3',
        source: 'CCI Facilities Overview',
        lastVerified: 'September 2026',
      },
      {
        category: 'career',
        icon: '🕵️',
        title: 'Cybersecurity Career Pathways',
        why:
          'Malaysia\'s cybersecurity talent gap is growing. Graduates enter roles as security analysts, ' +
          'ethical hackers, forensics investigators, and security consultants — often with above-average ' +
          'starting salaries in the ICT sector.',
        where: 'UNITEN Career Services / CCI Alumni Network',
        source: 'UNITEN Graduate Outcomes',
        lastVerified: 'September 2026',
      },
      {
        category: 'scholarship',
        icon: '🎓',
        title: 'Cybersecurity Talent Scholarships',
        why:
          'National demand for cyber talent has made this field a priority for scholarship bodies. ' +
          'UNITEN and external agencies offer bursaries for cybersecurity students.',
        where: 'UNITEN Scholarship Office',
        source: 'uniten.edu.my/scholarship',
        lastVerified: 'September 2026',
      },
      {
        category: 'event',
        icon: '🛡️',
        title: 'Cybersecurity Workshops & Industry Talks',
        why:
          'CCI hosts workshops and invites practitioners from the security industry. ' +
          'Attending before you enrol is one of the best ways to validate your interest and make contacts.',
        where: 'UNITEN Campus — CCI events calendar',
        source: 'CCI Student Events',
        lastVerified: 'September 2026',
      },
    ],
    cta: {
      primary:   { label: 'Apply to Cybersecurity',  url: 'https://www.uniten.edu.my/programme/bachelor-of-computer-science-cybersecurity/' },
      secondary: { label: 'Register for Open Day', url: 'https://www.uniten.edu.my/openday' },
    },
  },

  // ── AI Pioneer ──────────────────────────────────────────────────────────────
  'artificial-intelligence': {
    personaId: 'artificial-intelligence',
    opener: 'You ask "what if machines could do this?" UNITEN helps you find out.',
    intro:
      'AI Pioneers need a programme that takes the maths seriously while keeping pace with how fast ' +
      'the field moves. CCI\'s AI programme covers the fundamentals deeply and adds cloud-integrated ' +
      'and generative AI learning opportunities shaped by industry input.',
    proofCards: [
      {
        category: 'curriculum',
        icon: '🤖',
        title: 'Machine Learning, Deep Learning & Computer Vision',
        why:
          'You will study the mathematical foundations of AI — linear algebra, probability, optimisation — ' +
          'then apply them to real model training. Computer vision and NLP modules let you build things ' +
          'that work in the real world.',
        where: 'Bachelor of Computer Science (Artificial Intelligence) — all years',
        source: 'CCI Programme Handbook, Artificial Intelligence',
        lastVerified: 'September 2026',
        highlight: 'Best Match',
      },
      {
        category: 'curriculum',
        icon: '✨',
        title: 'Generative AI & Large Language Model Topics',
        why:
          'CCI\'s industry-guided review has introduced generative AI learning opportunities — ' +
          'the fastest-growing area in the field. This is where the jobs are being created right now.',
        where: 'Year 3 elective track — confirm current offerings with CCI',
        source: 'CCI Industry-Guided Curriculum Review',
        lastVerified: 'September 2026',
      },
      {
        category: 'certification',
        icon: '☁️',
        title: 'Google Cloud & Cloud Data Certification Alignment',
        why:
          'CCI programmes incorporate Google Cloud learning opportunities. A Google Cloud certification ' +
          'adds immediate credibility to an AI/ML graduate CV. Confirm availability with your coordinator.',
        where: 'Selected modules, Years 2–3',
        source: 'CCI Industry Certification Review — UNITEN Why Study Here',
        lastVerified: 'September 2026',
        highlight: 'Industry Valued',
      },
      {
        category: 'activity',
        icon: '🧠',
        title: 'AI Research Projects & Competition Teams',
        why:
          'The best AI portfolios come from building and shipping real models. CCI students work on ' +
          'research projects and compete in data challenges — giving you results to talk about in interviews.',
        where: 'FYP and co-curricular AI competitions — all years',
        source: 'CCI Academic & Student Activities',
        lastVerified: 'September 2026',
      },
      {
        category: 'career',
        icon: '🚀',
        title: 'AI/ML & Data Science Career Pathways',
        why:
          'AI engineers and data scientists are the most sought-after graduates in technology globally. ' +
          'UNITEN\'s programme positions you for roles in tech companies, research labs, finance, and healthcare.',
        where: 'UNITEN Career Services / CCI Alumni Network',
        source: 'UNITEN Graduate Outcomes',
        lastVerified: 'September 2026',
      },
      {
        category: 'scholarship',
        icon: '🎓',
        title: 'Research & Merit Scholarships',
        why:
          'Strong analytical results and research aptitude can qualify for merit scholarships. ' +
          'UNITEN and partner agencies offer bursaries for high-achieving ICT students.',
        where: 'UNITEN Scholarship Office',
        source: 'uniten.edu.my/scholarship',
        lastVerified: 'September 2026',
      },
      {
        category: 'event',
        icon: '🔬',
        title: 'AI Hackathons & Tech Talks',
        why:
          'CCI connects students with practitioners working in AI. Hackathons are a direct ' +
          'pathway to internship conversations — teams that win get noticed.',
        where: 'UNITEN Campus — CCI events calendar',
        source: 'CCI Student Events',
        lastVerified: 'September 2026',
      },
    ],
    cta: {
      primary:   { label: 'Apply to Artificial Intelligence', url: 'https://www.uniten.edu.my/programme/bachelor-of-computer-science-artificial-intelligence/' },
      secondary: { label: 'Register for Open Day', url: 'https://www.uniten.edu.my/openday' },
    },
  },

  // ── Data Oracle ─────────────────────────────────────────────────────────────
  'business-analytics': {
    personaId: 'business-analytics',
    opener: 'You see the story inside the numbers. UNITEN gives you the tools to tell it.',
    intro:
      'Data Oracles need a programme where analytics is not an add-on but the core skill. ' +
      'CCI\'s Business Analytics programme uses industry tools — Alteryx, SAP, Google Cloud Data Analytics — ' +
      'with real case studies, not textbook simulations.',
    proofCards: [
      {
        category: 'curriculum',
        icon: '📊',
        title: 'Business Analytics, Statistics & BI Systems',
        why:
          'You will build a foundation in statistical analysis, data modelling, and business intelligence — ' +
          'the triple skill set that separates a real analyst from someone who just knows Excel.',
        where: 'Bachelor of Information Technology (Business Analytics) — all years',
        source: 'CCI Programme Handbook, Business Analytics',
        lastVerified: 'September 2026',
        highlight: 'Best Match',
      },
      {
        category: 'certification',
        icon: '⚙️',
        title: 'Alteryx Certification Opportunity',
        why:
          'Alteryx is used by Fortune 500 data teams globally. CCI incorporates Alteryx training ' +
          'and may offer certification opportunities. Confirm current availability with your coordinator.',
        where: 'Selected analytics modules — confirm with CCI',
        source: 'CCI Industry Certification Review — UNITEN Why Study Here',
        lastVerified: 'September 2026',
        highlight: 'Industry Valued',
      },
      {
        category: 'certification',
        icon: '🔵',
        title: 'SAP & Google Cloud Data Analytics',
        why:
          'SAP is the enterprise backbone of most large Malaysian companies. Google Cloud Data Analytics ' +
          'certification is increasingly requested in job listings. CCI programmes may incorporate both — ' +
          'confirm availability before enrolling.',
        where: 'Selected Year 2–3 modules',
        source: 'CCI Industry-Guided Curriculum — UNITEN Why Study Here',
        lastVerified: 'September 2026',
      },
      {
        category: 'activity',
        icon: '📁',
        title: 'Real-World Industry Data Projects',
        why:
          'You will work with actual datasets — not synthetic textbook data. Industry-linked case studies ' +
          'let you build the analytical judgement that employers test for in interviews.',
        where: 'Integrated across Years 2–3, and Final Year Project',
        source: 'CCI Academic Structure',
        lastVerified: 'September 2026',
      },
      {
        category: 'career',
        icon: '📈',
        title: 'Analytics & BI Career Pathways',
        why:
          'Business analysts and BI developers are hired across banking, logistics, retail, healthcare, ' +
          'and government — making this one of the most versatile ICT career paths in Malaysia.',
        where: 'UNITEN Career Services / CCI Alumni Network',
        source: 'UNITEN Graduate Outcomes',
        lastVerified: 'September 2026',
      },
      {
        category: 'scholarship',
        icon: '🎓',
        title: 'Merit & Industry-Sponsored Scholarships',
        why:
          'The demand for analytics talent has made this field attractive to sponsors. ' +
          'Check UNITEN\'s scholarship office for current bursaries — PTPTN applies to all eligible students.',
        where: 'UNITEN Scholarship Office',
        source: 'uniten.edu.my/scholarship',
        lastVerified: 'September 2026',
      },
      {
        category: 'event',
        icon: '🎯',
        title: 'Analytics Case Competitions & Industry Seminars',
        why:
          'Solving a real business problem in a timed competition is the fastest way to prove ' +
          'your analytical skills to a future employer. CCI students participate in regional events.',
        where: 'UNITEN Campus — CCI events calendar',
        source: 'CCI Student Events',
        lastVerified: 'September 2026',
      },
    ],
    cta: {
      primary:   { label: 'Apply to Business Analytics', url: 'https://www.uniten.edu.my/programme/bachelor-of-information-technology-business-analytics/' },
      secondary: { label: 'Register for Open Day', url: 'https://www.uniten.edu.my/openday' },
    },
  },

  // ── Network Titan ───────────────────────────────────────────────────────────
  'systems-networking': {
    personaId: 'systems-networking',
    opener: 'You keep the digital world running. UNITEN trains you to build it.',
    intro:
      'Network Titans need hands-on lab time with real equipment, not just simulations. ' +
      'CCI\'s Systems & Networking programme is CCNA-aligned and extends into cloud infrastructure ' +
      'and network security — because modern networks span both physical and cloud layers.',
    proofCards: [
      {
        category: 'curriculum',
        icon: '🌐',
        title: 'CCNA-Aligned Networking, Routing & Wireless',
        why:
          'The curriculum mirrors CCNA content — routing protocols, switching, wireless networking — ' +
          'so your degree prepares you directly for the certification that employers look for first.',
        where: 'Bachelor of Computer Science (Systems & Networking) — all years',
        source: 'CCI Programme Handbook, Systems & Networking',
        lastVerified: 'September 2026',
        highlight: 'Best Match',
      },
      {
        category: 'certification',
        icon: '📜',
        title: 'CCNA Certification Opportunity',
        why:
          'Cisco Certified Network Associate (CCNA) is the gold standard entry credential for ' +
          'networking careers. CCI\'s curriculum is aligned to help you pursue this — confirm ' +
          'current exam support with your programme coordinator.',
        where: 'Networking modules — Years 2–3',
        source: 'CCI Industry Certification Review — UNITEN Why Study Here',
        lastVerified: 'September 2026',
        highlight: 'Industry Standard',
      },
      {
        category: 'curriculum',
        icon: '☁️',
        title: 'Cloud Engineering & Network Security',
        why:
          'Networks now span physical and cloud infrastructure. CCI extends the networking ' +
          'curriculum into cloud engineering and network security — skills that command premium salaries.',
        where: 'Year 3 elective track — Cloud & Security specialisation',
        source: 'CCI Industry-Guided Curriculum',
        lastVerified: 'September 2026',
      },
      {
        category: 'activity',
        icon: '🔌',
        title: 'Cisco Packet Tracer & Physical Lab Equipment',
        why:
          'Simulation alone is not enough. CCI provides access to physical networking equipment ' +
          'alongside Cisco Packet Tracer for hands-on configuration practice — exactly what appears ' +
          'in CCNA labs and real job tasks.',
        where: 'CCI Network Lab — Years 1–3',
        source: 'CCI Facilities Overview',
        lastVerified: 'September 2026',
      },
      {
        category: 'career',
        icon: '🏢',
        title: 'Network & Infrastructure Career Pathways',
        why:
          'Network engineers, cloud infrastructure engineers, and systems administrators are ' +
          'among the most consistently hired ICT professionals in Malaysia — and the pathway to ' +
          'senior architect roles is well-defined.',
        where: 'UNITEN Career Services / CCI Alumni Network',
        source: 'UNITEN Graduate Outcomes',
        lastVerified: 'September 2026',
      },
      {
        category: 'scholarship',
        icon: '🎓',
        title: 'TNB & UNITEN Scholarships',
        why:
          'As a TNB-linked university, UNITEN has scholarship and bursary options that may ' +
          'favour infrastructure and engineering-related programmes. PTPTN applies to all eligible students.',
        where: 'UNITEN Scholarship Office',
        source: 'uniten.edu.my/scholarship',
        lastVerified: 'September 2026',
      },
      {
        category: 'event',
        icon: '🏆',
        title: 'Cisco Networking Academy & Campus Tech Tour',
        why:
          'Visiting the networking labs before you enrol lets you see the real equipment and meet ' +
          'current students. The Cisco Networking Academy affiliation gives you a community from day one.',
        where: 'UNITEN Campus — open day and lab tours',
        source: 'CCI Student Events / Open Day',
        lastVerified: 'September 2026',
      },
    ],
    cta: {
      primary:   { label: 'Apply to Systems & Networking', url: 'https://www.uniten.edu.my/programme/bachelor-of-computer-science-systems-and-networking/' },
      secondary: { label: 'Register for Open Day', url: 'https://www.uniten.edu.my/openday' },
    },
  },
};
