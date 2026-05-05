"use client";
import {
  AreaOptions,
  facilityAccessOptions,
  facilitySizeOptions,
  industryOptions,
  preferTimeOptions,
  scheduleOptions,
  serviceOptions,
  usingACleanerOptions,
} from "@/constant/booking/booking";
import { trackBookingSubmit } from "@/lib/gtm";
import { createFormData } from "@/utility/createFormData";
import { bookingYupSchema } from "@/yup/bookingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import InputBox from "../InputBox";
import RadioBox from "../RadioBox";
import SelectBox from "../SelectBox";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const router=useRouter()
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {termAndCondition:false},
    resolver: yupResolver(bookingYupSchema),
  });
  const isAgree=useWatch({
    control,
    name:"termAndCondition"
  })


  const onSubmit = async (values) => {
    const formData = createFormData(values);
    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data) {
        setLoading(false)
        trackBookingSubmit({
          service: values.services?.join(", "),
          industry: values.facilityType,
          facilitySize: values.facilitySize,
        });
        // toast.success("Booking request successfull!");
        router.push("/booking/thankyou")
        console.log(data);
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
      toast.error("Booking request failed!");
    }
  };
  return (
    <div className="shadow shadow-black/50 rounded-xl px-5 sm:px-13 py-10 sm:py-18 ">
      <div>
        <h4 className="heading-4">Commercial Cleaning Request</h4>
        <p className="font-medium mt-6 text-light-blue">
          Fill out the form below and our team will prepare a custom quote
          within 24 hours.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 sm:mt-16">
        <div>
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Contact Information
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <InputBox
              label="First Name"
              id="firstName"
              placeholder="John"
              required
              {...register("firstName")}
              error={errors?.firstName?.message}
            />
            <InputBox
              label="Last Name"
              id="lastName"
              placeholder="Smith"
              required
              {...register("lastName")}
              error={errors?.lastName?.message}
            />
            <InputBox
              label="Business Email"
              id="email"
              placeholder="john@company.com"
              required
              {...register("email")}
              error={errors?.email?.message}
            />
            <InputBox
              label="Phone Number"
              id="phoneNumber"
              placeholder="(212) 000-0000"
              required
              {...register("phone")}
              error={errors?.phone?.message}
            />
            <InputBox
              label="Company Name"
              id="companyName"
              placeholder="Acme Corp"
              required
              {...register("companyName")}
              error={errors?.companyName?.message}
            />
            <InputBox
              label="Your Job Title (Optional)"
              id="jobTitle"
              placeholder="Facilities Manager"
              {...register("jobTitle")}
              error={errors?.jobTitle?.message}
            />
          </div>
        </div>
        <div className="pt-10">
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Property Details
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <Controller
              name="facilityType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  label="Industry / Facility Type"
                  placeholder="Select Your Industry"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  required
                  options={industryOptions}
                  error={errors?.facilityType?.message}
                />
              )}
            />

            <Controller
              name="facilitySize"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  label="Facility Size (sq ft) "
                  id="facilitySize"
                  placeholder="Select Size"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={facilitySizeOptions}
                  error={errors?.facilitySize?.message}
                />
              )}
            />

            <InputBox
              min="0"
              type="number"
              label="Number of Floors"
              id="floors"
              placeholder="1"
              {...register("numberOfFloors")}
              error={errors?.numberOfFloors?.message}
            />
            {/* <Controller
              name="numberOfEmployees"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  label="Number of Employees "
                  id="employees"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  placeholder="Select Range"
                  options={employeesOptions}
                  error={errors?.numberOfEmployees?.message}
                />
              )}
            /> */}
          </div>
          <div className="pt-6">
            <InputBox
              label="Property Address"
              id="propertyAddress"
              placeholder="Main St, Manhattan, NY 10001"
              required
              {...register("propertyAddress")}
              error={errors?.propertyAddress?.message}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <Controller
              name="area"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  label="NYC Borough / Area"
                  id="borough"
                  placeholder="Select borough"
                  required
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={AreaOptions}
                  error={errors?.area?.message}
                />
              )}
            />

            <InputBox
              label="Zip Code"
              id="zipCode"
              placeholder="10001"
              required
              {...register("zipCode")}
              error={errors?.zipCode?.message}
            />
          </div>
        </div>
        <div className="mt-10">
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Services Needed
          </p>
          <p className="text-light-blue  mt-4 ml-1 lg:text-lg">
            Select all that apply:{" "}
            {errors?.services && (
              <span className="text-sm text-red">
                {errors?.services?.message}
              </span>
            )}
          </p>
          <Controller
            name="services"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceOptions.map((option, index) => {
                  const selected = field.value.includes(option);

                  return (
                    <RadioBox
                      key={index}
                      value={option}
                      checked={selected}
                      onChange={() => {
                        if (selected) {
                          field.onChange(
                            field.value.filter((item) => item !== option),
                          );
                        } else {
                          field.onChange([...field.value, option]);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          />
        </div>
        <div className="mt-10">
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Scheduling Preferences
          </p>
          <p className="text-light-blue  mt-4 ml-1 lg:text-lg">
            How often do you need cleaning?
          </p>
          {errors?.cleaningSchedule && (
            <p className="text-sm text-red mt-2 pl-1">
              {errors?.cleaningSchedule?.message}
            </p>
          )}
          <div className="pt-6 ">
            <Controller
              name="cleaningSchedule"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ul className="flex flex-wrap gap-4">
                  {scheduleOptions.map((option, index) => {
                    const active = field.value === option;

                    return (
                      <li
                        key={index}
                        onClick={() => field.onChange(option)}
                        className={`border border-red px-2.5 py-1.5 rounded-full cursor-pointer transition
              ${
                active
                  ? "bg-red-500 text-white"
                  : "hover:bg-red-500 hover:text-white"
              }`}
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>
              )}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <InputBox
              label="Preferred Start Date"
              type="date"
              id="preferredStartDate"
              placeholder="Select Date"
              required
              {...register("preferredStartDate")}
              error={errors?.preferredStartDate?.message}
            />
            <Controller
              name="preferredTime"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  label="Preferred Time"
                  placeholder="Select time"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={preferTimeOptions}
                  error={errors?.preferredTime?.message}
                />
              )}
            />
            <Controller
              name="facilityAccess"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Facility Access"
                  placeholder="How will crew access"
                  options={facilityAccessOptions}
                  error={errors?.facilityAccess?.message}
                />
              )}
            />
            <Controller
              name="currentlyUsingCleaner"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectBox
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Currently Using a Cleaner?"
                  placeholder="Select one"
                  options={usingACleanerOptions}
                  error={errors?.currentlyUsingCleaner?.message}
                />
              )}
            />
          </div>
        </div>
        <div className="mt-10">
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Additional Details
          </p>
          <p className="text-black  mt-4 ml-1 lg:text-lg">
            Special Requirements or Notes
          </p>
          <div className="pt-6 ">
            <textarea
              {...register("notes")}
              placeholder="e.g We have a server room that needs  special care..."
              className="w-full h-32 border border-light-blue rounded-[20px] pl-4 pr-2 pt-3 placeholder:text-light-blue font-inter focus:outline-none focus:border focus:border-red-500"
            ></textarea>
            {errors.notes && (
              <p className="text-sm text-red pl-1">{errors?.notes?.message}</p>
            )}
            <div className="mt-4 flex gap-2 items-center h-14  font-inter   cursor-pointer text-sm">
              <input
                {...register("termAndCondition")}
                type="checkbox"
                id="agree"
                className="size-4 border-red border rounded-full"
              />
              <label htmlFor="agree">
                I agree to be contacted by NYC Clean Team Regarding this
                booking. View our Privacy Policy
              </label>
            </div>
          </div>
          <button disabled={!isAgree} className="disabled:bg-slate/30 disabled:cursor-not-allowed bg-slate hover:bg-slate/80 transition-all duration-300 py-2 w-full block text-white rounded-md mt-4">
           {loading ? "Submitting..." : "Submit Booking Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
