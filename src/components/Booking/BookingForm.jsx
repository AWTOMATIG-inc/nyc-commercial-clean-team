"use client";
import { AreaOptions, employeesOptions, facilityAccessOptions, facilitySizeOptions, industryOptions, preferTimeOptions, scheduleOptions, serviceOptions, usingACleanerOptions } from "@/constant/booking/booking";
import { useRef } from "react";
import InputBox from "../InputBox";
import RadioBox from "../RadioBox";
import SelectBox from "../SelectBox";

export default function BookingForm() {
  const scheduleOptionRef = useRef([]);
  return (
    <div className="shadow shadow-black/50 rounded-xl px-5 sm:px-13 py-10 sm:py-18 ">
      <div>
        <h4 className="heading-4">Commercial Cleaning Request</h4>
        <p className="font-medium mt-6 text-light-blue">
          Fill out the form below and our team will prepare a custom quote
          within 24 hours.
        </p>
      </div>
      <form action="#" className="mt-8 sm:mt-16">
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
            />
            <InputBox
              label="Last Name"
              id="lastName"
              placeholder="Smith"
              required
            />
            <InputBox
              label="Business Email"
              id="email"
              placeholder="john@company.com"
              required
            />
            <InputBox
              label="Phone Number"
              id="phoneNumber"
              placeholder="(212) 000-0000"
              required
            />
            <InputBox
              label="Company Name"
              id="companyName"
              placeholder="Acme Corp"
              required
            />
            <InputBox
              label="Your Job Title (Optional)"
              id="jobTitle"
              placeholder="Facilities Manager"
            />
          </div>
        </div>
        <div className="pt-10">
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Property Details
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <SelectBox
              label="Industry / Facility Type"
              placeholder="Select Your Industry"
              required
              options={industryOptions}
            />
            <SelectBox
              label="Facility Size (sq ft) "
              id="facilitySize"
              placeholder="Select Size"
              required
              options={facilitySizeOptions}
            />
            <InputBox
              min="0"
              type="number"
              label="Number of Employees"
              id="employees"
              placeholder="1"
              required
            />
            <SelectBox
              label="Number of Employees "
              id="employees"
              placeholder="Select Range"
              required
              options={employeesOptions}
            />
          </div>
          <div className="pt-6">
            <InputBox
              label="Property Address"
              id="propertyAddress"
              placeholder="Main St, Manhattan, NY 10001"
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <SelectBox
              label="NYC Borough / Area"
              id="borough"
              placeholder="Select borough"
              required
              options={AreaOptions}
            />
            <InputBox
              label="Zip Code"
              id="zipCode"
              placeholder="10001"
              required
            />
          </div>
        </div>
        <div className="mt-10">
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Services Needed
          </p>
          <p className="text-light-blue  mt-4 ml-1 lg:text-lg">
            Select all that apply:
          </p>
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2  gap-4">
            {serviceOptions.map((option, index) => (
              <RadioBox key={index} value={option} />
            ))}
          </div>
        </div>
        <div className="mt-10">
          <p className="border border-red-500 w-fit px-3 py-2 rounded-full font-semibold text-red-500">
            Scheduling Preferences
          </p>
          <p className="text-light-blue  mt-4 ml-1 lg:text-lg">
            How often do you need cleaning?
          </p>
          <div className="pt-6 ">
            <ul className="flex flex-wrap gap-4">
              {scheduleOptions.map((option, index) => (
                <li
                  ref={(el) => (scheduleOptionRef.current[index] = el)}
                  onClick={(e) => {
                    scheduleOptionRef.current.forEach((el, i) => {
                      if (i !== index) {
                        el.classList.remove("bg-red-500");
                        el.classList.remove("text-white");
                      }
                    });
                    e.target.classList.toggle("bg-red-500");
                    e.target.classList.toggle("text-white");
                  }}
                  key={index}
                  className="border border-red px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-red-500 hover:text-white"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <InputBox
              label="Preferred Start Date"
              type="date"
              id="preferredStartDate"
              placeholder="Select Date"
              required
            />
            <SelectBox
              label="Preferred Time"
              placeholder="Select time"
              options={preferTimeOptions}
            />
            <SelectBox
              label="Facility Access"
              placeholder="How will crew access"
              options={facilityAccessOptions}
            />
            <SelectBox
              label="Currently Using a Cleaner?"
              placeholder="Select one"
              options={usingACleanerOptions}
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
              placeholder="e.g We have a server room that needs  special care..."
              className="w-full h-32 border border-light-blue rounded-[20px] pl-4 pr-2 pt-3 placeholder:text-light-blue font-inter focus:outline-none focus:border focus:border-red-500"
            ></textarea>
            <div  className="mt-4 flex gap-2 items-center h-14  font-inter   cursor-pointer text-sm">
              <input
                type="checkbox"
                id="agree"
                className="size-4 border-red border rounded-full"
              />
              <label htmlFor="agree">
                I agree to be contacted by NYC Clean Team Regarding this booking.
                View our Privacy Policy
              </label>
            </div>
          </div>
          <button className="bg-slate hover:bg-slate/80 transition-all duration-300 py-2 w-full block text-white rounded-md mt-4">Submit Booking Request</button>
        </div>
      </form>
    </div>
  );
}
