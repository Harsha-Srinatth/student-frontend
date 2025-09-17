import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-fuchsia-50">
      {/* Decorative background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Content */}
      <div className="relative container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-20 md:py-28">
        
        {/* Left text */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Centralized Digital Platform for{" "}
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent animate-gradient">
              Comprehensive Student Activity Records
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-700">
            Manage and track academic and extracurricular activities,
            certifications, internships, and achievements — all in one place.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/roleforlogin")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Scroll down to explore further <span className="text-lg">↓</span>
            </button>
          </div>
        </div>

        {/* Right image */}
        <div className="relative mt-10 md:mt-0 flex justify-center">
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500 via-violet-600 to-fuchsia-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <img
            src="/default3.jpeg"
            alt="Student Dashboard Illustration"
            className="relative w-[320px] md:w-[480px] rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}
