import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "Personal Info",
    fields: ["studentid", "fullname", "username", "email", "mobileno", "password"]
  },
  {
    title: "Academic Info",
    fields: ["institution", "dept", "programName", "semester", "facultyid", "dateofjoin"]
  }
];

const fieldConfig = {
  studentid: { label: "Student ID", type: "text", required: true },
  fullname: { label: "Full Name", type: "text", required: true },
  username: { label: "Username", type: "text", required: true },
  email: { label: "Email Address", type: "email", required: true },
  mobileno: { label: "Mobile Number", type: "tel", required: true },
  password: { label: "Password", type: "password", required: true },
  institution: { label: "Institution", type: "text", required: true },
  dept: { label: "Department", type: "text", required: true },
  programName: { label: "Program Name", type: "text", required: true },
  semester: { label: "Semester", type: "text", required: false },
  facultyid: { label: "Faculty ID", type: "text", required: true },
  dateofjoin: { label: "Date of Joining", type: "date", required: true }
};

// Capitalize first letter of each word
const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(
    Object.fromEntries(Object.keys(fieldConfig).map((key) => [key, ""]))
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [direction, setDirection] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Keep only digits for mobile number, and limit to 10 digits
    if (["mobileno"].includes(name)) {
      // remove non-digits, then limit length to 10
      newValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (["fullname", "dept", "programName", "institution"].includes(name)) {
      newValue = capitalizeWords(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateStep = () => {
    const stepFields = steps[activeStep].fields;
    const newErrors = {};

    stepFields.forEach((name) => {
      // Use trimmed value for general fields
      const rawValue = formData[name] ?? "";
      const trimmed = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      const config = fieldConfig[name];

      if (config.required && !trimmed) {
        newErrors[name] = `${config.label} is required`;
        return;
      }

      if (name === "email" && trimmed && !/\S+@\S+\.\S+/.test(trimmed)) {
        newErrors[name] = "Email is invalid";
        return;
      }

      if (name === "password" && trimmed && trimmed.length < 6) {
        newErrors[name] = "Password must be at least 6 characters";
        return;
      }

      // For numeric-only fields check digits-only length
      if (name === "mobileno") {
        const digits = rawValue.replace(/\D/g, "");
        if (digits && digits.length !== 10) {
          newErrors[name] = "Mobile number must be exactly 10 digits";
        }
        return;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setDirection(1);
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate last step
    if (!validateStep()) return;

    try {
      setLoading(true);
      setResponseMessage(null);

      // Prepare data for backend: trim and ensure ids/mobile are digits-only
      const cleaned = { ...formData };

      // Trim general string fields
      Object.keys(cleaned).forEach((k) => {
        if (typeof cleaned[k] === "string") cleaned[k] = cleaned[k].trim();
      });

      // Force digits-only for ids and mobile
      cleaned.mobileno = (cleaned.mobileno || "").replace(/\D/g, "");

      // If your backend expects uppercase alphanumeric IDs, you can convert here:
      // cleaned.studentid = cleaned.studentid.toUpperCase();
      // cleaned.facultyid = cleaned.facultyid.toUpperCase();
      // But if they are numeric, don't upper-case.

      const res = await api.post("/register/student", cleaned);

      setResponseMessage({ type: "success", text: res.data?.message || "Registration successful" });
      setFormData(Object.fromEntries(Object.keys(fieldConfig).map((key) => [key, ""])));
      setErrors({});
      // navigate after short delay (if desired)
      setTimeout(() => (navigate("/roleforlogin")), 1200);
    } catch (error) {
      console.error("Registration error:", error);
      setResponseMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Registration failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 })
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h2>
        <p className="text-gray-600">Step by step registration</p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold transition-all duration-300
              ${index === activeStep
                  ? "bg-blue-600 text-white"
                  : index < activeStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"}`}
            >
              {index < activeStep ? "✓" : index + 1}
            </div>
            <p className="text-center mt-2 text-sm font-medium">{step.title}</p>
          </div>
        ))}
      </div>

      {responseMessage && (
        <div
          className={`mb-4 p-3 rounded-xl border ${
            responseMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {responseMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative h-auto">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={activeStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {steps[activeStep].fields.map((name) => {
              const config = fieldConfig[name];
              return (
                <div key={name} className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    {config.label}
                    {config.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={config.type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={`Enter ${config.label.toLowerCase()}`}
                    className={`px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors[name]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Back
            </button>
          )}
          {activeStep < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Next
            </button>
          )}
          {activeStep === steps.length - 1 && (
            <button
              type="submit"
              disabled={loading}
              className={`ml-auto px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {loading ? "Creating Account..." : "Create Student Account"}
            </button>
          )}
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => (navigate("/roleforlogin"))}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentRegistration;
