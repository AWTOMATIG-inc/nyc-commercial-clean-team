import { DayPorterServiceIcon, JanitorialServiceIcon, ServiceCardIcon } from "@/components/Icon";
export const services = [
  {
    id: 1,
    image: "/images/home/services/office-meet.png",
    icon:ServiceCardIcon,
    slug: "office-cleaning",
    heading: "Office cleaning",
    desc: "Workspaces, restrooms, breakrooms, and common areas are thoroughly cleaned and prepared before your team arrives, ensuring every scheduled visit delivers a consistent, spotless, and professional environment without disruption.",
    
  },
  {
    id: 2,
    image: "/images/home/services/floor-moping.jpg",
    icon:JanitorialServiceIcon,
    slug: "janitorial-services",
    heading: "Janitorial Services",
    desc: "Full-building janitorial coverage for lobbies, hallways, restrooms, and shared spaces, delivered with consistent quality and care. Flexible daily or nightly schedules ensure your facility stays clean, organized, and ready for use.",
  },
  {
    id: 3,
    image: "/images/home/services/wall-cleaning.jpg",
    icon:DayPorterServiceIcon,
    slug: "day-porter-services",
    heading: "Day Porter Services",
    desc: "Full-building janitorial coverage for lobbies, hallways, restrooms, and shared spaces, delivered with consistent quality and care. Flexible daily or nightly schedules ensure your facility stays clean, organized, and ready for use.",
  },
  
];
