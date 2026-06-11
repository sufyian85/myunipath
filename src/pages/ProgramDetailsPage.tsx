import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Briefcase, GraduationCap, FileText, Calendar, MapPin, Clock, Wallet } from 'lucide-react';
import { PROGRAM_DATA } from '../lib/data';

const PROGRAM_GRADIENT: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  indigo: 'from-indigo-500 to-indigo-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
};

const programDetails: Record<string, any> = {
  "software-engineering": {
    id: "software-engineering",
    name: "Bachelor in Software Engineering (Hons)",
    icon: "💻",
    color: "blue",
    description: "Prepares students in systematic software design, development, testing, and management with strong foundations in engineering principles and hands-on project experience. Graduates are equipped to excel in software development, application design, system integration, and emerging digital technologies across diverse industries.",
    requirements: [
      "SPM with at least 5 credits including Mathematics and one Science subject",
      "Pass in English",
      "Strong interest in programming and problem-solving"
    ],
    careers: [
      "Software Developer",
      "Full-Stack Engineer",
      "Mobile App Developer",
      "DevOps Engineer",
      "Systems Architect"
    ],
    whyThisProgram: {
      creator: "Perfect for you! You'll get to build real applications and see your creative ideas come to life.",
      solver: "Ideal match! You'll tackle complex coding challenges and optimize systems for peak performance.",
      guardian: "Great fit! You'll learn secure coding practices and build systems that are resilient to attacks.",
      analyst: "Good choice! You'll use data structures and algorithms to solve computational problems."
    },
    highlights: [
      "Industry-relevant curriculum",
      "Hands-on project experience",
      "Internship opportunities",
      "Expert faculty from industry"
    ],
    externalUrl: "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-software-engineering-honours/"
  },
  "graphics-multimedia": {
    id: "graphics-multimedia",
    name: "Bachelor in Information Technology (Graphics & Multimedia) (Hons)",
    icon: "🎨",
    color: "indigo",
    description: "Blends IT fundamentals with creative multimedia skills, preparing students for careers in graphics, animation, and digital content development. The curriculum emphasizes technical proficiency, coding capabilities, and real-world experience with industry-standard tools.",
    requirements: [
      "SPM with at least 5 credits including Mathematics",
      "Pass in English",
      "Creative eye and passion for visual design and digital arts"
    ],
    careers: [
      "UI/UX Designer",
      "Multimedia Developer",
      "Front-End Developer",
      "Creative Director",
      "Game Designer"
    ],
    whyThisProgram: {
      creator: "Absolute perfect match! Bring your designs and creative front-end ideas to life.",
      solver: "Good choice! Balance visual storytelling with interactive application logic.",
      guardian: "Interesting path! Focus on protecting digital assets and secure user interface design.",
      analyst: "Great! Combine data visualization and visual communication principles."
    },
    highlights: [
      "Creative design labs",
      "Portfolio-driven coursework",
      "Industry masterclasses",
      "Focus on modern UI/UX tools"
    ],
    externalUrl: "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-information-technology-graphics-multimedia-honours/"
  },
  "cybersecurity": {
    id: "cybersecurity",
    name: "Bachelor in Computer Science (Cyber Security) (Hons)",
    icon: "🔒",
    color: "red",
    description: "Equips students with specialized knowledge in cyber defense, network security, and digital forensics. Combines theoretical learning with practical cybersecurity training, preparing graduates for roles as security analysts, penetration testers, and cybersecurity professionals across various industries.",
    requirements: [
      "SPM with at least 5 credits including Mathematics and one Science subject",
      "Pass in English",
      "Strong ethical standards and interest in security"
    ],
    careers: [
      "Security Analyst",
      "Ethical Hacker",
      "Security Consultant",
      "Incident Response Specialist",
      "Chief Information Security Officer"
    ],
    whyThisProgram: {
      creator: "Interesting option! You'll design security solutions and build protective systems.",
      solver: "Good match! You'll solve security puzzles and find vulnerabilities before hackers do.",
      guardian: "Perfect for you! This is exactly what you're meant to do - protect and secure.",
      analyst: "Great fit! You'll analyze threats, patterns, and security data to prevent attacks."
    },
    highlights: [
      "Ethical hacking labs",
      "Industry-standard tools",
      "Security certifications",
      "High demand career"
    ],
    externalUrl: "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-computer-science-cyber-security-honours/"
  },
  "business-analytics": {
    id: "business-analytics",
    name: "Bachelor in Information Systems (Business Analytics) (Hons)",
    icon: "📊",
    color: "indigo",
    description: "Merges information technology with business intelligence to develop analytical and data-driven decision-making capabilities. Students learn to manage information systems, analyse business data, and create strategic solutions that boost organizational performance.",
    requirements: [
      "SPM with at least 5 credits including Mathematics",
      "Pass in English",
      "Interest in business strategy and data-driven insights"
    ],
    careers: [
      "Business Analyst",
      "Data Analyst",
      "IT Consultant",
      "Systems Analyst",
      "Project Manager"
    ],
    whyThisProgram: {
      creator: "Great fit! You'll design enterprise systems that solve real business problems.",
      solver: "Good match! You'll optimize complex business processes with advanced analytics.",
      guardian: "Useful! You'll help organizations protect and govern their information assets.",
      analyst: "Perfect for you! You'll analyze business data and drive strategic decisions."
    },
    highlights: [
      "Business-IT integration",
      "Real-world case studies",
      "Enterprise analytics tools",
      "Strong industry partnerships"
    ],
    externalUrl: "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-information-systems-business-analytics-honours/"
  },
  "systems-networking": {
    id: "systems-networking",
    name: "Bachelor in Computer Science (Systems and Networking) (Hons)",
    icon: "🖥️",
    color: "blue",
    description: "Emphasizes network infrastructure and systems architecture within a computer science curriculum. Students gain practical expertise in network design, system administration, cybersecurity, and emerging technologies aligned with Industry 4.0 standards.",
    requirements: [
      "SPM with at least 5 credits including Mathematics",
      "Pass in English",
      "Interest in computer networks and infrastructure"
    ],
    careers: [
      "Network Engineer",
      "Systems Administrator",
      "Cloud Architect",
      "Network Administrator",
      "Systems Engineer"
    ],
    whyThisProgram: {
      creator: "Good fit! You'll design and implement complex network architectures.",
      solver: "Perfect match! Troubleshoot network anomalies and optimize system performance.",
      guardian: "Excellent! Secure network infrastructures and protect data transmission.",
      analyst: "Great! Analyze traffic patterns and use performance data to optimize networks."
    },
    highlights: [
      "State-of-the-art networking labs",
      "Cloud engineering focus",
      "Cisco/industry curriculum alignment",
      "Highly practical labs"
    ],
    externalUrl: "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-computer-science-systems-and-networking-honours/"
  },
  "artificial-intelligence": {
    id: "artificial-intelligence",
    name: "Bachelor in Computer Science (Artificial Intelligence) (Hons)",
    icon: "🤖",
    color: "purple",
    description: "Equips students with core computer science foundations and specialised training in AI, machine learning, data analytics, and intelligent systems. The curriculum emphasizes hands-on learning and real-world problem-solving while integrating ethical AI practices.",
    requirements: [
      "SPM with at least 5 credits including Mathematics and one Science subject",
      "Pass in English",
      "Strong analytical and programming interest"
    ],
    careers: [
      "AI Engineer",
      "Machine Learning Engineer",
      "AI Research Scientist",
      "NLP Specialist"
    ],
    whyThisProgram: {
      creator: "Exciting! You'll create AI applications that transform industries.",
      solver: "Ideal! You'll solve complex AI challenges and optimize models.",
      guardian: "Important! You'll work on AI security and ethical AI.",
      analyst: "Perfect match! AI is built on data and pattern recognition."
    },
    highlights: [
      "Machine learning labs",
      "AI ethics focus",
      "Research opportunities"
    ],
    externalUrl: "https://www.uniten.edu.my/programme/undergraduate/bachelor-in-computer-science-artificial-intelligence-honours/"
  },
  "all": {
    id: "all",
    name: "All ICT Programs at UNITEN",
    icon: "🗺️",
    color: "blue",
    description: "UNITEN offers a comprehensive range of ICT programs designed to prepare you for the digital future. Each program is carefully crafted with industry input and delivered by experienced faculty.",
    requirements: [],
    careers: [],
    whyThisProgram: {},
    highlights: [],
    externalUrl: "https://www.uniten.edu.my/"
  }
};

