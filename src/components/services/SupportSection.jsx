"use client";
import { supports } from "@/constant/services/support";
import CommonHeading from "../CommonHeading";
import ServicesBlogCard from "../ServicesBlogCard";

export default function SupportSection() {
  return (
    <section className="container mt-20">
      <CommonHeading
        center={true}
        title="Support"
        heading="Beyond cleaning alone"
        subHeading="Additional facility support services that keep your commercial property running smoothly. "
      />
      <div className="mt-21 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {supports.map((item) => (
          <ServicesBlogCard view={"row"} key={item.id} blog={item} />
        ))}
      </div>
    </section>
  );
}
