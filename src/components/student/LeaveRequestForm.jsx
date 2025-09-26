import React, { useState } from 'react';
import { Calendar, Clock, FileText, AlertCircle, Send, X } from 'lucide-react';

const LeaveRequestForm = ({ onSubmit, onCancel, studentInfo }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    priority: 'medium',
    missedSubjects: [],
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    alternateAssessmentRequired: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leaveTypes = [
    { value: 'medical', label: 'Medical Leave', icon: '🏥' },
    { value: 'personal', label: 'Personal Leave', icon: '👤' },
    { value: 'emergency', label: 'Emergency Leave', icon: '🚨' },
    { value: 'family', label: 'Family Emergency', icon: '👨‍👩‍👧‍👦' },
    { value: 'academic', label: 'Academic Purpose', icon: '🎓' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-50' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-50' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.leaveType === 'emergency') {
      if (!formData.emergencyContact.name.trim()) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
      }
      if (!formData.emergencyContact.phone.trim()) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
    setIsSubmitting(true);
  
    try {
      const leaveRequest = {
        ...formData, // leaveType, startDate, endDate, reason, priority, etc.
      };
  
      await onSubmit(leaveRequest);
    } catch (error) {
      console.error('Error submitting leave request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Submit Leave Request</h2>
              <p className="text-sm text-gray-600 mt-1">Fill out the form below to request leave</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Leave Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {leaveTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                    formData.leaveType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="leaveType"
                    value={type.value}
                    checked={formData.leaveType === type.value}
                    onChange={(e) => handleInputChange('leaveType', e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
            {errors.leaveType && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.leaveType}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                  errors.startDate ? 'border-red-500' : 'border-gray-200'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                  errors.endDate ? 'border-red-500' : 'border-gray-200'
                }`}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Days Calculation */}
          {formData.startDate && formData.endDate && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center text-blue-800">
                <Clock size={20} className="mr-2" />
                <span className="font-semibold">
                  Total Leave Days: {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {priorityLevels.map((priority) => (
                <label
                  key={priority.value}
                  className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                    formData.priority === priority.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="sr-only"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.color}`}>
                    {priority.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Emergency Contact (if emergency leave) */}
          {formData.leaveType === 'emergency' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-red-800 mb-3">Emergency Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact', {
                      ...formData.emergencyContact,
                      name: e.target.value
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 ${
                      errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Full name"
                  />
                  {errors.emergencyContactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact', {
                      ...formData.emergencyContact,
                      phone: e.target.value
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 ${
                      errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact.relation}
                  onChange={(e) => handleInputChange('emergencyContact', {
                    ...formData.emergencyContact,
                    relation: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500"
                  placeholder="e.g., Parent, Guardian, Spouse"
                />
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Reason for Leave *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none ${
                errors.reason ? 'border-red-500' : 'border-gray-200'
              }`}
              rows={4}
              maxLength={500}
              placeholder="Please provide a detailed reason for your leave request..."
            />
            <div className="flex justify-between items-center mt-2">
              {errors.reason && (
                <p className="text-red-500 text-sm">{errors.reason}</p>
              )}
              <p className="text-gray-500 text-sm ml-auto">
                {formData.reason.length}/500 characters
              </p>
            </div>
          </div>

          {/* Alternative Assessment */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="alternateAssessment"
              checked={formData.alternateAssessmentRequired}
              onChange={(e) => handleInputChange('alternateAssessmentRequired', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="alternateAssessment" className="text-sm text-gray-700">
              I will require alternate assessment arrangements for missed classes/exams
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;