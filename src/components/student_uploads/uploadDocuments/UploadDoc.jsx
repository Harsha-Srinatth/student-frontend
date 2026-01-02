import { useState, useRef, useEffect } from "react";
import { FileText, Award, Users, Briefcase, Code, File } from "lucide-react";
import api from "../../../services/api";
import Cookies from "js-cookie";
import Toast from "./shared/Toast";
import AnimatedProgress from "./shared/AnimatedProgress";
import CertificateForm from "./forms/CertificateForm";
import WorkshopForm from "./forms/WorkshopForm";
import ClubForm from "./forms/ClubForm";
import InternshipForm from "./forms/InternshipForm";
import ProjectForm from "./forms/ProjectForm";
import OtherForm from "./forms/OtherForm";

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
    technologies: "",
    outcome: "",
    repoLink: "",
    demoLink: "",
    date: "",
    dateIssued: "",
    certificateUrl: "",
    recommendationUrl: "",
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

  const resetForm = () => {
    setFormData({
      type: formData.type, // Keep the same type
      title: "",
      issuer: "",
      organizer: "",
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: "",
      outcome: "",
      repoLink: "",
      demoLink: "",
      date: "",
      dateIssued: "",
      certificateUrl: "",
      recommendationUrl: "",
      image: null,
    });
    setImagePreview(null);
    setErrors({});
    setUploadProgress(0);
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
        if (key !== "image" && formData[key]) {
          data.append(key, formData[key]);
        }
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
      resetForm();
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.error || error.response?.data?.message || error.message || "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      // Reset all fields except type
      title: "",
      issuer: "",
      organizer: "",
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: "",
      outcome: "",
      repoLink: "",
      demoLink: "",
      date: "",
      dateIssued: "",
      certificateUrl: "",
      recommendationUrl: "",
      image: null,
    });
    setImagePreview(null);
    setErrors({});
  };

  const renderForm = () => {
    const commonProps = {
      formData,
      handleChange,
      handleFileSelect,
      imagePreview,
      handleRemoveImage,
      errors,
    };

    switch (formData.type) {
      case "certificate":
        return <CertificateForm {...commonProps} />;
      case "workshop":
        return <WorkshopForm {...commonProps} />;
      case "club":
        return <ClubForm {...commonProps} />;
      case "internship":
        return <InternshipForm {...commonProps} />;
      case "project":
        return <ProjectForm {...commonProps} />;
      case "other":
        return <OtherForm formData={formData} handleChange={handleChange} errors={errors} />;
      default:
        return null;
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
                      onClick={() => handleTypeChange(type.value)}
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
            {renderForm()}

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
