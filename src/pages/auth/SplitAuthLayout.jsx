import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react';

const AnimatedBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-emerald-950">
    <motion.div
      animate={{ scale: [1, 1.05, 1], x: [0, 15, 0], y: [0, 15, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-800/40 blur-[100px] transform-gpu will-change-transform"
    />
    <motion.div
      animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 20, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-800/40 blur-[120px] transform-gpu will-change-transform"
    />
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50"></div>
  </div>
);

export default function SplitAuthLayout({ children, title, subtitle }) {
  const benefits = [
    "Seamless real-time campus communication",
    "Smart ML-based attendance and analytics",
    "Centralized department administration"
  ];

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800 selection:bg-emerald-500/30">
      
      {/* Left Box: Branding (Hidden on strict mobile) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative overflow-hidden bg-emerald-950 flex-col justify-between p-12 text-white">
        <AnimatedBackground />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-emerald-400 to-teal-400 p-2.5 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)] group-hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">StudentFaculty</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto pt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
          >
            The Ultimate <br/>
            <span className="text-emerald-400">Campus Engine.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-emerald-100/80 mb-10 max-w-sm leading-relaxed"
          >
            Join the smart ecosystem designed to bring students, educators, and institutions together.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {benefits.map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-emerald-50/90">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-emerald-200/50 font-medium pb-2">
          &copy; {new Date().getFullYear()} StudentFaculty Inc.
        </div>
      </div>

      {/* Right Box: Form Container */}
      <div className="flex-1 flex flex-col justify-center relative overflow-y-auto">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold transition-colors text-sm">
           <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="w-full max-w-[440px] mx-auto p-6 sm:p-12 lg:p-16 py-16">
          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-loose">{title}</h2>
            {subtitle && <p className="text-base text-slate-500 mt-2 font-medium">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>

    </div>
  );
}
