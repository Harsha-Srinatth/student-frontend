import { useState } from "react";
import SendOtpForm from "./SendOtpForm";
import VerifyOtpForm from "./VerifyOtpForm";

export default function OtpPage() {
  const [mobile, setMobile] = useState("");

  return (
    <div className="max-w-sm mx-auto p-4">
      {!mobile ? (
        <SendOtpForm onSent={setMobile} />
      ) : (
        <VerifyOtpForm mobile={mobile} />
      )}
    </div>
  );
}