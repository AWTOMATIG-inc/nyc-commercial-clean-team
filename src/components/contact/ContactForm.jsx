"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", phone: "", message: "" });
  };

  return (
    <div>
      <h2 className="heading-4 mb-8">Feel free to write</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
          />
        </div>

        {/* Row 2: Subject & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="subject"
            placeholder="Enter Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Enter Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
          />
        </div>

        {/* Row 3: Message */}
        <textarea
          name="message"
          placeholder="Enter Message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all resize-none h-30 md:h-40"
        />

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-red hover:bg-[#1D2F64] text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            Send Message
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-8 py-3 bg-red hover:bg-[#1D2F64] text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}