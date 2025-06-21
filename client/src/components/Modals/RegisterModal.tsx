"use client";

import useRegisterModal from "@/hooks/useRegisterModal";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import { Heading } from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import useLoginModal from "../../hooks/useLoginModal";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal()
  const [isLoading, setIsLoading] = useState(false);
  //register giup gan cac input,... voi he thong quan li react-hook-form
  //giup truyen cac rule nhu required, maxLength, ...
  //tu dung cap nhat gia tri ma khong can onChange khi nguoi dung nhap vao input
  const { register, handleSubmit, formState: { errors } } = useForm<
    FieldValues
  >({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });
  // dung FieldValue de thay the cho viec tao Props
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`,{
        name: data.name,    
        email: data.email,
        password: data.password
      }).catch((error) => {
          toast.error("Something went wrong")
      })
      registerModal.onClose();
        loginModal.onOpen()
    } catch (error) {
      console.log(error)
    }



    setIsLoading(false)

    // axios
    //   .post("/api/register", data)
    //   .then(() => {
    //     toast.success("Success")
    //     registerModal.onClose();
    //     loginModal.onOpen()
    //   })
    //   .catch(error => {
    //     // toast.error("Something went wrong"+ error);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

    const toggle = useCallback(() => {
      registerModal.onClose()
      loginModal.onOpen()
    },[loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-2">
      <Heading title="Welcome to Airbnb" subtitle="Create an access" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
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
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="gap-2 flex justify-center text-neutral-500 text-center mt-2 font-light">
        <div>Already have an account? </div>
        <div
          onClick={toggle}
          className="text-neutral-800 cursor-pointer hover:underline"
        >
          Log In
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
