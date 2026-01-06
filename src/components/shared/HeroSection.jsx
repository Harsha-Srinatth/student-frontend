import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-16 lg:px-24 pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-40"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-blue-300 rounded-full opacity-50"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-full text-sm font-medium text-indigo-700 mb-6 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Next-Gen Student Management Platform
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              <span className="text-slate-800">Empowering Students,</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Simplifying Academics
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Manage courses, track progress, and visualize performance—all in one intuitive dashboard. 
              Build your verified digital portfolio from day one.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/roleoftheuser"
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-150" />
              </Link>
              
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200 flex items-center justify-center gap-3">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
                <span>Learn More</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">50K+</div>
                <div className="text-sm text-slate-600">Active Students</div>
              </div>
              <div className="w-px h-12 bg-slate-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">200+</div>
                <div className="text-sm text-slate-600">Institutions</div>
              </div>
              <div className="w-px h-12 bg-slate-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">99.9%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="relative"
          >
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-xl flex items-center justify-center z-10"
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg flex items-center justify-center z-10"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>

            {/* Main Dashboard Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
              <img
                src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Smart Student Hub Dashboard"
                className="relative w-full max-w-lg mx-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-purple-900/10 rounded-3xl"></div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Live Analytics</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ x: [0, -8, 0], y: [0, 4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/3 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Real-time Updates</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
