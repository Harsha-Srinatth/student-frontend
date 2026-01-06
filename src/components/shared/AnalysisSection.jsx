import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Users, Award, BookOpen, Target, Zap } from "lucide-react";

export default function AnalysisSection() {
  const features = [
    {
      title: "Performance Analytics",
      desc: "Track academic progress with interactive charts and real-time insights into student performance trends.",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "Smart Dashboards",
      desc: "Comprehensive overview of academics, extracurriculars, and achievements in one intuitive interface.",
      icon: PieChart,
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50"
    },
    {
      title: "Progress Tracking",
      desc: "Monitor growth across multiple dimensions with detailed progress reports and milestone tracking.",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Student Profiles",
      desc: "Build comprehensive digital portfolios showcasing academic and extracurricular achievements.",
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      title: "Achievement Management",
      desc: "Centralized system for documenting, verifying, and showcasing student accomplishments.",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      title: "Course Integration",
      desc: "Seamlessly integrate with existing LMS and ERP systems for unified academic management.",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
  ];

  return (
    <section className="px-6 sm:px-12 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-full text-sm font-medium text-indigo-700 mb-6 shadow-lg">
            <Zap className="w-4 h-4" />
            Powerful Analytics & Insights
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Student Activity Analysis
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Gain deep insights into student activities, participation, and growth with our comprehensive analytics platform. 
            Make data-driven decisions to enhance academic excellence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-200`}></div>
              
              {/* Card Content */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 border border-white/50 h-full">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-indigo-700 transition-colors duration-200">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            <Target className="w-5 h-5" />
            <span>Explore Analytics Dashboard</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
