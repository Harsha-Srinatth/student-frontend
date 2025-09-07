import { useState } from "react";
import api from "../services/api";

export default function VerifyOtpForm({ mobile }) {
  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/otp/verify", { mobile, otp });
      alert(res.data.message);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-2 mt-4">
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Verify OTP
      </button>
    </form>
  );
}