import { careServices } from "@/constant/quotes/quoteServices";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function ProfessionalCareServices() {
  return (
    <section className="container my-10 md:my-14 lg:my-20">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-slate text-2xl md:text-2xl lg:text-4xl font-bold">
          Professional Care and Services
        </h2>
        <p className="mt-4 text-light-blue max-w-2xl mx-auto">
          Advancing Cleaning & Outsourced Staff Service through Skilled
          Management. Cleaning Driving And Security Service
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {careServices.map((item) => (
          <div
            key={item.id}
            className="p-8 rounded-xl border border-light-blue/30 bg-white shadow-sm flex flex-col gap-4"
          >
            <Icon
              icon={item.icon}
              width={40}
              height={40}
              className="text-slate"
            />
            <h3 className="text-xl font-bold text-slate">{item.title}</h3>
            <p className="text-sm flex-1 text-light-blue">
              {item.description}
            </p>
            <Link
              href="/contact"
              className="mt-auto w-max px-6 py-2 rounded-full text-sm font-bold border border-slate text-slate transition-colors duration-300 hover:bg-slate hover:text-white"
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
