"use client";
import logo from "@/assets/logos/nyc-logo.png";
import { companyLinks, followUsLinks, servicesLinks } from "@/constant/footer";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const path = usePathname();
  const handleSubmit = async () => {
    if (!email) {
      return toast.error("Please add a valid gmail");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    if (!isValid) {
      return toast.error("Please add a valid gmail");
    }
    try {
      const res = await fetch("/api/subscriber", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 409) {
        setEmail("");
        return toast.error("You have already Subscribed!");
      }
      const data = await res.json();
      setEmail("");
      return toast.success("Subscribe successfuly!");
    } catch (error) {
      console.log(error);
    }
  };
  if (path.includes("thankyou")) {
    return null;
  }
  return (
    <footer className="bg-slate md:rounded-t-3xl text-white py-8 md:py-12 lg:py-13.25">
      <div className="container grid lg:grid-cols-[1fr_1.4fr] xl:grid-cols-[1fr_1.2fr] lg:gap-x-14  xl:gap-x-28">
        <div>
          <div>
            <Image
              src={logo}
              alt="Logo"
              width={92}
              height={77}
              className="w-full max-w-23 h-auto"
            />
          </div>
          <p className="py-3.5 text-lg">
            Professional commercial cleaning services across all five NYC
            boroughs — offices, retail, medical, and more.
          </p>
          <div>
            <div className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-[85%] md:w-[70%] lg:w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className=" border border-gray-300 text-white placeholder:text-white py-2 w-full rounded-full pl-6 focus:outline-none max-h-9.25"
              />
              <button
                onClick={handleSubmit}
                className="w-full sm:w-fit flex items-center justify-center shadow shadow-[#F4F5F7] h-10 px-6 rounded-full hover:shadow-lg transistion-transform duration-300 max-h-9.25"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-4.75 text-xs">
              Facility maintenance tips for NYC commercial property managers —
              delivered occasionally.
            </p>{" "}
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-between lg:justify-end gap-x-5 lg:gap-x-10 gap-y-10  mt-12 lg:mt-0 pt-3.25">
          <div>
            <p className="text-lg font-semibold">Services</p>
            <ul className="mt-4.75 space-y-3.5">
              {servicesLinks.map((link) => (
                <li key={link.id}>
                  <a
                    className=" text-light hover:underline hover:text-blue-500"
                    href={link.href}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <Link
                href="/privacy-policy"
                className="hidden lg:block text-light underline hover:text-blue-500 relative lg:top-13 xl:top-6.25 h-0"
              >
                Privacy Policy
              </Link>
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">Company</p>
            <ul className="mt-4.75 space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    className=" text-light hover:underline hover:text-blue-500"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <Link
                href="/terms-of-service"
                className="hidden lg:block text-light underline hover:text-blue-500 relative lg:top-13 xl:top-6.25 h-0"
              >
                Terms of Service
              </Link>
            </ul>
          </div>
          <div className="sm:hidden">
            <p className="text-lg font-semibold">Follow us</p>
            <ul className="mt-4.75 space-y-3.5 flex">
              {followUsLinks.map((link) => (
                <li key={link.id}>
                  <a
                    className={`flex items-center gap-3 capitalize text-light hover:underline hover:text-blue-500 border-y border-l p-2 ${followUsLinks.length === link.id && "border-r"}`}
                    href={link.href}
                  >
                    <Icon icon={link.icon} width="24" height="24" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold">Follow us</p>
            <ul className="mt-4 space-y-3.5">
              {followUsLinks.map((link) => (
                <li key={link.id}>
                  <a
                    target="_blank"
                    className="flex items-center gap-3 capitalize text-light hover:underline hover:text-blue-500"
                    href={link.href}
                  >
                    <Icon icon={link.icon} width="24" height="24" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
              <Link
                href="/privacy-policy"
                className="hidden lg:block text-light underline hover:text-blue-500 relative lg:top-13 xl:top-6.25 h-0"
              >
                Cookies settings
              </Link>
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
        <hr className=" text-gray-300 mt-2 mb-4" />
        <div className="flex flex-col-reverse lg:flex-row gap-y-6 justify-between md:items-center ">
          <p className="text-light text-sm sm:text-base">
            © 2026 Developed by{" "}
            <a
              href="https://awtomatig.com/"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWTOMATIG
            </a>
            . All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row gap-4 lg:hidden">
            <Link
              href="/privacy-policy"
              className="text-light underline hover:text-blue-500 relative xl:right-57.5 2xl:right-57.5"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-of-service"
              className="text-light underline hover:text-blue-500 relative xl:right-57.5 2xl:right-32.5"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="text-light underline hover:text-blue-500 relative xl:right-57.5 2xl:right-12"
            >
              Cookies settings
            </Link>
          </div>
        </div>{" "}
      </div>
    </footer>
  );
}
