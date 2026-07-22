import ButtonSolid from "@/components/ButtonSolid";
import Counter from "@/components/Counter";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";
import ManagerReview from "@/components/quote/ManagerReview";
import QuoteForm from "@/components/quote/QuoteForm";
import { quoteDetails } from "@/constant/quotes/quoteDetails";
import { careServices } from "@/constant/quotes/quoteServices";
import { getFeedback } from "@/utility/getFeedback";
import { Icon } from "@iconify/react";



export default async function Quotes({ params }) {
  const { slug } = await params;
  const feedbacks = await getFeedback();
  const pageDetail = quoteDetails.find((detail) => detail.pageName === slug);
  return (
    <main>
      <section className="relative mt-6 bg-[linear-gradient(to_right,rgba(29,47,100,0.9),rgba(29,47,100,0.4)),url('/images/quotes/quote.jpg')] bg-cover bg-center bg-no-repeat w-full h-300 md:h-260 lg:h-200 xl:h-250 ">
        <div className="flex items-center w-full h-full absolute top-0 left-0">
          <div className="container grid lg:grid-cols-2 items-center gap-10 md:gap-15 xl:gap-25  text-white">
            <div>
              <p className="text-sm border border-white font-medium w-fit px-5 py-1.5 rounded-full">
                {pageDetail.title}
              </p>
              <h1 className="text-[23px] lg:text-5xl leading-[120%] font-medium my-6 md:my-8">
                {pageDetail.subtitle}
              </h1>
              <p className="text-base md:text-lg max-w-3xl mt-4">
                {pageDetail.desc}
              </p>
              <div className="mt-6 md:mt-12">
                <div className="grid grid-cols-2 items-start gap-4 md:w-4/5   gap-y-4 ">
                  {pageDetail.list.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start sm:items-center gap-2"
                    >
                      <Icon icon="ix:success" width={17} height={17} />{" "}
                      <span className="flex-1 relative -top-0.5 md:top-0 text-sm md:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
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
          {pageDetail.steps.map((item, id) => (
            <div
              key={item.id}
              className={` px-4 py-4 md:py-0 flex-col items-center justify-center text-center border-white/20  ${pageDetail.steps.length - 1 === id ? "" : " border-r border-b md:border-b-0"} ${pageDetail.steps.length - 2 === id ? "border-b-0" : " "} ${pageDetail.steps.length - 3 === id ? "border-r-0 md:border-r" : " "}`}
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
          {pageDetail.services.map((item) => (
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
              <Icon
                icon={item.icon}
                width={40}
                height={40}
                className="text-slate"
              />
              <h3 className="text-xl font-bold text-slate">{item.title}</h3>
              <p className="text-sm flex-1 text-light-blue">
                {item.description}
              </p>
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
