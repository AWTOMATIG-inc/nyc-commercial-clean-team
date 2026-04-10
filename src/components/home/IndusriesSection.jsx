import { industries } from "@/constant/home/industries";
import Image from "next/image";
import CommonHeading from "../CommonHeading";
import LinkWithArrow from "../LinkWithArrow";

export default function IndusriesSection() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div>
        <CommonHeading
          title="Industries"
          heading="Who we serve"
          subHeading="Specialized commercial cleaning for every sector across New York City."
        />
      </div>
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 mt-8">
        {industries.slice(0, 1).map((blog) => (
          <div
            key={blog.id}
            className={`flex flex-col justify-end rounded-3xl group border border-[#03020326]`}
          >
            <div className="space-y-4 px-7 py-9 md:mb-59">
              <p className="font-semibold">{blog.title}</p>
              <h5 className="heading-5">{blog.heading}</h5>
              <p>{blog.desc}</p>

              <LinkWithArrow href={`/industries/${blog.slug}`}>
                learn more
              </LinkWithArrow>
            </div>

            <div className="mt-4.5 overflow-hidden rounded-[20px]">
              <Image
                src={blog.image}
                alt={blog.title}
                width={581}
                height={253}
                className={`object-cover w-full h-full max-h-100.25 hover:scale-110 transition-transform duration-300`}
              />
            </div>
          </div>
        ))}
        <div className="grid sm:grid-cols-2 gap-8">
          {industries.slice(1, industries.length).map((industy) => (
            <div
              key={industy.id}
              className={`flex flex-col justify-between rounded-3xl group border border-[#03020326]`}
            >
              <div className="space-y-4 px-7 py-9">
                <p className="font-semibold">{industy.title}</p>
                <h5 className="heading-5">{industy.heading}</h5>
                <p>{industy.desc}</p>

                <LinkWithArrow href={`/industries/${industy.slug}`}>
                  learn more
                </LinkWithArrow>
              </div>

              <div className="mt-4.5 overflow-hidden rounded-[20px]">
                <Image
                  src={industy.image}
                  alt={industy.title}
                  width={304}
                  height={171}
                  className={`rounded-3xl object-cover w-full h-42.75 hover:scale-110 transition-transform duration-300`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