import { ThemeToggle } from '../components/theme/ThemeToggle';

export function ProgramDetailsPage() {
  const { programId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAllView = programId === 'all' || location.pathname === '/programs';
  const program = programDetails[programId || ''] || programDetails['software-engineering'];
  // Pull intakes/campus/duration/fees from the canonical PROGRAM_DATA so they always match the UNITEN program pages.
  const meta = PROGRAM_DATA[program.id];

  if (isAllView) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col selection:bg-primary/20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <img
                  src="/myunipath-emblem.svg"
                  alt="MyUniPath mascot"
                  className="w-8 h-8 object-contain drop-shadow-sm"
                />
                <span className="text-xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #0F3361, #e34628)' }}>
                  MyUniPath
                </span>
              </button>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 relative z-10 w-full">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6 animate-in zoom-in duration-500">
              <div className="w-28 h-28 bg-primary/10 border border-primary/20 rounded-3xl p-4 flex items-center justify-center shadow-xl">
                <img
                  src="/myunipath-emblem.svg"
                  alt="MyUniPath Mascot"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-foreground mb-4 filter drop-shadow-sm">ICT Programs at UNITEN</h1>
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our comprehensive ICT programs and find the perfect path for your future career in technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {Object.values(programDetails).filter(p => p.id !== 'all').map((prog) => (
              <div
                key={prog.id}
                onClick={() => navigate(`/program/${prog.id}`)}
                className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all hover:scale-[1.02] flex flex-col group"
              >
                <div className={`bg-gradient-to-br ${PROGRAM_GRADIENT[prog.color] || 'from-blue-500 to-blue-600'} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                  <div className="relative text-5xl mb-4 filter drop-shadow-md group-hover:scale-110 transition-transform">{prog.icon}</div>
                  <h3 className="relative text-2xl font-bold filter drop-shadow-sm">{prog.name}</h3>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <p className="text-muted-foreground font-medium mb-8 leading-relaxed">{prog.description}</p>
                  <div className="flex gap-4 items-center mt-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/program/${prog.id}`);
                      }}
                      className="text-primary font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <span>View Details</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="w-px h-4 bg-border" />
                    <a 
                      href={prog.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#e34628] font-bold hover:underline"
                    >
                      Official Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 bg-card p-6 border border-border rounded-3xl shadow-sm">
            <button
              onClick={() => navigate('/compare')}
              className="bg-secondary text-secondary-foreground font-semibold px-8 py-4 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all shadow-sm"
            >
              Compare Programs
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all shadow-md hover:-translate-y-0.5"
            >
              Take the Questionnaire
            </button>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-3xl shadow-xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-foreground mb-4">Still not sure which program is right for you?</h3>
              <p className="text-muted-foreground font-medium mb-8 text-lg max-w-xl mx-auto">
                Take our quick identity engine assessment and receive highly personalized curriculum recommendations based on your unique tech persona.
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="bg-primary text-primary-foreground font-semibold px-10 py-4 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Take the Assessment
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col selection:bg-primary/20">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <img
                src="/myunipath-emblem.svg"
                alt="MyUniPath mascot"
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #0F3361, #e34628)' }}>
                MyUniPath
              </span>
            </button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 relative z-10 w-full">
        {/* Program Header */}
        <div className={`bg-gradient-to-br ${PROGRAM_GRADIENT[program.color] || 'from-blue-500 to-blue-600'} rounded-3xl shadow-xl p-10 md:p-16 mb-10 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
          <div className="text-center relative z-10">
            <div className="text-7xl mb-8 filter drop-shadow-lg">{program.icon}</div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 filter drop-shadow-sm tracking-tight">{program.name}</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
              {program.description}
            </p>
          </div>
        </div>

        {/* UNITEN Program Quick Facts */}
        {meta && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center">
              <Calendar className="w-7 h-7 text-primary mb-2" />
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Intakes</p>
              <p className="text-sm font-bold text-foreground mt-1">{meta.intakes}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center">
              <MapPin className="w-7 h-7 text-primary mb-2" />
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Campus</p>
              <p className="text-sm font-bold text-foreground mt-1">{meta.campus}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center">
              <Clock className="w-7 h-7 text-primary mb-2" />
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Duration</p>
              <p className="text-sm font-bold text-foreground mt-1">{meta.duration}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center">
              <Wallet className="w-7 h-7 text-primary mb-2" />
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Total Fee</p>
              <p className="text-sm font-bold text-foreground mt-1">{meta.feeMalaysian}</p>
              <p className="text-xs text-muted-foreground mt-1">Malaysian</p>
              <p className="text-sm font-bold text-foreground mt-2">{meta.feeInternational}</p>
              <p className="text-xs text-muted-foreground">International</p>
            </div>
          </div>
        )}

        {/* Highlights */}
        {program.highlights.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {program.highlights.map((highlight: string, index: number) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-500 mb-3" />
                <p className="text-sm font-medium text-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Entry Requirements (full UNITEN qualification breakdown) */}
        {meta && meta.entryRequirements.length > 0 && (
          <div className="bg-card border border-border rounded-3xl shadow-lg p-8 mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Entry Requirements</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose the qualification path that matches yours.</p>
              </div>
            </div>
            <div className="space-y-3">
              {meta.entryRequirements.map((path, index) => (
                <details
                  key={index}
                  className="group bg-secondary/30 border border-border rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-secondary/60 transition-colors">
                    <span className="font-semibold text-foreground">{path.qualification}</span>
                    <span className="text-primary group-open:rotate-180 transition-transform text-xl leading-none">⌄</span>
                  </summary>
                  <ul className="px-5 pb-5 pt-1 space-y-2 border-t border-border">
                    {path.requirements.map((req, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground text-[15px] leading-relaxed">
                        <CheckCircle className="w-5 h-5 text-green-500 fill-green-500/20 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Future Careers */}
        <div className="bg-card border border-border rounded-3xl shadow-lg p-8 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Briefcase className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Future Careers</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {program.careers.map((career: string, index: number) => (
              <li key={index} className="flex gap-3 text-muted-foreground font-medium bg-secondary/30 border border-border rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500/20 flex-shrink-0 mt-0.5" />
                <span className="text-[15px] leading-relaxed">{career}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why This Program */}
        {Object.keys(program.whyThisProgram).length > 0 && (
          <div className="bg-card border border-border rounded-3xl shadow-lg p-10 mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-bl-[100%] pointer-events-none" />
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center relative z-10">Why This Program Fits Different Personas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {Object.entries(program.whyThisProgram).map(([persona, reason]: [string, any]) => (
                <div key={persona} className="bg-secondary/50 border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={`/mascot-${persona}.png`}
                        alt={`${persona} mascot`}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                    <div>
                      <h4 className="text-foreground font-bold tracking-wide uppercase text-sm mb-2 opacity-80">The {persona}</h4>
                      <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">{reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex justify-center mb-8">
          <a 
            href="https://www.uniten.edu.my/apply-now/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full max-w-md bg-[#e34628] text-white font-semibold px-8 py-5 rounded-xl shadow-md hover:shadow-xl hover:shadow-[#e34628]/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <FileText className="w-5 h-5" />
            <span>Apply Now</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-8 px-4 relative z-10 backdrop-blur-sm mt-auto">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground font-medium">
            Powered by <span className="text-primary font-bold">UNITEN</span> – Universiti Tenaga Nasional
          </p>
        </div>
      </footer>
    </div>
  );
}