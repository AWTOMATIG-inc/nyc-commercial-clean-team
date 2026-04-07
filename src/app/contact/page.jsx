import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/Contactinfo";
import ContactMap from "@/components/contact/ContactMap";
import HeroBanner from "@/components/HeroBanner";

export default function Contact() {
  return (
    <main>
      <HeroBanner title="Get a Fast, Free Cleaning Quote"  desc="Tell us about your facility and we'll be in touch within 24 hours.
" />
      {/* Form + Info Section */}
      <section className="container py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-end">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
      <section className="container pb-8 sm:pb-16">
        <ContactMap/>
      </section>
      
    </main>
  );
}
