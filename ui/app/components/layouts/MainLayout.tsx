import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useAppTheme } from '../../hooks/useAppTheme';

interface MainLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const MainLayout = ({ children, sidebar }: MainLayoutProps) => {
  const { theme } = useAppTheme();
  
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto gradient-background">
        <motion.div 
          className={`
            min-h-full 
            glass
            rounded-2xl 
            shadow-lg 
            shadow-black/10
            p-6 
            space-y-8 
            transition-all
            glass-hover
          `}
          layout
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut",
            layout: {
              duration: 0.3
            }
          }}
        >
          {children}
        </motion.div>
      </div>

      {sidebar && (
        <div className="w-full lg:w-[400px] h-screen border-t lg:border-l border-white/10 bg-[hsl(var(--layer-1))] bg-opacity-95 backdrop-blur-xl">
          {sidebar}
        </div>
      )}
    </div>
  );
}; 