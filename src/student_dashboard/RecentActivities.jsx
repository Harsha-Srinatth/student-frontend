import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSDashboardData } from "../features/studentDashSlice";

const RecentActivities = () => {
  const dispatch = useDispatch();
  const { pendingApprovals = [], loading, error } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <ul className="flex flex-col gap-3">
        {pendingApprovals.map((a, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >
            <div>
              <p className="font-medium">{a.type || "Activity"}</p>
              <p className="text-sm text-gray-500">
                {new Date(a.requestedOn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-xl ${
                a.status === "approved"
                  ? "bg-green-100 text-green-600"
                  : a.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentActivities;
