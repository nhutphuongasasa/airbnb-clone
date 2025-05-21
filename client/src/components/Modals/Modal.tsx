"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel
}: ModalProps) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(
    () => {
      setShowModal(isOpen);
    },
    [isOpen]
  );
  //useCallBack dung de ghi vao memory
  const handleClose = useCallback(
    () => {
      if (disabled) {
        return;
      }

      setShowModal(false);
      setTimeout(() => {
        onClose();
      }, 300);
    },
    [disabled, onClose]
  );

  const handleSubmit = useCallback(
    () => {
      if (disabled) {
        return;
      }

      onSubmit();
    },
    [disabled, onSubmit]
  );

  const handleSecondaryAction = useCallback(
    () => {
      if (disabled || !secondaryAction) {
        return;
      }

      secondaryAction();
    },
    [disabled, secondaryAction]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className=" justify-center items-center flex overflow-hidden md:overflow-auto scrollbar-hide scroll-smooth fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div className="relative md:p-7 md:pt-20 w-full md:w-4/6 lg:w-3/6 xl:w-2/5 mx-auto h-full lg:h-auto md:h-auto">
        {/* Content */}
        <div
          className={`translate-x-0 transition duration-300 h-full pb-3 
        ${showModal ? "translate" : "translate-y-full"}
        ${showModal ? "opacity-100" : "opacity-0"}
        `}
        >
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*Header*/}
            <div className="flex items-center p-3 rounded-t justify-center relative border-b-[1px]">
              <button
                onClick={handleClose}
                className="p-x-6 border-0 hover:opacity-70 transition absolute left-9"
              >
                <IoMdClose size={18} />
              </button>
              <div className="text-lg font-semibold">
                {title}
              </div>
            </div>
            {/*body*/}
            <div className="relative p-6 pt-4 pb-3 flex-auto">
              {body}
            </div>
            {/*footer*/}
            <div className="flex flex-col gap-2 p-6">
              <div className="flex flex-row items-center gap-4 w-full">
                {secondaryAction &&
                  secondaryActionLabel &&
                  <Button
                    outline
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                  />}
                <Button
                  disabled={disabled}
                  label={actionLabel}
                  onClick={handleSubmit}
                />
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
