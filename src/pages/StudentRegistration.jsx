import React, { useState } from "react";
import api from "../services/api";

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    studentid: "",
    fullname: "",
    username: "",
    institution: "",
    dept: "",
    email: "",
    mobileno: "",
    password: "",
    programName: "",
    semester: "",
    dateofjoin: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentid.trim()) newErrors.studentid = "Student ID is required";
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.mobileno.trim()) newErrors.mobileno = "Mobile number is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.institution.trim()) newErrors.institution = "Institution is required";
    if (!formData.dept.trim()) newErrors.dept = "Department is required";
    if (!formData.programName.trim()) newErrors.programName = "Program name is required";
    if (!formData.dateofjoin.trim()) newErrors.dateofjoin = "Date of joining is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setResponseMessage(null);
      const res = await api.post("/register/student", formData);
      setResponseMessage({ type: "success", text: res.data.message });
      
      // Clear form on success
      setFormData({
        studentid: "",
        fullname: "",
        username: "",
        institution: "",
        dept: "",
        email: "",
        mobileno: "",
        password: "",
        programName: "",
        semester: "",
        dateofjoin: "",
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/roleforlogin';
      }, 2000);
      
    } catch (error) {
      setResponseMessage({
        type: "error",
        text: error.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldConfig = [
    { name: "studentid", label: "Student ID", type: "text", required: true },
    { name: "fullname", label: "Full Name", type: "text", required: true },
    { name: "username", label: "Username", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "mobileno", label: "Mobile Number", type: "tel", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "institution", label: "Institution", type: "text", required: true },
    { name: "dept", label: "Department", type: "text", required: true },
    { name: "programName", label: "Program Name", type: "text", required: true },
    { name: "semester", label: "Semester", type: "text", required: false },
    { name: "dateofjoin", label: "Date of Joining", type: "date", required: true },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h2>
        <p className="text-gray-600">Create your student account to get started</p>
      </div>

      {/* Success/Error Message */}
      {responseMessage && (
        <div className={`mb-6 p-4 rounded-xl border ${
          responseMessage.type === "success" 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div className="flex items-center space-x-2">
            {responseMessage.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{responseMessage.text}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fieldConfig.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors[field.name] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Student Account'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => window.location.href = '/roleforlogin'}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistration;
