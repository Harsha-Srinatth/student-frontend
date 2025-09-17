import React from "react";

const PendingApprovalsList = ({
  items = [],
  loading = false,
  error = null,
  onRetry,
  onItemClick,
  variant = 'summary',
  limit = 10,
}) => {
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

  const list = variant === 'summary' ? items.slice(0, limit) : items;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading pending approvals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 animate-fadeIn">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
            <p className="text-gray-600 mt-1">Review and approve student submissions</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {items.length} pending
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {list.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending approvals at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((student, index) => (
              <div
                key={student.studentid || index}
                onClick={() => onItemClick && onItemClick(student)}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group animate-slideInRight"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.fullname?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {student.fullname}
                      </h3>
                      <p className="text-sm text-gray-600">{student.studentid}</p>
                      <p className="text-xs text-gray-500">{student.institution} • {student.dept}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {student.pendingApprovals?.map((approval, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(approval.type)}`}
                          >
                            {approval.imageUrl && (
                              <span className="w-4 h-4 mr-1 rounded overflow-hidden bg-gray-100 border border-gray-200 hidden sm:inline-block">
                                <img
                                  src={approval.imageUrl}
                                  alt={approval.type}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </span>
                            )}
                            <span className="mr-1">{getTypeIcon(approval.type)}</span>
                            {approval.type}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {student.pendingApprovals?.length || 0} submission{student.pendingApprovals?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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

export default PendingApprovalsList;


