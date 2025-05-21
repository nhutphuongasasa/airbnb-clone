import React from "react";
import { FieldErrors, UseFormRegister, FieldValues } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
//useFormRegister duoc react-hook-form cung cap dinh nghia kieu du lieu cho ham register
//tom lai la dung de khai bao cho react hieu ddo la register tu useForm()
interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Input = ({
  id,
  label,
  type,
  disabled,
  formatPrice,
  required,
  register,
  errors
}: InputProps) => {
  return (
    <div className="relative w-full">
      {formatPrice &&
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />}
      <input
        id={id}
        disabled={disabled}
        //cu phap nay dung dednag ky voi react-hook-form register la ham lay tu hook useForm register se tra ve cac thuoc tinh can thiet co input
        //required chua cac rule validate
        {...register(id, { required })}
        placeholder=" "
        type={type}
        className={`
          peer w-full p-4 pt-6 font-light bg-white
          border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />
      {/*react-hook-form ses tu dong danh dau loi vao o thong qu a errors[if]*/}
      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0]
        ${formatPrice ? "left-9" : "left-4"}
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id] ? "text-rose-500" : "text-zinc-400"}
      `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
