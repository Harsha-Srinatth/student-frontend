import React from "react";

const pending = [
  { student: "Ananya Sharma", activity: "Hackathon Participation", date: "Sept 5, 2025" },
  { student: "Ravi Patel", activity: "AWS Certification", date: "Sept 7, 2025" },
  { student: "Meera Nair", activity: "Community Service", date: "Sept 8, 2025" },
];

const PendingApprovals = () => {
  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
      <ul className="flex flex-col gap-3">
        {pending.map((p, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >
            <div>
              <p className="font-medium">{p.activity}</p>
              <p className="text-sm text-gray-500">By {p.student}</p>
              <p className="text-xs text-gray-400">{p.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-100 text-green-600 rounded-xl text-sm hover:bg-green-200 transition">
                Approve
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-600 rounded-xl text-sm hover:bg-red-200 transition">
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PendingApprovals;
