import ArrowButton from "../ArrowButton";
import CommonHeading from "../CommonHeading";
import Counter from "../Counter";

const staticstics = [
  {
    id: 1,
    value: 98,
    sign: "%",
    title: "Client retention rate",
  },
  {
    id: 2,
    value: 200,
    sign: "+",
    title: "Happy customers",
  },
  {
    id: 3,
    value: 100,
    sign: "%",
    title: "Insured and background-checked",
  },
  {
    id: 4,
    value: "24/7",
    sign: "",
    title: "Responsive supportate",
  },
];
export default function WhySection() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-16">
        <div>
          <CommonHeading
            title="Why Choose Us"
            heading="NYC Businesses Trust Us for Reliable Cleaning"
            subHeading="Office managers and property managers across New York City rely on us because we show up when scheduled, perform to a consistent standard, and communicate clearly. No rotating crews. No missed visits. No surprises."
          />

          <div className="mt-8 mx-auto md:mx-0 w-fit">
            <ArrowButton>Learn How We Work</ArrowButton>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {staticstics.map((item) => (
            <div
              key={item.id}
              className="text-center bg-skyblue-light px-5 sm:px-9 py-4 sm:py-5 rounded-2xl flex flex-col items-center justify-start"
            >
              {item.id < 4 ? (
                <Counter value={item.value} sign={item.sign} />
              ) : (
                <div className="flex items-center">
                  <Counter
                    value={
                      typeof item.value === "string"
                        ? item.value.split("/")[0]
                        : item.value
                    }
                    sign={item.sign}
                  />
                  <span className="text-slate text-[28px] md:text-[58px] font-bold ">
                    /
                  </span>
                  <Counter
                    value={
                      typeof item.value === "string"
                        ? item.value.split("/")[1]
                        : item.value
                    }
                    sign={item.sign}
                  />
                </div>
              )}

              <span className="w-full bg-black rounded-full border border-transparent [border-image:linear-gradient(90deg,#FFFFFF_-4.54%,rgba(23,38,80,0.46)_46.64%,#FFFFFF_108.06%)_1]"></span>
              <p className="text-sm md:text-base lg:text-lg font-medium pt-4 border-black ">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
