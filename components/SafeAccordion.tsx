"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeAccordionProps {
  type: "single" | "multiple";
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface SafeAccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SafeAccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SafeAccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const SafeAccordion: React.FC<SafeAccordionProps> = ({ 
  type, 
  collapsible, 
  children, 
  className 
}) => {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
};

const SafeAccordionItem: React.FC<SafeAccordionItemProps> = ({ 
  value, 
  children, 
  className 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("border-b", className)} data-value={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SafeAccordionTrigger) {
            return React.cloneElement(child, {
              ...child.props,
              onClick: () => setIsOpen(!isOpen),
              isOpen
            });
          }
          if (child.type === SafeAccordionContent) {
            return React.cloneElement(child, {
              ...child.props,
              isOpen
            });
          }
        }
        return child;
      })}
    </div>
  );
};

const SafeAccordionTrigger: React.FC<SafeAccordionTriggerProps & { isOpen?: boolean }> = ({ 
  children, 
  className, 
  onClick,
  isOpen 
}) => {
  return (
    <div className="flex">
      <button
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
          className
        )}
        onClick={onClick}
        type="button"
      >
        {children}
        <ChevronDown 
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
    </div>
  );
};

const SafeAccordionContent: React.FC<SafeAccordionContentProps & { isOpen?: boolean }> = ({ 
  children, 
  className,
  isOpen 
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-hidden text-sm transition-all duration-200 ease-out",
        className
      )}
      style={{ 
        maxHeight: isOpen ? "500px" : "0px",
        opacity: isOpen ? 1 : 0
      }}
    >
      <div className={cn("pb-4 pt-0")}>{children}</div>
    </div>
  );
};

export { SafeAccordion, SafeAccordionItem, SafeAccordionTrigger, SafeAccordionContent };
