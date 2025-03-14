
import React from 'react';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const SidebarFooter: React.FC = () => {
  const { expanded } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

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
