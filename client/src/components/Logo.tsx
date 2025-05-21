"use client";

import Image from "next/image";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter()

  return (
    <div className="flex items-center text-2xl gap-2 text-red-500 font-bold hover:cursor-pointer"  onClick={() => router.push("/")}>
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
