export default function DashboardStats() {
  const stats = [
    { label: "Verified Records", value: "128K+" },
    { label: "Active Students", value: "54K+" },
    { label: "Faculty Onboarded", value: "3.2K+" },
    { label: "System Uptime", value: "99.9%" },
  ];

  return (
    <section className="px-4 sm:px-10 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            
            className="text-center rounded-xl bg-white shadow p-4 sm:p-6"
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">
              {s.value}
            </div>
            <div className="mt-1 text-xs sm:text-sm text-gray-600">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
