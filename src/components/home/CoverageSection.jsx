import { coverage } from "@/constant/home/coverage";
import Image from "next/image";
import CommonHeading from "../CommonHeading";
export default function CoverageSection() {
  return (
    <section className="container mt-16">
      <div>
        <CommonHeading
          title="Coverage"
          heading="We serve all five boroughs"
          subHeading="From Manhattan to Long Island, we're your local cleaning partner."
        />
      </div>
      <div className="grid grid-cols-4 mt-8">
        {coverage.map((item, id) => (
          <div key={id}>
            <Image width={500} height={200} className="max-h-100 h-full object-cover" src={item} alt="slider" />
          </div>
        ))}
      </div>
    </section>
  );
}
