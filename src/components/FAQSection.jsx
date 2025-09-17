import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      q: "What is Smart Student Hub?",
      a: "A centralized platform to manage student activities, certificates, and progress.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, all data is encrypted and stored securely with access controls.",
    },
    {
      q: "Can I access it on mobile?",
      a: "Absolutely. The platform is fully responsive across devices.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="px-6 sm:px-12 py-16 bg-gray-50">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Frequently Asked Questions
        </span>
      </h2>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4">
            <button
              onClick={() => toggleFAQ(i)}
              className="w-full flex justify-between items-center text-left focus:outline-none"
            >
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {faq.q}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-indigo-600 transform transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-sm sm:text-base text-gray-600">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}