import React from "react";

const announcements = [
  { 
    title: "Faculty Meeting", 
    date: "Sept 15, 2025", 
    detail: "Monthly faculty meeting scheduled for next week. Please prepare your reports.",
    type: "meeting",
    priority: "high"
  },
  { 
    title: "Student Evaluation Deadline", 
    date: "Sept 20, 2025", 
    detail: "Submit student evaluation reports before the deadline.",
    type: "deadline",
    priority: "high"
  },
  { 
    title: "New Academic Policies", 
    date: "Sept 10, 2025", 
    detail: "Updated academic policies have been published. Please review the changes.",
    type: "policy",
    priority: "medium"
  },
  { 
    title: "Professional Development Workshop", 
    date: "Sept 25, 2025", 
    detail: "Attend the upcoming workshop on modern teaching methodologies.",
    type: "workshop",
    priority: "low"
  },
];

const FacultyAnnouncements = () => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return '📅';
      case 'deadline': return '⏰';
      case 'policy': return '📋';
      case 'workshop': return '🎓';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-white w-full rounded-2xl shadow-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
            <p className="text-gray-600 mt-1">Stay updated with important faculty information</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {announcements.length} announcements
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zm0-4h6v-2H4v2zm0-4h6V9H4v2zm0-4h6V5H4v2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-600">No announcements at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${getPriorityColor(announcement.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getTypeIcon(announcement.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {announcement.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        announcement.priority === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : announcement.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.detail}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{announcement.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="capitalize">{announcement.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAnnouncements;
