const steps = [
  {
    title: "We review your request.",
    text: "A member of our team reads your details and reaches out within 24 hours to learn how your facility operates.",
  },
  {
    title: "We scope your space.",
    text: "We discuss square footage, foot traffic, service frequency, and any compliance needs so the quote matches your building, not a generic package.",
  },
  {
    title: "You get a detailed commercial quote.",
    text: "It lists exactly what's included, how often, and what it costs, with no residential work and no one-size-fits-all packages.",
  },
];

export default function ContactProcess() {
  return (
    <section className="container pb-8 sm:pb-16">
      <h2 className="text-[22px] lg:text-4xl leading-[120%] pb-6">
        What happens after you contact us
      </h2>
      <ol className="grid md:grid-cols-3 gap-6 list-decimal list-inside">
        {steps.map((step) => (
          <li key={step.title} className="text-sm sm:text-base md:text-lg">
            <span className="font-semibold">{step.title}</span> {step.text}
          </li>
        ))}
      </ol>
      <h3 className="heading-5 pt-10 pb-3">Who we work with</h3>
      <p className="text-sm sm:text-base md:text-lg">
        We clean for office managers, property managers, and business owners
        across Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. That
        includes offices, retail spaces, medical facilities, restaurants, and
        schools.
      </p>
      <h3 className="heading-5 pt-8 pb-3">What we can quote</h3>
      <p className="text-sm sm:text-base md:text-lg">
        Janitorial services, day porter services, office cleaning, deep
        cleaning, floor stripping and waxing, carpet cleaning, commercial window
        cleaning, post-construction cleaning, restroom supply management,
        move-out cleaning, and commercial handyman services.
      </p>
    </section>
  );
}
