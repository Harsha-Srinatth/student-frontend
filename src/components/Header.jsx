// src/components/Header.jsx
import react from 'react'
import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="flex justify-between items-center py-6 px-10 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3v18h18"
          />
        </svg>
        Smart Student Hub
      </div>

      {/* Nav links (hidden on mobile) */}
      <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
        <a href="#home" className="hover:text-indigo-600">Home</a>
        <a href="#about" className="hover:text-indigo-600">About</a>
        <a href="#contact" className="hover:text-indigo-600">Contact</a>
      </nav>

      {/* Auth buttons */}
      <div className="flex gap-3">
        <Link to ='/roleforlogin' className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100">
          Login
        </Link>
        <Link to ="/roleoftheuser" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
          Register
        </Link>
      </div>
    </header>
  );
};