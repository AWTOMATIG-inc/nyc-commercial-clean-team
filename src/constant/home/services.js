import { DayPorterServiceIcon, JanitorialServiceIcon, ServiceCardIcon } from "@/components/Icon";
export const services = [
  {
    id: 1,
    image: "/images/home/services/office-meet.png",
    icon:ServiceCardIcon,
    slug: "office-cleaning",
    heading: "Office cleaning",
    desc: "Keep your workspace consistently clean, organized, and client-ready.",
    
  },
  {
    id: 2,
    image: "/images/home/services/floor-moping.jpg",
    icon:JanitorialServiceIcon,
    slug: "janitorial-services",
    heading: "Janitorial Services",
    desc: "Daily and scheduled cleaning programs designed for high-traffic facilities.",
  },
  {
    id: 3,
    image: "/images/home/services/bookself-cleaning.png",
    icon:DayPorterServiceIcon,
    slug: "day-porter-services",
    heading: "Day Porter Services",
    desc: "On-site staff to maintain cleanliness throughout the day.",
  },
  
];
