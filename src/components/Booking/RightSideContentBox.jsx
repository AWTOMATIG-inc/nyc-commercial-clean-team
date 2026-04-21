import { Icon } from "@iconify/react";
import {
  AssessmentIcon,
  CalenderIcon,
  CrewManIcon,
  DayPorter2Icon,
  DayPorterIcon,
  DeepCleaningIcon,
  FloorCareIcon,
  JanitorialIcon,
  LoopIcon,
  OfficeIcon,
  PostConstructionIcon,
  WindowCleaningIcon,
} from "../Icon";

const includeSteps = [
  {
    id: 1,
    icon: AssessmentIcon,
    title: "Free Site Assessment",
    desc: "We evaluate your space before quoting — no guesswork",
  },
  {
    id: 2,
    icon: CrewManIcon,
    title: "Background-Checked Crew",
    desc: "Every cleaner is vetted, insured, and uniformed",
  },
  {
    id: 3,
    icon: CalenderIcon,
    title: "Custom Cleaning Plan",
    desc: "Tailored to your schedule, size, and compliance needs",
  },
  {
    id: 4,
    icon: LoopIcon,
    title: "Satisfaction Guarantee",
    desc: "Not happy? We make it right — every time",
  },
];
const servicesOptions = [
  {
    id: 1,
    icon: OfficeIcon,
    name: "Office Cleaning",
  },
  {
    id: 2,
    icon: JanitorialIcon,
    name: "Janitorial",
  },
  {
    id: 3,
    icon: FloorCareIcon,
    name: "Floor Care",
  },
  {
    id: 4,
    icon: WindowCleaningIcon,
    name: "Window Cleaning",
  },
  {
    id: 5,
    icon: DayPorterIcon,
    name: "Day Porter",
  },
  {
    id: 6,
    icon: DeepCleaningIcon,
    name: "Deep Cleaning",
  },
  {
    id: 7,
    icon: DayPorter2Icon,
    name: "Day Porter",
  },
  {
    id: 8,
    icon: PostConstructionIcon,
    name: "Post-Construction",
  },
];
const contactList = [
  {
    id: 1,
    icon: "proicons:call",
    name: "+1 (631) 381-7252 — Call Us Now",
    type: "call",
    href: "tel:+1 (631) 381-7252",
  },
  {
    id: 2,
    icon: "material-symbols:mail-outline-sharp",
    type: "mail",
    name: "info@nyccleantinc.com",
    href: "mailto:info@nyccleantinc.com",
  },
];
export default function RightSideContentBox() {
  return (
    <div>
      <div className="shadow shadow-black/50 rounded-xl px-5 py-8 sm:px-8 sm:py-14">
        <h1 className="font-bold text-xl md:text-2xl">What's Included</h1>
        <div className="pt-2">
          {includeSteps.map((step) => (
            <div key={step.id} className="flex gap-6 mt-8">
              <div className="size-12 rounded-lg bg-red/10 flex items-center justify-center">
                <step.icon />
              </div>
              <div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="pt-2 text-light-blue text-sm mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="shadow shadow-black/50 rounded-xl px-5 py-8 sm:px-8 sm:py-14 mt-8 sm:mt-16">
        <h1 className="font-bold text-xl md:text-2xl">Services We Offer</h1>
        <div className="pt-2 flex flex-wrap gap-4 mt-6">
          {servicesOptions.map((step) => (
            <div
              key={step.id}
              className="flex gap-2 items-center text-xs bg-red/10 w-fit px-3 py-1.5 rounded-md"
            >
              <step.icon />
              <p className="text-red">{step.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="shadow shadow-black/50 rounded-xl px-5 py-8 sm:px-8 sm:py-14 mt-8 sm:mt-16">
        <h1 className="font-bold text-xl md:text-2xl">Prefer to Talk?</h1>
        <div className="pt-2 mt-6 space-y-4">
          {contactList.map((contact) => (
            <div
              key={contact.id}
              className="flex gap-6 items-center  w-fit px-3 py-1.5 rounded-md"
            >
              <div className="size-10 bg-red/20 flex justify-center items-center rounded-md border border-black/40">
                <Icon icon={contact.icon} width="24" height="24" />
              </div>
              {contact.type == "call" ? (
                <a
                  href={`tel:${contact.href}`}
                  className="font-medium hover:underline"
                >
                  {contact.name}
                </a>
              ) : (
                <a
                  href={`mailto:${contact.href}`}
                  className="font-medium hover:underline"
                >
                  {contact.name}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
