import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ label, options, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[13.5px] font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-lg appearance-none text-[14.5px] text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-emerald-500 hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/10'
            }
          `}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
          <ChevronDown className="w-[18px] h-[18px] text-slate-400" />
        </div>
      </div>
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
