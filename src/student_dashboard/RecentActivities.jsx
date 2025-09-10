import React from "react";

const activities = [
  { title: "AI Workshop", status: "Approved", date: "Sept 1, 2025" },
  { title: "Hackathon Participation", status: "Pending", date: "Sept 5, 2025" },
  { title: "Community Volunteering", status: "Approved", date: "Aug 28, 2025" },
];

const RecentActivities = () => {
  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <ul className="flex flex-col gap-3">
        {activities.map((a, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-sm text-gray-500">{a.date}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-xl ${
                a.status === "Approved"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {a.status}
            </span>
            
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentActivities;
