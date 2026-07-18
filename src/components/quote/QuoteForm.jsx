"use client";
import { industryOptions } from "@/constant/booking/booking";
import { createFormData } from "@/utility/createFormData";
import { quoteYupSchema } from "@/yup/quoteYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputBox from "../InputBox";
import SelectBox from "../SelectBox";

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "janitorial-services",
    },
    resolver: yupResolver(quoteYupSchema),
  });

  const onSubmit = async (values) => {
    const formData = createFormData(values);
    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data) {
        toast.success("Quote request submitted successfully!");
        setLoading(false);
        reset();
        console.log(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Quote request failed!");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 ">
      <p className="text-xs border border-red font-medium w-fit px-5 py-1.5 rounded-full text-red">
        Get Your Free Quote
      </p>
      <h2 className="text-[22px] lg:text-4xl leading-[120%] font-medium mt-6 text-black">
        Request Pricing
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 text-black">
        <div className="space-y-4">
          <InputBox
            id="fullName"
            placeholder="Full Name"
            {...register("fullName")}
            error={errors?.fullName?.message}
          />

          <InputBox
            placeholder="Email Address"
            {...register("email")}
            error={errors?.email?.message}
          />
          <InputBox
            placeholder="Phone Number"
            {...register("phone")}
            error={errors?.phone?.message}
          />
          <div className="pt-0.5">
            <Controller
              name="facilityType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  placeholder="Select Facility Type"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={industryOptions}
                  error={errors?.facilityType?.message}
                />
              )}
            />
          </div>
          <InputBox
            placeholder="Zip"
            {...register("zipCode")}
            error={errors?.zipCode?.message}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#BC0001] hover:bg-red text-white font-bold py-4 px-4 rounded-full flex w-full justify-center items-center mt-6 text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Get My Free Quote</span>
          <Icon
            icon="line-md:arrow-right"
            width={20}
            height={20}
            className="ml-2"
          />
        </button>
        <p className="text-sm text-center mt-6 flex items-center justify-center gap-1 text-red font-medium">
          <Icon icon="mdi:star" width={16} height={16} className="inline " />
          <span className="ml-1">4.9 rated by 200+ NYC facility managers</span>
        </p>
      </form>
    </div>
  );
}
