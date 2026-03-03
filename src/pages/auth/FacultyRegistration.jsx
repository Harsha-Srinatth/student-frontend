import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Loader2, Search } from "lucide-react";
import PasswordInput from "../../components/shared/PasswordInput";
import { requestPermission } from "../../../firebase.js";

// Backend requires at least one subject (subjects array min length 1). We collect them in step 2.
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
  dateofjoin: { label: "Date of Joining", type: "date", required: true },
  subjects: { label: "Subjects you can teach", type: "text", required: true }
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
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");
  const [collegeResults, setCollegeResults] = useState([]);
  const [searchingCollege, setSearchingCollege] = useState(false);
  const [showCollegeResults, setShowCollegeResults] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
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

  // Search colleges when query changes (same as student portal – uses /colleges/search)
  useEffect(() => {
    const searchColleges = async () => {
      const query = collegeSearchQuery?.trim();
      if (!query || query.length < 2) {
        setCollegeResults([]);
        setShowCollegeResults(false);
        if (query.length === 0) {
          setSelectedCollege(null);
        }
        return;
      }

      setSearchingCollege(true);
      try {
        const response = await api.get(`/colleges/search?query=${encodeURIComponent(query)}`);
        if (response.data?.success && response.data?.data) {
          setCollegeResults(response.data.data);
          setShowCollegeResults(true);
        } else {
          setCollegeResults([]);
          setShowCollegeResults(false);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("College search error:", error);
        }
        setCollegeResults([]);
        setShowCollegeResults(false);
      } finally {
        setSearchingCollege(false);
      }
    };

    const timeoutId = setTimeout(searchColleges, 500);
    return () => clearTimeout(timeoutId);
  }, [collegeSearchQuery]);

  // Close college dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCollegeResults && !event.target.closest(".college-search-container")) {
        setShowCollegeResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCollegeResults]);

  const handleCollegeSelect = (college) => {
    setFormData((prev) => ({ ...prev, collegeId: college.collegeId }));
    setSelectedCollege(college);
    setCollegeSearchQuery(college.collegeId);
    setShowCollegeResults(false);
    if (errors.collegeId) setErrors((prev) => ({ ...prev, collegeId: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Keep only digits for mobile, limit to 10 digits
    if (["mobile"].includes(name)) {
      newValue = (value || "").replace(/\D/g, "").slice(0, 10);
    } else if (["fullname", "dept"].includes(name)) {
      newValue = capitalizeWords(value);
    } else if (name === "collegeId") {
      newValue = value.trim();
      setCollegeSearchQuery(newValue);
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

      if (config?.required && (value === "" || value == null || (Array.isArray(value) && value.length === 0))) {
        newErrors[name] = `${config?.label ?? name} is required`;
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
        const subjects = Array.isArray(formData.subjects) ? formData.subjects : [];
        const validSubjects = subjects.filter((s) => s != null && String(s).trim());
        if (validSubjects.length === 0) {
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

      // Prepare payload: trim strings; keep full facultyid (e.g. FAC-IT-04), mobile digits-only
      const cleaned = { ...formData };
      Object.keys(cleaned).forEach((k) => {
        if (k === "subjects") return;
        if (typeof cleaned[k] === "string") cleaned[k] = cleaned[k].trim();
      });

      // Faculty ID can be alphanumeric (e.g. FAC-IT-04) – do not strip to digits only
      cleaned.mobile = (cleaned.mobile || "").replace(/\D/g, "");
      cleaned.subjects = Array.isArray(formData.subjects) ? formData.subjects.filter((s) => s && String(s).trim()) : [];

      // Add FCM token if available
      if (fcmToken) {
        cleaned.fcmToken = fcmToken;
      }

      const res = await api.post("/register/faculty", cleaned, { timeout: 25000 });

      setResponseMessage({ type: "success", text: res.data?.message || "Registration successful" });
      setFormData(Object.fromEntries(Object.keys(fieldConfig).map((key) => [key, key === "subjects" ? [] : ""])));
      setErrors({});
      setCollegeSearchQuery("");
      setCollegeResults([]);
      setSelectedCollege(null);
      setShowCollegeResults(false);
      setSubjectInput("");
      setTimeout(() => navigate("/roleforlogin"), 1200);
    } catch (error) {
      console.error("Registration error:", error);
      const isTimeout = error?.code === "ECONNABORTED" || error?.message?.includes("timeout");
      setResponseMessage({
        type: "error",
        text: isTimeout
          ? "Request timed out. Please check your connection and try again."
          : error?.response?.data?.message || "Registration failed. Please try again."
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

      {responseMessage?.type === "error" && (
        <div className="mb-4 p-3 rounded-xl border bg-red-50 border-red-200 text-red-700">
          {responseMessage.text}
        </div>
      )}
      {responseMessage?.type === "success" && (
        <div className="mb-4 p-3 rounded-xl border bg-green-50 border-green-200 text-green-700">
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

              if (!config && !isSubjects) return null;

              if (isSubjects) {
                return (
                  <div key={name} className="sm:col-span-2 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">
                      Subjects you can teach <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Add at least one subject. Type and press Enter or click Add.</p>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={subjectInput}
                          onChange={(e) => setSubjectInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && subjectInput.trim()) {
                              e.preventDefault();
                              const newSubjects = [...(formData.subjects || []), subjectInput.trim()];
                              setFormData((prev) => ({ ...prev, subjects: newSubjects }));
                              setSubjectInput("");
                            }
                          }}
                          placeholder="e.g. Mathematics, Physics"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (subjectInput.trim()) {
                              const newSubjects = [...(formData.subjects || []), subjectInput.trim()];
                              setFormData((prev) => ({ ...prev, subjects: newSubjects }));
                              setSubjectInput("");
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors whitespace-nowrap"
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
                                  setFormData((prev) => ({ ...prev, subjects: newSubjects }));
                                }}
                                className="ml-2 text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors[name] && (
                      <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                    )}
                  </div>
                );
              }

              return (
                <div key={name} className={`flex flex-col ${isCollegeId ? "sm:col-span-2 college-search-container" : ""}`}>
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    {config?.label ?? name}
                    {config?.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    {config?.type === "password" ? (
                      <PasswordInput
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={`Enter ${(config?.label ?? name).toLowerCase()}`}
                        className={`px-4 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-full ${
                          errors[name] ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                      />
                    ) : (
                      <>
                        <input
                          type={config?.type ?? "text"}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          onFocus={() => isCollegeId && collegeSearchQuery.length >= 2 && setShowCollegeResults(true)}
                          placeholder={isCollegeId ? "Search by College ID or Name" : `Enter ${(config?.label ?? name).toLowerCase()}`}
                          className={`px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-full ${
                            errors[name]
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {isCollegeId && searchingCollege && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        {isCollegeId && selectedCollege && !searchingCollege && formData.collegeId === selectedCollege.collegeId && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                        {isCollegeId && !searchingCollege && !selectedCollege && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {isCollegeId && showCollegeResults && collegeResults.length > 0 && (
                    <div className="mt-1 absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {collegeResults.map((college) => (
                        <button
                          key={college.collegeId}
                          type="button"
                          onClick={() => handleCollegeSelect(college)}
                          className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{college.collegeName}</p>
                              <p className="text-sm text-gray-600">ID: {college.collegeId}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {isCollegeId && selectedCollege && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{selectedCollege.collegeName}</span>
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
