import cleaningImg from "@/assets/home/partnership/cleaning-discussion.webp";
import Image from "next/image";
import CommonHeading from "../CommonHeading";
import LinkWithArrow from "../LinkWithArrow";
export default function Foundation() {
  return (
    <section className="container mt-16 grid md:grid-cols-2 items-center gap-20">
      <div>
        <CommonHeading
          title="Foundation"
          heading="Built on experience and accountability"
          subHeading="NYC Clean Team has maintained the highest standards of commercial cleaning across the city for twenty-five years. We are fully insured, background-checked, and licensed to serve the most demanding facilities in Manhattan, Brooklyn, Queens, the Bronx, and Long Island."
        />{" "}
        <div className="mt-4 mx-auto md:mx-0 w-fit">
          <LinkWithArrow>learn more</LinkWithArrow>
        </div>
      </div>
      <div>
        <Image src={cleaningImg} alt="foundation" height={640} width={600} className="rounded-xl max-h-160 object-cover"/>
      </div>
    </section>
  );
}
