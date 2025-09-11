interface AdminProps {
  title?: string;
  subTitle?: string;
  description?: string;
  description2?: string;
  backgroundColor?: boolean;
}
import {
  SafeAccordion as Accordion,
  SafeAccordionContent as AccordionContent,
  SafeAccordionItem as AccordionItem,
  SafeAccordionTrigger as AccordionTrigger,
} from "@/components/SafeAccordion";

const Updates = ({
  title,
  subTitle,
  backgroundColor,
  description,
  description2,
}: AdminProps) => {
  return (
    <div className="w-full mx-auto relaive">
      <h1 className="py-1 text-lg font-bold ">{title}</h1>
      <div
        className={`
      ${backgroundColor ? "bg-[#fbfaeb]" : undefined}
      max-w-full  md:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] text-md
   `}
      >
        <h5 className="text-[14px] py-1 ">{subTitle}</h5>
      </div>
      <div
        className={`
      ${backgroundColor ? "bg-[#fbfaeb]" : undefined}
      max-w-full  md:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] text-sm  
   `}
      >
        <h5 className="text-[14px] py-1 ">{description}</h5>
        {description2 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-violet-500">
                Les mer
              </AccordionTrigger>
              <AccordionContent>{description2}</AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Updates;
