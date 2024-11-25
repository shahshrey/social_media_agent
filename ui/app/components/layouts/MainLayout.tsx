import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const MainLayout = ({ children, sidebar }: MainLayoutProps) => (
  <div className="flex flex-col lg:flex-row h-screen w-full">
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
      <motion.div 
        className="min-h-full bg-white rounded-2xl shadow-xl p-6 space-y-8 border border-indigo-100"
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
      <div className="w-full lg:w-[400px] h-screen border-t lg:border-l border-indigo-200 bg-white">
        {sidebar}
      </div>
    )}
  </div>
); 