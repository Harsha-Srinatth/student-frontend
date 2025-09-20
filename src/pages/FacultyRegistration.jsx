import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const steps = [
  {
    title: "Personal Info",
    fields: ["facultyid", "fullname", "username", "email", "mobile", "password"]
  },
  {
    title: "Professional Info",
    fields: ["institution", "dept", "dateofjoin"]
  }
];

const fieldConfig = {
  facultyid: { label: "Faculty ID", type: "text", required: true },
  fullname: { label: "Full Name", type: "text", required: true },
  username: { label: "Username", type: "text", required: true },
  email: { label: "Email Address", type: "email", required: true },
  mobile: { label: "Mobile Number", type: "tel", required: true },
  password: { label: "Password", type: "password", required: true },
  institution: { label: "Institution", type: "text", required: true },
  dept: { label: "Department", type: "text", required: true },
  dateofjoin: { label: "Date of Joining", type: "date", required: true }
};

// Capitalize first letter of each word
const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const FacultyRegistration = () => {
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

    // Transform certain fields
    if (["fullname", "dept", "institution"].includes(name)) {
      newValue = capitalizeWords(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateStep = () => {
    const stepFields = steps[activeStep].fields;
    const newErrors = {};

    stepFields.forEach((name) => {
      const value = formData[name].trim();
      const config = fieldConfig[name];

      if (config.required && !value)
        newErrors[name] = `${config.label} is required`;

      if (name === "email" && value && !/\S+@\S+\.\S+/.test(value))
        newErrors[name] = "Email is invalid";

      if (name === "password" && value && value.length < 6)
        newErrors[name] = "Password must be at least 6 characters";

      if (name === "mobile" && value && !/^\d{10}$/.test(value))
        newErrors[name] = "Mobile number must be exactly 10 digits";

      if (name === "facultyid" && value && !/^\d{10}$/.test(value))
        newErrors[name] = "Faculty Id number must be exactly 10 digits";
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
    if (!validateStep()) return;

    try {
      setLoading(true);
      setResponseMessage(null);

      const formattedData = {
        ...formData,
        facultyid: formData.facultyid.toUpperCase()
      };

      const res = await api.post("/register/faculty", formattedData);
      setResponseMessage({ type: "success", text: res.data.message });
      setFormData(Object.fromEntries(Object.keys(fieldConfig).map((key) => [key, ""])));
      setTimeout(() => window.location.href = "/roleforlogin", 2000);
    } catch (error) {
      setResponseMessage({
        type: "error",
        text: error.response?.data?.message || "Registration failed. Please try again."
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Faculty Registration</h2>
        <p className="text-gray-600">Step by step registration for faculty</p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold transition-all duration-300
              ${index === activeStep
                  ? "bg-green-600 text-white"
                  : index < activeStep
                  ? "bg-green-400 text-white"
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
                    className={`px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
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
              className="ml-auto px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
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
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              }`}
            >
              {loading ? "Creating Account..." : "Create Faculty Account"}
            </button>
          )}
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => (window.location.href = "/roleforlogin")}
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default FacultyRegistration;
