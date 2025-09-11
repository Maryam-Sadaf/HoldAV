interface HeadingProps {
  title?: string | null;
  subTitle?: string | null;
  backgroundColor?: boolean;
  flex?: boolean;
}
const Heading = ({ title, subTitle, backgroundColor, flex }: HeadingProps) => {
  return (
    <div className="w-full py-5 mx-auto ralative ">
      {flex ? (
        <div className="flex items-center">
          <h1 className="font-bold text-[25px] capitalize">{title}</h1>
          <div
            className={` ${
              backgroundColor ? "bg-light/10" : undefined
            } max-w-full  md:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] pl-2 `}
          >
            <h5 className=" text-[14px] ml-2">{subTitle}</h5>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="py-5 text-2xl font-bold ">{title}</h1>
          <div
            className={`
      ${backgroundColor ? "bg-light/10" : undefined}
      max-w-full  md:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px]
   `}
          >
            <h5 className="pb-5  text-[14px]">{subTitle}</h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default Heading;
