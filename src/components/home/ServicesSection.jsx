import { services } from "@/constant/home/services";
import BlogCard from "../BlogCard";
import CommonHeading from "../CommonHeading";

export default function ServicesSection() {
  return (
    <section className="container mt-16">
      <div className="grid md:grid-cols-2 gap-32">
        <div className="md:sticky top-24 h-fit">
          <CommonHeading
            title="Services"
            heading="What we handle"
            subHeading="Complete cleaning solutions for every commercial need."
          />
           <div className="mt-21">
          {services.slice(0,1).map((item) => (
            <BlogCard key={item.id} blog={item} isClean={true}/>
          ))}
        </div>
        </div>
        <div className="space-y-5">
          {services.slice(1,services.length).map((item) => (
            <BlogCard key={item.id} blog={item}/>
          ))}
        </div>
      </div>
    </section>
  );
}
