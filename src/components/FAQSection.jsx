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
  
    return (
      <section className="px-4 sm:px-10 py-12 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-4 sm:p-6 rounded-xl bg-white shadow-sm hover:shadow-md"
            >
              <h3 className="text-base sm:text-lg font-medium text-indigo-600">
                {faq.q}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  