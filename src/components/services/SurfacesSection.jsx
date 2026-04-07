import { surfaces } from "@/constant/services/surfaces";
import CommonHeading from "../CommonHeading";
import ServicesBlogCard from "../ServicesBlogCard";

export default function SurfacesSection() {
  return (
    <section className="container mt-8 sm:mt-16">
      <CommonHeading
        center={true}
        title="Surfaces"
        heading="Floors and finishes maintained"
        subHeading="Professional floor care that protects your surfaces and extends their lifespan."
      />
      <div className="mt-21">
        <div className="grid sm:grid-cols-2  xl:grid-cols-[1.8fr_1fr_1fr] gap-4 md:gap-8">
        {surfaces.map((item) => (
          <ServicesBlogCard view={item.view} key={item.id} blog={item} />
        ))}
      </div>
      {/* <div className="grid lg:grid-cols-2 gap-8">
        {surfaces.slice(1, 3).map((item) => (
          <ServicesBlogCard view={item.view} key={item.id} blog={item} />
        ))}
      </div> */}
      </div>
      
    </section>
  );
}
