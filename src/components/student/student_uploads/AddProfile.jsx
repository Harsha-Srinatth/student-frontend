import React, { useState, useRef, useEffect } from 'react';
import api from '../../../services/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AddProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // ✅ clear preview on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ✅ auto-redirect after success
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        navigate('/'); // change to your dashboard route
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const uploadProfile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setProfile(file);
    setError('');
    setUploadSuccess(false);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleProfileSubmit = async () => {
    if (!profile) {
      setError('Please select an image first');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append('studentprofilePhoto', profile);

      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await api.post('/student/upload-profile-img', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response || response.status < 200 || response.status >= 300) {
        const message = response?.data?.message || 'Failed to upload image. Please try again.';
        throw new Error(message);
      }

      setUploadSuccess(true);
      setProfile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadSuccess(false);
      const message =
        error?.response?.data?.message || error?.message || 'An unexpected error occurred. Please try again.';
      setError(message);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    navigate('/'); // change to your main dashboard route
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-3 md:p-4 lg:p-6 w-full">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Photo preview */}
          <div className="w-full md:w-1/2 bg-gray-50 p-8 md:p-10 lg:p-14 flex items-center justify-center">
            <div className="relative cursor-pointer group" onClick={handleProfileClick}>
              <div
                className={`w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full border-3 flex items-center justify-center overflow-hidden
                ${previewUrl ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300 border-dashed hover:border-blue-400 transition-colors'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <svg
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-500 font-medium">Click to select photo</p>
                    <p className="mt-2 text-sm sm:text-base text-gray-400">JPG, PNG or GIF (max. 2MB)</p>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-medium">
                  {previewUrl ? 'Change photo' : 'Upload photo'}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Profile Photo</h1>
              <p className="text-lg md:text-xl text-gray-600 mt-4">
                {previewUrl ? 'Update your profile picture' : 'Upload a profile picture for your account'}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              name="profilePhoto"
              onChange={uploadProfile}
              accept="image/*"
              className="hidden"
            />

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-md mb-4">
                <p className="text-red-700 font-medium text-base md:text-lg">{error}</p>
              </div>
            )}

            {/* Success message */}
            {uploadSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-md mb-4">
                <p className="text-green-700 font-medium text-base md:text-lg">Profile photo uploaded successfully! Redirecting...</p>
              </div>
            )}

            <div className="flex flex-col gap-4 mt-8 md:mt-12">
              <button
                onClick={handleProfileSubmit}
                disabled={!profile || isUploading}
                className={`w-full py-4 px-6 rounded-lg text-white text-lg md:text-xl font-medium transition-all transform
                  ${!profile || isUploading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
                  }`}
              >
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </button>

              {/* ✅ Skip button */}
              <button
                onClick={handleSkip}
                className="w-full py-4 px-6 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 text-lg md:text-xl font-medium transition-all"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProfile;