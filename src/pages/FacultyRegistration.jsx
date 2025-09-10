import React, { useState } from "react";
import api from "../services/api";

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
    
    if (!formData.facultyid.trim()) newErrors.facultyid = "Faculty ID is required";
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.institution.trim()) newErrors.institution = "Institution is required";
    if (!formData.dept.trim()) newErrors.dept = "Department is required";
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
      const res = await api.post("/register/faculty", formData);
      setResponseMessage({ type: "success", text: res.data.message });
      
      // Clear form on success
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
    { name: "facultyid", label: "Faculty ID", type: "text", required: true },
    { name: "fullname", label: "Full Name", type: "text", required: true },
    { name: "username", label: "Username", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "mobile", label: "Mobile Number", type: "tel", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "institution", label: "Institution", type: "text", required: true },
    { name: "dept", label: "Department", type: "text", required: true },
    { name: "dateofjoin", label: "Date of Joining", type: "date", required: true },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Faculty Registration</h2>
        <p className="text-gray-600">Create your faculty account to manage students</p>
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
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
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Faculty Account'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => window.location.href = '/roleforlogin'}
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default FacultyRegistration;