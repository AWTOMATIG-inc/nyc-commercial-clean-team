"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export default function SelectBox({
  label,
  required,
  onChange,
  value,
  options = [],
  placeholder,
  error,
  className = "",
  ...rest
}) {
  const dropdownRef = useRef(null);
  const wrapperRef = useRef(null);
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    setSelected(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (dropdownRef.current) dropdownRef.current.classList.add("hidden");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`flex flex-col space-y-1.5 w-full relative ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          {label}
          {required && <span className="text-[#ed0505] pl-1">*</span>}
        </label>
      )}
      <div
        onClick={() => dropdownRef.current?.classList.toggle("hidden")}
        className={`w-full px-4 py-3 text-xs bg-white border ${
          error ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 font-medium transition-all cursor-pointer flex justify-between items-center shadow-2xs`}
      >
        <span className={selected ? "text-slate-900 font-bold" : "text-slate-400 font-medium"}>
          {selected || (placeholder ? placeholder : "Select an option")}
        </span>
        <Icon icon="lucide:chevron-down" className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
      </div>

      <ul
        ref={dropdownRef}
        className="absolute top-[calc(100%+6px)] left-0 bg-white border border-slate-300 rounded-xl shadow-xl w-full max-h-60 overflow-y-auto z-40 hidden py-1 text-xs text-slate-800 animate-in fade-in duration-150"
      >
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => {
              dropdownRef.current?.classList.add("hidden");
              setSelected(option);
              if (onChange) onChange(option);
            }}
            className={`px-4 py-2.5 hover:bg-slate-100 cursor-pointer font-medium transition-colors ${
              selected === option ? "bg-slate-100 font-bold text-[#1d2f64]" : ""
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
      {error && <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">{error}</p>}
    </div>
  );
}
