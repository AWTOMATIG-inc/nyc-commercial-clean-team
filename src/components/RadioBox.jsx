"use client";

import { useState } from "react";

export default function RadioBox({ value,onChange, ...rest }) {
  const [selected, setSelected] = useState(false);
  return (
    <div
      onClick={() => {
        {
          setSelected((prev) => !prev);
          onChange(value);
        }
      }}
      className={`mt-4 flex gap-2 items-center h-14 border border-light-blue rounded-[20px] pl-4 pr-2  font-inter  hover:border-red-500 ${selected ? "border-red/50 bg-red/10" : ""} cursor-pointer`}
    >
      <span
        className={`size-4 border-red border rounded-full ${selected ? "bg-red" : ""}`}
      ></span>
      <p>{value}</p>
    </div>
  );
}
