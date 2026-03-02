import React, { useState } from "react";
import api from "../../../services/api";

const TYPE_TO_ARRAY = {
  certificate: "certifications",
  workshop: "workshops",
  club: "clubsJoined",
  internship: "internships",
  project: "projects",
  other: "others",
};

const StudentDetailView = ({ student, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  // Points per approval card (keyed by achievementId); required when approving (0–50)
  const [pointsByAchievementId, setPointsByAchievementId] = useState({});

  const handleApproval = async (type, achievementId, action, points) => {
    try {
      setLoading(true);
      const payload = {
        action,
        message: message || undefined,
        type,
        achievementId,
      };
      if (action === "approve") {
        const pts = points != null && !Number.isNaN(Number(points)) ? Math.min(50, Math.max(0, Number(points))) : 0;
        payload.points = pts;
      }
      await api.post(`/faculty/approve/${student.studentid}`, payload);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        onBack();
      }, 2000);
    } catch (error) {
      console.error("Error updating approval:", error);
      alert(error.response?.data?.message || "Failed to update approval. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setPointsFor = (achievementId, value) => {
    setPointsByAchievementId((prev) => ({ ...prev, [achievementId]: value }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'certificate': return '📜';
      case 'workshop': return '🎓';
      case 'club': return '🏆';
      case 'internship': return '💼';
      case 'project': return '💡';
      default: return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'certificate': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'workshop': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'club': return 'bg-green-50 text-green-700 border-green-200';
      case 'internship': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'project': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSubmissionDetails = (approval) => {
    const idStr = approval.achievementId ? String(approval.achievementId) : null;
    if (!idStr) return null;
    const arrayName = TYPE_TO_ARRAY[approval.type];
    if (!arrayName || !student[arrayName]) return null;
    return student[arrayName].find((doc) => doc._id && String(doc._id) === idStr) || null;
  };

  if (showMessage) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval Updated!</h3>
          <p className="text-gray-600">The student has been notified of your decision.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Student Review</h2>
              <p className="text-gray-600 mt-1">Review submissions and make approval decisions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Student Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {student.fullname?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{student.fullname}</h3>
              <p className="text-gray-600">{student.studentid}</p>
              <p className="text-sm text-gray-500">{student.institution} • {student.dept} • {student.programName}</p>
              <p className="text-sm text-gray-500">Email: {student.email} • Mobile: {student.mobileno}</p>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Submissions</h3>
          
          {student.pendingApprovals?.map((approval, index) => {
            const submissionDetails = getSubmissionDetails(approval);
            const achievementId = approval.achievementId || approval._id;
            const pointsVal = pointsByAchievementId[achievementId] ?? "";
            return (
              <div key={achievementId || index} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(approval.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">{approval.type}</h4>
                      <p className="text-sm text-gray-600">{approval.description}</p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(approval.requestedOn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(approval.type)}`}>
                    {approval.type}
                  </span>
                </div>

                {/* Submission Details */}
                {submissionDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Submission Details:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {approval.type === 'certificate' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Issuer:</span>
                            <p className="text-gray-600">{submissionDetails.issuer}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Date Issued:</span>
                            <p className="text-gray-600">{new Date(submissionDetails.dateIssued).toLocaleDateString()}</p>
                          </div>
                        </>
                      )}
                      {approval.type === 'workshop' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Organizer:</span>
                            <p className="text-gray-600">{submissionDetails.organizer}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Date:</span>
                            <p className="text-gray-600">{new Date(submissionDetails.date).toLocaleDateString()}</p>
                          </div>
                        </>
                      )}
                      {approval.type === 'club' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Role:</span>
                            <p className="text-gray-600">{submissionDetails.role}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Joined On:</span>
                            <p className="text-gray-600">{new Date(submissionDetails.joinedOn).toLocaleDateString()}</p>
                          </div>
                        </>
                      )}
                      {approval.type === 'internship' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Organization:</span>
                            <p className="text-gray-600">{submissionDetails.organization}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Role:</span>
                            <p className="text-gray-600">{submissionDetails.role}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Start Date:</span>
                            <p className="text-gray-600">{new Date(submissionDetails.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">End Date:</span>
                            <p className="text-gray-600">{new Date(submissionDetails.endDate).toLocaleDateString()}</p>
                          </div>
                          {submissionDetails.description && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Description:</span>
                              <p className="text-gray-600">{submissionDetails.description}</p>
                            </div>
                          )}
                          {submissionDetails.recommendationUrl && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Recommendation Letter:</span>
                              <a href={submissionDetails.recommendationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Recommendation
                              </a>
                            </div>
                          )}
                        </>
                      )}
                      {approval.type === 'project' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">Title:</span>
                            <p className="text-gray-600">{submissionDetails.title}</p>
                          </div>
                          {submissionDetails.technologies && submissionDetails.technologies.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">Technologies:</span>
                              <p className="text-gray-600">{submissionDetails.technologies.join(', ')}</p>
                            </div>
                          )}
                          {submissionDetails.outcome && (
                            <div>
                              <span className="font-medium text-gray-700">Outcome:</span>
                              <p className="text-gray-600">{submissionDetails.outcome}</p>
                            </div>
                          )}
                          {submissionDetails.repoLink && (
                            <div>
                              <span className="font-medium text-gray-700">Repository:</span>
                              <a href={submissionDetails.repoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Repository
                              </a>
                            </div>
                          )}
                          {submissionDetails.demoLink && (
                            <div>
                              <span className="font-medium text-gray-700">Demo:</span>
                              <a href={submissionDetails.demoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Demo
                              </a>
                            </div>
                          )}
                          {submissionDetails.description && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Description:</span>
                              <p className="text-gray-600">{submissionDetails.description}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {(submissionDetails?.imageUrl || submissionDetails?.certificateUrl || approval?.imageUrl) && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Uploaded Document:</h5>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={submissionDetails?.imageUrl || submissionDetails?.certificateUrl || approval?.imageUrl}
                        alt={`${approval.type} document`}
                        className="max-w-full max-h-96 rounded-lg shadow-sm mx-auto block"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-center text-gray-500 py-8">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Document preview not available</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Actions */}
                <div className="flex flex-wrap items-end gap-4 pt-4 border-t border-gray-200">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add a message (optional):
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add feedback or comments for the student..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  {/* Points (0–50) to the left of Approve/Reject */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Points (0–50):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={pointsVal}
                      onChange={(e) => setPointsFor(achievementId, e.target.value)}
                      placeholder="0"
                      className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApproval(approval.type, achievementId, "reject", 0)}
                      disabled={loading}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApproval(approval.type, achievementId, "approve", pointsVal)}
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentDetailView;
