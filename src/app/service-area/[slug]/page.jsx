import ProfessionalCareServices from "@/components/quote/ProfessionalCareServices";
import QuoteForm from "@/components/quote/QuoteForm";
import { boroughs } from "@/constant/service-area";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return boroughs.map((borough) => ({ slug: borough.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const borough = boroughs.find((item) => item.slug === slug);
  if (!borough) return {};
  return {
    title: `Commercial Cleaning in ${borough.title} - New York Commercial Clean Team INC`,
    description: borough.desc,
  };
}

export default async function ServiceAreaLocation({ params }) {
  const { slug } = await params;
  const borough = boroughs.find((item) => item.slug === slug);
  if (!borough) {
    notFound();
  }

  return (
    <main>
      <section
        style={{
          backgroundImage: `linear-gradient(
      to right,
      rgba(29, 47, 100, 0.9),
      rgba(29, 47, 100, 0.4)
    ),
    url('${borough.heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="relative mt-6 w-full overflow-hidden"
      >
        <div className="relative z-10 container py-12 sm:py-20 grid lg:grid-cols-2 items-center gap-10 lg:gap-16 text-white">
          <div>
            <p className="text-sm border border-white font-medium w-fit px-5 py-1.5 rounded-full">
              {borough.title}
            </p>
            <h1 className="text-[28px] sm:text-4xl lg:text-5xl leading-[120%] font-medium my-6">
              Commercial Cleaning
              <br />
              in {borough.title}
            </h1>
            <p className="text-base md:text-lg max-w-2xl">{borough.desc}</p>
          </div>
          <div>
            <QuoteForm pageName={`service-area-${borough.slug}`} />
          </div>
        </div>
      </section>

      <ProfessionalCareServices />
    </main>
  );
}
