import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Users, Shield, Smartphone, BarChart3, Award } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      q: "What is Smart Student Hub?",
      a: "Smart Student Hub is a comprehensive digital platform that centralizes student achievements, academic records, and extracurricular activities. It helps students build verified portfolios while enabling institutions to streamline academic management and accreditation processes.",
      icon: HelpCircle
    },
    {
      q: "How does the faculty approval system work?",
      a: "Our platform includes a robust faculty approval panel where educators and administrators can review, verify, and approve student-uploaded records. This ensures credibility and maintains the integrity of all documented achievements and activities.",
      icon: Shield
    },
    {
      q: "Can I access the platform on mobile devices?",
      a: "Absolutely! Smart Student Hub is designed as both a web and mobile application, ensuring you can access your dashboard, upload achievements, and track progress from anywhere, anytime.",
      icon: Smartphone
    },
    {
      q: "What kind of analytics and reporting does it provide?",
      a: "The platform offers comprehensive analytics including performance trends, participation metrics, achievement tracking, and institutional reports for NAAC, AICTE, and NIRF compliance. Real-time dashboards provide insights for both students and faculty.",
      icon: BarChart3
    },
    {
      q: "How are digital portfolios generated?",
      a: "Our system automatically generates professional digital portfolios from your verified records. These can be downloaded as PDFs or shared via web links, making them perfect for job applications, higher education admissions, and scholarship opportunities.",
      icon: Award
    },
    {
      q: "Is my personal data secure and private?",
      a: "Yes, data security is our top priority. All information is encrypted, stored securely with enterprise-grade security measures, and access is controlled through role-based permissions. We comply with all relevant data protection regulations.",
      icon: Shield
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="px-6 sm:px-12 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-full text-sm font-medium text-indigo-700 mb-6 shadow-lg">
            <HelpCircle className="w-4 h-4" />
            Got Questions? We've Got Answers
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about Smart Student Hub and how it can transform your academic journey
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/50 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group-hover:bg-indigo-50/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-150">
                      <faq.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors duration-150">
                      {faq.q}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-indigo-600 transform transition-all duration-200 ${
                      openIndex === i ? "rotate-180 scale-110" : "group-hover:scale-110"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="pl-16">
                          <p className="text-slate-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-8 border border-indigo-100/50">
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-6">
              Our support team is here to help you get started with Smart Student Hub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
