import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSDashboardData, isDataStale } from "../features/studentDashSlice";
import { XCircle, Clock, User, MessageCircle, AlertCircle } from "lucide-react";

const RejectedApprovals = () => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();
  const { rejectedApprovals = [], loading, error, lastFetched } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    // Redux store is the cache - only fetch if data doesn't exist or is stale (>5 min)
    const hasData = rejectedApprovals.length > 0 || lastFetched;
    const isStale = isDataStale(lastFetched, 5);
    
    if (!hasData || isStale) {
      dispatch(fetchSDashboardData());
    }
  }, [dispatch, rejectedApprovals.length, lastFetched]);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4">Rejected Approvals</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center border-b pb-3 last:border-none animate-pulse">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4">Rejected Approvals</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 mb-2">Error loading rejected approvals</p>
          <button 
            onClick={() => dispatch(fetchSDashboardData())}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Rejected Approvals</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <XCircle className="w-4 h-4" />
          <span>{rejectedApprovals.length} rejected</span>
        </div>
      </div>

      {rejectedApprovals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rejected Approvals</h3>
          <p className="text-gray-600">All your submissions have been approved or are pending review.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {rejectedApprovals.map((item, idx) => (
            <li 
              key={idx} 
              className="p-4 border border-red-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all duration-200 cursor-pointer group bg-red-50/30"
              onClick={() => setSelected(item)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-red-100 rounded">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="font-medium text-gray-800 capitalize">
                      {item.type} - {item.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Rejected {getTimeAgo(item.reviewedOn || item.requestedOn)}</span>
                    </div>
                    {(item.reviewedByName || item.reviewedBy) && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>by {item.reviewedByName || item.reviewedBy}</span>
                      </div>
                    )}
                  </div>

                  {item.message && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <MessageCircle className="w-3 h-3" />
                      <span className="italic">"{item.message}"</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-sm rounded-xl font-medium bg-red-100 text-red-700 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Rejected
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideInRight">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Rejection Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Rejected Submission</span>
                </div>
                <p className="text-sm text-red-700 capitalize">{selected.type} - {selected.description}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900 capitalize">{selected.type}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selected.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Requested On</label>
                  <p className="text-gray-900">{new Date(selected.requestedOn).toLocaleString()}</p>
                </div>
                
                {selected.reviewedOn && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rejected On</label>
                    <p className="text-gray-900">{new Date(selected.reviewedOn).toLocaleString()}</p>
                  </div>
                )}
                
                {(selected.reviewedByName || selected.reviewedBy) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rejected By</label>
                    <p className="text-gray-900">{selected.reviewedByName || selected.reviewedBy}</p>
                  </div>
                )}
                
                {selected.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reason for Rejection</label>
                    <p className="text-gray-900 italic">"{selected.message}"</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RejectedApprovals;
