import CleaningQuote from "@/components/services/CleaningQuote";
import { recurrings } from "@/constant/services/recurring";
import Image from "next/image";
export default async function RecuringDetails({params}) {
  const {slug}=await params
  const recurring=recurrings.find(service=>service.slug===slug)
  return (
    <main>
      <section className="container  mt-8 sm:mt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-8 sm:gap-14">
          <div>
            <p
            className={`font-semibold text-red border px-4.5 py-1 w-fit rounded-full`}
          >
            {recurring.title}
          </p>
          <h4 className="text-2xl sm:text-3xl lg:text-[32px] mt-8">{recurring.heading}</h4>
          <p className="text-base sm:text-lg mt-6">{recurring.desc}</p>
          </div>
          <div>
            <Image src={recurring.image} alt="detail-image" width={576} height={576} className="h-144 rounded-[20px] object-cover"/>
          </div>
        </div>
      </section>
      <CleaningQuote/>
    </main>
  );
}
