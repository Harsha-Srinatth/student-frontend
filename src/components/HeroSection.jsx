
export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-gray-50">
      {/* Left text */}
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Centralized Digital Platform for <br />
          <span className="text-indigo-600">Comprehensive Student Activity Records</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Manage and track academic and extracurricular activities,
          certifications, internships, and achievements in one place.
        </p>
        <button className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg">
          Get Started
        </button>
      </div>

      {/* Right image */}
      <div className="mt-10 md:mt-0">
        <img src= "/default3.jpeg"
         alt="Student Dashboard Illustration" className="w-[400px] md:w-[500px]" 
         />
      </div>
    </section>
  );
}
