import { DayPorterServiceIcon, JanitorialServiceIcon, ServiceCardIcon } from "@/components/Icon";
export const services = [
  {
    id: 1,
    image: "/images/home/services/office-meet.png",
    icon:ServiceCardIcon,
    slug: "office-cleaning",
    newUrl: "/commercial-office-cleaning-nyc",
    heading: "Office cleaning",
    desc: "Keep your workspace consistently clean, organized, and client-ready.",
    
  },
  {
    id: 2,
    image: "/images/home/services/floor-moping.jpg",
    icon:JanitorialServiceIcon,
    slug: "janitorial-services",
    newUrl: "/janitorial-services-nyc",
    heading: "Janitorial Services",
    desc: "Daily and scheduled cleaning programs designed for high-traffic facilities.",
  },
  {
    id: 3,
    image: "/images/home/services/bookself-cleaning.png",
    icon:DayPorterServiceIcon,
    slug: "day-porter-services",
    newUrl: "/day-porter-services-nyc",
    heading: "Day Porter Services",
    desc: "On-site staff to maintain cleanliness throughout the day.",
  },
  
];

export const allServiceLinks = [
  { label: "Office Cleaning NYC", href: "/commercial-office-cleaning-nyc" },
  { label: "Janitorial Services NYC", href: "/janitorial-services-nyc" },
  { label: "Day Porter Services NYC", href: "/day-porter-services-nyc" },
  { label: "Post-Construction Cleaning NYC", href: "/post-construction-cleaning-nyc" },
  { label: "Commercial Deep Cleaning NYC", href: "/commercial-deep-cleaning-nyc" },
  { label: "Commercial Move-Out Cleaning NYC", href: "/commercial-move-out-cleaning-nyc" },
  { label: "Floor Stripping & Waxing NYC", href: "/floor-stripping-waxing-nyc" },
  { label: "Commercial Carpet Cleaning NYC", href: "/commercial-carpet-cleaning-nyc" },
  { label: "Commercial Window Cleaning NYC", href: "/commercial-window-cleaning-nyc" },
  { label: "Commercial Handyman Services NYC", href: "/commercial-handyman-services-nyc" },
  { label: "Restroom Supply Management NYC", href: "/restroom-supply-management-nyc" },
];
