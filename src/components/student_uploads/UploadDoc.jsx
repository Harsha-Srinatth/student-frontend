import { useState, useRef, useEffect } from "react";
import { Upload, X, Check, AlertCircle, FileText, Award, Users, Briefcase, Code, File } from "lucide-react";
import api from "../../services/api";
import Cookies from "js-cookie";

const REQUIRED_FIELDS = {
  certificate: ["title"],
  workshop: ["title"],
  club: ["title"],
  internship: ["organization", "role"],
  project: ["title"],
  other: ["description"],
};

const IMAGE_UPLOAD_TYPES = ["certificate", "workshop", "club", "internship", "project"];

const DOCUMENT_TYPES = [
  { value: "certificate", label: "Certificate", icon: Award, gradient: "from-blue-500 to-cyan-600" },
  { value: "workshop", label: "Workshop", icon: Users, gradient: "from-purple-500 to-pink-600" },
  { value: "club", label: "Club Activity", icon: Users, gradient: "from-green-500 to-teal-600" },
  { value: "internship", label: "Internship", icon: Briefcase, gradient: "from-orange-500 to-red-600" },
  { value: "project", label: "Project", icon: Code, gradient: "from-indigo-500 to-purple-600" },
  { value: "other", label: "Other", icon: File, gradient: "from-gray-500 to-slate-600" },
];

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm transform transition-all duration-300 ease-out ${
      type === 'success' 
        ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white' 
        : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white'
    }`}>
      {type === 'success' ? (
        <Check className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Floating Label Input Component
const FloatingInput = ({ label, type = "text", name, value, onChange, placeholder, required, error, textarea, rows, className = "" }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;
  const shouldFloat = focused || hasValue;

  const inputClasses = `
    w-full px-4 pt-6 pb-2 bg-white border-2 rounded-2xl transition-all duration-300 
    ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}
    focus:outline-none focus:ring-4 focus:ring-blue-500/10
    ${className}
  `;

  const labelClasses = `
    absolute left-4 transition-all duration-300 pointer-events-none
    ${shouldFloat 
      ? 'top-2 text-xs font-semibold text-blue-600' 
      : 'top-1/2 -translate-y-1/2 text-gray-500'
    }
    ${error && shouldFloat ? 'text-red-600' : ''}
  `;

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          className={inputClasses}
          placeholder={focused ? placeholder : ''}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={inputClasses}
          {...(type === "date"
                ? { placeholder: "" }
                : { placeholder: focused ? placeholder : "" })}
        />

      )}
      <label className={labelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// Drag and Drop Upload Component
const DragDropUpload = ({ onFileSelect, preview, onRemove, error, fileName }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer group ${
          dragOver 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : error 
            ? 'border-red-300 hover:border-red-400' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className={`transition-all duration-300 ${dragOver ? 'scale-110' : 'group-hover:scale-105'}`}>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {dragOver ? 'Drop your image here' : 'Upload Image'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Drag and drop or click to browse
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            Choose File
          </div>
        </div>
        
        {fileName && !preview && (
          <div className="mt-4 text-sm text-gray-600">
            Selected: {fileName}
          </div>
        )}
      </div>

      {preview && (
        <div className="relative group">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Preview</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 hover:bg-red-100 rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-2xl shadow-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// Animated Progress Bar
const AnimatedProgress = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
    <div
      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
      style={{ width: `${progress}%` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full animate-pulse" />
    </div>
  </div>
);

export default function UploadDocument() {
  const [formData, setFormData] = useState({
    type: "certificate",
    title: "",
    issuer: "",
    organizer: "",
    organization: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    projects: "",
    recommendationUrl: "",
    technologies: "",
    outcome: "",
    repoLink: "",
    demoLink: "",
    date: "",
    dateIssued: "",
    certificateUrl: "",
    joinedOn: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFields = () => {
    const required = REQUIRED_FIELDS[formData.type] || [];
    const newErrors = {};
    required.forEach((field) => {
      if ((formData[field] ?? "").toString().trim() === "") {
        newErrors[field] = "This field is required.";
      }
    });
    if (IMAGE_UPLOAD_TYPES.includes(formData.type) && !formData.image) {
      newErrors.image = "Please attach an image.";
    }
    if (formData.image && formData.image.size > 10 * 1024 * 1024) {
      newErrors.image = "File size must be under 10MB";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleFileSelect = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, image: "File size must be under 10MB" });
      return;
    }
    setFormData({ ...formData, image: file });
    handleImagePreview(file);
    setErrors({ ...errors, image: null });
  };

  const handleImagePreview = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setToast({ type: "error", message: "Please fill all required fields." });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "image" && formData[key]) data.append(key, formData[key]);
      });
      if (formData.image) data.append("image", formData.image);
      
      const token = Cookies.get("token");
      await api.post(`/upload/student/Docs`, data, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });
      
      setToast({ type: "success", message: "Document uploaded successfully!" });
      
      // Reset form
      setFormData({
        type: "certificate",
        title: "",
        issuer: "",
        organizer: "",
        organization: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
        projects: "",
        recommendationUrl: "",
        technologies: "",
        outcome: "",
        repoLink: "",
        demoLink: "",
        date: "",
        dateIssued: "",
        certificateUrl: "",
        joinedOn: "",
        image: null,
      });
      setImagePreview(null);
      setUploadProgress(0);
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.error || error.response?.data?.message || error.message || "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const currentDocType = DOCUMENT_TYPES.find(type => type.value === formData.type);
  const isSubmitDisabled = isUploading || !(REQUIRED_FIELDS[formData.type] || []).every((field) => (formData[field] ?? "").toString().trim() !== "");

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="w-full max-w-none mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Upload Document
            </h1>
            <p className="text-gray-600">Share your achievements and experiences</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Document Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DOCUMENT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.value;
                  
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? 'border-transparent bg-gradient-to-br ' + type.gradient + ' text-white shadow-lg'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Form Fields */}
            <div className="space-y-6">
              {formData.type === "certificate" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput
                    label="Certificate Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Python Basics"
                    required
                    error={errors.title}
                  />
                  <FloatingInput
                    label="Issuer"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleChange}
                    placeholder="e.g., Coursera"
                  />
                  <FloatingInput
                    label="Date Issued"
                    type="date"
                    name="dateIssued"
                    value={formData.dateIssued}
                    onChange={handleChange}
                    className="date-input"
                  />
                </div>
              )}

              {formData.type === "workshop" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput
                    label="Workshop Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Web Dev Bootcamp"
                    required
                    error={errors.title}
                  />
                  <FloatingInput
                    label="Organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="e.g., IIT Bombay"
                  />
                  <FloatingInput
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="date-input"
                  />
                  <FloatingInput
                    label="Certificate URL"
                    type="url"
                    name="certificateUrl"
                    value={formData.certificateUrl}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              )}

              {formData.type === "club" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput
                    label="Club Name"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Coding Club"
                    required
                    error={errors.title}
                  />
                  <FloatingInput
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g., Member"
                  />
                  <FloatingInput
                    label="Joined On"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="date-input"
                  />
                </div>
              )}

              {formData.type === "internship" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingInput
                      label="Organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g., Microsoft"
                      required
                      error={errors.organization}
                    />
                    <FloatingInput
                      label="Role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g., Software Intern"
                      required
                      error={errors.role}
                    />
                    <FloatingInput
                      label="Start Date"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="date-input"
                    />
                    <FloatingInput
                      label="End Date"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="date-input"
                    />
                  </div>
                  <FloatingInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your internship..."
                    textarea
                    rows={3}
                  />
                  <FloatingInput
                    label="Projects (comma separated)"
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    placeholder="Project1, Project2"
                  />
                  <FloatingInput
                    label="Recommendation Letter URL"
                    type="url"
                    name="recommendationUrl"
                    value={formData.recommendationUrl}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              )}

              {formData.type === "project" && (
                <div className="space-y-6">
                  <FloatingInput
                    label="Project Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., AI Chatbot"
                    required
                    error={errors.title}
                  />
                  <FloatingInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project..."
                    textarea
                    rows={3}
                  />
                  <FloatingInput
                    label="Technologies (comma separated)"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="React, Node.js"
                  />
                  <FloatingInput
                    label="Outcome"
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                    placeholder="e.g., Deployed on cloud"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingInput
                      label="Repository Link"
                      type="url"
                      name="repoLink"
                      value={formData.repoLink}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />
                    <FloatingInput
                      label="Demo Link"
                      type="url"
                      name="demoLink"
                      value={formData.demoLink}
                      onChange={handleChange}
                      placeholder="https://project-demo.com"
                    />
                  </div>
                </div>
              )}

              {formData.type === "other" && (
                <FloatingInput
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your achievement or activity..."
                  textarea
                  rows={4}
                  required
                  error={errors.description}
                />
              )}
            </div>

            {/* File Upload */}
            {IMAGE_UPLOAD_TYPES.includes(formData.type) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Upload Image *
                </label>
                <DragDropUpload
                  onFileSelect={handleFileSelect}
                  preview={imagePreview}
                  onRemove={handleRemoveImage}
                  error={errors.image}
                  fileName={formData.image?.name}
                />
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Uploading...</span>
                  <span className="text-blue-600 font-semibold">{uploadProgress}%</span>
                </div>
                <AnimatedProgress progress={uploadProgress} />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-4 px-8 rounded-2xl font-semibold text-white text-lg transition-all duration-300 transform ${
                isSubmitDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                "Upload Document"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}