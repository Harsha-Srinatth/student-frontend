// src/components/RoleOfTheUser.jsx
import { useState } from "react";
import RoleSelector from "./RoleSelector";
import StudentLogin from "./StudentLogin";
import FacultyLogin from "./FacultyLogin";

const Roleforlogin = () => {
  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
      <div className="w-full bg-blue-500 rounded-2xl shadow-lg p-3 ">
        {!role ? (
          <RoleSelector onSelectRole={setRole} />
        ) : (
          <div>
            <button
              onClick={() => setRole("")}
              className="text-gray-500 underline mb-4"
            >
              ← Back
            </button>
            {role === "student" ? (
              <StudentLogin />
            ) : (
              <FacultyLogin />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roleforlogin;
