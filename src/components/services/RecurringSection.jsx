"use client";
import { recurrings } from "@/constant/services/recurring";
import CommonHeading from "../CommonHeading";
import ServicesBlogCard from "../ServicesBlogCard";

export default function RecurringSection() {
  return (
    <section className="container mt-20">
      <CommonHeading
        center={true}
        title="Recurring"
        heading="Daily cleaning that works"
        subHeading="Consistent janitorial coverage keeps your space ready"
      />

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
        {recurrings.map((item, id) => (
          <ServicesBlogCard key={item.id} blog={item} />
        ))}
      </div>
    </section>
  );
}
