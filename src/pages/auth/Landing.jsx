import React from 'react';
import Header from "../../components/shared/Header";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, Users, Building, BarChart3, ChevronRight, 
  Activity, BookOpen, ShieldCheck, Zap, Code2, BrainCircuit, 
  Trophy, Sparkles, MessageSquare, Network,
  Briefcase, FileSignature, CheckCircle, PieChart, Star, Crown, FileCheck, CalendarCheck, Megaphone, Target, Award
} from "lucide-react";

// --- Animated Global Background Component ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#f8fafc]">

    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        x: [0, 25, 0],
        y: [0, 25, 0],
      }}
      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-100/50 blur-[80px] transform-gpu will-change-transform"
    />

    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        x: [0, -30, 0],
        y: [0, 35, 0],
      }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-teal-100/50 blur-[90px] transform-gpu will-change-transform"
    />

    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        x: [0, 20, 0],
        y: [0, -30, 0],
      }}
      transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-green-200/40 blur-[80px] transform-gpu will-change-transform"
    />

    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDE2LCAxODUsIDEyOSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-[0.2]"></div>

  </div>
);

// --- Ecosystem Connection SVG Component ---
const EcosystemDiagram = () => {
  const roleCards = [
    {
      id: 'students',
      icon: GraduationCap,
      label: 'Students',
      pos: 'absolute top-5 left-3 sm:top-8 sm:left-6',
      gradient: 'from-sky-500 to-blue-600',
      border: 'border-sky-200',
      dot: 'bg-sky-500',
      badge: 'Peer Network',
      badgeCls: 'bg-sky-50 text-sky-700 border border-sky-200',
      features: ['Skill Exchange Hub', 'Digital Portfolio Builder', 'Ask Doubt Forum'],
      initAnim: { opacity: 0, x: 40, y: 40 },
    },
    {
      id: 'faculty',
      icon: Users,
      label: 'Faculty',
      pos: 'absolute top-5 right-3 sm:top-8 sm:right-6',
      gradient: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      badge: 'Mentor Access',
      badgeCls: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      features: ['Certificate Approvals', 'Attendance Tracking', '1-on-1 Doubt Threads'],
      initAnim: { opacity: 0, x: -40, y: 40 },
    },
    {
      id: 'hods',
      icon: BarChart3,
      label: 'HODs',
      pos: 'absolute bottom-5 right-3 sm:bottom-8 sm:right-6',
      gradient: 'from-indigo-500 to-violet-600',
      border: 'border-indigo-200',
      dot: 'bg-indigo-500',
      badge: 'ML-Powered',
      badgeCls: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      features: ['AI Club Predictor', 'Dept. Analytics Suite', 'Cohort Risk Reports'],
      initAnim: { opacity: 0, x: -40, y: -40 },
    },
    {
      id: 'admins',
      icon: Crown,
      label: 'Admins',
      pos: 'absolute bottom-5 left-3 sm:bottom-8 sm:left-6',
      gradient: 'from-amber-500 to-orange-500',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      badge: 'Full Control',
      badgeCls: 'bg-amber-50 text-amber-700 border border-amber-200',
      features: ['Global Announcements', 'User & Role Management', 'System Configuration'],
      initAnim: { opacity: 0, x: 40, y: -40 },
    },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[600px] sm:h-[660px] flex items-center justify-center">

      {/* Central Institution Node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="absolute z-20 flex flex-col items-center gap-3"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-700 rounded-full shadow-[0_0_60px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center text-white border-4 border-white">
          <Building className="w-10 h-10 mb-1" />
          <span className="font-bold text-sm tracking-wide">Institution</span>
        </div>
        <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 shadow-sm rounded-xl px-4 py-1.5">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Core Platform</span>
        </div>
      </motion.div>

      {/* Role Cards */}
      {roleCards.map((role, i) => {
        const Icon = role.icon;
        return (
          <motion.div
            key={role.id}
            initial={role.initAnim}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
            className={`${role.pos} z-20 w-40 sm:w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border ${role.border} overflow-hidden hover:shadow-[0_14px_40px_rgba(0,0,0,0.13)] hover:-translate-y-1.5 transition-all duration-300 cursor-default`}
          >
            {/* Gradient Header */}
            <div className={`flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r ${role.gradient}`}>
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-white tracking-wide">{role.label}</span>
            </div>

            {/* Feature List */}
            <div className="px-4 py-3 space-y-2.5">
              {role.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${role.dot} shrink-0`}></div>
                  <span className="text-[11px] font-medium text-slate-600 leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Role Badge */}
            <div className="px-4 pb-3.5">
              <div className={`px-3 py-1 rounded-lg text-center text-[9px] font-bold uppercase tracking-widest ${role.badgeCls}`}>
                {role.badge}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* SVG Connections Layer */}
      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        viewBox="0 0 800 660"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow-particle" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* — Main Radial Paths from Institution — */}
        {/* To Students (top-left) */}
        <path d="M400,330 L195,185" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="9,6" strokeOpacity="0.75" />
        {/* To Faculty (top-right) */}
        <path d="M400,330 L605,185" fill="none" stroke="#34d399" strokeWidth="2.5" strokeDasharray="9,6" strokeOpacity="0.75" />
        {/* To HODs (bottom-right) */}
        <path d="M400,330 L605,475" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="9,6" strokeOpacity="0.75" />
        {/* To Admins (bottom-left) */}
        <path d="M400,330 L195,475" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="9,6" strokeOpacity="0.75" />

        {/* — Connection Label Chips — */}
        {/* Students chip */}
        <rect x="233" y="234" width="120" height="20" rx="10" fill="white" fillOpacity="0.96" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
        <text x="293" y="248" textAnchor="middle" fill="#0369a1" fontSize="8.5" fontWeight="700" fontFamily="system-ui,sans-serif">Announcements & Results</text>

        {/* Faculty chip */}
        <rect x="447" y="234" width="116" height="20" rx="10" fill="white" fillOpacity="0.96" stroke="#34d399" strokeWidth="1" strokeOpacity="0.5" />
        <text x="505" y="248" textAnchor="middle" fill="#065f46" fontSize="8.5" fontWeight="700" fontFamily="system-ui,sans-serif">Tasks & Assignments</text>

        {/* HODs chip */}
        <rect x="447" y="392" width="116" height="20" rx="10" fill="white" fillOpacity="0.96" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.5" />
        <text x="505" y="406" textAnchor="middle" fill="#3730a3" fontSize="8.5" fontWeight="700" fontFamily="system-ui,sans-serif">Analytics & Reports</text>

        {/* Admins chip */}
        <rect x="237" y="392" width="112" height="20" rx="10" fill="white" fillOpacity="0.96" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
        <text x="293" y="406" textAnchor="middle" fill="#92400e" fontSize="8.5" fontWeight="700" fontFamily="system-ui,sans-serif">System Management</text>

        {/* — Cross-Role Arcs — */}
        {/* Students ↔ Faculty: Doubt Resolution */}
        <path d="M195,185 C195,95 605,95 605,185" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="5,5" strokeOpacity="0.3" />
        <rect x="340" y="75" width="120" height="18" rx="9" fill="white" fillOpacity="0.88" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.5" />
        <text x="400" y="88" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="700" fontFamily="system-ui,sans-serif">Doubt Resolution Flow</text>

        {/* Students ↔ Students: Skill Exchange loop */}
        <path d="M195,185 Q155,130 195,110 Q235,90 260,130 Q280,165 250,185" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" strokeOpacity="0.28" />

        {/* — Animated Particles — */}
        {/* Institution → Students */}
        <circle r="5.5" fill="#38bdf8" filter="url(#glow-particle)">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M400,330 L195,185" />
        </circle>
        {/* Institution → Faculty */}
        <circle r="5.5" fill="#34d399" filter="url(#glow-particle)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M400,330 L605,185" />
        </circle>
        {/* HODs → Institution */}
        <circle r="5.5" fill="#818cf8" filter="url(#glow-particle)">
          <animateMotion dur="4s" repeatCount="indefinite" path="M605,475 L400,330" />
        </circle>
        {/* Admins → Institution */}
        <circle r="5.5" fill="#fbbf24" filter="url(#glow-particle)">
          <animateMotion dur="3.8s" repeatCount="indefinite" path="M195,475 L400,330" />
        </circle>
        {/* Cross-role: Doubt Resolution arc */}
        <circle r="3.5" fill="#7dd3fc" filter="url(#glow-particle)">
          <animateMotion dur="4.5s" repeatCount="indefinite" path="M195,185 C195,95 605,95 605,185" />
        </circle>
        {/* Skill Exchange loop */}
        <circle r="3" fill="#a78bfa" filter="url(#glow-particle)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M195,185 Q155,130 195,110 Q235,90 260,130 Q280,165 250,185" />
        </circle>
      </svg>
    </div>
  );
};

export default function Landing() {

  return (
    <div className="relative min-h-screen bg-transparent text-green-950 overflow-hidden font-sans">
      <AnimatedBackground />
      <Header />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-transparent">

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-emerald-700 font-bold mb-8 shadow-sm border border-emerald-100 uppercase tracking-widest text-xs">
              <Sparkles className="w-4 h-4 text-emerald-500" /> The Future of Academic Collaboration
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold text-green-950 tracking-tight mb-8 leading-[1.05]">
              Empowering Students. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Unifying Institutions.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              We transcend administrative portals. Welcome to a living ecosystem built for skill exchange, deeply integrated portfolios, AI club predictors, and instant doubt lifelines.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/roleoftheuser" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2">
                Join the Network <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/roleforlogin" className="px-8 py-4 bg-white text-emerald-800 rounded-2xl font-bold text-lg border border-emerald-100 hover:bg-green-50 hover:border-emerald-300 transition-all duration-300 shadow-sm w-full sm:w-auto">
                Login to Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE ECOSYSTEM VISUALIZATION */}
      <section className="py-24 relative overflow-hidden bg-white/40 backdrop-blur-xl border-y border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-950 mb-6">Synergy, Perfected.</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">Watch how peer-to-peer mentoring, faculty interventions, and AI-driven HOD insights flawlessly merge inside the platform.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-[3rem] p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
             {/* Subdued tech background */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDE2LCAxODUsIDEyOSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none opacity-[0.15]"></div>
             <EcosystemDiagram />
          </div>
        </div>
      </section>

      {/* 3. DEEP CORE UNIQUE FEATURE SHOWCASES */}
      <section className="py-32 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          {/* USP 1: Skill Exchange & Ask Doubt (Student-to-Student & Student-to-Faculty) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8}}
            className="flex flex-col lg:flex-row items-center gap-16 mb-40"
          >
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-sky-50 aspect-video flex items-center justify-center p-8 group">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-emerald-50/20 pointer-events-none"></div>
                {/* Abstract UI for Skill Exchange */}
                <div className="w-full h-full relative">
                   {/* Student 1 Node */}
                   <div className="absolute top-4 left-4 w-32 bg-white rounded-xl shadow-lg p-3 border border-sky-100 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                        <div className="text-xs font-bold text-slate-800">John Doe</div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-1.5 rounded border border-slate-100">
                        Needs: <span className="text-sky-600 font-bold">ReactJS</span>
                      </div>
                   </div>
                   
                   {/* Student 2 Node */}
                   <div className="absolute bottom-4 right-4 w-32 bg-white rounded-xl shadow-lg p-3 border border-emerald-100 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-[10px] font-bold">SW</div>
                        <div className="text-xs font-bold text-slate-800">Sam W.</div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-1.5 rounded border border-slate-100">
                        Offers: <span className="text-emerald-600 font-bold">ReactJS</span>
                      </div>
                   </div>

                   {/* Doubt Forum Center */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white z-20 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1 pb-2 border-b border-slate-100">
                         <MessageSquare className="w-4 h-4" /> Live Forum
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="h-2 w-3/4 bg-slate-200 rounded mb-1"></div>
                        <div className="h-1.5 w-1/2 bg-slate-200 rounded"></div>
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100 mt-1">
                        <div className="h-2 w-full bg-emerald-200 rounded mb-1"></div>
                        <div className="flex justify-start mt-1">
                           <div className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] rounded-full font-bold">Resolved</div>
                        </div>
                      </div>
                   </div>

                   {/* Connection SVG */}
                   <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M 15 20 Q 50 50 85 80" fill="none" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="2,1">
                        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite"/>
                     </path>
                     <circle r="1.5" fill="#38bdf8">
                       <animateMotion dur="2.5s" repeatCount="indefinite" path="M 15 20 Q 50 50 85 80" />
                     </circle>
                   </svg>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center justify-center p-3 bg-white border border-sky-100 text-sky-600 shadow-sm rounded-xl mb-6">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">Collab-Driven Skill Exchange & Dedicated Forums</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Students break through academic bottlenecks instantly. Offer your strengths and request what you lack in our <strong>Skill Exchange Hub</strong>. Stuck on a lecture? Post a ticket in the <strong>Ask Doubt Portal</strong> where verified Faculties and top-performing peers resolve problems in real-time.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-8 h-8 rounded-full bg-white border border-sky-100 flex items-center justify-center text-sky-500 shadow-sm shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  Peer-to-Peer Mutual Mentoring
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-8 h-8 rounded-full bg-white border border-sky-100 flex items-center justify-center text-sky-500 shadow-sm shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  Direct 1-to-1 Faculty Doubt Resolution Threads
                </li>
              </ul>
            </div>
          </motion.div>

          {/* USP 2: AI Club Predictor & Analytics (HOD/Institution) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-40"
          >
            <div className="w-full lg:w-1/2">
               <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-indigo-50 aspect-video flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/50 to-transparent pointer-events-none"></div>
                {/* Abstract UI for Predictor */}
                <div className="w-full h-full bg-white/95 rounded-2xl shadow-xl border border-white p-5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                       <BrainCircuit className="w-5 h-5 text-indigo-600" />
                       <span className="font-bold text-green-950 text-sm">AI Club Predictor Engine</span>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">LIVE</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 h-full">
                     {/* Data Card 1 */}
                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute top-3 left-3 text-xs font-bold text-slate-500">Proposed Club: <br/><span className="text-indigo-600">Cybesecurity</span></div>
                        <div className="text-3xl font-extrabold text-green-950">92%</div>
                        <div className="text-[10px] text-slate-500 font-medium uppercase mt-1 tracking-wide">Success Prediction</div>
                        {/* Hover reveal chart */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-200">
                           <motion.div initial={{ width: 0 }} whileInView={{ width: '92%' }} className="h-full bg-indigo-500"></motion.div>
                        </div>
                     </div>
                     {/* Graph Mockup */}
                     <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-3 flex items-end justify-between gap-2">
                        <motion.div initial={{ height: '20%' }} whileInView={{ height: '40%' }} className="w-full bg-indigo-200 rounded-t-md"></motion.div>
                        <motion.div initial={{ height: '30%' }} whileInView={{ height: '65%' }} className="w-full bg-indigo-300 rounded-t-md"></motion.div>
                        <motion.div initial={{ height: '40%' }} whileInView={{ height: '85%' }} className="w-full bg-indigo-400 rounded-t-md"></motion.div>
                        <motion.div initial={{ height: '50%' }} whileInView={{ height: '100%' }} className="w-full bg-indigo-600 rounded-t-md relative">
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-950 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">High Demand</div>
                        </motion.div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center justify-center p-3 bg-white border border-indigo-100 text-indigo-600 shadow-sm rounded-xl mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">Intelligent Analytics & Club Predictions</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                We empower HODs with data, not just spreadsheets. Analyze overarching institutional performance, track massive global metrics, and utilize our revolutionary <strong>Machine Learning Club Predictor</strong> to determine if a proposed student organization will succeed based on historical institutional data arrays.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                    <PieChart className="w-4 h-4" />
                  </div>
                  Deep Result Analytics Dashboards
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  Institution-wide Announcement Control
                </li>
              </ul>
            </div>
          </motion.div>

          {/* USP 3: Auto-Generated Portfolios & Leaderboards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-amber-50 aspect-video flex items-center justify-center p-8">
                {/* Abstract Profile Card UI */}
                <div className="w-full max-w-sm bg-white/95 rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-amber-100/50 p-6 flex flex-col items-center relative backdrop-blur-md">
                   {/* Rank Badge */}
                   <div className="absolute -top-4 -right-4 bg-amber-400 text-amber-950 font-extrabold flex items-center justify-center w-14 h-14 rounded-full shadow-lg border-4 border-white transform rotate-12">
                     <span className="text-lg">#1</span>
                   </div>
                   
                   <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-full p-1 mb-4 shadow-md">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white">
                         <GraduationCap className="w-8 h-8 text-emerald-600" />
                      </div>
                   </div>
                   
                   <h4 className="text-xl font-bold text-green-950 mb-1">Elite Performer CV</h4>
                   <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-4">CS Dept • Sem 6</p>
                   
                   <div className="w-full grid grid-cols-2 gap-3 mb-1">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                         <Trophy className="w-5 h-5 text-amber-500" />
                         <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Achievements</div>
                            <div className="font-bold text-green-950">Level 8</div>
                         </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                         <Activity className="w-5 h-5 text-emerald-500" />
                         <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Projects</div>
                            <div className="font-bold text-green-950">Featured</div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center justify-center p-3 bg-white border border-amber-100 text-amber-600 shadow-sm rounded-xl mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">Digital Portfolios & Verified Leaderboards</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Every action builds a student's professional resume. Upload certificates, track club involvements, and display faculty-approved achievements. The platform compiles this into an automated, beautifully formatted <strong>Digital Portfolio</strong> ready for employers, while sparking healthy competition via live campus leaderboards.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                   <div className="w-8 h-8 rounded-full bg-white border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  Automated Digital CV Generation
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-8 h-8 rounded-full bg-white border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  Faculty-Verified Achievements System
                </li>
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* USP 4: AI PLACEMENT PREDICTION */}
      <section className="py-32 bg-transparent relative border-t border-emerald-100/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-16"
          >
             <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 bg-gradient-to-br from-purple-50 to-fuchsia-50 aspect-video flex items-center justify-center p-8 group">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDE2LCAxODUsIDEyOSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>
                {/* Abstract UI for Placement Prediction */}
                <div className="w-full h-full bg-white/95 rounded-[1.5rem] shadow-xl border border-white p-6 flex flex-col relative backdrop-blur-md">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Zap className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="text-sm font-bold text-green-950">Placement AI</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Analysis Running...</div>
                         </div>
                      </div>
                      <div className="w-16 h-16 relative">
                         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"/>
                            <motion.path 
                               initial={{ strokeDasharray: "0, 100" }}
                               whileInView={{ strokeDasharray: "88, 100" }}
                               transition={{ duration: 1.5, delay: 0.5 }}
                               className="text-purple-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"/>
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-purple-700">88%</div>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <div className="flex-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                               <span>Coding Skills</span>
                               <span>Strong</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} whileInView={{ width: '90%' }} className="h-full bg-emerald-500"></motion.div>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                         <div className="flex-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                               <span>Aptitude/Soft Skills</span>
                               <span>Needs Work</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} whileInView={{ width: '55%' }} transition={{ delay: 0.2 }} className="h-full bg-amber-500"></motion.div>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute -bottom-4 -left-4 bg-green-950 text-white p-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 transform -rotate-2 group-hover:rotate-0 transition-transform">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold tracking-wide">Ready for Tier-1 Companies</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center justify-center p-3 bg-white border border-purple-100 text-purple-600 shadow-sm rounded-xl mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">AI Placement & Career Prediction</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Take the guesswork out of student futures. Our Machine Learning models deeply analyze academic performance, soft-skill records, and club involvement to output real-time <strong>Placement Probabilities</strong>. Students know exactly what they must improve, while HODs instantly identify at-risk graduating cohorts.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                   <div className="w-8 h-8 rounded-full bg-white border border-purple-100 flex items-center justify-center text-purple-500 shadow-sm shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  Personalized Student Roadmap Generation
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-8 h-8 rounded-full bg-white border border-purple-100 flex items-center justify-center text-purple-500 shadow-sm shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  Cohort Risk Analysis for Institutions
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* USP 5: PAPERLESS CERTIFICATE UPLOADS */}
      <section className="py-32 bg-transparent relative border-t border-emerald-100/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-rose-50 aspect-video flex items-center justify-center p-8">
                {/* Abstract Profile Card UI */}
                <div className="w-full max-w-sm bg-white/95 rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-rose-100/50 p-6 flex flex-col items-center relative backdrop-blur-md">
                   {/* Verification Badge */}
                   <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center px-3 py-1 rounded-full shadow-sm border border-emerald-200">
                     <ShieldCheck className="w-3 h-3 mr-1" />
                     <span className="text-[10px]">VERIFIED</span>
                   </div>
                   
                   <div className="w-16 h-16 bg-gradient-to-tr from-rose-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-md transform -rotate-6">
                      <BookOpen className="w-8 h-8 text-white" />
                   </div>
                   
                   <h4 className="text-lg font-bold text-green-950 mb-1">State Level Hackathon</h4>
                   <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-6">Winner Certificate • 2024</p>
                   
                   <div className="w-full space-y-3">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <div className="text-[10px] text-slate-500 font-bold uppercase">Approving Faculty</div>
                         </div>
                         <div className="font-bold text-sm text-green-950">Prof. Smith</div>
                      </div>
                      <div className="w-full bg-emerald-50 text-emerald-700 py-2 rounded-xl text-center text-xs font-bold border border-emerald-200 shadow-sm flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" /> Added to Digital Profile
                      </div>
                   </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center justify-center p-3 bg-white border border-rose-100 text-rose-600 shadow-sm rounded-xl mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">Paperless Certificate Validation</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Never carry physical files again. Upload your achievements straight into our <strong>Digital Depository</strong> where faculty members instantly review and verify them. Certified achievements automatically sync with your public portfolio.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                   <div className="w-8 h-8 rounded-full bg-white border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  Permanent Institutional Record
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* USP 6: GAMIFIED LEADERBOARDS */}
      <section className="py-32 bg-transparent relative border-t border-emerald-100/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-16"
          >
             <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 bg-gradient-to-br from-cyan-50 to-blue-50 aspect-video flex items-center justify-center p-8 group">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDE2LCAxODUsIDEyOSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
                {/* Abstract Leaderboard UI */}
                <div className="w-full h-full bg-white/95 rounded-[1.5rem] shadow-xl border border-white p-6 flex flex-col relative backdrop-blur-md">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                            <Trophy className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="text-sm font-bold text-green-950">Campus Athletics & EC</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Live Rankings</div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-white p-3 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden">
                         <div className="text-amber-500 font-black text-xl w-6 text-center">1</div>
                         <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-700 text-xs">A</div>
                         <div className="flex-1">
                            <div className="text-xs font-bold text-slate-800">Alice Johnson</div>
                            <div className="text-[10px] text-slate-500">CS Dept</div>
                         </div>
                         <div className="text-sm font-black text-amber-600">4,250 <span className="text-[10px] text-slate-400">pts</span></div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <div className="text-slate-400 font-bold text-lg w-6 text-center">2</div>
                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">M</div>
                         <div className="flex-1">
                            <div className="text-xs font-bold text-slate-700">Mark Z.</div>
                            <div className="text-[10px] text-slate-400">IT Dept</div>
                         </div>
                         <div className="text-sm font-bold text-slate-600">3,900 <span className="text-[10px] text-slate-400">pts</span></div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <div className="text-slate-400 font-bold text-lg w-6 text-center">3</div>
                         <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">S</div>
                         <div className="flex-1">
                            <div className="text-xs font-bold text-slate-700">Sarah O.</div>
                            <div className="text-[10px] text-slate-400">EC Dept</div>
                         </div>
                         <div className="text-sm font-bold text-slate-600">3,450 <span className="text-[10px] text-slate-400">pts</span></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center justify-center p-3 bg-white border border-cyan-100 text-cyan-600 shadow-sm rounded-xl mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">Gamified Experience & Leaderboards</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Extracurriculars are finally mapped, recognized, and rewarded. Faculty assign participation points for sports, clubs, and hackathons. Engage in healthy competition as you watch your ranking skyrocket on our <strong>Campus-wide Leaderboards</strong>.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                   <div className="w-8 h-8 rounded-full bg-white border border-cyan-100 flex items-center justify-center text-cyan-500 shadow-sm shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  Foster High Participation Rates
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-8 h-8 rounded-full bg-white border border-cyan-100 flex items-center justify-center text-cyan-500 shadow-sm shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  Reward Well-Rounded Students
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 7. THE ADMINISTRATIVE BREAD & BUTTER (Minified Grid) */}
      <section className="py-20 bg-white/40 backdrop-blur-xl border-y border-emerald-100/50">
         <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
            <h3 className="text-2xl font-bold text-green-950 mb-4">...And the Complete Administrative Suite.</h3>
            <p className="text-slate-500 mb-12 max-w-2xl mx-auto font-medium">We've automated the mundane so you can focus on what matters. Attendance, leaves, and approvals happen in a few clicks.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <FileSignature className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm">Faculty Document Approvals</span>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <CheckCircle className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm">Smart Attendance Tracking</span>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <CalendarCheck className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm">Automated Leave Requests</span>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <BookOpen className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm">Course & Mid-Mark Inputs</span>
               </div>
               
               {/* Grid Row 2 */}
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <FileCheck className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm text-center">Paperless Certificate Uploads</span>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <Target className="w-8 h-8 text-slate-400 group-hover:text-amber-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm text-center">Comprehensive Point Tracking</span>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <Megaphone className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm text-center">Global Announcements</span>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
                  <Star className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                  <span className="font-bold text-slate-700 text-sm text-center">Gamified Leaderboards</span>
               </div>
               
            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-transparent relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-green-950 mb-8 tracking-tight">Ready to Transform Your Campus?</h2>
          <p className="text-slate-600 text-xl md:text-2xl mb-12 font-medium">Join the smart ecosystem and eliminate the communication gap forever.</p>
          <Link to="/register" className="inline-flex px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-600 shadow-[0_15px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-1 items-center justify-center gap-3">
            Enter the Ecosystem <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
        
        {/* Background gradient for footer */}
        <div className="absolute inset-x-0 bottom-0 h-full w-full bg-gradient-to-t from-green-50/80 to-transparent pointer-events-none"></div>
      </section>

      {/* Main Footer - Contact & Rights */}
      <footer className="bg-green-950 text-emerald-50 border-t border-emerald-900 pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 cursor-pointer">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">StudentFaculty</span>
              </div>
              <p className="text-emerald-200 shadow-sm opacity-80 leading-relaxed max-w-sm mb-6">
                The definitive campus ecosystem. Connecting students, empowering faculty, and providing actionable intelligence to institutions.
              </p>
              <div className="flex items-center gap-4">
                 {/* Placeholder Social Links */}
                 <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer text-emerald-300 hover:text-white">
                    <span className="font-bold">in</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer text-emerald-300 hover:text-white">
                    <span className="font-bold">x</span>
                 </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
              <ul className="space-y-4 text-emerald-200/80 font-medium">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Features</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Institutions</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Security</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Pricing</li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-emerald-200/80 font-medium">
                <li className="flex items-start gap-3">
                   <div className="mt-1 flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                   </div>
                   <span>support@studentfaculty.edu<br/>sales@studentfaculty.edu</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="mt-1 flex-shrink-0">
                      <Building className="w-4 h-4 text-emerald-500" />
                   </div>
                   <span>123 Innovation Drive,<br/>Tech Campus, TC 40921</span>
                </li>
              </ul>
            </div>
            
          </div>
          
          <div className="pt-8 border-t border-emerald-900/50 flex flex-col md:flex-row items-center justify-between text-sm text-emerald-200/60 font-medium">
            <p>&copy; {new Date().getFullYear()} StudentFaculty System. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
               <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy Policy</span>
               <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
