import React, { memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleActivity } from '../features/dashboardSlice'

const StatCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 min-w-0">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    {children}
  </div>
)

const ActivityItem = ({ activity, onToggle }) => (
  <label className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer">
    <input type="checkbox" checked={activity.done} onChange={() => onToggle(activity.id)} className="mt-1" />
    <div>
      <div className="font-medium">{activity.title}</div>
      <div className="text-sm text-slate-500">{activity.date}</div>
    </div>
  </label>
)

function DashboardInner() {
  const dispatch = useDispatch()
  const gpa = useSelector(s => s.dashboard.gpa)
  const semesters = useSelector(s => s.dashboard.semesters)
  const nextDeadline = useSelector(s => s.dashboard.nextDeadline)
  const activities = useSelector(s => s.dashboard.activities)
  const certifications = useSelector(s => s.dashboard.certifications)

  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Academic Performance">
          <div className="text-4xl font-bold">{gpa}</div>
          <div className="mt-3 text-sm text-slate-500 flex gap-3">
            {semesters.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-sm">Semester {i + 1}</div>
                <div className="font-medium">{s}</div>
              </div>
            ))}
          </div>
        </StatCard>

        <StatCard title="Activity Tracker">
          <div className="space-y-2">
            {activities.map((act) => (
              <ActivityItem
                key={act.id}
                activity={act}
                onToggle={(id) => dispatch(toggleActivity(id))}
              />
            ))}
          </div>
        </StatCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Next Deadline">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-md">📅</div>
            <div>
              <div className="font-medium">{nextDeadline.title}</div>
              <div className="text-sm text-slate-500">{nextDeadline.date}</div>
            </div>
          </div>
        </StatCard>

        <StatCard title="Certifications">
          <ul className="space-y-3">
            {certifications.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-slate-500">{c.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </StatCard>
      </div>
    </div>

    <aside className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold mb-3">Recent Activities</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          {activities.map((a) => (
            <li
              key={a.id}
              className={`flex items-center gap-3 ${a.done ? 'opacity-80' : ''}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  a.done ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              />
              <div>{a.title}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div>
            Courses <div className="font-medium">12</div>
          </div>
          <div>
            Credits <div className="font-medium">24</div>
          </div>
          <div>
            Clubs <div className="font-medium">3</div>
          </div>
          <div>
            Events <div className="font-medium">7</div>
          </div>
        </div>
      </div>
    </aside>
  </div>
);
}
export default memo(DashboardInner)