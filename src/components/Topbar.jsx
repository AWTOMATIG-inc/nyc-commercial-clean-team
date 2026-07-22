"use client";
import { quoteDetails } from "@/constant/quotes/quoteDetails";
import { trackPhoneClick } from "@/lib/gtm";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
export default function Topbar() {
  const path= usePathname();
  if(quoteDetails.some((item) => path.includes(item.pageName)))return
  return (
    <div className="bg-black text-white text-center h-8 sticky top-0 z-50 flex items-center justify-center">
      <div className="text-sm flex items-center gap-1.5">
        <Icon icon="tdesign:call" width="18" height="18" />
        <p>
          Call{" "}
          <a
            onClick={() => trackPhoneClick("topbar_phone")}
            className="hover:underline"
            href="tel:+1 (631) 381-7252"
          >
            (631) 381-7252
          </a>
        </p>
      </div>
    </div>
  );
}
