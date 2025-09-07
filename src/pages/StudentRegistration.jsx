import { useState } from "react";
import api from "../services/api";


const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    studentid: "",
    fullname: "",
    username: "",
    institution: "",
    dept: "",
    email: "",
    mobileno: "",
    password: "",
    programName: "",
    semester: "",
    dateofjoin: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/register/student", formData);
      setResponseMessage({ type: "success", text: res.data.message });
      setFormData({
        studentid: "",
        fullname: "",
        username: "",
        institution: "",
        dept: "",
        email: "",
        mobileno: "",
        password: "",
        programName: "",
        semester: "",
        dateofjoin: "",
      });
    } catch (error) {
      setResponseMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Student Registration</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {["studentid","fullname","username","email","mobileno","dateofjoin","password","programName","semester","institution","dept"].map((field) => (
          <input
            key={field}
            type={field==="password" ? "password" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2 rounded focus:ring-2 focus:ring-green-400"
          />
        ))}
        
        <button
          type="submit"
          className="mt-2 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
      {responseMessage && (
        <p className={`mt-2 ${responseMessage.type==="success" ? "text-green-600":"text-red-600"}`}>
          {responseMessage.text}
        </p>
      )}
    </div>
  );
};

export default StudentRegistration;
