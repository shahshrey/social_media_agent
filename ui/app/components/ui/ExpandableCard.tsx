import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardContent } from "./card";
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ExpandableCardProps {
  isExpanded: boolean;
  onToggle: () => void;
  header: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  index: number;
}

export const ExpandableCard = ({
  isExpanded,
  onToggle,
  header,
  actions,
  children,
  index
}: ExpandableCardProps) => {
  const { theme } = useAppTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...theme.animation.spring, delay: index * 0.1 }}
    >
      <Card className={cn(
        "group",
        theme.card.base,
        isExpanded ? theme.card.expanded : theme.card.hover
      )}>
        <CardHeader 
          onClick={onToggle}
          className="cursor-pointer flex flex-row items-center justify-between space-y-0 group-hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1 pr-4">
            {header}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-primary" />
            </motion.div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <CardContent>
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}; 