import { ReactNode } from 'react';
import { useThemeStyles } from '../hooks/useThemeStyles';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
}

export function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const styles = useThemeStyles();
  
  return (
    <Collapsible>
      <CollapsibleTrigger 
        className={`flex w-full items-center justify-between rounded-lg 
          ${styles.card.base} 
          ${styles.card.hover}
          bg-background-subtle p-4`}
      >
        <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>{title}</h2>
        <ChevronDown className="h-5 w-5 text-slate" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
} 