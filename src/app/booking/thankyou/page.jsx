import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="h-screen flex items-center justify-center">
        <div className="w-fit  relative">
            <Image src="/images/thankyou.png" alt="Thank You" width={1200} height={750} className="w-full h-full hidden sm:block" />
            <Image src="/images/thankyou-mobile.png" alt="Thank You" width={376} height={880} className="max-w-[376px] max-h-[90vh] sm:hidden shadow-custom rounded-[20px]" />
            <Link href="/booking" className="absolute text-center top-5 right-5 sm:top-12 sm:right-14 hover:text-red-500"><Icon icon="carbon:close-outline" width="30" height="30" /></Link>
            <div className="absolute text-center bottom-40 sm:bottom-18 lg:bottom-38 left-1/2 -translate-x-1/2 w-full">
                <h1 className="text-3xl font-bold">Thank you</h1>
                <p className="mt-3.75 mb-6 sm:text-lg text-[#585858]">Your service is being processed.</p>
                <Link href="/" className="border-black border text-red py-1 px-5 rounded-full text-semibold hover:bg-red hover:text-white hover:border-red transition-colors duration-300">Home</Link>
            </div>
        </div>
    </div>
  )
}
