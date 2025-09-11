"use client";

interface EmptyStateProps {
  title: string;
  subTitle: string;
}
const EmptyState = ({ title, subTitle }: EmptyStateProps) => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center  min-h-screen">
      <div className="text-start">
        <div className="text-2xl font-bold text-center">{title}</div>
        <div className="font-light text-neutral-500 mt-2">{subTitle}</div>
      </div>
    </div>
  );
};

export default EmptyState;
