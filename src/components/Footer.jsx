import logo from "@/assets/logos/nyc-logo.png";
import { companyLinks, followUsLinks, servicesLinks } from "@/constant/footer";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate md:rounded-t-3xl text-white py-8 md:py-12 lg:py-16">
      <div className="container grid lg:grid-cols-[1fr_1.2fr]  lg:gap-x-28">
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
          <p className="py-8 text-lg">
            Stay informed on facility maintenance and cleaning standards.
          </p>
          <div>
            <div className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-[85%] md:w-[70%] lg:w-full">
              <input
                type="email"
                placeholder="Your email"
                className=" border border-gray-300 text-white placeholder:text-white py-2 w-full rounded-full pl-6 focus:outline-none"
              />
              <button className="w-full sm:w-fit flex items-center justify-center shadow shadow-[#F4F5F7] h-10 px-6 rounded-full hover:shadow-lg transistion-transform duration-300">
                Subscribe
              </button>
            </div>
            <p className="mt-3 text-xs">
             We respect your privacy and send updates only when necessary.
            </p>{" "}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5 lg:gap-x-10 gap-y-10 md:grid-cols-3 mt-12 lg:mt-0">
          <div>
            <p className="text-lg font-semibold">Services</p>
            <ul className="mt-4 space-y-3.5">
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
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">Company</p>
            <ul className="mt-4 space-y-3.5">
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
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">Follow us</p>
            <ul className="mt-4 space-y-3.5">
              {followUsLinks.map((link) => (
                <li key={link.id}>
                  <a
                    className="flex items-center gap-3 capitalize text-light hover:underline hover:text-blue-500"
                    href={link.href}
                  >
                    <Icon icon={link.icon} width="24" height="24" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
        <hr className=" text-gray-300 my-8" />
        <div className="flex flex-col-reverse md:flex-row gap-y-6 justify-between md:items-center ">
          <p className="text-center text-light">
            © 2025 NYC Clean Team. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="#" className="text-light underline hover:text-blue-500">
              Privacy Policy
            </Link>

            <Link href="#" className="text-light underline hover:text-blue-500">
              Terms of Service
            </Link>
            <Link href="#" className="text-light underline hover:text-blue-500">
              Cookies settings
            </Link>
          </div>
        </div>{" "}
      </div>
    </footer>
  );
}
