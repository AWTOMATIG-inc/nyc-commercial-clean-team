import cleaningImg from "@/assets/serviceArea/floor-smoke-clean.webp";
import statenIsland from "@/assets/serviceArea/5.png";
import bronx from "@/assets/serviceArea/4.png";
import queens from "@/assets/serviceArea/3.png";
import brooklyn from "@/assets/serviceArea/2.png";
import manhattan from "@/assets/serviceArea/1.png";
import { CycleCircleIcon, GridIcon, ThreeDotIcon } from "@/components/Icon";
export const foundations = [
  {
    id: 1,
    slug: "built-on-experience-and-accountability",
    title: "Foundation",
    heading: "Built on experience and accountability",
    desc: "NYC Clean Team has maintained the highest standards of commercial cleaning across the city for twenty-five years. We are fully insured, background-checked, and licensed to serve the most demanding facilities in Manhattan, Brooklyn, Queens, the Bronx, and Long Island.",
    image:cleaningImg
  },
];

export const boroughs = [
  {
    id: 1,
    slug: "long-island",
    image: statenIsland,
    heroImage: "/images/service-area/long-island.webp",
    name: "one",
    title: "Long Island",
    desc: "Office parks, retail centers, medical facilities, and commercial properties across Nassau and Suffolk Counties. Available for recurring contracts, one time cleans, and everything in between.",
  },
  {
    id: 2,
    slug: "bronx",
    image: bronx,
    heroImage: "/images/service-area/bronx.webp",
    name: "two",
    title: "Bronx",
    desc: "Commercial cleaning for offices, schools, retail spaces, and facilities throughout the Bronx, scheduled around your business hours with fully insured, background checked crews you can trust.",
  },
  {
    id: 3,
    slug: "queens",
    image: queens,
    heroImage: "/images/service-area/queens.webp",
    name: "three",
    title: "Queens",
    desc: "Medical facilities, logistics warehouses, restaurants, and multi tenant commercial buildings across Long Island City, Flushing, Jamaica, and every neighborhood in between, big or small.",
  },
  {
    id: 4,
    slug: "brooklyn",
    image: brooklyn,
    heroImage: "/images/service-area/brooklyn.webp",
    name: "four",
    title: "Brooklyn",
    desc: "Creative offices in DUMBO, retail spaces in Williamsburg, and industrial facilities in Sunset Park, professional commercial cleaning across every Brooklyn neighborhood you operate in.",
  },
  {
    id: 5,
    slug: "manhattan",
    image: manhattan,
    heroImage: "/images/service-area/manhattan.webp",
    name: "Five",
    title: "Manhattan",
    desc: "Office towers, corporate headquarters, law firms, medical practices, and retail spaces across Midtown, Downtown, and everywhere in between, cleaned to the highest possible standard.",
  },
];

export const availableSteps = [
  {
    id: 1,
    slug:"janitorial-services",
    image: "/images/service-area/floor-moping.jpg",
    name: "Recurring",
    title: "Janitorial services",
    desc: "Daily cleaning, restocking, and facility maintenance",
  },
  {
    id: 4,
    slug:"office-cleaning",
    image: "/images/services/recurring/office-meet.png",
    icon: ThreeDotIcon,
    title: "Office cleaning",
    desc: "Comprehensive cleaning for corporate and professional spaces",
  },
  {
    id: 2,
    slug:"day-porter-services",
    image: "/images/services/recurring/wall-cleaning.jpg",
    icon: CycleCircleIcon,   
    title: "Day porter services",
    desc: "On-site support during business hours for immediate needs",
  },
  {
    id: 5,
    slug:"post-construction-cleaning",
    image: "/images/service-area/construction.jpg",
    name: "Specialty",
    title: "Post-construction cleaning",
    desc: "Complete debris removal and final site preparation",
  },
  {
    id: 3,
    slug:"carpet-cleaning",
    image: "/images/service-area/carpet.webp",
    name: "Surfaces",
    title: "Floor and carpet care",
    desc: "Stripping, waxing, and deep cleaning for all floor types.",
  },  
  {
    id: 6,
    slug:"window-cleaning",
    image: "/images/services/surface/glass.webp",
    icon: GridIcon,
    title: "Window cleaning",
    desc: "Professional glass and facade maintenance for high-rises",
  },
];