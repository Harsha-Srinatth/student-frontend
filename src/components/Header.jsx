import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-16 lg:px-24 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-fuchsia-200 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Content */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
            Smart Student Hub
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600">
          Your one-stop platform to manage achievements, projects, internships,
          and more — all in one place.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/roleoftheuser"
            className="px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/roleforlogin"
            className="px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
