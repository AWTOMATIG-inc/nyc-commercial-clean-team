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
    desc: "We keep our commitments and deliver consistent, high-quality results—every time.",
  },
  {
    id: 2,
    icon: QualityIcon,
    title: "Quality That Lasts",
    desc: "We keep our commitments and deliver consistent, high-quality results—every time.",
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
    desc: "Our team is fully trained, vetted, and equipped to handle your facility with care.",
  },
  {
    id: 5,
    icon: TrackIcon,
    title: "Proven Track Record",
    desc: "Thousands of successful projects across NYC and a growing list of satisfied clients.",
  },
  {
    id: 6,
    icon: SupportIcon,
    title: "Responsive Support",
    desc: "We’re here when you need us—quick to respond and ready to solve any issue.",
  },
];
export default function WhyChooseUs() {
  return (
    <section className="container mt-16">
      <div>
        <CommonHeading
          title="Why Choose Us ?"
          heading="What Sets Us Apart from Other NYC Cleaning Companies"
          subHeading="Commercial cleaning contracts are built on trust, reliability, and the ability to maintain a standard over time — not just on the first visit."
        />
      </div>

      <div className=" mt-20">
        <div className="grid lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] gap-4">
          <div>
            <div className="relative">
              <Image
                src={city}
                alt="hand-with-spay"
                height={160}
                className="object-cover w-full"
              />
              <div className="absolute top-1/2 -translate-y-1/2">
                <Image
                  src={handWithSpay}
                  alt="hand-with-spay"
                  width={235}
                  height={235}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="lg:mt-20 mb-10 lg:mb-0">
              <h1 className="text-red heading-1 mt-4">5000+</h1>
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
                <h1 className="font-black text-2xl mt-5.5 mb-6">
                  {item.title}
                </h1>
                <p className="text-justify">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
