import cleaningDiscussion from "@/assets/home/partnership/cleaning-discussion.webp";
import Image from "next/image";
import CommonHeading from "../CommonHeading";
import LinkWithArrow from "../LinkWithArrow";
export default function PartnershipSection() {
  return (
    <section className="container mt-16">
      <div className="grid grid-cols-2 gap-12">
        <div className="flex flex-col justify-between py-14">
          <div className="space-y-6">
            <CommonHeading
              title="Partnership"
              heading="Why NYC Clean Team stands apart"
              subHeading="We build lasting relationships with our clients through accountability and results."
            />
            <LinkWithArrow>Learn More</LinkWithArrow>
          </div>
          <div>
            <h5 className="heading-5">Customized plans</h5>
            <p className="md:text-lg mt-4">
              Background-checked staff trained in commercial cleaning best
              practices and safety protocols.
            </p>
          </div>
        </div>
        <div>
          <Image
            src={cleaningDiscussion}
            alt="cleaningDiscussion"
            width={600}
            height={752}
            className="max-h-188 object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
