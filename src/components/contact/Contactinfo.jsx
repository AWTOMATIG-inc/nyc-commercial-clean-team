import { contactInfoCards } from "@/constant/contact";
import { Icon } from "@iconify/react";

export default function ContactInfo() {
  return (
    <div>      
      <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
        We work with office managers, property managers, and business owners across NYC, fill out the form and our team will reach out to discuss your facility’s needs and provide a detailed, commercial cleaning quote.
      </p>

      <div className="space-y-6">
        {contactInfoCards.map((card) => (
          <div key={card.id} className="flex items-center gap-4">
            {/* Icon circle */}
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red hover:bg-[#1D2F64] rounded-md flex items-center justify-center flex-shrink-0">
              <Icon
                icon={card.icon}
                width="24"
                height="24"
                className={`text-white ${card.icon=="fa6-solid:clock" ? "w-7 h-7" : "w-6 h-6"}`}
              />
            </div>

            {/* Text */}
            <div>
              <p className="text-sm md:text-base font-semibold text-dark-slate">
                {card.label}
              </p>
              {card.isLink ? (
                <a
                  href={card.href}
                  className="text-red text-sm md:text-base hover:underline transition-colors"
                >
                  {card.value}
                </a>
              ) : (
                <p className="text-gray-600 text-sm md:text-base">
                  {card.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}