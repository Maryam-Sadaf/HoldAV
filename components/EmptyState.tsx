"use client";

interface EmptyStateProps {
  title: string;
  subTitle: string;
  fullHeight?: boolean;
  children?: React.ReactNode;
}
const EmptyState = ({ title, subTitle, fullHeight = true, children }: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col gap-2 justify-center items-center ${fullHeight ? "min-h-screen" : "py-10"}`}
    >
      <div className="text-start">
        <div className="text-2xl font-bold text-center">{title}</div>
        <div className="font-light text-neutral-500 mt-2">{subTitle}</div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
};

export default EmptyState;
