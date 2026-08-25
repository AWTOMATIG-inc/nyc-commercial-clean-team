import React from "react";

export default function InputBox({ label, id, required, error, className = "", ...rest }) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          {label}
          {required && <span className="text-[#ed0505] pl-1">*</span>}
        </label>
      )}
      <input
        type="text"
        id={id}
        name={id}
        className={`w-full px-4 py-3 text-xs bg-white border ${
          error ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-2xs ${className}`}
        {...rest}
      />
      {error && <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">{error}</p>}
    </div>
  );
}
