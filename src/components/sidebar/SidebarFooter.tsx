import React from 'react';
import { cn } from '@/lib/utils';
import { LogOut, Moon, Sun, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const SidebarFooter: React.FC = () => {
  const { expanded } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, focusMode, toggleFocusMode } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className="mt-auto px-3">
      <div className={cn(
        "text-xs font-semibold mb-2 text-muted-foreground",
        !expanded && "text-center"
      )}>
        {expanded ? '设置' : '设置'}
      </div>
      
      {/* 暗色模式切换按钮 */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={toggleDarkMode}
              className={cn(
                "flex items-center gap-x-3 px-3 py-2.5 rounded-lg w-full text-left justify-start mb-1",
                darkMode ? "hover:bg-sky-900/10" : "hover:bg-sky-100/60",
                !expanded && "justify-center"
              )}
            >
              {darkMode ? (
                <Sun size="1.2rem" className="text-yellow-400" />
              ) : (
                <Moon size="1.2rem" className="text-blue-800" />
              )}
              {expanded && (
                <span className="text-sm">
                  {darkMode ? '切换到亮色模式' : '切换到暗色模式'}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          {!expanded && (
            <TooltipContent side="right">
              {darkMode ? '切换到亮色模式' : '切换到暗色模式'}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      {/* 专注模式切换按钮 */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={toggleFocusMode}
              className={cn(
                "flex items-center gap-x-3 px-3 py-2.5 rounded-lg w-full text-left justify-start mb-1",
                focusMode ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted",
                !expanded && "justify-center"
              )}
            >
              <Focus size="1.2rem" className={focusMode ? "text-primary" : ""} />
              {expanded && (
                <span className="text-sm">
                  {focusMode ? '退出专注模式' : '进入专注模式'}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          {!expanded && (
            <TooltipContent side="right">
              {focusMode ? '退出专注模式' : '进入专注模式'}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      {/* 退出登录按钮 */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-x-3 px-3 py-2.5 rounded-lg w-full text-left justify-start hover:bg-destructive/10 text-destructive",
                !expanded && "justify-center"
              )}
            >
              <LogOut size="1.2rem" />
              {expanded && <span className="text-sm">退出登录</span>}
            </Button>
          </TooltipTrigger>
          {!expanded && <TooltipContent side="right">退出登录</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SidebarFooter;
