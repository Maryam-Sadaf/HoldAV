"use client";

import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  type?: boolean;
  icon?: IconType;
  loading?: boolean;
  loadingLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  loading,
  loadingLabel,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        ${outline ? "bg-white" : "bg-primary"}
        ${outline ? "border-black" : "border-secondary"}
        ${outline ? "text-black" : "text-white"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "py-1" : "py-3"}
        ${small ? "font-light" : "font-semibold"}
        ${small ? "border-[1px]" : "border-2"}
      `}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
            aria-hidden="true"
          />
        )}
        <span>{loading ? (loadingLabel ?? "Laster...") : label}</span>
      </span>
    </button>
  );
};

export default Button;
