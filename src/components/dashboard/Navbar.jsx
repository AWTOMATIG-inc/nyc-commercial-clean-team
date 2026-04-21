"use client";
import { SearchIcon, XmarkIcon } from "@/components/SvgIcons";
import { useAuth } from "@/hook/useAuth";
import { logout } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const Navbar = () => {
  const [isSearchBar, setIsSearchBar] = useState(false);
  const [isShowMenu, setisShowMenu] = useState(false);
  const { user } = useAuth();
  return (
    <div className=" py-6 px-10 bg-slate/10 rounded-[20px] shadow mx-4 ">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold capitalize">
          Hello, {user ? user?.name : "John"} 👋
        </h2>
        <div className="flex items-center gap-4">
          <button
            className="cursor-pointer md:hidden"
            onClick={() => setIsSearchBar((prev) => !prev)}
          >
            {isSearchBar ? (
              <XmarkIcon className="text-gray-300" />
            ) : (
              <SearchIcon className="text-gray-300 " />
            )}
          </button>

          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="border-2 border-gray-300 px-4 py-1 rounded-xl focus:outline-0 h-full placeholder:text-gray-400"
            />
            <SearchIcon className="text-gray-300 absolute top-1/2 -translate-y-1/2 right-3" />
          </div>
          <div className="relative">
            <button
              onClick={() => setisShowMenu((prev) => !prev)}
              className="cursor-pointer"
            >
              <Image
                src={
                  user?.avatar
                    ? `/api/uploads/user/${user?.avatar}`
                    : "/avatar.png"
                }
                className="size-10 object-cover rounded-full border border-gray-200"
                width={100}
                height={100}
                alt="avatar"
              />
            </button>
            {isShowMenu && (
              <div className="absolute top-12 right-0 bg-white w-48 p-2 border border-gray-400 rounded-md">
                <ul className="space-y-4 mt-2">
                  <li className="">
                    <Link
                      href="/dashboard/account"
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-500 group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M6.5 7.5a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M3 19a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3H3z"
                        />
                      </svg>
                      <span className="group-hover:underline">Account</span>
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={async () => await logout()}
                      className="bg-blue-500 capitalize w-full rounded-lg py-1 text-white cursor-pointer"
                    >
                      logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {isSearchBar && (
        <div className="relative mt-4 md:hidden">
          <input
            type="text"
            placeholder="Search"
            className="border-2 border-gray-300 px-4 py-1 rounded-xl focus:outline-0 h-full placeholder:text-gray-400 w-full"
          />
          <SearchIcon className="text-gray-300 absolute top-1/2 -translate-y-1/2 right-3" />
        </div>
      )}
    </div>
  );
};
export default Navbar;
