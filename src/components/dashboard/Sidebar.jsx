"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import {
  BlogPostIcon,
  ClientIcon,
  FeedbackClientIcon,
  LeftArrowIcon,
  RightArrowIcon,
  SubscribeIcon,
} from "../SvgIcons";

const Sidebar = () => {
  const [isSidebar, setIsSidebar] = useState(false);
  return (
    <div
      className={`bg-slate text-white h-screen w-72 sm:w-96 p-6 flex flex-col gap-8 fixed lg:sticky top-0 z-100 lg:rounded-[20px]  ${
        isSidebar ? "left-[0px]" : "-left-[290px] sm:-left-[385px]"
      }`}
    >
      <div className="relative w-full h-full">
        <button
          onClick={() => setIsSidebar((prev) => !prev)}
          className="absolute top-32 sm:top-20 -right-[60px]  bg-[#0A1F44] h-10 w-10 grid place-items-center rounded-r-full lg:hidden cursor-pointer"
        >
          {isSidebar ? <RightArrowIcon /> : <LeftArrowIcon />}
        </button>
        <h1 className="text-3xl font-bold px-4">Admin</h1>
        <nav className="flex flex-col gap-y-8 text-lg mt-8">
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard"
            className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-deepBlue "
          >
            <BlogPostIcon /> <span>Blogs</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/client-feedback"
            className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-deepBlue "
          >
            <FeedbackClientIcon />
            <span>Client Feedback</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/bookings"
            className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-deepBlue "
          >
            <Icon icon="tdesign:order" width="25" height="25" />
            <span>Bookings</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/users"
            className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-deepBlue "
          >
            <ClientIcon />
            <span>Users</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/subscribers"
            className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-deepBlue "
          >
            <SubscribeIcon />
            <span>Subscribers</span>
          </Link>
        </nav>

        <Link
          onClick={() => setIsSidebar(false)}
          href="/"
          className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-deepBlue text-lg absolute bottom-0 left-0 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>

          <span>Back home</span>
        </Link>
      </div>
    </div>
  );
};
export default Sidebar;
