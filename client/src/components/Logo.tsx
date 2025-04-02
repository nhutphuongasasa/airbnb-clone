"use client";

import Image from "next/image";
// import { useRouter } from "next/navigation";

const Logo = () => {
  return (
    <div className="flex items-center text-2xl gap-2 text-red-500 font-bold">
      <Image
        alt="Logo"
        className="hidden md:block cursor-pointer"
        height={"32"}
        width={"32"}
        src={"/Airbnb_Logo_PNG_(10).png"}
      />
      airbnb
    </div>
  );
};

export default Logo;
