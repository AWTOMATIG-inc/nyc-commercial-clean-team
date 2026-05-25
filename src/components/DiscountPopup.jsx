"use client";
import discountImage from "@/assets/home/discount-popup.png";
import { trackCtaClick, trackPhoneClick } from "@/lib/gtm";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonSolid from "./ButtonSolid";
export default function DiscountPopup({ popupName = "home_discount_popup" }) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const isClosed = sessionStorage.getItem(`${popupName}-closed`);
    if (!isClosed) {
      setShowPopup(true);
    }
  }, [popupName]);

  const handleClose = () => {
    sessionStorage.setItem(`${popupName}-closed`, "true");
    setShowPopup(false);
  };

  if (!showPopup) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-10 py-16 shadow-lg max-w-129.75 w-[90%] sm:w-full items-center flex flex-col justify-center relative">
        <button className="absolute top-6 right-6" onClick={handleClose}>
          <Icon
            icon="material-symbols:close"
            className="text-gray-500 hover:text-gray-700"
            width="28"
            height="28"
          />
        </button>
        <div>
          <Image
            src={discountImage}
            alt="Discount Popup"
            width={400}
            height={300}
            className="w-auto h-40 sm:h-60 object-contain"
          />
        </div>
        <div className="text-center mt-8">
          <h2 className="text-3xl font-medium font-jetbrains">
            On Your First Order
          </h2>
          <div className="flex flex-col items-center gap-5 mt-6">
            <Link
              href="/booking"
              onClick={() => trackCtaClick("Schedule Service", "navbar")}
            >
              <ButtonSolid>Schedule Service</ButtonSolid>
            </Link>

            <a
              href="tel:+16313817252"
              onClick={() => trackPhoneClick("hero_cta")}
            >
              <ButtonSolid color="white">
                <span className="opacity-0">222</span> Call Now{" "}
                <span className="opacity-0">222</span>{" "}
              </ButtonSolid>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
