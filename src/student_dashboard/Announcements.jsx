import React from "react";

const announcements = [
  { title: "NAAC Audit", date: "Sept 15, 2025", detail: "Submit reports before deadline." },
  { title: "Hackathon Event", date: "Sept 20, 2025", detail: "Register via the portal." },
];

const Announcements = () => {
  return (
    <section className="flex flex-col gap-4 w-full bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Announcements</h3>
      <ul className="flex flex-col gap-3">
        {announcements.map((a, idx) => (
          <li key={idx} className="border-b pb-2 last:border-none">
            <p className="font-medium">{a.title}</p>
            <p className="text-sm text-gray-500">{a.date}</p>
            <p className="text-sm text-gray-600">{a.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Announcements;
