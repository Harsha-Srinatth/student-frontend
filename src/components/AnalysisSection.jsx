import { motion } from "framer-motion";
import { Brain, LayoutDashboard, Award } from "lucide-react";

export default function AnalysisSection() {
  const items = [
    {
      title: "AI-Driven Analytics",
      desc: "Gain insights into student activities, participation, and growth.",
      icon: <Brain className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Smart Dashboards",
      desc: "Track progress across academics, events, and extracurriculars.",
      icon: <LayoutDashboard className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Certificates & Records",
      desc: "Easily manage and verify certificates and achievements.",
      icon: <Award className="w-8 h-8 text-indigo-600" />,
    },
  ];

  return (
    <section className="px-6 sm:px-12 py-16 bg-gradient-to-b from-white via-indigo-50 to-white">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Student Activity Analysis
        </span>
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}