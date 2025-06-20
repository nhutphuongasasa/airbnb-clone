"use client";

import React, { useEffect, useRef, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/types";
import Categories from "./Categories";
import axios from "axios";
import { useRouter } from "next/navigation";
import userUserStore from "@/hooks/useUser";
import { stat } from "fs";
import { fetchProfile } from "@/hooks/useProfile";
import { effect } from "zod";
import { Bell, HomeIcon } from "lucide-react";
import { BsBalloon } from "react-icons/bs";

interface NavbarProps {
  currentUser?: SafeUser | null;
}


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeField, setActiveField] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)


  // const [currentUser, setCurrentUser] = useState()
  // // const router = useRouter();

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     try {
  //       const currentUser = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/profile`, {
  //         withCredentials: true
  //       }).then(res => res.data.user).catch(() => null);

  //       setCurrentUser(currentUser);
  //       // router.refresh();
  //     } catch (error) {
  //       return
  //     }
  //   }

  //   fetchCurrentUser();
  // },[])


  useEffect(() => {
    fetchProfile()
  },[])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 99)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActiveField(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const currentUser = userUserStore(state => state.currentUser)


  return (
    <div className={`fixed top-0 left-0 right-0 z-10 bg-white border-b transition-all duration-300 ease-in-out ${
      isScrolled ? "py-2 shadow-md" : "py-6"
    }`}>

    <div className="fixed w-full bg-white shadow-sm">
      <div className="pb-4 border-b-[1px]">
        <Container>
            <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
              <Logo />
              <Search />
              <UserMenu />
            </div>

        </Container>
      </div>
      {/* <Categories /> */}
    </div>
    </div>
  );
};

export default Navbar;
