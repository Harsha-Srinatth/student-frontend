import { useState } from "react";
import { AlertCircle } from "lucide-react";

const FloatingInput = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  required, 
  error, 
  textarea, 
  rows, 
  className = "" 
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;
  const shouldFloat = focused || hasValue;

  const inputClasses = `
    w-full px-4 pt-6 pb-2 bg-white border-2 rounded-2xl transition-all duration-300 
    ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}
    focus:outline-none focus:ring-4 focus:ring-blue-500/10
    ${type === "date" ? "date-input" : ""}
    ${className}
  `;

  const labelClasses = `
    absolute left-4 transition-all duration-300 pointer-events-none
    ${shouldFloat 
      ? 'top-2 text-xs font-semibold text-blue-600' 
      : 'top-1/2 -translate-y-1/2 text-gray-500'
    }
    ${error && shouldFloat ? 'text-red-600' : ''}
  `;

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          className={inputClasses}
          placeholder={focused ? placeholder : ''}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={inputClasses}
          {...(type === "date"
                ? { placeholder: "" }
                : { placeholder: focused ? placeholder : "" })}
        />
      )}
      <label className={labelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingInput;

