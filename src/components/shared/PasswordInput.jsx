import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Reusable password input with show/hide toggle.
 * Drop-in replacement for <input type="password" ... />
 * Accepts all standard input props.
 */
const PasswordInput = ({ className = "", ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={className}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;

