"use client";

import { signIn } from "next-auth/react";
import React, { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import { Heading } from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import useRegisterModal from "../../hooks/useRegisterModal";

const LoginModal = () => {
  const router = useRouter()
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal()
  const [isLoading, setIsLoading] = useState(false);
  //register giup gan cac input,... voi he thong quan li react-hook-form
  //giup truyen cac rule nhu required, maxLength, ...
  //tu dung cap nhat gia tri ma khong can onChange khi nguoi dung nhap vao input
  const { register, handleSubmit, formState: { errors } } = useForm<
    FieldValues
  >({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  // dung FieldValue de thay the cho viec tao Props
  const onSubmit: SubmitHandler<FieldValues> = data => {
    //khi set loading = true thi disabled cung bang true lam cho button khong bam duoc nua
    setIsLoading(true);
    signIn('credentials', {
      ...data,
      redirect: false
    })
    .then((callback) => {
      setIsLoading(false)
      
      if(callback?.ok){
        toast.success('Logged In')
        router.refresh()
        loginModal.onClose()
      }

      if(callback?.error){
        toast.error(callback.error)
      }
    })
  };

  const toggle = useCallback(() => {
    loginModal.onClose()
    registerModal.onOpen()
  },[loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-2">
      <Heading title="Welcome to Airbnb" subtitle="Login to Account" />
      <Input
        id="email"
        label="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        type="password"
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn('google')}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />
      <div className="gap-2 flex justify-center text-neutral-500 text-center mt-2 font-light">
        <div>First time using Airbnb? </div>
        <div
          onClick={toggle}
          className="text-neutral-800 cursor-pointer hover:underline"
        >
          Create an account
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
