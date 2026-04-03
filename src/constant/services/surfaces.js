import carpet from "@/assets/services/support/carpet.webp";
import floor from "@/assets/services/support/floor.webp";

import windowClean from "@/assets/home/services/window-cleaning.webp";

export const surfaces = [
  {
    id: 1,
    image: floor,
    view: "row",
    title: "Floors",
    heading: "Floor strip and wax",
    desc: "Strip old finish down to the surface, clean thoroughly, and apply fresh protective wax coating. Restores appearance and extends floor life significantly.",
  },
  {
    id: 2,
    image: carpet,
    view: "row-reverse",
    title: "Carpet",
    heading: "Carpet cleaning",
    desc: "Deep extraction removes embedded dirt and extends carpet life.",
  },
  {
    id: 3,
    image: windowClean,
    view: "row-reverse",
    title: "Glass",
    heading: "Window cleaning",
    desc: "Crystal clear glass and frames for a professional appearance.",
  },
  
];
