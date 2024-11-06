"use client";
import { sidebarLinks } from "@/constants/constants.index";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname , useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();


  return (
    <section className="custom-scrollbar leftsidebar shadow-sidebar">
      <div className="flex w-full flex-1 flex-col px-6 gap-3">
        {sidebarLinks.map((item, i) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            item.route == pathname;


          if (item.route === "/profile") item.route = `${item.route}/${userId}`;

          return (
            <Link
              className={`leftsidebar_link ${isActive ? "bg-[#1A73E8]" : 'bg-sidebar-inactive'} `}
              key={i}
              href={item.route}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={23}
                height={23}
              />

              <p className="text-light-1 max-lg:hidden">{item.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6 w-full mx-auto py-2">
        <SignedIn>
          <SignOutButton  >
            <div className="flex cursor-pointer gap-4 items-center bg-sidebar-inactive rounded-xl py-4 px-3">
              <Image
                src={"/assets/logout.svg"}
                alt="logout" 
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg-hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
