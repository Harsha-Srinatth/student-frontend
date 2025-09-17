import { motion } from "framer-motion";

export default function DashboardStats() {
  const stats = [
    { label: "Verified Records", value: "128K+" },
    { label: "Active Students", value: "54K+" },
    { label: "Faculty Onboarded", value: "3.2K+" },
    { label: "System Uptime", value: "99.9%" },
  ];

  return (
    <section className="px-6 sm:px-12 py-16 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="text-center rounded-2xl bg-white shadow-md hover:shadow-xl p-6 transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-600">
              {s.value}
            </div>
            <div className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
