import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ label, type = 'text', error, className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[13.5px] font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-[14.5px] text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
            ${isPassword ? 'pr-11' : 'pr-3.5'}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-emerald-500 hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/10'
            }
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 inset-y-0 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-emerald-600"
          >
            {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
