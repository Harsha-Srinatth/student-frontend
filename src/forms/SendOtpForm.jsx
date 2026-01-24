import { useState } from "react";
import api from "../services/api";

export default function SendOtpForm({ onSent }) {
  const [mobile, setMobile] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/otp/send", { mobile });
      if (res.data.success) {
        alert(res.data.message || "OTP sent successfully");
        onSent(mobile);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send OTP";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-2">
      <input
        type="text"
        placeholder="Enter mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Send OTP
        
      </button>
    </form>
  );
}