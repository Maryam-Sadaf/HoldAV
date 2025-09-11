"use client";

import { IconType } from "react-icons";

interface CardProps {
  label: string | null;
  outline?: boolean | null;
  number?: string | number | null;
  icon?: IconType;
  flex?: boolean;
}

const Card: React.FC<CardProps> = ({
  label,
  outline,
  number,
  icon: Icon,
  flex,
}) => {
  return (
    <button
      className={`
          relative
          disabled:opacity-70
          disabled:cursor-not-allowed
          rounded-lg
          hover:opacity-80
          transition
          w-full
          
          ${outline ? "bg-gray-100" : "bg-[#2a44a1]"}
          ${outline ? "border-black" : "border-[#2a44a1]"}
          ${outline ? "text-black" : "text-white"}
          ${outline && "border"}
          ${outline && "text-md"}
          ${outline && "py-3"}
        
        `}
    >
      {flex ? (
        <div className="flex items-center justify-start">
          {Icon && (
            <Icon size={20} className="absolute left-4 top-3 text-violet-500" />
          )}
          <div className="ml-11 text-[14px]">{label}</div>
        </div>
      ) : (
        <>
          <h1 className="mb-2 text-2xl font-bold">{number}</h1>
          <span className="mb-2 text-sm font-light capitalizee">{label}</span>
        </>
      )}
    </button>
  );
};

export default Card;
