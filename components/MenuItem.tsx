"use client";

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className="
        px-4 
        z-50
        py-3 
        bg-white
        hover:bg-neutral-100 
        transition
        font-semibold
        cursor-pointer
        "
    >
      {label}
    </div>
  );
};

export default MenuItem;
