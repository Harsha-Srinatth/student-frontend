import React from 'react';
import { X, Bell, Calendar, Users, Tag, AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

const PRIORITY_STYLES = {
  high:   'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low:    'bg-green-100 text-green-700 border-green-200',
  urgent: 'bg-red-200 text-red-800 border-red-300',
};

const TYPE_ICONS = {
  general:  Info,
  academic: Bell,
  event:    Calendar,
  urgent:   AlertTriangle,
  warning:  AlertCircle,
  success:  CheckCircle2,
};

const AnnouncementDetailView = ({ announcement, onClose }) => {
  if (!announcement) return null;

  const PriorityIcon = TYPE_ICONS[announcement.type] ?? Bell;
  const priorityCls = PRIORITY_STYLES[announcement.priority] ?? PRIORITY_STYLES.low;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <PriorityIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-100 uppercase tracking-wider font-medium">Announcement</p>
              <h2 className="text-lg font-bold leading-tight">{announcement.title}</h2>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {announcement.priority && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityCls}`}>
              <Tag className="w-3 h-3" />
              {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
            </span>
          )}

          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {announcement.content || announcement.message || announcement.description || 'No content available.'}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500">
            {announcement.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(announcement.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
            {announcement.targetAudience && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {announcement.targetAudience}
              </span>
            )}
            {announcement.author && (
              <span className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                {announcement.author}
              </span>
            )}
          </div>
        </div>

        {onClose && (
          <div className="px-6 pb-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementDetailView;
