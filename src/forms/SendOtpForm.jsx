import { useState } from "react";
import api from "../services/api";

export default function SendOtpForm({ onSent }) {
  const [mobile, setMobile] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await api.post("/otp/send", { mobile });
      alert("OTP generated (check backend console)");
      onSent(mobile);
    } catch (err) {
      alert("Failed to send OTP");
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