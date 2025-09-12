import { useState, useRef } from "react";
import api from "../../services/api";
import Cookies from "js-cookie";

export default function UploadDocument({ studentid }) {
  const [formData, setFormData] = useState({
    type: "certificate",
    title: "",
    issuer: "",
    organizer: "",
    description: "",
    date: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ratioNotice, setRatioNotice] = useState(null);
  const fileInputRef = useRef(null);

  // -----------------------------
  // Handlers
  // -----------------------------
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
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // Soft-check preferred aspect ratios: 4:5, 3:4, 1.91:1, 1:1
        const img = new Image();
        img.onload = () => {
          const w = img.width;
          const h = img.height;
          if (w && h) {
            const r = w / h;
            const preferred = [4 / 5, 3 / 4, 1.91 / 1, 1 / 1];
            const withinTolerance = preferred.some((p) => Math.abs(r - p) < 0.03);
            if (!withinTolerance) {
              setRatioNotice(
                "Tip: For best results, use 4:5, 3:4, 1.91:1, or 1:1 images."
              );
            } else {
              setRatioNotice(null);
            }
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setRatioNotice(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, image: "File size must be under 10MB" });
      return;
    }

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      setFormData({ ...formData, image: file });
      handleImagePreview(file);
      setErrors({ ...errors, image: null });
    } else {
      setErrors({ ...errors, image: "Please upload only images or PDF files" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.image) newErrors.image = "Please upload a file";
    if (formData.type === "certificate" && !formData.issuer.trim()) {
      newErrors.issuer = "Issuer is required for certificates";
    }
    if (formData.type === "workshop" && !formData.organizer.trim()) {
      newErrors.organizer = "Organizer is required for workshops";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Submit Handler (improved error handling)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUploading(true);
    setUploadStatus(null);
    setUploadProgress(0);

    try {
      const data = new FormData();

      // non-file fields
      Object.keys(formData).forEach((key) => {
        if (key !== "image" && formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      // image field
      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = Cookies.get("token");

      const response = await api.post(`/upload/${studentid}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const pct = Math.round((evt.loaded * 100) / evt.total);
            setUploadProgress(pct);
          }
        },
      });

      setUploadStatus({ type: "success", message: "Document uploaded successfully!" });

      // reset form
      setFormData({
        type: "certificate",
        title: "",
        issuer: "",
        organizer: "",
        description: "",
        date: "",
        image: null,
      });
      setImagePreview(null);
      setRatioNotice(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const backendError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (error.response?.data && typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data) ||
        error.message ||
        "Upload failed";
    
      setUploadStatus({ type: "error", message: backendError });
      console.error("Upload error:", backendError);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    setErrors({ ...errors, image: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100 min-h-fit">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h2>
          <p className="text-gray-600">Share your achievements and certificates with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Document Type */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type *</label>
            <div className="relative">
              <select
                name="type"
                onChange={handleChange}
                value={formData.type}
                className="w-full px-4 py-4 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer hover:border-gray-400 shadow-sm"
              >
                <option value="certificate">📜 Certificate</option>
                <option value="workshop">🎓 Workshop</option>
                <option value="club">🏆 Club Activity</option>
                <option value="other">📄 Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter document title"
                onChange={handleChange}
                value={formData.title}
                className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                  errors.title ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                onChange={handleChange}
                value={formData.date}
                className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                  errors.date ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
            </div>
          </div>

          {/* Conditional fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.type === "certificate" && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Issuer *</label>
                <input
                  type="text"
                  name="issuer"
                  placeholder="Certificate issuer"
                  onChange={handleChange}
                  value={formData.issuer}
                  className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                    errors.issuer ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.issuer && <p className="text-red-500 text-sm mt-2">{errors.issuer}</p>}
              </div>
            )}

            {formData.type === "workshop" && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer *</label>
                <input
                  type="text"
                  name="organizer"
                  placeholder="Workshop organizer"
                  onChange={handleChange}
                  value={formData.organizer}
                  className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                    errors.organizer ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.organizer && <p className="text-red-500 text-sm mt-2">{errors.organizer}</p>}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Describe your achievement or activity..."
              onChange={handleChange}
              value={formData.description}
              rows={4}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm hover:border-gray-400"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File *</label>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : errors.image
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-64 rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{formData.image?.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">Drop your file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, PDF (Max 10MB)</p>
                  </div>
                </div>
              )}
            </div>

            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
          </div>

          {/* Status */}
          {uploadStatus?.type === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-700 font-medium">{uploadStatus.message}</p>
            </div>
          )}

          {uploadStatus?.type === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-700 font-medium break-words">{uploadStatus.message}</p>
            </div>
          )}

          {ratioNotice && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
              {ratioNotice}
            </div>
          )}

          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                "Upload Document"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
