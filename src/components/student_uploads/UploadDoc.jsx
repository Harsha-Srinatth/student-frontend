import { useState, useRef } from "react";
import api from "../../services/api";
import Cookies from "js-cookie";

const REQUIRED_FIELDS = {
  certificate: ["title", "issuer"],
  workshop: ["title", "organizer"],
  club: ["title"],
  internship: ["organization", "role", "startDate", "endDate"],
  project: ["title"],
  other: ["description"],
};

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
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Validate required fields for the selected type
  const validateFields = () => {
    const required = REQUIRED_FIELDS[formData.type] || [];
    const newErrors = {};
    required.forEach((field) => {
      if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
        newErrors[field] = "This field is required.";
      }
    });
    if (formData.image && formData.image.size > 10 * 1024 * 1024) {
      newErrors.image = "File size must be under 10MB";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setErrors({ ...errors, image: "File size must be under 10MB" });
          return;
        }
        setFormData({ ...formData, image: file });
        handleImagePreview(file);
        setErrors({ ...errors, image: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: null });
    }
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

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus(null);
    if (!validateFields()) {
      setUploadStatus({ type: "error", message: "Please fill all required fields." });
      return;
    }
    setIsUploading(true);
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
      setUploadStatus({ type: "success", message: "Document uploaded successfully!" });
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
        image: null,
      });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setUploadStatus({
        type: "error",
        message:
          error.response?.data?.error || error.response?.data?.message || error.message || "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Check if all required fields are filled for disabling submit
  const isSubmitDisabled = isUploading || !(REQUIRED_FIELDS[formData.type] || []).every((field) => formData[field] && formData[field].toString().trim() !== "");

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Document</h2>
        {uploadStatus && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${uploadStatus.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {uploadStatus.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document Type *
            </label>
            <div className="relative">
              <select
                name="type"
                onChange={handleChange}
                value={formData.type}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl shadow focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white appearance-none cursor-pointer"
                style={{ minHeight: '48px' }}
              >
                <option value="certificate">📜 Certificate</option>
                <option value="workshop">🎓 Workshop</option>
                <option value="club">🏆 Club Activity</option>
                <option value="internship">💼 Internship</option>
                <option value="project">💡 Project</option>
                <option value="other">📄 Other</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">▼</span>
            </div>
          </div>

          {/* Certificate */}
          {formData.type === "certificate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Python Basics"
                  onChange={handleChange}
                  value={formData.title}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Issuer</label>
                <input
                  type="text"
                  name="issuer"
                  placeholder="e.g., Coursera"
                  onChange={handleChange}
                  value={formData.issuer}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Issued</label>
                <input
                  type="date"
                  name="dateIssued"
                  onChange={handleChange}
                  value={formData.dateIssued || ""}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Workshop */}
          {formData.type === "workshop" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Workshop Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Web Dev Bootcamp"
                  onChange={handleChange}
                  value={formData.title}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  placeholder="e.g., IIT Bombay"
                  onChange={handleChange}
                  value={formData.organizer}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  value={formData.date || ""}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate URL</label>
                <input
                  type="url"
                  name="certificateUrl"
                  placeholder="https://drive.google.com/..."
                  onChange={handleChange}
                  value={formData.certificateUrl || ""}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Club */}
          {formData.type === "club" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Club Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Coding Club"
                  onChange={handleChange}
                  value={formData.name}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g., Member"
                  onChange={handleChange}
                  value={formData.role}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Joined On</label>
                <input
                  type="date"
                  name="joinedOn"
                  onChange={handleChange}
                  value={formData.joinedOn || ""}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Internship */}
          {formData.type === "internship" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organization *</label>
                <input
                  type="text"
                  name="organization"
                  placeholder="e.g., Microsoft"
                  onChange={handleChange}
                  value={formData.organization}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.organization && <p className="text-xs text-red-500 mt-1">{errors.organization}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g., Software Intern"
                  onChange={handleChange}
                  value={formData.role}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  value={formData.startDate || ""}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  value={formData.endDate || ""}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your internship..."
                  onChange={handleChange}
                  value={formData.description}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Projects (comma separated)</label>
                <input
                  type="text"
                  name="projects"
                  placeholder="Project1, Project2"
                  onChange={handleChange}
                  value={formData.projects}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recommendation Letter (URL)</label>
                <input
                  type="url"
                  name="recommendationUrl"
                  placeholder="https://drive.google.com/..."
                  onChange={handleChange}
                  value={formData.recommendationUrl}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Project */}
          {formData.type === "project" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., AI Chatbot"
                  onChange={handleChange}
                  value={formData.title}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your project..."
                  onChange={handleChange}
                  value={formData.description}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies (comma separated)</label>
                <input
                  type="text"
                  name="technologies"
                  placeholder="React, Node.js"
                  onChange={handleChange}
                  value={formData.technologies}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Outcome</label>
                <input
                  type="text"
                  name="outcome"
                  placeholder="e.g., Deployed on cloud"
                  onChange={handleChange}
                  value={formData.outcome}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Repository Link</label>
                <input
                  type="url"
                  name="repoLink"
                  placeholder="https://github.com/..."
                  onChange={handleChange}
                  value={formData.repoLink}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Demo Link</label>
                <input
                  type="url"
                  name="demoLink"
                  placeholder="https://project-demo.com"
                  onChange={handleChange}
                  value={formData.demoLink}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Other */}
          {formData.type === "other" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                placeholder="Describe your achievement or activity..."
                onChange={handleChange}
                value={formData.description}
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          )}

          {/* File Upload (only for types with imageUrl) */}
          {["certificate", "internship", "project"].includes(formData.type) && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="customFileInput"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3.5 3.5M12 8l3.5 3.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Choose Image
                </button>
                <span className="text-gray-500 text-sm truncate max-w-xs">
                  {formData.image ? formData.image.name : "No file chosen"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG (Max size: 10MB)
              </p>
              {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
              {/* Preview Box */}
              {imagePreview && (
                <div className="mt-3 border rounded-lg p-3 bg-gray-50 relative max-w-xs">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 bg-white rounded-full p-1 shadow"
                    onClick={() => {
                      setFormData({ ...formData, image: null });
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    aria-label="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="File Preview"
                    className="max-h-40 mx-auto rounded-lg shadow-md object-contain"
                    style={{ aspectRatio: '4/5', maxWidth: '100%' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white ${isSubmitDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
    </div>
  );
}