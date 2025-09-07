export default function AnalysisSection() {
    const items = [
      {
        title: "AI-Driven Analytics",
        desc: "Gain insights into student activities, participation, and growth.",
      },
      {
        title: "Smart Dashboards",
        desc: "Track progress across academics, events, and extracurriculars.",
      },
      {
        title: "Certificates & Records",
        desc: "Easily manage and verify certificates and achievements.",
      },
    ];
  
    return (
      <section className="px-4 sm:px-10 py-12 bg-white">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8">
          Student Activity Analysis
        </h2>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-50 hover:bg-gray-100 transition p-6 sm:p-8 shadow-sm"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  