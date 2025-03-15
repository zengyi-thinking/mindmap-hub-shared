
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useSidebar } from '@/contexts/SidebarContext';
import SidebarHeader from './SidebarHeader';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

// Function to get usage time from localStorage
const getUsageTime = () => {
  const storedTime = localStorage.getItem('todayUsageTime');
  return storedTime ? parseInt(storedTime, 10) : 0;
};

const Sidebar: React.FC = () => {
  const { expanded } = useSidebar();
  const todayUsageTime = getUsageTime();
  const usagePercentage = Math.min(todayUsageTime / (4 * 60) * 100, 100); // 4 hours daily goal

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
        "flex flex-col h-screen bg-card border-r shadow-sm z-20 overflow-y-auto py-6 relative",
        expanded ? "w-64" : "w-16"
      )}
    >
      {/* 侧边栏背景装饰 */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-full h-64 opacity-20 blur-xl"
          style={{ background: 'radial-gradient(circle, rgba(125, 211, 252, 0.4) 0%, rgba(125, 211, 252, 0.1) 35%, rgba(125, 211, 252, 0) 70%)' }}
        />

        {/* Usage indicator - horizontal progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/10">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>
      
      <SidebarHeader />
      <SidebarUserProfile />
      <SidebarNavigation />
      <SidebarFooter />

      {/* Today's usage time indicator */}
      {expanded && (
        <div className="px-4 mt-auto mb-2">
          <div className="text-xs text-muted-foreground flex justify-between items-center">
            <span>今日使用:</span>
            <span>{Math.floor(todayUsageTime / 60)}小时 {todayUsageTime % 60}分钟</span>
          </div>
          <div className="w-full h-1.5 bg-primary/10 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
