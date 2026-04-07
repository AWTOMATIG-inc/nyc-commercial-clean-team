import BookingForm from "@/components/Booking/BookingForm";
import RightSideContentBox from "@/components/Booking/RightSideContentBox";
import HeroBanner from "@/components/HeroBanner";

export default function page() {
  return (
    <main>
      <HeroBanner title="Booking" pageName="Booking" />
      <section className="container grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1fr_424px] lg:gap-10 xl:gap-20 my-8 lg:my-16">
        <div className="order-2 lg:order-1 mt-8 lg:mt-0">
          <BookingForm />
        </div>
        <div className="order-1 lg:order-2 ">
          <RightSideContentBox />
        </div>
      </section>
    </main>
  );
}
