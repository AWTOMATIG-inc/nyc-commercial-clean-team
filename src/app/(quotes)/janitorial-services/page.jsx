import ButtonSolid from "@/components/ButtonSolid";
import Counter from "@/components/Counter";
import ManagerReview from "@/components/quote/ManagerReview";
import QuoteForm from "@/components/quote/QuoteForm";
import { Icon } from "@iconify/react";
import Image from "next/image";
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
    sign: "-48 Hrs",
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
    image: "/images/quotes/break-room.jpg",
  },
  {
    id: 2,
    title: "Lobby Entrance Floor",
    image: "/images/quotes/lobby-entrance.jpg",
  },
  {
    id: 3,
    title: "Restroom Deep Clean",
    image: "/images/quotes/restroom-deep.jpg",
  },
];

const handles = [
  {
    id: 1,
    icon: "hugeicons:office",
    name: "Office Cleaning",
  },
  {
    id: 2,
    icon: "ci:layer",
    name: "Floor Care & Waxing",
  },
  {
    id: 3,
    icon: "material-symbols:construction",
    name: "Post-Construction",
  },
  {
    id: 4,
    icon: "icon-park-outline:medical-box",
    name: "Medical Facility",
  },
  {
    id: 5,
    icon: "material-symbols:storefront-outline",
    name: "Retail & Storefront",
  },
];
export default function Quotes() {
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
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">Fully Insured & Bonded</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Icon icon="ix:success" width={17} height={17} />{" "}
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">Custom Schedules</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Icon icon="ix:success" width={17} height={17} />{" "}
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">Eco-Friendly Products</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2">
                    <Icon icon="ix:success" width={17} height={17} />{" "}
                    <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">Dedicated Account Manager</span>
                  </div>
                </div>
              </div>
              <a href="tel:+1 (631) 381-7252" className="block mt-10">
                <ButtonSolid>Call Now (631) 381-7252</ButtonSolid>
              </a>
            </div>
            <div >
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
            <div
              key={item.id}
              className="relative rounded-[20px] shadow-lg overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
              <div className="flex justify-between items-start absolute top-5 left-0 w-full h-full px-4">
                <span className="text-xs font-bold bg-black rounded-full text-white px-4 py-1.5 uppercase">
                  before
                </span>
                <span className="text-xs font-bold bg-red rounded-full text-white px-4 py-1.5 uppercase">
                  after
                </span>
              </div>
              <p className="text-sm  font-bold  py-6 text-center">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>
      <ManagerReview/>
      <section className="container my-10 md:my-14 lg:my-20">
        <h2 className="text-slate text-2xl md:text-2xl lg:text-4xl font-bold text-center">
            We Also Handle
          </h2>
          <div className=" grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {handles.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl bg-[#EDEEF0] p-4 text-slate flex flex-col items-center justify-center gap-2 text-center"
              >
                <Icon icon={item.icon} width={24} height={24}  />
                <h5 className="text-xs font-bold text-slate/80">{item.name}</h5>
              </div>
            ))}
          </div>
      </section>
    </main>
  );
}
