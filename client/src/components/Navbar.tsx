"use client";

import React, { useEffect, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/types";
import Categories from "./Categories";
import axios from "axios";
import { useRouter } from "next/navigation";

interface NavbarProps {
  currentUser?: SafeUser | null;
}


const Navbar = ({ currentUse1r }: NavbarProps) => {
  const [currentUser, setCurrentUser] = useState()
  // const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/profile`, {
          withCredentials: true
        }).then(res => res.data.user).catch(() => null);

        setCurrentUser(currentUser);
        // router.refresh();
      } catch (error) {
        return
      }
    }

    fetchCurrentUser();
  },[])

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
      {/* <Categories /> */}
    </div>
  );
};

export default Navbar;
