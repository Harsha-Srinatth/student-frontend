// src/components/FacultyRegistration.jsx
import { useState } from "react";
import api from "../services/api"; // 👈 import your axios instance

const FacultyRegistration = () => {
  const [formData, setFormData] = useState({
    facultyid: "",
    fullname: "",
    username: "",
    institution: "",
    role: "faculty",
    dept: "",
    email: "",
    mobile: "",
    password: "",
    dateofjoin: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/register/faculty", formData); // 👈 correct endpoint for faculty
      setResponseMessage({ type: "success", text: res.data.message });
      setFormData({
        facultyid: "",
        fullname: "",
        username: "",
        institution: "",
        role: "faculty",
        dept: "",
        email: "",
        mobile: "",
        password: "",
        dateofjoin: "",
      });
    } catch (error) {
      setResponseMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Faculty Registration
      </h2>

      {responseMessage && (
        <p
          className={`mb-3 text-sm ${
            responseMessage.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {responseMessage.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="facultyid"
          value={formData.facultyid}
          onChange={handleChange}
          placeholder="Faculty Id Number"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="User Name"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="dept"
          value={formData.dept}
          onChange={handleChange}
          placeholder="Department"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          placeholder="Institution Name"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

         <input
          type="tel"
          name="dateofjoin"
          value={formData.dateofjoin}
          onChange={handleChange}
          placeholder="Date of Join"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default FacultyRegistration;