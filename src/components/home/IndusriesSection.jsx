import { industries } from "@/constant/home/industries";
import Image from "next/image";
import CommonHeading from "../CommonHeading";
import LinkWithArrow from "../LinkWithArrow";

export default function IndusriesSection() {
  return (
    <section className="container my-16">
      <div>
        <CommonHeading
          title="Industries"
          heading="Who we serve"
          subHeading="Specialized cleaning for every sector across the city."
        />
      </div>
      <div className="grid grid-cols-[1fr_1.2fr] gap-8 mt-8">
        {industries.slice(0, 1).map((blog) => (
          <div
            key={blog.id}
            className={`flex flex-col justify-end rounded-3xl group border border-[#03020326]`}
          >
            <div className="space-y-4 px-7 py-9 mb-59">
              <p className="font-semibold">{blog.title}</p>
              <h5 className="heading-5">{blog.heading}</h5>
              <p>{blog.desc}</p>
              <LinkWithArrow>learn more</LinkWithArrow>
            </div>

            <div className="mt-4.5">
              <Image
                src={blog.image}
                alt={blog.title}
                width={581}
                height={253}
                className={`rounded-3xl object-cover w-full max-h-63.25`}
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-8">
          {industries.slice(1, industries.length).map((blog) => (
            <div
              key={blog.id}
              className={`flex flex-col justify-between rounded-3xl group border border-[#03020326]`}
            >
              <div className="space-y-4 px-7 py-9">
                <p className="font-semibold">{blog.title}</p>
                <h5 className="heading-5">{blog.heading}</h5>
                <p>{blog.desc}</p>
                <LinkWithArrow>learn more</LinkWithArrow>
              </div>

              <div className="mt-4.5">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={304}
                  height={171}
                  className={`rounded-3xl object-cover w-full max-h-42.75`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
