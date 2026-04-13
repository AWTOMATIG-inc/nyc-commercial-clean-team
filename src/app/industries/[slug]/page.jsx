import CleaningQuote from "@/components/services/CleaningQuote";
import { details, industries } from "@/constant/home/industries";
import Image from "next/image";
export default async function IndustriesDetails({params}) {
  const {slug}=await params
  const item=industries.find(service=>service.slug===slug)
  const detail = details.find((service) => service.slug === slug);
  return (
    <main>
      <section className="container  mt-8 sm:mt-16">
             <div className="grid md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-8 sm:gap-14">
               <div>
                 <p
                   className={`font-semibold text-red border px-4.5 py-1 w-fit rounded-full`}
                 >
                   {item.title}
                 </p>
                 <h4 className="text-2xl sm:text-3xl lg:text-[32px] mt-8">
                   {detail.heading}
                 </h4>
                 <p className="text-base sm:text-lg mt-6 text-justify">{detail.desc}</p>
                 <div className="mt-8">
                   <h3 className="font-bold text-lg">
                     {detail.challenges.heading}
                   </h3>
                   
                   <ul className="mt-2 list-disc ml-6">
                     {detail.challenges.list.map((item, id) => (
                       <li key={id}>{item}</li>
                     ))}
                   </ul>
                 </div>
               </div>
               <div className="md:mt-17">
                 <Image
                   src={item.image}
                   alt="detail-image"
                   width={576}
                   height={576}
                   className="h-144 rounded-[20px] object-cover"
                 />
               </div>
             </div>
             <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
              <div>
                   <h3 className="font-bold text-lg">
                     {detail.environments.heading}
                   </h3>
                   
                   <ul className="mt-2 list-disc ml-6 text-justify">
                     {detail.environments.list.map((item, id) => (
                       <li key={id}>{item}</li>
                     ))}
                   </ul>
                 </div>
               <div>
                 <h3 className="font-bold text-lg">
                   {detail.whyThisMatters.heading}
                 </h3>
                 <p className="mt-4 text-justify">{detail.whyThisMatters.desc}</p>
               </div>
               <div>
                 <h3 className="font-bold text-lg">{detail.whyChoose.heading}</h3>
                 <p className="mt-4 text-justify">{detail.whyChoose.desc}</p>
               </div>
             </div>
           </section>
      <CleaningQuote/>
    </main>
  );
}
