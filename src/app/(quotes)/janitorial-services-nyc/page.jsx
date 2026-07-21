import ButtonSolid from "@/components/ButtonSolid";
import Counter from "@/components/Counter";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";
import ManagerReview from "@/components/quote/ManagerReview";
import QuoteForm from "@/components/quote/QuoteForm";
import { getFeedback } from "@/utility/getFeedback";
import { Icon } from "@iconify/react";
const steps = [
  {
    id: 1,
    score: 200,
    sign: "+",
    title: "PROJECTS COMPLETED",
  },
  {
    id: 2,
    score: 24,
    sign: "Hrs",
    title: "FAST QUOTING",
  },
  {
    id: 3,
    score: 100,
    sign: "%",
    title: "LICENSED & INSURED",
  },
  {
    id: 4,
    score: 98,
    sign: "%",
    title: "Happy\nCustomers",
  },
];
const services = [
  {
    id: 1,
    title: "Break Room Deep Clean",
    beforeImage: "/images/quotes/janitorial/janitorial-after01.jpeg",
    afterImage: "/images/quotes/janitorial/janitorial-before01.png",
  },
  {
    id: 2,
    title: "Lobby Entrance Floor",
    beforeImage: "/images/quotes/janitorial/janitorial-after01.jpeg",
    afterImage: "/images/quotes/janitorial/janitorial-before01.png",
  },
  {
    id: 3,
    title: "Restroom Deep Clean",
    beforeImage: "/images/quotes/janitorial/janitorial-after01.jpeg",
    afterImage: "/images/quotes/janitorial/janitorial-before01.png",
  },
];

const careServices = [
  {
    id: 1,
    icon: "material-symbols:corporate-fare-outline",
    title: "Office Cleaning",
    description:
      "Daily or weekly cleaning tailored to your corporate environment. We ensure a pristine workspace for your team.",
  },
  {
    id: 2,
    icon: "material-symbols:cleaning-services-outline",
    title: "Janitorial Services",
    description:
      "Comprehensive facility maintenance including trash removal, dusting, and surface sanitation for NYC buildings.",
  },
  {
    id: 3,
    icon: "material-symbols:person-celebrate-outline",
    title: "Day Porter Services",
    description:
      "On-site staff to maintain high-traffic areas, restrooms, and lobbies throughout your business hours.",
  },
  {
    id: 4,
    icon: "material-symbols:construction-outline",
    title: "Post-Construction",
    description:
      "Detailed debris and dust removal to make your newly renovated space ready for immediate occupancy.",
  },
  {
    id: 5,
    icon: "material-symbols:sanitizer-outline",
    title: "Deep Disinfection",
    description:
      "Hospital-grade sanitation and deep cleaning protocols to ensure the highest safety standards for your facility.",
  },
  {
    id: 6,
    icon: "material-symbols:event-outline",
    title: "Move-Out & Event",
    description:
      "Pre and post-event cleanup or thorough move-out services to leave your space in perfect condition.",
  },
  {
    id: 7,
    icon: "material-symbols:layers-outline",
    title: "Floor Stripping & Waxing",
    description:
      "Restore the shine to your hard floors with professional stripping, sealing, and high-gloss waxing services.",
  },
  {
    id: 8,
    icon: "material-symbols:texture-outline",
    title: "Carpet Cleaning",
    description:
      "Deep steam cleaning and stain removal to extend the life of your commercial carpets and improve air quality.",
  },
  {
    id: 9,
    icon: "material-symbols:window-outline",
    title: "Window Cleaning",
    description:
      "Streak-free interior and exterior window cleaning for a professional and bright business appearance.",
  },
  {
    id: 10,
    icon: "material-symbols:handyman-outline",
    title: "Handyman Services",
    description:
      "Minor repairs, painting, and general maintenance to keep your facility running smoothly and looking its best.",
  },
  {
    id: 11,
    icon: "material-symbols:inventory-outline",
    title: "Supply Management",
    description:
      "Automated restocking of paper products, soaps, and liners so you never run out of essential restroom supplies.",
  },
];
export default async function Quotes() {
  const feedbacks = await getFeedback();
  return (
    <main>
      <section className="relative mt-6 bg-[linear-gradient(to_right,rgba(29,47,100,0.9),rgba(29,47,100,0.4)),url('/images/quotes/quote.jpg')] bg-cover bg-center bg-no-repeat w-full h-300 md:h-260 lg:h-200 xl:h-250 ">
        <div className="flex items-center w-full h-full absolute top-0 left-0">
          <div className="container grid lg:grid-cols-2 items-center gap-10 md:gap-15 xl:gap-25  text-white">
            <div>
              <p className="text-sm border border-white font-medium w-fit px-5 py-1.5 rounded-full">
                Janitorial Services
              </p>
              <h1 className="text-[23px] lg:text-5xl leading-[120%] font-medium my-6 md:my-8">
                Reliable Commercial Janitorial Service for NYC Facilities
              </h1>
              <p className="text-base md:text-lg max-w-3xl mt-4">
                NYC's most trusted commercial cleaning crews — tailored to your
                schedule.
              </p>
              <div className="mt-6 md:mt-12">
                <div className="grid grid-cols-2 items-start gap-4 md:w-4/5   gap-y-4 ">
                  <div className="flex items-start sm:items-center gap-2">
                    <Icon icon="ix:success" width={17} height={17} />{" "}
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">
                      Fully Insured & Bonded
                    </span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Icon icon="ix:success" width={17} height={17} />{" "}
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">
                      Custom Schedules
                    </span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Icon icon="ix:success" width={17} height={17} />{" "}
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">
                      Eco-Friendly Products
                    </span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Icon icon="ix:success" width={17} height={17} />{" "}
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">
                      Dedicated Account Manager
                    </span>
                  </div>
                </div>
              </div>
              <a href="tel:+1 (631) 381-7252" className="block mt-10">
                <ButtonSolid>Call Now (631) 381-7252</ButtonSolid>
              </a>
            </div>
            <div>
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 p-10">
          {steps.map((item, id) => (
            <div
              key={item.id}
              className={` px-4 py-4 md:py-0 flex-col items-center justify-center text-center border-white/20  ${steps.length - 1 === id ? "" : " border-r border-b md:border-b-0"} ${steps.length - 2 === id ? "border-b-0" : " "} ${steps.length - 3 === id ? "border-r-0 md:border-r" : " "}`}
            >
              <Counter
                value={item.score}
                sign={item.sign}
                className="text-3xl sm:text-4xl font-bold whitespace-pre-wrap"
              />
              <p className="text-xs  font-medium  mt-2 text-white/40">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mt-10 md:mt-14 lg:mt-20">
        <div className="text-center">
          <h2 className="text-slate text-2xl md:text-3xl lg:text-4xl font-bold">
            See the Difference We Make
          </h2>
          <p className="mt-4">
            Real results from real NYC facilities we service.
          </p>
        </div>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((item) => (
            <div key={item.id}>
              <ImageComparisonSlider
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                altBefore={`${item.title} before`}
                altAfter={`${item.title} after`}
              />
              <p className="text-sm  font-bold  py-6 text-center">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>
      <ManagerReview feedbacks={feedbacks} />
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
              <Icon icon={item.icon} width={40} height={40} className="text-slate" />
              <h3 className="text-xl font-bold text-slate">{item.title}</h3>
              <p className="text-sm flex-1 text-light-blue">{item.description}</p>
              <button className="mt-auto w-max px-6 py-2 rounded-full text-sm font-bold border border-slate text-slate transition-colors duration-300 hover:bg-slate hover:text-white">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
