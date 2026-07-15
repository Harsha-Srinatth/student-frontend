import React from 'react';
import Header from "../../components/shared/Header";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Users, Building, BarChart3, ChevronRight, Activity, BookOpen, ShieldCheck, Zap } from "lucide-react";

// --- Ecosystem Connection SVG Component ---
const EcosystemDiagram = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[500px] sm:h-[600px] flex items-center justify-center">
      {/* Central Node: Institution */}
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="absolute z-20 w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-700 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center text-white border-4 border-white"
      >
        <Building className="w-10 h-10 mb-1" />
        <span className="font-bold text-sm tracking-wide">Institution</span>
      </motion.div>

      {/* Orbiting Nodes */}
      {/* 1. Students (Top Left) */}
      <motion.div 
        initial={{ opacity: 0, x: 50, y: 50 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute z-20 top-10 left-10 sm:top-20 sm:left-20 w-28 h-28 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center text-green-950 border-2 border-emerald-50 hover:border-emerald-300 hover:shadow-[0_15px_40px_rgba(16,185,129,0.2)] hover:scale-110 transition-all cursor-pointer group"
      >
        <div className="absolute inset-0 bg-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <GraduationCap className="w-8 h-8 text-emerald-600 mb-1 z-10" />
        <span className="font-bold text-xs z-10">Students</span>
      </motion.div>

      {/* 2. Faculty (Top Right) */}
      <motion.div 
        initial={{ opacity: 0, x: -50, y: 50 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute z-20 top-10 right-10 sm:top-20 sm:right-20 w-28 h-28 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center text-green-950 border-2 border-emerald-50 hover:border-emerald-300 hover:shadow-[0_15px_40px_rgba(16,185,129,0.2)] hover:scale-110 transition-all cursor-pointer group"
      >
        <div className="absolute inset-0 bg-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Users className="w-8 h-8 text-emerald-600 mb-1 z-10" />
        <span className="font-bold text-xs z-10">Faculty</span>
      </motion.div>

      {/* 3. HODs (Bottom Right) */}
      <motion.div 
        initial={{ opacity: 0, x: -50, y: -50 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute z-20 bottom-10 right-10 sm:bottom-20 sm:right-20 w-28 h-28 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center text-green-950 border-2 border-emerald-50 hover:border-emerald-300 hover:shadow-[0_15px_40px_rgba(16,185,129,0.2)] hover:scale-110 transition-all cursor-pointer group"
      >
        <div className="absolute inset-0 bg-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <BarChart3 className="w-8 h-8 text-emerald-600 mb-1 z-10" />
        <span className="font-bold text-xs z-10">HODs</span>
      </motion.div>

      {/* 4. Admins (Bottom Left) */}
      <motion.div 
        initial={{ opacity: 0, x: 50, y: -50 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute z-20 bottom-10 left-10 sm:bottom-20 sm:left-20 w-28 h-28 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center text-green-950 border-2 border-emerald-50 hover:border-emerald-300 hover:shadow-[0_15px_40px_rgba(16,185,129,0.2)] hover:scale-110 transition-all cursor-pointer group"
      >
        <div className="absolute inset-0 bg-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <ShieldCheck className="w-8 h-8 text-emerald-600 mb-1 z-10" />
        <span className="font-bold text-xs z-10">Admins</span>
      </motion.div>

      {/* SVG Connecting Lines with Glowing Particles */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Path: Institution to Students */}
        <path id="path-student" d="M400,300 L180,180" fill="none" stroke="url(#line-gradient)" strokeWidth="3" strokeDasharray="6,6" />
        {/* Path: Institution to Faculty */}
        <path id="path-faculty" d="M400,300 L620,180" fill="none" stroke="url(#line-gradient)" strokeWidth="3" strokeDasharray="6,6" />
        {/* Path: Institution to HODs */}
        <path id="path-hod" d="M400,300 L620,420" fill="none" stroke="url(#line-gradient)" strokeWidth="3" strokeDasharray="6,6" />
        {/* Path: Institution to Admins */}
        <path id="path-admin" d="M400,300 L180,420" fill="none" stroke="url(#line-gradient)" strokeWidth="3" strokeDasharray="6,6" />
        
        {/* Inter-role Connections */}
        <path id="path-s-to-f" d="M180,180 L620,180" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4,4" />
        <path id="path-f-to-h" d="M620,180 L620,420" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4,4" />

        {/* Animated Particles */}
        <circle r="5" fill="#10b981" filter="url(#glow)">
          <animateMotion dur="4s" repeatCount="indefinite" path="M400,300 L180,180" />
        </circle>
        <circle r="6" fill="#059669" filter="url(#glow)">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M400,300 L620,180" />
        </circle>
        <circle r="7" fill="#047857" filter="url(#glow)">
          <animateMotion dur="5s" repeatCount="indefinite" path="M620,420 L400,300" />
        </circle>
        <circle r="5" fill="#34d399" filter="url(#glow)">
          <animateMotion dur="4.5s" repeatCount="indefinite" path="M180,420 L400,300" />
        </circle>

        {/* Inter-role fast packets */}
        <circle r="4" fill="#6ee7b7" filter="url(#glow)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M180,180 L620,180" />
        </circle>
        <circle r="4" fill="#6ee7b7" filter="url(#glow)">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M620,180 L620,420" />
        </circle>
      </svg>
    </div>
  );
};

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-green-50/30 text-green-950 overflow-hidden font-sans">
      <Header />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Advanced Background Orbs (Light Mode) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
           <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[100px] mix-blend-multiply"></div>
           <div className="absolute top-40 right-[10%] w-[600px] h-[600px] bg-teal-100/60 rounded-full blur-[120px] mix-blend-multiply"></div>
        </div>
        
        {/* Subtle Grid overlay for high-tech feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDE2LCAxODUsIDEyOSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-emerald-700 font-bold mb-8 shadow-sm border border-emerald-100 uppercase tracking-widest text-xs">
              <Zap className="w-4 h-4 text-emerald-500" /> Next-Gen College Management
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold text-green-950 tracking-tight mb-8 leading-[1.1]">
              The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Ecosystem</span> For Your Institution
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Breaking down silos. We seamlessly connect Students, Faculty, HODs, and Institutions with real-time updates and collaborative automated workflows.
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
      <section className="py-24 relative overflow-hidden bg-white border-y border-emerald-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-950 mb-6">A Living Interconnected Network</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">Watch how data, approvals, and communication perfectly flow between every role in real-time across your campus.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-[3rem] p-8 border border-emerald-100 shadow-sm">
             <EcosystemDiagram />
          </div>
        </div>
      </section>

      {/* 3. DEEP FEATURE SHOWCASES */}
      <section className="py-32 bg-green-50/30 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          {/* Feature 1: Student -> Faculty (Left Image, Right Text) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16 mb-40"
          >
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-green-100/50 aspect-video flex items-center justify-center p-8 group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent pointer-events-none"></div>
                {/* Abstract UI representation */}
                <div className="w-full h-full bg-white/90 rounded-2xl shadow-xl border border-white p-6 flex flex-col relative overflow-hidden backdrop-blur-md">
                  <div className="h-4 w-1/3 bg-emerald-50 rounded-full mb-6 relative overflow-hidden">
                     <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                  </div>
                  <div className="h-20 w-full bg-slate-50 rounded-xl mb-3 relative flex items-center px-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-4 w-full">
                       <div className="h-3 w-1/2 bg-slate-200 rounded mb-2"></div>
                       <div className="h-2 w-1/3 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                  <div className="h-20 w-full bg-slate-50 rounded-xl relative flex items-center px-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="ml-4 w-full">
                       <div className="h-3 w-3/4 bg-slate-200 rounded mb-2"></div>
                       <div className="h-2 w-1/4 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                  {/* Floating Action Button animation */}
                  <div className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform cursor-pointer">
                     <span className="text-white text-2xl font-light">+</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="w-16 h-16 bg-white border border-emerald-100 text-emerald-600 shadow-sm rounded-2xl flex items-center justify-center mb-8">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">Empowering Student Success</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Students don't just consume information; they interact. With our advanced digital portfolio builder, skill exchange hub, and 1-on-1 direct doubt clarification with faculties, students take full absolute control of their academic trajectory.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-10 h-10 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Activity className="w-5 h-5" />
                  </div>
                  Live Performance & Result Analytics
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-10 h-10 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  Direct Club & Organization Enrollments
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Feature 2: Faculty Control (Right Image, Left Text) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-40"
          >
            <div className="w-full lg:w-1/2">
               <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-teal-50 aspect-video flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-100/50 to-transparent pointer-events-none"></div>
                {/* Abstract UI representation */}
                <div className="w-full h-full bg-white/90 rounded-2xl shadow-xl border border-white p-6 grid grid-cols-2 gap-4 backdrop-blur-md">
                  <div className="bg-emerald-50/50 rounded-xl p-5 flex flex-col justify-between border border-emerald-100/50">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                       <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                       <div className="text-3xl font-bold text-green-950 mb-1">85%</div>
                       <div className="text-emerald-700 font-semibold text-xs uppercase tracking-wider">Avg Attendance</div>
                    </div>
                  </div>
                  <div className="bg-amber-50/50 rounded-xl p-5 flex flex-col justify-between border border-amber-100/50 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                       <BookOpen className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                       <div className="text-3xl font-bold text-green-950 mb-1">12</div>
                       <div className="text-amber-700 font-semibold text-xs uppercase tracking-wider">Approvals</div>
                    </div>
                    {/* Notification pip */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"></div>
                  </div>
                  <div className="col-span-2 bg-slate-50 rounded-xl p-4 flex items-center gap-4 border border-slate-100">
                     <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] relative">
                        <div className="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-75"></div>
                     </div>
                     <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="w-16 h-16 bg-white border border-teal-100 text-teal-600 shadow-sm rounded-2xl flex items-center justify-center mb-8">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">Faculty Command Center</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                We've eliminated administrative overhead natively. Faculties manage real-time smart attendance, seamlessly review student document uploads, and forward critical academic approvals instantly to their HODs from a sleek, unified dashboard.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-10 h-10 rounded-full bg-white border border-teal-100 flex items-center justify-center text-teal-500 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  One-Click Document Approvals
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-10 h-10 rounded-full bg-white border border-teal-100 flex items-center justify-center text-teal-500 shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  Seamless Course & Assignment Management
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Feature 3: Interconnected HODs & Institution */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-green-50 aspect-video flex items-center justify-center p-8">
                {/* Abstract Data Visualization */}
                <div className="w-full h-full bg-white/90 rounded-2xl shadow-xl border border-white p-6 flex flex-col justify-end backdrop-blur-md relative gap-3">
                  <div className="absolute top-6 left-6 text-green-950 font-bold text-xl">Institution Metrics</div>
                  <div className="flex items-end gap-3 justify-between w-full h-[60%] border-b border-slate-100 pb-1">
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '40%' }} className="w-1/5 bg-emerald-100 rounded-t-lg relative group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                    </motion.div>
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '70%' }} transition={{ delay: 0.1 }} className="w-1/5 bg-emerald-200 rounded-t-lg relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                    </motion.div>
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '50%' }} transition={{ delay: 0.2 }} className="w-1/5 bg-emerald-300 rounded-t-lg relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.3)]"></div>
                    </motion.div>
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '90%' }} transition={{ delay: 0.3 }} className="w-1/5 bg-gradient-to-t from-emerald-100 to-emerald-500 rounded-t-lg relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="w-16 h-16 bg-white border border-emerald-100 text-emerald-600 shadow-sm rounded-2xl flex items-center justify-center mb-8">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-green-950 mb-6 leading-tight">High-Level Institutional Analytics</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                HODs and Institutional Admins unlock the big picture. Gain unprecedented access to cross-department statistics, intelligently manage faculty workloads, blast massive institution-wide announcements, and predict club viability using our integrated predictors.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-green-950 font-bold">
                   <div className="w-10 h-10 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  Beautiful, Actionable Analytics Dashboards
                </li>
                <li className="flex items-center gap-4 text-green-950 font-bold">
                  <div className="w-10 h-10 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  Bird's-eye View of all Campus Operations
                </li>
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-white relative overflow-hidden border-t border-emerald-50">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-green-950 mb-8 tracking-tight">Ready to Transform Your Campus?</h2>
          <p className="text-slate-600 text-xl md:text-2xl mb-12 font-medium">Join the smart ecosystem and eliminate the communication gap forever.</p>
          <Link to="/roleoftheuser" className="inline-flex px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-600 shadow-[0_15px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-1 items-center justify-center gap-3">
            Enter the Ecosystem <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
        
        {/* Background gradient for footer */}
        <div className="absolute inset-x-0 bottom-0 h-full w-full bg-gradient-to-t from-green-50/80 to-transparent pointer-events-none"></div>
      </section>
    </div>
  );
}
