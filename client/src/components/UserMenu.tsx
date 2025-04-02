"use client";

import React, { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";
import MenuItems from "./MenuItems";
import useRegisterModal from '../hooks/useRegisterModal'

const UserMenu = () => {
  const registerModal = useRegisterModal()
  const [isOpen, setIsOpen] = useState(false);
  //dun useCallBack de ghi nho no vao memory tranh tao lai khi re-render
  const toggleOpen = useCallback(() => {
    setIsOpen(value => !value); // cu phap dam bao isOpen luon moi nhat
  }, []);

  return (
    <div>
      <div className="relative">
        <div className="flex flex-row items-center gap-3">
          <div
            onClick={() => {}}
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer "
          >
            Airbnb your home
          </div>
          <div
            onClick={() => {
              toggleOpen();
            }}
            className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
          >
            <AiOutlineMenu />
            <div className="hidden md:block">
              <Avatar />
            </div>
          </div>
        </div>
      
      {isOpen && (
        <div className="absolute cursor-pointer rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
            <>
            <MenuItems onClick={() => {}} label="Login"></MenuItems>
            <MenuItems onClick={registerModal.onOpen} label="Sign up"></MenuItems>
            </>
        </div>
      ) }
      </div>
    </div>
  );
};

export default UserMenu;
