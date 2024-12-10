import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const MainLayout = ({ children, sidebar }: MainLayoutProps) => (
  <div className="flex flex-col lg:flex-row h-screen w-full">
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-background">
      <motion.div 
        className="min-h-full bg-gradient-to-br from-background from-10% via-card/95 via-50% to-muted/80 to-90% rounded-2xl shadow-lg shadow-black/40 backdrop-blur-[2px] p-6 space-y-8 border border-border/20"
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
      <div className="w-full lg:w-[400px] h-screen border-t lg:border-l border-border/20 bg-card">
        {sidebar}
      </div>
    )}
  </div>
); 