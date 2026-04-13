import CleaningQuote from "@/components/services/CleaningQuote";
import { foundations } from "@/constant/service-area";
import Image from "next/image";
export default async function SurfaceDetails({params}) {
  const {slug}=await params
  const foundation=foundations.find(service=>service.slug===slug)
  return (
    <main>
      <section className="container min-h-screen mt-8 sm:mt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-8 sm:gap-14">
          <div>
            <p
            className={`font-semibold text-red border px-4.5 py-1 w-fit rounded-full`}
          >
            {foundation.title}
          </p>
          <h4 className="text-2xl sm:text-3xl lg:text-[32px] mt-8">{foundation.heading}</h4>
          <p className="text-base sm:text-lg mt-6 text-justify">{foundation.desc}</p>
          </div>
          <div>
            <Image src={foundation.image} alt="detail-image" width={576} height={576} className="h-144 rounded-[20px] object-cover"/>
          </div>
        </div>
      </section>
      <CleaningQuote/>
    </main>
  );
}
