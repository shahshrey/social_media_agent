import { ReactNode } from 'react';
import { useAppTheme } from '../hooks/useAppTheme';
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
  const { theme } = useAppTheme();
  
  return (
    <Collapsible>
      <CollapsibleTrigger 
        className={`flex w-full items-center justify-between rounded-lg 
          ${theme.card.base} 
          ${theme.card.hover}
          bg-card text-card-foreground p-4`}
      >
        <div className="flex items-center gap-2">
          <h2 className={`text-lg font-semibold ${theme.text.gradient}`}>{title}</h2>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
} 