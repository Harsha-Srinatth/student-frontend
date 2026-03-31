import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle, maxWidth = "max-w-md" }) {
  return (
    <div className="min-h-screen flex selection:bg-emerald-500/30 font-sans">
      
      {/* LEFT SIDE: Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-full lg:w-[45%] xl:w-[40%] bg-slate-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Glowing Orbs for Application Branding */}
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/30 blur-[120px]" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-600/20 blur-[120px]" />
        </div>
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">StudentFaculty</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            The ultimate<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              communication engine.
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-md">
            Connect students, faculty, and administrators in one unified, high-performance ecosystem designed for modern institutions.
          </p>
          
          <ul className="space-y-4">
            {['Unified Portals', 'Automated Workflows', 'Centralized Announcements'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                 {feature}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-sm text-slate-500 font-medium">
          <span>&copy; {new Date().getFullYear()} Workspace</span>
          <div className="flex gap-4">
             <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
             <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form Panel */}
      <div className="flex-1 flex flex-col bg-white relative">
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
           <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to home
           </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full ${maxWidth}`}
          >
            <div className="flex flex-col mb-10">
              {/* Mobile Logo Only */}
              <div className="lg:hidden w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600 border border-emerald-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-slate-900 mb-2">{title}</h2>
              {subtitle && <p className="text-base text-slate-500">{subtitle}</p>}
            </div>
            
            {children}
          </motion.div>
        </div>
      </div>
      
    </div>
  );
}
