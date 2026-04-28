import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/Contactinfo";
import HeroBanner from "@/components/HeroBanner";
export const metadata = {
  title: "Contact - New York Commercial Clean Team INC",
  description: "professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference",
};
export default function Contact() {
  return (
    <main>
      <HeroBanner
        title="Get a Fast, Free Cleaning Quote"
        desc="Tell us about your facility and we'll be in touch within 24 hours.
"
      />
      {/* Form + Info Section */}
      <section className="container py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-end">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
      <section className="container pb-8 sm:pb-16">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.3586241521007!2d-73.80426442358723!3d40.693956638719456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84473a9fc16af62b%3A0x58b1181e6e925aa7!2sNew%20York%20Commercial%20Clean%20Team%20inc.!5e1!3m2!1sen!2sbd!4v1777215746953!5m2!1sen!2sbd"
          width="100%"
          height="500"
          style={{ border: 0, borderRadius: "20px" }}          
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </main>
  );
}
