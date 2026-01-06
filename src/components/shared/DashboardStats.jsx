import { motion } from "framer-motion";
import { Users, BookOpen, Award, TrendingUp, Building, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardStats() {
  const stats = [
    { 
      label: "Total Students", 
      value: 128000, 
      suffix: "+",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    { 
      label: "Active Institutions", 
      value: 250, 
      suffix: "+",
      icon: Building,
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50"
    },
    { 
      label: "Verified Records", 
      value: 54000, 
      suffix: "+",
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    { 
      label: "System Uptime", 
      value: 99.9, 
      suffix: "%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
  ];

  return (
    <section className="px-6 sm:px-12 py-20 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Trusted by Thousands
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join the growing community of students and institutions transforming academic management
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const duration = 1200; // 1.2 seconds (faster)
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
      className="group relative"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-200`}></div>
      
      {/* Card Content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 border border-white/50">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-200`}>
          <stat.icon className="w-8 h-8 text-white" />
        </div>

        {/* Value */}
        <div className="mb-2">
          <span className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.suffix === "%" ? count.toFixed(1) : count.toLocaleString()}
          </span>
          <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <p className="text-slate-600 font-medium text-lg">
          {stat.label}
        </p>

        {/* Hover Effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
      </div>
    </motion.div>
  );
}
