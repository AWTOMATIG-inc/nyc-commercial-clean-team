import BookingForm from "@/components/Booking/BookingForm";
import RightSideContentBox from "@/components/Booking/RightSideContentBox";
import HeroBanner from "@/components/HeroBanner";
export const metadata = {
  title: "Booking - New York Commercial Clean Team INC",
  description: "professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference",
};
export default function page() {
  return (
    <main>
      <HeroBanner title="Schedule Your Commercial Cleaning Service
" desc="Fill out the form and we'll have a custom quote ready within 24 hours — no obligation." pageName="Booking" />
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
