import CleaningQuote from "@/components/services/CleaningQuote";
import { details } from "@/constant/services";
import { speciality } from "@/constant/services/specialty";
import Image from "next/image";
export default async function SpecialtyDetails({ params }) {
  const { slug } = await params;
  const specialty = speciality.find((service) => service.slug === slug);
  const detail = details.find((service) => service.slug === slug);
  return (
    <main>
      <section className="container  mt-8 sm:mt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-8 sm:gap-14">
          <div>
            <p
              className={`font-semibold text-red border px-4.5 py-1 w-fit rounded-full`}
            >
              {specialty.title}
            </p>
            <h4 className="text-2xl sm:text-3xl lg:text-[32px] mt-8">
              {detail.heading}
            </h4>
            <p className="text-base sm:text-lg mt-6 text-justify">{detail.desc}</p>
            <div className="mt-8">
              <h3 className="font-bold text-lg">
                {detail.serviceIncludes.heading}
              </h3>
              <p className="mt-4 font-medium">
                {detail.serviceIncludes.listHeading}
              </p>
              <ul className="mt-2 list-disc ml-6">
                {detail.serviceIncludes.list.map((item, id) => (
                  <li key={id}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-justify">{detail.serviceIncludes.desc}</p>
            </div>
          </div>
          <div className="md:mt-17">
            <Image
              src={specialty.image}
              alt="detail-image"
              width={576}
              height={576}
              className="h-144 rounded-[20px] object-cover"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
          <div >
            <h3 className="font-bold text-lg">
              {detail.WhoThisService.heading}
            </h3>
            <p className="mt-4 text-justify">{detail.WhoThisService.desc}</p>
          </div>
          <div >
            <h3 className="font-bold text-lg">
              {detail.whyThisService.heading}
            </h3>
            <p className="mt-4 text-justify">{detail.whyThisService.desc}</p>
          </div>
          <div >
            <h3 className="font-bold text-lg">{detail.whyChoose.heading}</h3>
            <p className="mt-4 text-justify">{detail.whyChoose.desc}</p>
          </div>
        </div>
      </section>
      <CleaningQuote />
    </main>
  );
}
