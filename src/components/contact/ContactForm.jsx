"use client";

import { contactYupSchema } from "@/yup/contactYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactYupSchema),
  });
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    console.log(data)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        reset();
        setLoading(false);
        toast.success("Email sent successfully");
        reset();
      } else {
        setLoading(false);
        const errorText = await response.text();
        toast.error(`Failed to send email: ${errorText}`);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="heading-4 mb-8">Feel free to write</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <input
              type="text"
              placeholder="Enter Name"
              {...register("name")}
              className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
            />
            {errors.name && (
              <p className="text-sm text-red-500 pl-1 mt-1">
                {errors.name?.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter Email"
              {...register("email")}
              className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
            />
            {errors.email && (
              <p className="text-sm text-red-500 pl-1 mt-1">
                {errors.email?.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Subject & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <input
              type="text"
              placeholder="Enter Subject"
              {...register("subject")}
              className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
            />
            {errors.subject && (
              <p className="text-sm text-red-500 pl-1 mt-1">
                {errors.subject?.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Enter Phone"
              {...register("phone")}
              className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all h-14 md:h-20"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 pl-1 mt-1">
                {errors.phone?.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Message */}
        <div>
          <textarea
            placeholder="Enter Message"
            rows={5}
            {...register("message")}
            className="w-full px-5 py-3.5 bg-[#DDE1E6] rounded-lg text-sm md:text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red/30 transition-all resize-none h-30 md:h-40"
          />
          {errors.message && (
            <p className="text-sm text-red-500 pl-1 mt-1">
              {errors.message?.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-red hover:bg-[#1D2F64] text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
          >{loading ? "Sending..." : "Send Message"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-8 py-3 bg-red hover:bg-[#1D2F64] text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
