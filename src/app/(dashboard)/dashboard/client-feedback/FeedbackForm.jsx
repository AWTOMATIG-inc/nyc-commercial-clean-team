"use client";
import Button from "@/components/Button";
import { feedbackYupSchema } from "@/yup/feedbackYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientName: "",
      date: "",
      rating: "0",
      feedback: "",
      image: null,
    },
    resolver: yupResolver(feedbackYupSchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("clientName", data.clientName);
    formData.append("feedbackDate", data.feedbackDate);
    formData.append("rating", data.rating);
    formData.append("feedback", data.feedback);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });
      const FeedbackData = await res.json();
      if (FeedbackData) {
        reset();
        toast.success("Feedback added successfully!");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.message);
    }
  };
  return (
    <div className="mt-14 md:w-[70%] mx-auto">
      <h1 className="font-bold text-3xl mb-6">NYC Customers Feedback</h1>
      <div className="custom-shadow border border-gray-300 px-8 py-10 rounded-lg">
        <h1 className="font-semibold text-2xl">Create Feedback</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" mt-6 space-y-5"
          action="#"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="" className="mb-1 block">Client Name:</label>
              <input
                type="text"
                className={`border  p-4 rounded-md w-full focus:outline-none ${
                  errors.clientName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: John Doe"
                {...register("clientName")}
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.clientName.message}
                </p>
              )}
            </div>
             <div>
              <label htmlFor="" className="mb-1 block">Client Profile:</label>
              <input
                type="file"
                className={`border  p-4 rounded-md accent-amber-50 w-full focus:outline-none ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
                {...register("image")}
                accept="image/jpg, image/jpeg, image/png"
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.image.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="" className="mb-1 block">Rating:</label>
              <select   {...register("rating")} className={`border  p-4 rounded-md w-full focus:outline-none ${
                  errors.clientName ? "border-red-500" : "border-gray-300"
                }`}>
                {Array.from({length:6}).map((_,index)=><option key={index} value={index}>{index}</option>)}                
              </select>
              
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.rating.message}
                </p>
              )}
            </div>
           <div>
              <label htmlFor="" className="mb-1 block">Feedback Date:</label>
              <input
                type="datetime-local"
                className={`border  p-4 rounded-md w-full focus:outline-none ${
                  errors.feedbackDate ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="feedback date"
                {...register("feedbackDate")}
              />
              {errors.feedbackDate && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.feedbackDate.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="mb-1 block">Feedback:</label>
            <textarea
              placeholder="Write something..."
              className={`border border-gray-300 w-full focus:outline-0 rounded-md p-3 min-h-24 focus:outline-none ${
                errors.feedback ? "border-red-500" : "border-gray-300"
              }`}
              {...register("feedback")}
            ></textarea>
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.feedback.message}
              </p>
            )}
          </div>
         <div className="w-fit ml-auto">
           <Button
            className="text-white !bg-blue-600"
            name={loading ? "submiting..." : "Submit"}
          />
         </div>
        </form>
      </div>
    </div>
  );
}
