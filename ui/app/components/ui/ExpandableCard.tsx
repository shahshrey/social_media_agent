import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardContent } from "./card";
import { ReactNode } from 'react';

const cardAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    type: "spring",
    stiffness: 100,
    damping: 15,
  }
};

const contentAnimations = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

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
  return (
    <motion.div 
      {...cardAnimations}
      transition={{ ...cardAnimations.transition, delay: index * 0.1 }}
    >
      <Card className="group hover:border-indigo-300 transition-all duration-300">
        <CardHeader 
          onClick={onToggle}
          className="cursor-pointer flex flex-row items-center justify-between space-y-0 group-hover:bg-indigo-50/50 transition-colors"
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
              <ChevronDown className="h-5 w-5 text-indigo-600" />
            </motion.div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div {...contentAnimations}>
              <CardContent className="border-t border-indigo-100 bg-white">
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}; 