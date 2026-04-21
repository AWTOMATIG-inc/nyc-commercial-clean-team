import { availableSteps } from "@/constant/service-area";
import Image from "next/image";
import Link from "next/link";
import ButtonSolid from "../ButtonSolid";
import CommonHeading from "../CommonHeading";
import LinkWithArrow from "../LinkWithArrow";

export default function Available() {
  return (
    <section className="container mt-8 xs:mt-14 sm:mt-24">
      <div>
        <CommonHeading
          title="Available"
          heading="Services in these areas"
          subHeading="We deliver the full range of commercial cleaning solutions"
          center={true}
        />
      </div>
      <div className="mt-8 sm:mt-16 grid lg:grid-cols-3 gap-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {availableSteps.slice(0, 2).map((service) => (
            <div
              key={service.id}
              className={`shadow rounded-lg overflow-hidden`}
            >
              {!service.icon && (
                <div>
                  <Image
                    width={394}
                    height={233}
                    src={service.image}
                    alt="service"
                    className="w-full h-full max-h-58.25 object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {service.icon && <service.icon />}

                <p className="font-semibold capitalize ">{service.name}</p>
                <h4 className="heading-4 mt-6 mb-4">{service.title}</h4>
                <p className="mb-6">{service.desc}</p>

                <LinkWithArrow href={`/service-area/available/${service.slug}`}>
                  learn more
                </LinkWithArrow>
              </div>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {availableSteps.slice(2, 4).map((service) => (
            <div
              key={service.id}
              className={`shadow rounded-lg overflow-hidden`}
            >
              {!service.icon && (
                <div>
                  <Image
                    width={394}
                    height={233}
                    src={service.image}
                    alt="service"
                    className="w-full h-full max-h-58.25  object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {service.icon && <service.icon />}

                <p className="font-semibold capitalize ">{service.name}</p>
                <h4 className="heading-4 mt-6 mb-4">{service.title}</h4>
                <p className="mb-6">{service.desc}</p>

                <LinkWithArrow href={`/service-area/available/${service.slug}`}>
                  learn more
                </LinkWithArrow>
              </div>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {availableSteps.slice(4, 6).map((service) => (
            <div
              key={service.id}
              className={`shadow rounded-lg overflow-hidden`}
            >
              {!service.icon && (
                <div>
                  <Image
                    width={394}
                    height={233}
                    src={service.image}
                    alt="service"
                    className="w-full h-58.25 object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {service.icon && <service.icon />}

                <p className="font-semibold capitalize ">{service.name}</p>
                <h4 className="heading-4 mt-6 mb-4">{service.title}</h4>
                <p className="mb-6">{service.desc}</p>

                <LinkWithArrow href={`/service-area/available/${service.slug}`}>
                  learn more
                </LinkWithArrow>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-8 sm:my-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[32px] sm:text-5xl lg:text-[56px] leading-[120%]">
            Ready to upgrade <br /> Your facility deserves better
          </h1>
          <p className="md:text-lg my-6">
            Let NYC Clean Team handle the details while you focus on running
            your business.
          </p>
          <div className="flex gap-8">
            <Link href="/contact">
              <ButtonSolid>Get a Free Quote</ButtonSolid>
            </Link>

            <a href="tel:+1 (631) 381-7252">
              <ButtonSolid color="white">Call Now</ButtonSolid>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
