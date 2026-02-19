import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Loader2, User, Search } from "lucide-react";
import PasswordInput from "../../components/shared/PasswordInput";
import { requestPermission } from "../../../firebase.js";

const steps = [
  {
    title: "Personal Info",
    fields: ["studentid", "fullname", "username", "email", "mobileno", "password"]
  },
  {
    title: "Academic Info",
    fields: ["institutionId", "dept", "programName", "semester", "facultyid", "dateofjoin"]
  }
];

const fieldConfig = {
  studentid: { label: "Student ID", type: "text", required: true },
  fullname: { label: "Full Name", type: "text", required: true },
  username: { label: "Username", type: "text", required: true },
  email: { label: "Email Address", type: "email", required: true },
  mobileno: { label: "Mobile Number", type: "tel", required: true },
  password: { label: "Password", type: "password", required: true },
  institutionId: { label: "Institution ID", type: "text", required: true },
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
  const [institutionName, setInstitutionName] = useState(null);
  const [checkingInstitution, setCheckingInstitution] = useState(false);
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");
  const [collegeResults, setCollegeResults] = useState([]);
  const [searchingCollege, setSearchingCollege] = useState(false);
  const [showCollegeResults, setShowCollegeResults] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [facultySearchQuery, setFacultySearchQuery] = useState("");
  const [facultyResults, setFacultyResults] = useState([]);
  const [searchingFaculty, setSearchingFaculty] = useState(false);
  const [showFacultyResults, setShowFacultyResults] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
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

  // Search colleges when query changes
  useEffect(() => {
    const searchColleges = async () => {
      const query = collegeSearchQuery?.trim();
      if (!query || query.length < 2) {
        setCollegeResults([]);
        setShowCollegeResults(false);
        if (query.length === 0) {
          setSelectedCollege(null);
          setInstitutionName(null);
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

  // Reset faculty selection when institution changes
  useEffect(() => {
    if (formData.institutionId) {
      setSelectedFaculty(null);
      setFacultySearchQuery("");
      setFacultyResults([]);
      setShowFacultyResults(false);
    }
  }, [formData.institutionId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCollegeResults && !event.target.closest('.college-search-container')) {
        setShowCollegeResults(false);
      }
      if (showFacultyResults && !event.target.closest('.faculty-search-container')) {
        setShowFacultyResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCollegeResults, showFacultyResults]);

  // Search faculty when query changes
  useEffect(() => {
    const searchFaculty = async () => {
      const query = facultySearchQuery?.trim();
      if (!query || query.length < 2) {
        setFacultyResults([]);
        setShowFacultyResults(false);
        if (query.length === 0) {
          setSelectedFaculty(null);
        }
        return;
      }

      // Only search if college ID is provided
      if (!formData.institutionId || !formData.institutionId.trim()) {
        setFacultyResults([]);
        setShowFacultyResults(false);
        return;
      }

      setSearchingFaculty(true);
      try {
        const collegeIdParam = `&collegeId=${encodeURIComponent(formData.institutionId)}`;
        const response = await api.get(`/faculty/search?query=${encodeURIComponent(query)}${collegeIdParam}`);
        if (response.data?.success && response.data?.data) {
          setFacultyResults(response.data.data);
          setShowFacultyResults(true);
        } else {
          setFacultyResults([]);
          setShowFacultyResults(false);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Faculty search error:", error);
        }
        setFacultyResults([]);
        setShowFacultyResults(false);
      } finally {
        setSearchingFaculty(false);
      }
    };

    const timeoutId = setTimeout(searchFaculty, 500);
    return () => clearTimeout(timeoutId);
  }, [facultySearchQuery, formData.institutionId, selectedCollege]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Keep only digits for mobile number, and limit to 10 digits
    if (["mobileno"].includes(name)) {
      // remove non-digits, then limit length to 10
      newValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (["fullname", "dept", "programName"].includes(name)) {
      newValue = capitalizeWords(value);
    } else if (name === "institutionId") {
      // For institution ID, update search query and form data
      newValue = value.trim();
      setCollegeSearchQuery(newValue);
    } else if (name === "facultyid") {
      // For faculty ID, update search query and form data
      newValue = value.trim();
      setFacultySearchQuery(newValue);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCollegeSelect = (college) => {
    // Auto-fill the college ID field
    setFormData((prev) => ({ ...prev, institutionId: college.collegeId }));
    setSelectedCollege(college);
    setCollegeSearchQuery(college.collegeId);
    setInstitutionName(college.collegeName);
    setShowCollegeResults(false);
    // Clear faculty selection when college changes
    setSelectedFaculty(null);
    setFacultySearchQuery("");
    setFormData((prev) => ({ ...prev, facultyid: "" }));
    if (errors.institutionId) {
      setErrors((prev) => ({ ...prev, institutionId: null }));
    }
  };

  const handleFacultySelect = (faculty) => {
    // Auto-fill the faculty ID field
    setFormData((prev) => ({ ...prev, facultyid: faculty.facultyid }));
    setSelectedFaculty(faculty);
    setFacultySearchQuery(faculty.facultyid);
    setShowFacultyResults(false);
    // Clear any errors for facultyid
    if (errors.facultyid) {
      setErrors((prev) => ({ ...prev, facultyid: null }));
    }
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

      // Map institutionId to collegeId for backend compatibility
      if (cleaned.institutionId) {
        cleaned.collegeId = cleaned.institutionId;
        delete cleaned.institutionId;
      }

      // Force digits-only for ids and mobile
      cleaned.mobileno = (cleaned.mobileno || "").replace(/\D/g, "");

      // Add FCM token if available
      if (fcmToken) {
        cleaned.fcmToken = fcmToken;
      }

      // If your backend expects uppercase alphanumeric IDs, you can convert here:
      // cleaned.studentid = cleaned.studentid.toUpperCase();
      // cleaned.facultyid = cleaned.facultyid.toUpperCase();
      // But if they are numeric, don't upper-case.

      const res = await api.post("/register/student", cleaned);

      setResponseMessage({ type: "success", text: res.data?.message || "Registration successful" });
      setFormData(Object.fromEntries(Object.keys(fieldConfig).map((key) => [key, ""])));
      setErrors({});
      setInstitutionName(null);
      setCollegeSearchQuery("");
      setCollegeResults([]);
      setSelectedCollege(null);
      setShowCollegeResults(false);
      setFacultySearchQuery("");
      setFacultyResults([]);
      setSelectedFaculty(null);
      setShowFacultyResults(false);
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
              const isInstitutionId = name === "institutionId";
              const isFacultyId = name === "facultyid";
              
              return (
                <div key={name} className={`flex flex-col ${isInstitutionId || isFacultyId ? "sm:col-span-2" : ""} ${isInstitutionId ? "college-search-container" : "faculty-search-container"}`}>
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
                        className={`px-4 py-2 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full ${
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
                          onFocus={() => {
                            if (isInstitutionId && collegeSearchQuery.length >= 2) {
                              setShowCollegeResults(true);
                            }
                            if (isFacultyId && facultySearchQuery.length >= 2) {
                              setShowFacultyResults(true);
                            }
                          }}
                          placeholder={
                            isInstitutionId 
                              ? "Search by College ID or Name" 
                              : isFacultyId 
                              ? "Search by Faculty ID or Name (Select college first)" 
                              : `Enter ${config.label.toLowerCase()}`
                          }
                          className={`px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full ${
                            errors[name]
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                        {isInstitutionId && searchingCollege && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        {isInstitutionId && selectedCollege && !searchingCollege && formData.institutionId === selectedCollege.collegeId && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                        {isInstitutionId && !searchingCollege && !selectedCollege && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        {isFacultyId && searchingFaculty && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        {isFacultyId && selectedFaculty && !searchingFaculty && formData.facultyid === selectedFaculty.facultyid && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                        {isFacultyId && !searchingFaculty && !selectedFaculty && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* College Search Results Dropdown */}
                  {isInstitutionId && showCollegeResults && collegeResults.length > 0 && (
                    <div className="mt-1 absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {collegeResults.map((college) => (
                        <button
                          key={college.collegeId}
                          type="button"
                          onClick={() => handleCollegeSelect(college)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{college.collegeName}</p>
                              <p className="text-sm text-gray-600">ID: {college.collegeId}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Faculty Search Results Dropdown */}
                  {isFacultyId && showFacultyResults && facultyResults.length > 0 && (
                    <div className="mt-1 absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {facultyResults.map((faculty) => (
                        <button
                          key={faculty.facultyid}
                          type="button"
                          onClick={() => handleFacultySelect(faculty)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{faculty.fullname}</p>
                              <p className="text-sm text-gray-600">ID: {faculty.facultyid}</p>
                              {faculty.designation && (
                                <p className="text-xs text-gray-500">{faculty.designation}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {isInstitutionId && selectedCollege && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{selectedCollege.collegeName}</span>
                    </div>
                  )}
                  
                  {isFacultyId && selectedFaculty && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <User className="h-4 w-4" />
                      <div>
                        <span className="font-medium">{selectedFaculty.fullname}</span>
                        {selectedFaculty.designation && (
                          <span className="text-xs text-gray-600 ml-2">({selectedFaculty.designation})</span>
                        )}
                      </div>
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
