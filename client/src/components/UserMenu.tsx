"use client";

import React, { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";
import MenuItems from "./MenuItems";
import useRegisterModal from '../hooks/useRegisterModal'
import useLoginModal from "@/hooks/useLoginModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/types";
import useRentModal from "../hooks/useRentModel";
import { useRouter } from "next/navigation";
import axios from "axios";
import logout from "@/app/actions/logout";
import toast from "react-hot-toast";
import { set } from "date-fns";
import { el, ro } from "date-fns/locale";
import userUserStore from "@/hooks/useUser";

interface UserMenuProps {
  currentUser?: SafeUser | null
}

const UserMenu = () => {
  const router = useRouter()
  const userStore = userUserStore()
  const currentUser = userUserStore(state => state.currentUser)
  const rentModal = useRentModal()
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const [isOpen, setIsOpen] = useState(false);
  //dun useCallBack de ghi nho no vao memory tranh tao lai khi re-render
  const toggleOpen = useCallback(() => {
    setIsOpen(value => !value); // cu phap dam bao isOpen luon moi nhat
  }, []);

  //khi user logout se hien login model ngay lap tuc 
  // khi user da dnag nhap se khong hien login model du bam vao airbnb your home
  const onRent = useCallback(() => {
    if (!currentUser){
      return loginModal.onOpen()
    }

    rentModal.onOpen()
  }, [currentUser, loginModal, rentModal])
//khi click vao airbnb my home thi moi goi onRent lan dau tien 
//vi vay khi dang nhap xong moi khong hien RentModal
//khi click vao se chay onrent lan dau tien nen xuat hien rentModal
//va close RentModal khong lien quan den onclick(onRent) nen se khong cha lai

const handleLogout = async () => {
  try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`, {}, {
          withCredentials: true
      });
      console.log("Logout response:", res.data);
      if( res.status === 200) {
        toast.success("LogOut successfully!");
        userStore.onClear()
        // window.location.reload()
        setIsOpen(false);
      }else {
        // toast.error("error");
      }
  } catch (error) {
      console.error("Logout error:", error); // Log lỗi chi tiết
      // toast.error("Lỗi khi đăng xuất: " + error.message);
  }
};
  return (
    <div>
      <div className="relative z-20">
        <div className="flex flex-row items-center gap-3">
          <div
          //onClick={() => onRent()} hoac onClick={onRent}
            onClick={onRent}
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer "
          >
            {`Airbnb your home`}
          </div>
          <div
            onClick={() => {
              toggleOpen();
            }}
            className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
          >
            <AiOutlineMenu />
            <div className="hidden md:block">
              <Avatar src={currentUser?.images}/>
            </div>
          </div>
        </div>
      
      {isOpen && (
        <div className="absolute cursor-pointer rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
            {currentUser ? (
              <>
                <MenuItems onClick={() => router.push("/trips")} label="My Trips"></MenuItems>
                <MenuItems onClick={()=> router.push("/favorites")} label="My Favorite"></MenuItems>
                {/* <MenuItems onClick={()=> router.push("/reservations")} label="My Reservation"></MenuItems> */}
                <MenuItems onClick={()=> router.push("/properties")} label="My Properties"></MenuItems>
                <MenuItems onClick={rentModal.onOpen } label="Airbnb My Home"></MenuItems>
                <hr></hr>
                <MenuItems onClick={handleLogout} label="LogOut"></MenuItems>
              </>
            ) : (
              <>
                <MenuItems onClick={loginModal.onOpen} label="Login"></MenuItems>
                <MenuItems onClick={registerModal.onOpen} label="Sign up"></MenuItems>
              </>
            )}
        </div>
      ) }
      </div>
    </div>
  );
};

export default UserMenu;
