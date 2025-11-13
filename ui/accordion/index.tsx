"use client";

import "../index.css";
import "./index.css";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AccordionProps {
  children: React.ReactNode;
}

interface AccordionItemProps {
  header: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: () => void;
}

const Accordion = ({ children }: AccordionProps) => {
  return (
    <div data-theme="trakteer" className="accordion">
      {children}
    </div>
  );
};

const AccordionItem = ({
  header,
  children,
  open,
  onOpenChange,
}: AccordionItemProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;

  const isOpen = isControlled ? open : internalOpen;
  const handleToggle = isControlled
    ? onOpenChange
    : () => setInternalOpen(!internalOpen);

  return (
    <div className={`accordion_item ${isOpen ? "accordion_item_active" : ""}`}>
      <div className="accordion_header" onClick={handleToggle}>
        {header}
        <span>{isOpen ? <X /> : <Plus />}</span>
      </div>
      {isOpen && <div className="accordion_content">{children}</div>}
    </div>
  );
};

export { Accordion, AccordionItem };
