
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useSidebar } from '@/contexts/SidebarContext';
import SidebarHeader from './SidebarHeader';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

const Sidebar: React.FC = () => {
  const { expanded } = useSidebar();

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "4rem" }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={expanded ? "expanded" : "collapsed"}
      animate={expanded ? "expanded" : "collapsed"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "flex flex-col h-screen bg-card border-r shadow-sm sticky top-0 left-0 z-30 overflow-y-auto py-6",
        expanded ? "w-64" : "w-16"
      )}
    >
      {/* 侧边栏背景装饰 */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-full h-64 opacity-20 blur-xl"
          style={{ background: 'radial-gradient(circle, rgba(125, 211, 252, 0.4) 0%, rgba(125, 211, 252, 0.1) 35%, rgba(125, 211, 252, 0) 70%)' }}
        />
      </div>
      
      <SidebarHeader />
      <SidebarUserProfile />
      <SidebarNavigation />
      <SidebarFooter />
    </motion.aside>
  );
};

export default Sidebar;
