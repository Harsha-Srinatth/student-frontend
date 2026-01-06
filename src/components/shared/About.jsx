import { motion } from "framer-motion";
import { CheckCircle, Users, Building, Award, TrendingUp, Shield, Zap } from "lucide-react";

const AboutSection = () => {
  const benefits = [
    "Centralized student achievement tracking",
    "Faculty approval system for credibility",
    "Auto-generated digital portfolios",
    "NAAC & AICTE compliance reporting",
    "Real-time analytics and insights",
    "Seamless LMS integration"
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Students Empowered" },
    { icon: Building, value: "200+", label: "Institutions" },
    { icon: Award, value: "1M+", label: "Achievements Tracked" },
    { icon: TrendingUp, value: "99.9%", label: "Accuracy Rate" }
  ];

  return (
    <section className="px-6 sm:px-12 py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-full text-sm font-medium text-indigo-700 mb-6 shadow-lg">
              <Shield className="w-4 h-4" />
              About Our Project
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-slate-800">Revolutionizing</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Academic Management
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our Smart Student Hub bridges the gap between scattered academic records and centralized digital excellence. 
              We empower students to build verified portfolios while helping institutions streamline their academic operations 
              and accreditation processes.
            </p>

            {/* Key Points */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
                <span>Start Your Journey</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Students collaborating with digital tools"
                className="relative w-full rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-purple-900/10 rounded-3xl"></div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-8 -left-8 right-8">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800">{stat.value}</div>
                        <div className="text-xs text-slate-600">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-12 border border-indigo-100/50">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Ready to Transform Your Academic Journey?
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students and institutions already using Smart Student Hub to streamline 
              academic management and build verified digital portfolios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Get Started Today
              </button>
              <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
