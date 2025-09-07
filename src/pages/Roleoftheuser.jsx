// src/components/RoleOfTheUser.jsx
import { useState } from "react";
import RoleSelector from "./RoleSelector";
import StudentRegistration from "./StudentRegistration";
import FacultyRegistration from "./FacultyRegistration";

const RoleOfTheUser = () => {
  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full bg-white rounded-2xl shadow-lg p-6">
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
              <StudentRegistration />
            ) : (
              <FacultyRegistration />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleOfTheUser;
