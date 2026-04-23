"use client";
import logo from "@/assets/logos/nyc-logo.png";
import { followUsLinks } from "@/constant/footer";
import { headerLinks } from "@/constant/header";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ButtonSolid from "./ButtonSolid";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY + 100;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if (path.includes("thankyou")) {
    return null;
  }
  return (
    <header
      className={`sticky top-0 z-50  bg-slate rounded-b-[20px] text-white lg:py-2 ${!isMenuOpen ? "bg-slate" : "bg-white lg:bg-slate"} ${
        scrolled
          ? "opacity-0 -translate-y-full transition-transform duration-300"
          : "opacity-100 translate-y-0 transition-transform duration-300"
      }`}
    >
      <div className={`relative z-10 `}>
        <nav className="container flex justify-between  py-6 relative z-50">
          <div className={`hidden lg:flex items-center gap-8 `}>
            {headerLinks.map((link) => {
              if (link.dropdownList) {
                return (
                  <div key={link.id} className="relative inline-block group">
                    <div className="flex gap-2 items-center cursor-pointer hover:text-blue transition-colors duration-300">
                      <Link href={link.href}>{link.name}</Link>
                      <Icon icon="ep:arrow-down" width="18" height="18" />
                    </div>

                    <div className="absolute left-0  min-w-32 bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:block">
                      {link.dropdownList.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  className="hover:text-blue transition-colors duration-300"
                  key={link.id}
                  href={link.href}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          {/* mobile version */}
          <div
            className={`bg-[#172650B2] fixed top-0 w-full h-screen right-0 z-100 ${isMenuOpen ? "block lg:hidden" : "hidden"}`}
          >
            <div
              className={`w-[80%] sm:w-[70%] md:w-[60%] ml-auto  bg-slate h-full  flex flex-col justify-between gap-6 `}
            >
              <div>
                <button
                  className=" pt-4 mr-4 ml-auto w-fit block"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Icon
                    icon="material-symbols-light:close"
                    width="40"
                    height="40"
                  />
                </button>
                <div className="pt-5 flex flex-col">
                  {headerLinks.map((link, id) => {
                    return (
                      <Link
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className={`hover:text-blue border-t pl-5 py-4 ${headerLinks.length === id + 1 ? "border-b" : ""}`}
                        key={link.id}
                        href={link.href}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
                <Link
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  href="/booking"
                  className="w-fit mx-auto mt-10 block"
                >
                  <ButtonSolid className="">Schedule Service</ButtonSolid>
                </Link>
              </div>
              <ul className="mt-4 grid grid-cols-5 border-t border-white/40">
                {followUsLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      className={`flex items-center justify-center capitalize text-light hover:underline hover:text-blue-500 border-white/40 border-r p-2 ${followUsLinks.length === link.id && "border-r-0"}`}
                      href={link.href}
                    >
                      <Icon icon={link.icon} width="24" height="24" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/"
            className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-1/2"
          >
            <Image
              src={logo}
              alt="Logo"
              width={77}
              height={64}
              className="h-auto"
            />
          </Link>
          <Link href="/booking">
            <ButtonSolid className="hidden lg:block">
              Schedule Service
            </ButtonSolid>
          </Link>

          <button
            className="lg:hidden cursor-pointer w-fit block ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon icon="solar:hamburger-menu-outline" width="35" height="35" />
          </button>
        </nav>
      </div>
    </header>
  );
}
