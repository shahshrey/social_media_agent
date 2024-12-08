import { ReactNode } from 'react';
import { useThemeStyles } from '../hooks/useThemeStyles';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  tooltip?: string;
  children: ReactNode;
}

export function CollapsibleSection({ title, tooltip, children }: CollapsibleSectionProps) {
  const styles = useThemeStyles();
  
  return (
    <Collapsible>
      <CollapsibleTrigger 
        className={`flex w-full items-center justify-between rounded-lg 
          ${styles.card.base} 
          ${styles.card.hover}
          bg-background-subtle p-4`}
      >
        <div className="flex items-center gap-2">
          <h2 className={`text-lg font-semibold ${styles.text.gradient}`}>{title}</h2>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-slate cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <ChevronDown className="h-5 w-5 text-slate" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
} 