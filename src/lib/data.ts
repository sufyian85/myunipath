/**
 * MyUniPath – CCI UNITEN
 * Centralised data: 6 program characters, 12 scenario-based quiz questions,
 * and full program information.
 */

// ─── Program IDs ──────────────────────────────────────────────────────────────
export type ProgramId =
  | 'software-engineering'
  | 'graphics-multimedia'
  | 'cybersecurity'
  | 'artificial-intelligence'
  | 'business-analytics'
  | 'systems-networking';

// ─── Quiz question option ─────────────────────────────────────────────────────
export interface QuestionOption {
  text: string;
  emoji: string;
  scores: Partial<Record<ProgramId, number>>;
  // Legacy fields kept for backend compatibility
  persona?: string;
  icon?: string;
  logic?: number;
  creative?: number;
}

export interface Question {
  id: number;
  question: string;
  category: string;
  options: QuestionOption[];
}

// ─── 12 scenario-based quiz questions ────────────────────────────────────────
// Each option awards points to 1–2 programs. Highest total = your character.
// Scoring legend: S=SoftEng, G=Graphics, C=Cyber, AI=AI, BA=BizAnalytics, N=Networking
export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "School holidays after SPM — it's midnight and your laptop is open. What are you actually doing?",
    category: "Your Habits",
    options: [
      {
        text: "Editing photos, making videos or designing something in Canva",
        emoji: "🎨",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "Trying to build a simple website or app — just to see if I can",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'artificial-intelligence': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 1,
      },
      {
        text: "Watching YouTube videos about hackers, scams, and online security",
        emoji: "🛡️",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
      {
        text: "Making charts or tables in Excel — I like making sense of numbers",
        emoji: "📊",
        scores: { 'business-analytics': 3, 'artificial-intelligence': 1 },
        persona: 'business-analytics', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 2,
    question: "UNITEN offers you a one-week work experience placement. Which team do you choose?",
    category: "Dream Placement",
    options: [
      {
        text: "AI Lab — helping build a smart chatbot that can answer questions",
        emoji: "🤖",
        scores: { 'artificial-intelligence': 3, 'software-engineering': 1 },
        persona: 'artificial-intelligence', icon: '', logic: 4, creative: 2,
      },
      {
        text: "Design Studio — creating graphics and animations for apps and games",
        emoji: "🎮",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "Cybersecurity Team — testing if the university's systems can be hacked",
        emoji: "🔐",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
      {
        text: "Network Operations Room — making sure all systems stay connected",
        emoji: "🌐",
        scores: { 'systems-networking': 3, 'cybersecurity': 1 },
        persona: 'systems-networking', icon: '', logic: 4, creative: 1,
      },
    ],
  },
  {
    id: 3,
    question: "You have the whole school break and RM500 to spend on learning something. What do you pick?",
    category: "What You'd Learn",
    options: [
      {
        text: "A course on photo editing, video production and 3D animation",
        emoji: "🎨",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "A coding bootcamp to build my first mobile app",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'artificial-intelligence': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 2,
      },
      {
        text: "A course on how to protect people from online scams and hacking",
        emoji: "🕵️",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 1,
      },
      {
        text: "A data course — learning how to read trends and turn numbers into insights",
        emoji: "🧠",
        scores: { 'artificial-intelligence': 3, 'business-analytics': 1 },
        persona: 'artificial-intelligence', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 4,
    question: "Your school's WhatsApp group gets hacked — someone is sending fake messages pretending to be the teacher. You're asked to help fix it. What do you do?",
    category: "Crisis Mode",
    options: [
      {
        text: "Track down how the hack happened and block it from spreading",
        emoji: "🛡️",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
      {
        text: "Set up a new, more secure communication system for the school",
        emoji: "🌐",
        scores: { 'systems-networking': 3, 'cybersecurity': 1 },
        persona: 'systems-networking', icon: '', logic: 4, creative: 1,
      },
      {
        text: "Build a quick tool to automatically detect and remove fake messages",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'cybersecurity': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 1,
      },
      {
        text: "Collect all the screenshots and logs, then put together a full report",
        emoji: "📊",
        scores: { 'business-analytics': 3, 'cybersecurity': 1 },
        persona: 'business-analytics', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 5,
    question: "Your school is hosting an Open Day next month. Which digital project do YOU volunteer to lead?",
    category: "Your Role in the Team",
    options: [
      {
        text: "Design all the posters, banners and social media content",
        emoji: "🎨",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "Build a simple website where visitors can register and get info",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'artificial-intelligence': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 1,
      },
      {
        text: "Set up the school's Wi-Fi so everything runs smoothly on the day",
        emoji: "🌐",
        scores: { 'systems-networking': 3, 'cybersecurity': 1 },
        persona: 'systems-networking', icon: '', logic: 4, creative: 1,
      },
      {
        text: "Track visitor numbers and figure out which booths were most popular",
        emoji: "📊",
        scores: { 'business-analytics': 3, 'artificial-intelligence': 1 },
        persona: 'business-analytics', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 6,
    question: "You see a tech news headline that makes you stop scrolling. Which one is it?",
    category: "What Grabs Your Attention",
    options: [
      {
        text: "Malaysian studio wins award for best animated short film — made with AI tools",
        emoji: "🕹️",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "New AI assistant can now write code, solve maths and diagnose illnesses",
        emoji: "🤖",
        scores: { 'artificial-intelligence': 3, 'software-engineering': 1 },
        persona: 'artificial-intelligence', icon: '', logic: 4, creative: 2,
      },
      {
        text: "Millions of Malaysians' personal data leaked — here's how it happened",
        emoji: "🔐",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
      {
        text: "Malaysia targets full 5G coverage by 2026 — what this means for everyone",
        emoji: "📡",
        scores: { 'systems-networking': 3, 'artificial-intelligence': 1 },
        persona: 'systems-networking', icon: '', logic: 4, creative: 1,
      },
    ],
  },
  {
    id: 7,
    question: "You find a free online course to try this weekend. Which one do you click on first?",
    category: "Weekend Learning",
    options: [
      {
        text: "'Learn Canva, Photoshop & Video Editing — No Experience Needed'",
        emoji: "🎨",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "'Build Your First Mobile App in 8 Hours — Beginners Welcome'",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'artificial-intelligence': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 1,
      },
      {
        text: "'How Hackers Think: Protecting Yourself Online — Free Intro Course'",
        emoji: "🕵️",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 1,
      },
      {
        text: "'AI and Data for Beginners: How Machines Learn from Numbers'",
        emoji: "🧠",
        scores: { 'artificial-intelligence': 3, 'business-analytics': 1 },
        persona: 'artificial-intelligence', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 8,
    question: "Technology amazes me most when it...",
    category: "What Excites You",
    options: [
      {
        text: "Creates stunning visuals, animations or game worlds you can get lost in",
        emoji: "✨",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "Learns and improves on its own — without anyone programming every step",
        emoji: "🤖",
        scores: { 'artificial-intelligence': 3, 'business-analytics': 1 },
        persona: 'artificial-intelligence', icon: '', logic: 4, creative: 2,
      },
      {
        text: "Keeps people safe — stopping scammers, hackers and data thieves",
        emoji: "🔒",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
      {
        text: "Turns a huge pile of messy data into something clear and useful",
        emoji: "📊",
        scores: { 'business-analytics': 3, 'artificial-intelligence': 1 },
        persona: 'business-analytics', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 9,
    question: "You're at McDonald's and the free Wi-Fi is super slow. What's your FIRST thought?",
    category: "How You Think",
    options: [
      {
        text: "\"The app probably has a bug — the developers need to fix the code\"",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'systems-networking': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 1,
      },
      {
        text: "\"Something is wrong with the router or the connection settings here\"",
        emoji: "🌐",
        scores: { 'systems-networking': 3, 'cybersecurity': 1 },
        persona: 'systems-networking', icon: '', logic: 4, creative: 1,
      },
      {
        text: "\"Free public Wi-Fi is risky — I should use my mobile data instead\"",
        emoji: "🛡️",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
      {
        text: "\"I wonder how many people are connected and how that's affecting the speed\"",
        emoji: "📊",
        scores: { 'business-analytics': 3, 'systems-networking': 1 },
        persona: 'business-analytics', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 10,
    question: "Which of these job titles sounds the most exciting to you?",
    category: "Dream Career",
    options: [
      {
        text: "Game Designer · Animator · UI/UX Designer · 3D Artist",
        emoji: "🎨",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "App Developer · Software Engineer · Web Developer",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'artificial-intelligence': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 2,
      },
      {
        text: "AI Researcher · Data Scientist · Machine Learning Engineer",
        emoji: "🤖",
        scores: { 'artificial-intelligence': 3, 'business-analytics': 1 },
        persona: 'artificial-intelligence', icon: '', logic: 4, creative: 2,
      },
      {
        text: "Cybersecurity Analyst · Ethical Hacker · Digital Forensics Expert",
        emoji: "🔐",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 1,
      },
    ],
  },
  {
    id: 11,
    question: "When something goes wrong, how do YOU usually try to fix it?",
    category: "Your Problem-Solving Style",
    options: [
      {
        text: "I draw it out or map it visually — seeing it helps me think clearly",
        emoji: "🎨",
        scores: { 'graphics-multimedia': 3, 'business-analytics': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "I go step by step through the logic until I find exactly where it broke",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'artificial-intelligence': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 1,
      },
      {
        text: "I think about what could go wrong first — I look for risks before they happen",
        emoji: "🔍",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
      {
        text: "I collect all the information I can and look for patterns in the data",
        emoji: "📊",
        scores: { 'business-analytics': 3, 'artificial-intelligence': 1 },
        persona: 'business-analytics', icon: '', logic: 4, creative: 2,
      },
    ],
  },
  {
    id: 12,
    question: "Your friends always come to you because you're the one who...",
    category: "Your Reputation",
    options: [
      {
        text: "Makes everything look amazing — edits photos, designs posters, creates TikTok content",
        emoji: "🎨",
        scores: { 'graphics-multimedia': 3, 'software-engineering': 1 },
        persona: 'graphics-multimedia', icon: '', logic: 1, creative: 4,
      },
      {
        text: "Builds or fixes apps, websites and tech stuff when no one else can",
        emoji: "💻",
        scores: { 'software-engineering': 3, 'artificial-intelligence': 1 },
        persona: 'software-engineering', icon: '', logic: 4, creative: 1,
      },
      {
        text: "Sorts out the Wi-Fi and fixes internet problems for everyone",
        emoji: "🌐",
        scores: { 'systems-networking': 3, 'cybersecurity': 1 },
        persona: 'systems-networking', icon: '', logic: 4, creative: 1,
      },
      {
        text: "Warns everyone about online scams and knows how to stay safe on the internet",
        emoji: "🛡️",
        scores: { 'cybersecurity': 3, 'systems-networking': 1 },
        persona: 'cybersecurity', icon: '', logic: 4, creative: 0,
      },
    ],
  },
];

// ─── 6 Character / Persona Data ───────────────────────────────────────────────
export interface CharacterData {
  id: ProgramId;
  name: string;
  title: string;
  tagline: string;
  description: string;
  traits: string[];
  emoji: string;
  color: string;       // primary hex
  colorAlt: string;    // secondary hex for gradient
  gradient: string;    // CSS gradient string
  gradientClass: string; // Tailwind gradient class (for legacy compat)
  programs: ProgramId[];
  mascotImage: string;
  careerRoles: string[];
  superpower: string;
}

export type PersonaData = CharacterData; // alias for backward compat

export const CHARACTER_DATA: Record<ProgramId, CharacterData> = {
  'software-engineering': {
    id: 'software-engineering',
    name: 'The Code Architect',
    title: 'You build the digital world',
    tagline: 'Where logic meets creation',
    description:
      'You think in systems and solutions. You love the satisfaction of building something from nothing — an idea that becomes a working product. You are methodical, persistent, and driven by elegant code that scales. The world runs on software, and you write it.',
    traits: ['Problem Solver', 'Logical Thinker', 'Builder at Heart', 'Detail-Oriented'],
    emoji: '💻',
    color: '#3b82f6',
    colorAlt: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
    gradientClass: 'from-[#1e40af] via-[#3b82f6] to-[#06b6d4]',
    programs: ['software-engineering', 'artificial-intelligence'],
    mascotImage: '/mascot-solver.png',
    careerRoles: ['Software Engineer', 'Full-Stack Developer', 'Mobile App Developer', 'DevOps Engineer'],
    superpower: 'Turning complex ideas into working software',
  },
  'graphics-multimedia': {
    id: 'graphics-multimedia',
    name: 'The Pixel Maestro',
    title: 'You make technology beautiful',
    tagline: 'Art powered by technology',
    description:
      'You see the world in colour, composition, and creativity. Technology is your canvas. You understand that great design is not just about looking good — it\'s about making people feel something. You combine artistic vision with technical skill to create digital experiences people love.',
    traits: ['Creative Visionary', 'Design Thinker', 'Storyteller', 'User-Focused'],
    emoji: '🎨',
    color: '#a855f7',
    colorAlt: '#ec4899',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
    gradientClass: 'from-[#7c3aed] via-[#a855f7] to-[#ec4899]',
    programs: ['graphics-multimedia', 'software-engineering'],
    mascotImage: '/mascot-creator.png',
    careerRoles: ['UI/UX Designer', '3D Artist & Animator', 'Game Designer', 'Multimedia Developer'],
    superpower: 'Creating experiences that are impossible to ignore',
  },
  'cybersecurity': {
    id: 'cybersecurity',
    name: 'The Cyber Sentinel',
    title: 'You guard the digital frontier',
    tagline: 'Protecting what matters most',
    description:
      'You think like both attacker and defender. You are the last line of protection in a world where every system has vulnerabilities. Your vigilance, ethical mindset, and technical precision keep organisations safe. In a world of digital threats, you are the guardian that everyone needs.',
    traits: ['Vigilant & Sharp', 'Ethical Hacker', 'Strategic Defender', 'Systems Thinker'],
    emoji: '🛡️',
    color: '#ef4444',
    colorAlt: '#991b1b',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f97316 100%)',
    gradientClass: 'from-[#7f1d1d] via-[#dc2626] to-[#f97316]',
    programs: ['cybersecurity', 'systems-networking'],
    mascotImage: '/mascot-guardian.png',
    careerRoles: ['Cybersecurity Analyst', 'Ethical Hacker / Pen Tester', 'Security Consultant', 'Digital Forensics Analyst'],
    superpower: 'Seeing threats before they become breaches',
  },
  'artificial-intelligence': {
    id: 'artificial-intelligence',
    name: 'The AI Pioneer',
    title: 'You teach machines to think',
    tagline: 'Engineering the future of intelligence',
    description:
      'You are fascinated by the question: how do we make machines smarter? You love maths, patterns, and the thrill of training a model that actually works. You sit at the cutting edge of technology — building AI systems that will reshape industries, medicine, and how humanity solves its greatest challenges.',
    traits: ['Analytical Mind', 'Pattern Seeker', 'Future-Focused', 'Research-Driven'],
    emoji: '🤖',
    color: '#06b6d4',
    colorAlt: '#0891b2',
    gradient: 'linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)',
    gradientClass: 'from-[#164e63] via-[#0891b2] to-[#06b6d4]',
    programs: ['artificial-intelligence', 'software-engineering'],
    mascotImage: '/mascot-solver.png',
    careerRoles: ['AI/ML Engineer', 'Data Scientist', 'AI Research Scientist', 'Computer Vision Engineer'],
    superpower: 'Building intelligence from data',
  },
  'business-analytics': {
    id: 'business-analytics',
    name: 'The Data Oracle',
    title: 'You see what the numbers reveal',
    tagline: 'Where data meets strategy',
    description:
      'You have a rare gift: you can see stories inside spreadsheets and meaning inside massive datasets. You bridge the gap between raw data and real decisions. Companies depend on people like you to make sense of complexity, predict trends, and turn numbers into strategies that drive growth.',
    traits: ['Data-Driven', 'Strategic Thinker', 'Curious & Analytical', 'Business-Minded'],
    emoji: '📊',
    color: '#f59e0b',
    colorAlt: '#d97706',
    gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%)',
    gradientClass: 'from-[#92400e] via-[#d97706] to-[#fbbf24]',
    programs: ['business-analytics', 'artificial-intelligence'],
    mascotImage: '/mascot-analyst.png',
    careerRoles: ['Business Analyst', 'Data Analyst', 'IT Consultant', 'Business Intelligence Developer'],
    superpower: 'Turning raw data into decisions that matter',
  },
  'systems-networking': {
    id: 'systems-networking',
    name: 'The Network Titan',
    title: 'You connect the world',
    tagline: 'The backbone of the digital era',
    description:
      'Without you, nothing works. You are the architect of digital infrastructure — the person who ensures that billions of devices can communicate seamlessly. You love the complexity of networks, the satisfaction of perfect uptime, and the challenge of designing systems that never fail.',
    traits: ['Infrastructure Expert', 'Systems Thinker', 'Reliable & Precise', 'Problem Eliminator'],
    emoji: '🌐',
    color: '#10b981',
    colorAlt: '#059669',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
    gradientClass: 'from-[#064e3b] via-[#059669] to-[#10b981]',
    programs: ['systems-networking', 'cybersecurity'],
    mascotImage: '/mascot-guardian.png',
    careerRoles: ['Network Engineer', 'Systems Administrator', 'Cloud Infrastructure Engineer', 'Network Architect'],
    superpower: 'Keeping the digital world connected and running',
  },
};

// Backward-compatible export (ResultPage, StudentProfile etc. reference PERSONA_DATA)
export const PERSONA_DATA: Record<string, CharacterData> = CHARACTER_DATA as Record<string, CharacterData>;

// ─── Program Information ──────────────────────────────────────────────────────
export interface EntryRequirementPath {
  qualification: string;
  requirements: string[];
}

export interface ProgramInfo {
  id: string;
  name: string;
  icon: string;
  shortDesc: string;
  color: string;
  intakes: string;
  campus: string;
  duration: string;
  feeMalaysian: string;
  feeInternational: string;
  summary: string;
  entryRequirements: EntryRequirementPath[];
  careerProspects?: string[];
  externalUrl: string;
}

const UNITEN_INTAKES = 'January, June & September';
const UNITEN_CAMPUS = 'Putrajaya Campus';
const UNITEN_DURATION = '3 years (full-time)';
const UNITEN_FEE_MY = 'RM75,000';
const UNITEN_FEE_INTL = 'RM78,000';

const CS_ENTRY_REQUIREMENTS: EntryRequirementPath[] = [
  {
    qualification: 'STPM (Science Stream)',
    requirements: ['Pass STPM with min Grade C (CGPA 2.00) in:', 'Mathematics (Grade C)', 'Any 1 Science / ICT subject (Grade C)'],
  },
  {
    qualification: 'Matriculation / Foundation',
    requirements: ['Pass in related field with min CGPA of 2.00', 'Additional Mathematics / Mathematics SPM (Grade C)', 'Any 1 Science / Technology / Engineering subject (Grade C)'],
  },
  {
    qualification: 'Diploma (Computing field)',
    requirements: ['Pass with min CGPA of 2.50.', 'CGPA 2.00–2.50 may be considered via internal evaluation.'],
  },
  {
    qualification: 'A-Level / GCSE',
    requirements: ['Min Grade D in Mathematics', 'Min Grade D in any 1 Science / ICT subject'],
  },
];

const IT_ENTRY_REQUIREMENTS: EntryRequirementPath[] = [
  {
    qualification: 'STPM',
    requirements: ['Pass with min Grade C (CGPA 2.00) in any 2 subjects.', 'Mathematics SPM (Grade C)'],
  },
  {
    qualification: 'Matriculation / Foundation',
    requirements: ['Pass in related field with min CGPA of 2.00.', 'Mathematics SPM (Grade C)'],
  },
  {
    qualification: 'Diploma (Computing field)',
    requirements: ['Pass with min CGPA of 2.50.', 'CGPA 2.00–2.50 may be considered via internal evaluation.'],
  },
  {
    qualification: 'UEC',
    requirements: ['Min Grade B6 in 5 subjects including Mathematics, English & any 1 Science/ICT subject.'],
  },
];

export const PROGRAM_DATA: Record<string, ProgramInfo> = {
  'software-engineering': {
    id: 'software-engineering',
    name: 'Bachelor in Software Engineering (Hons)',
    icon: '💻',
    shortDesc: 'Design and build robust software systems',
    color: 'blue',
    intakes: UNITEN_INTAKES,
    campus: UNITEN_CAMPUS,
    duration: UNITEN_DURATION,
    feeMalaysian: UNITEN_FEE_MY,
    feeInternational: UNITEN_FEE_INTL,
    summary:
      'Prepares students in systematic software design, development, testing, and management with strong foundations in engineering principles and hands-on project experience. Graduates excel in software development, application design, system integration, and emerging digital technologies.',
    entryRequirements: CS_ENTRY_REQUIREMENTS,
    careerProspects: ['Software Developer', 'Full-Stack Engineer', 'Mobile App Developer', 'DevOps Engineer'],
    externalUrl: 'https://www.uniten.edu.my/programme/undergraduate/bachelor-in-software-engineering-honours/',
  },
  'graphics-multimedia': {
    id: 'graphics-multimedia',
    name: 'Bachelor in Information Technology (Graphics & Multimedia) (Hons)',
    icon: '🎨',
    shortDesc: 'Create visually stunning digital experiences',
    color: 'indigo',
    intakes: UNITEN_INTAKES,
    campus: UNITEN_CAMPUS,
    duration: UNITEN_DURATION,
    feeMalaysian: UNITEN_FEE_MY,
    feeInternational: UNITEN_FEE_INTL,
    summary:
      'Blends IT fundamentals with creative multimedia skills, preparing graduates for careers in UI/UX, 3D animation, game design, and digital media production.',
    entryRequirements: IT_ENTRY_REQUIREMENTS,
    careerProspects: ['UI/UX Designer', '3D Artist & Animator', 'Game Developer', 'Multimedia Designer'],
    externalUrl: 'https://www.uniten.edu.my/programme/undergraduate/bachelor-in-information-technology-graphics-multimedia-honours/',
  },
  'cybersecurity': {
    id: 'cybersecurity',
    name: 'Bachelor in Computer Science (Cyber Security) (Hons)',
    icon: '\u{1F6E1}\uFE0F',
    shortDesc: 'Guard the digital world from threats',
    color: 'red',
    intakes: UNITEN_INTAKES,
    campus: UNITEN_CAMPUS,
    duration: UNITEN_DURATION,
    feeMalaysian: UNITEN_FEE_MY,
    feeInternational: UNITEN_FEE_INTL,
    summary:
      'Equips students with skills in ethical hacking, digital forensics, network security, and incident response. Graduates are prepared to protect organisations from evolving cyber threats as analysts, penetration testers, and security consultants.',
    entryRequirements: CS_ENTRY_REQUIREMENTS,
    careerProspects: ['Cybersecurity Analyst', 'Ethical Hacker', 'Security Consultant', 'Digital Forensics Analyst'],
    externalUrl: 'https://www.uniten.edu.my/programme/undergraduate/bachelor-in-computer-science-cyber-security-honours/',
  },
  'artificial-intelligence': {
    id: 'artificial-intelligence',
    name: 'Bachelor in Computer Science (Artificial Intelligence) (Hons)',
    icon: '\u{1F916}',
    shortDesc: 'Build intelligent systems of the future',
    color: 'cyan',
    intakes: UNITEN_INTAKES,
    campus: UNITEN_CAMPUS,
    duration: UNITEN_DURATION,
    feeMalaysian: UNITEN_FEE_MY,
    feeInternational: UNITEN_FEE_INTL,
    summary:
      'Covers machine learning, deep learning, computer vision, and natural language processing. Graduates design AI-powered solutions for healthcare, finance, automation, and beyond — shaping the intelligent future of technology.',
    entryRequirements: CS_ENTRY_REQUIREMENTS,
    careerProspects: ['AI/ML Engineer', 'Data Scientist', 'Research Scientist', 'NLP Engineer'],
    externalUrl: 'https://www.uniten.edu.my/programme/undergraduate/bachelor-in-computer-science-artificial-intelligence-honours/',
  },
  'business-analytics': {
    id: 'business-analytics',
    name: 'Bachelor in Information Technology (Business Analytics) (Hons)',
    icon: '\u{1F4CA}',
    shortDesc: 'Turn data into business decisions',
    color: 'amber',
    intakes: UNITEN_INTAKES,
    campus: UNITEN_CAMPUS,
    duration: UNITEN_DURATION,
    feeMalaysian: UNITEN_FEE_MY,
    feeInternational: UNITEN_FEE_INTL,
    summary:
      'Combines IT skills with business intelligence, data analytics, and decision-support systems. Graduates use data to drive strategy, improve operations, and create competitive advantages across all industries.',
    entryRequirements: IT_ENTRY_REQUIREMENTS,
    careerProspects: ['Business Analyst', 'Data Analyst', 'BI Developer', 'Analytics Consultant'],
    externalUrl: 'https://www.uniten.edu.my/programme/undergraduate/bachelor-in-information-technology-business-analytics-honours/',
  },
  'systems-networking': {
    id: 'systems-networking',
    name: 'Bachelor in Computer Science (Computer Systems & Networking) (Hons)',
    icon: '\u{1F310}',
    shortDesc: 'Build and maintain digital infrastructure',
    color: 'green',
    intakes: UNITEN_INTAKES,
    campus: UNITEN_CAMPUS,
    duration: UNITEN_DURATION,
    feeMalaysian: UNITEN_FEE_MY,
    feeInternational: UNITEN_FEE_INTL,
    summary:
      'Focuses on network architecture, cloud computing, operating systems, and enterprise IT infrastructure. Graduates design and maintain the systems that keep organisations connected, secure, and operational.',
    entryRequirements: CS_ENTRY_REQUIREMENTS,
    careerProspects: ['Network Engineer', 'Cloud Architect', 'Systems Administrator', 'IT Infrastructure Specialist'],
    externalUrl: 'https://www.uniten.edu.my/programme/undergraduate/bachelor-in-computer-science-computer-systems-networking-honours/',
  },
};
