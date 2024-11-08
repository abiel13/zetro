import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Topbar = () => {
  return (
    <nav className="topbar border-[#E5E7EB] border-b-2">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src={"/logo.svg"} alt={"logo"} width={28} height={28} />
        <p className="text-heading3-bold text-[#333] ">Zetro</p>
      </Link>
      <div className="flex items-center gap-1">
        <OrganizationSwitcher
          appearance={{
            baseTheme:neobrutalism,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />{" "}
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src={"/assets/logout.svg"}
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
