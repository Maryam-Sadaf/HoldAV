"use client";

interface WidthProps {
  children: React.ReactNode;
  medium?: boolean;
}

const Width = ({ children, medium }: WidthProps) => {
  return (
    <div
      className={`${
        medium &&
        "max-w-full md:max-w-[200px] xl:max-w-[200px] 2xl:max-w-[200px] py-5"
      } ${
        !medium &&
        "w-full relative max-w-full  md:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px]"
      }`}
    >
      {children}
    </div>
  );
};

export default Width;
