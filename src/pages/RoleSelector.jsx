// src/components/RoleSelector.jsx
const RoleSelector = ({ onSelectRole }) => {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Select Your Role
        </h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelectRole("student")}
            className="py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Student
          </button>
          <button
            onClick={() => onSelectRole("faculty")}
            className="py-2 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Faculty
          </button>
        </div>
      </div>
    );
  };
  
  export default RoleSelector;
  