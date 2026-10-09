import city from "@/assets/about/city.png";
import handWithSpay from "@/assets/about/hand-with-spay.png";
import Image from "next/image";
import CommonHeading from "../CommonHeading";
import {
  EcoIcon,
  QualityIcon,
  SupportIcon,
  TrackIcon,
  TrainTeamIcon,
  TrustIcon,
} from "../Icon";
const ourProcces = [
  {
    id: 1,
    icon: TrustIcon,
    title: "Trusted & Reliable",
    desc: "We keep our commitments and show up consistently, every scheduled visit.",
  },
  {
    id: 2,
    icon: QualityIcon,
    title: "Quality That Lasts",
    desc: "Our standards hold after week one — quality is built into the process.",
  },
  {
    id: 3,
    icon: EcoIcon,
    title: "Eco-Friendly ",
    desc: "We use safe, non-toxic products that protect your space and the environment.",
  },
  {
    id: 4,
    icon: TrainTeamIcon,
    title: "Trained Team",
    desc: "Every crew member is vetted, trained, and directly managed by our operations team.",
  },
  {
    id: 5,
    icon: TrackIcon,
    title: "Proven Track Record",
    desc: "Hundreds of successful commercial projects across NYC and a growing client base.",
  },
  {
    id: 6,
    icon: SupportIcon,
    title: "Responsive Support",
    desc: "We’re here when you need us — fast to respond and ready to resolve issues.",
  },
];
export default function WhyChooseUs() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div>
        <CommonHeading
          title="Why Choose Us ?"
          heading="What Sets Us Apart from Other NYC Cleaning Companies"
          subHeading="Commercial cleaning contracts are built on trust, reliability, and the ability to maintain a standard
over time — not just on the first visit. We understand the pace of New York City operations and
deliver consistent results without the inconsistency that comes with subcontracted, unmanaged
crews."
        />
      </div>

      <div className="mt-8 sm:mt-16">
        <div className="grid lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] gap-4">
          <div>
            <div className="relative lg:max-w-90 overflow-hidden">
              <Image
                src={city}
                alt="hand-with-spay"
                height={160}
                width={500}
                className="object-cover w-full lg:min-w-150 "
              />
              <div className="absolute top-1/2 -translate-y-1/2 md:top-0 md:translate-y-0">
                <Image
                  src={handWithSpay}
                  alt="hand-with-spay"
                  width={235}
                  height={235}
                  className="rounded-full h-auto w-35 md:w-56 object-cover"
                />
              </div>
            </div>
            <div className="mt-5 mb-10 lg:mb-0 text-center lg:text-left">
              <p className="text-red text-5xl md:text-6xl lg:text-[96px] font-medium mt-4">5000+</p>
              <p className="my-4">
                Installations and repairs completed successfully.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-6">
            {ourProcces.map((item, index) => (
              <div
                key={index}
                className="bg-[#F4F5F7] rounded-xl flex flex-col justify-center items-center text-center px-6 py-9 shadow shadow-black"
              >
                <item.icon />
                <h5 className="font-black text-2xl mt-5.5 mb-6">
                  {item.title}
                </h5>
                <p className="text-justify">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
