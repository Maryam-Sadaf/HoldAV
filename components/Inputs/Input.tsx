"use client";

import React, { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  bgBackground?: boolean;
  required: boolean;
  isDisabled?: any;
  onClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  bgBackground,
  onClick,
  required,
  isDisabled,
  disabled,
  register,
  errors,
}) => {
  return (
    <div className="w-full relative">
      <input
        id={id}
        disabled={disabled}
        {...register(id, {
          required: { value: required, message: "This field is required" },
        })}
        type={type}
        className={`
          peer
          w-full
          p-3
          pt-4
          font-light
          bg-white
          border-2
          rounded-sm  
          outline-none
          transition
          disabled:opacity-70
          disabled-cursor-not-allowed
          ${errors?.[id] ? "border-rose-500" : "border-[#2a44a1]"}
          ${errors?.[id] ? "focus:border-rose-500" : "focus:border-[#2a44a1]"}
          ${
            isDisabled &&
            "border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border border-t-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0"
          }
        `}
      />
      <label
        className={`
          absolute text-sm duration-150 transform -translate-y-3 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-70 peer-focus:-translate-y-3
          ${errors?.[id] ? "text-rose-500" : "text-zinc-400"}
        
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
