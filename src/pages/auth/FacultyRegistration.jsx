import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import PasswordInput from "../../components/shared/PasswordInput";
import { requestPermission } from "../../../firebase.js";

const steps = [
  {
    title: "Personal Info",
    fields: ["facultyid", "fullname", "username", "email", "mobile", "password"]
  },
  {
    title: "Professional Info",
    fields: ["collegeId", "dept", "dateofjoin", "subjects"]
  }
];

const fieldConfig = {
  facultyid: { label: "Faculty ID", type: "text", required: true },
  fullname: { label: "Full Name", type: "text", required: true },
  username: { label: "Username", type: "text", required: true },
  email: { label: "Email Address", type: "email", required: true },
  mobile: { label: "Mobile Number", type: "tel", required: true },
  password: { label: "Password", type: "password", required: true },
  collegeId: { label: "College ID", type: "text", required: true },
  dept: { label: "Department", type: "text", required: true },
  dateofjoin: { label: "Date of Joining", type: "date", required: true }
};

// Capitalize first letter of each word
const capitalizeWords = (str = "") =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const FacultyRegistration = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(
    Object.fromEntries(Object.keys(fieldConfig).map((key) => [key, key === "subjects" ? [] : ""]))
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [direction, setDirection] = useState(0);
  const [collegeName, setCollegeName] = useState(null);
  const [checkingCollege, setCheckingCollege] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");
  const [fcmToken, setFcmToken] = useState(null);

  // Request FCM token on component mount
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const token = await requestPermission();
        if (token) {
          setFcmToken(token);
          console.log("FCM token obtained:", token);
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };
    getFCMToken();
  }, []);

  // Check college name when collegeId changes
  useEffect(() => {
    const checkCollege = async () => {
      const collegeIdValue = formData.collegeId?.trim();
      if (!collegeIdValue || collegeIdValue.length < 2) {
        setCollegeName(null);
        return;
      }

      setCheckingCollege(true);
      try {
        const response = await api.get(`/college/${encodeURIComponent(collegeIdValue)}`);
        if (response.data?.success && response.data?.data) {
          setCollegeName(response.data.data.collegeName);
        } else {
          setCollegeName(null);
        }
      } catch (error) {
        // College not found or error - that's okay, user can still register
        // Only log if it's not a 404 (expected during typing)
        if (error.response?.status !== 404) {
          console.error("College lookup error:", error);
        }
        setCollegeName(null);
      } finally {
        setCheckingCollege(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkCollege, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.collegeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Keep only digits for mobile, limit to 10 digits
    if (["mobile"].includes(name)) {
      newValue = (value || "").replace(/\D/g, "").slice(0, 10);
    } else if (["fullname", "dept"].includes(name)) {
      newValue = capitalizeWords(value);
    } else if (name === "collegeId") {
      // College ID can be alphanumeric, keep as is but trim
      newValue = value.trim();
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateStep = () => {
    const stepFields = steps[activeStep].fields;
    const newErrors = {};

    stepFields.forEach((name) => {
      const raw = formData[name] ?? "";
      const value = typeof raw === "string" ? raw.trim() : raw;
      const config = fieldConfig[name];

      if (config.required && !value) {
        newErrors[name] = `${config.label} is required`;
        return;
      }

      if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[name] = "Email is invalid";
        return;
      }

      if (name === "password" && value && value.length < 6) {
        newErrors[name] = "Password must be at least 6 characters";
        return;
      }

      if (name === "mobile") {
        const digits = (raw || "").replace(/\D/g, "");
        if (digits && digits.length !== 10) {
          newErrors[name] = "Mobile number must be exactly 10 digits";
        }
        return;
      }

      if (name === "subjects") {
        const subjects = Array.isArray(value) ? value : [];
        if (config.required && subjects.length === 0) {
          newErrors[name] = "At least one subject is required";
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
    if (!validateStep()) return;

    try {
      setLoading(true);
      setResponseMessage(null);

      // Prepare payload: trim strings and ensure ids/mobile are digits-only
      const cleaned = { ...formData };
      Object.keys(cleaned).forEach((k) => {
        if (typeof cleaned[k] === "string") cleaned[k] = cleaned[k].trim();
      });

      cleaned.facultyid = (cleaned.facultyid || "").replace(/\D/g, "");
      cleaned.mobile = (cleaned.mobile || "").replace(/\D/g, "");

      // Add FCM token if available
      if (fcmToken) {
        cleaned.fcmToken = fcmToken;
      }

      const res = await api.post("/register/faculty", cleaned);

      setResponseMessage({ type: "success", text: res.data?.message || "Registration successful" });
      setFormData(Object.fromEntries(Object.keys(fieldConfig).map((key) => [key, key === "subjects" ? [] : ""])));
      setErrors({});
      setCollegeName(null);
      setSubjectInput("");
      setTimeout(() => navigate("/roleforlogin"), 1200);
    } catch (error) {
      console.error("Registration error:", error);
      setResponseMessage({
        type: "error",
        text: error?.response?.data?.message || "Registration failed. Please try again."
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
              const isCollegeId = name === "collegeId";
              const isSubjects = name === "subjects";
              
              if (isSubjects) {
                return (
                  <div key={name} className="sm:col-span-2 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">
                      Subjects You Can Teach
                      {config.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={subjectInput}
                          onChange={(e) => setSubjectInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && subjectInput.trim()) {
                              e.preventDefault();
                              const newSubjects = [...(formData.subjects || []), subjectInput.trim()];
                              setFormData({ ...formData, subjects: newSubjects });
                              setSubjectInput("");
                            }
                          }}
                          placeholder="Enter subject name and press Enter"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (subjectInput.trim()) {
                              const newSubjects = [...(formData.subjects || []), subjectInput.trim()];
                              setFormData({ ...formData, subjects: newSubjects });
                              setSubjectInput("");
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      {formData.subjects && formData.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          {formData.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                            >
                              {subject}
                              <button
                                type="button"
                                onClick={() => {
                                  const newSubjects = formData.subjects.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, subjects: newSubjects });
                                }}
                                className="ml-2 text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">Add all subjects you can teach. Press Enter or click Add to add each subject.</p>
                    </div>
                    {errors[name] && (
                      <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                    )}
                  </div>
                );
              }
              
              return (
                <div key={name} className={`flex flex-col ${isCollegeId ? "sm:col-span-2" : ""}`}>
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    {config.label}
                    {config.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    {config.type === "password" ? (
                      <PasswordInput
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={`Enter ${config.label.toLowerCase()}`}
                        className={`px-4 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-full ${
                          errors[name] ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                      />
                    ) : (
                      <>
                        <input
                          type={config.type}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          placeholder={`Enter ${config.label.toLowerCase()}`}
                          className={`px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-full ${
                            errors[name]
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {isCollegeId && checkingCollege && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        {isCollegeId && collegeName && !checkingCollege && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {isCollegeId && collegeName && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{collegeName}</span>
                    </div>
                  )}
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
            onClick={() => navigate("/roleforlogin")}
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
