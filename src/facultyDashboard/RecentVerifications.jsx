import React from "react";

const verifications = [
  { student: "Karthik R", activity: "AI Workshop", status: "Approved", date: "Sept 1, 2025" },
  { student: "Sonal Jain", activity: "Internship Report", status: "Rejected", date: "Aug 30, 2025" },
];

const RecentVerifications = () => {
  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Verifications</h3>
      <ul className="flex flex-col gap-3">
        {verifications.map((v, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >
            <div>
              <p className="font-medium">{v.activity}</p>
              <p className="text-sm text-gray-500">By {v.student}</p>
              <p className="text-xs text-gray-400">{v.date}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-xl ${
                v.status === "Approved"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {v.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentVerifications;
