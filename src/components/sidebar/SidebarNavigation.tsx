import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BrainCircuit, 
  Search, 
  BookOpen, 
  FileUp, 
  MessageSquare, 
  User, 
  LayoutGrid, 
  Users 
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/lib/auth';
import SidebarNavItem from './SidebarNavItem';

const SidebarNavigation: React.FC = () => {
  const { expanded } = useSidebar();
  const { user } = useAuth();

  // 侧边栏导航项 - 修正路径与App.tsx中的路由匹配
  const navItems = [
    {
      title: '仪表盘',
      icon: <Home size="1.2rem" />,
      path: '/dashboard',
      roles: ['user', 'admin']
    },
    {
      title: '思维导图管理',
      icon: <BrainCircuit size="1.2rem" />,
      path: '/my-mindmaps',
      roles: ['user', 'admin']
    },
    {
      title: '资料搜索',
      icon: <Search size="1.2rem" />,
      path: '/material-search',
      roles: ['user', 'admin']
    },
    {
      title: '上传资料',
      icon: <FileUp size="1.2rem" />,
      path: '/material-upload',
      roles: ['user', 'admin']
    },
    {
      title: '讨论中心',
      icon: <MessageSquare size="1.2rem" />,
      path: '/discussion',
      roles: ['user', 'admin']
    },
    {
      title: '个人中心',
      icon: <User size="1.2rem" />,
      path: '/personal',
      roles: ['user', 'admin']
    },
    {
      title: '管理资料',
      icon: <LayoutGrid size="1.2rem" />,
      path: '/material-management',
      roles: ['admin']
    },
    {
      title: '用户管理',
      icon: <Users size="1.2rem" />,
      path: '/user-management',
      roles: ['admin']
    }
  ];

  const filteredNavItems = user
    ? navItems.filter(item => item.roles.includes(user.role))
    : navItems.filter(item => item.roles.includes('user'));

  return (
    <div className="flex-1 px-3">
      <div className={cn(
        "text-xs font-semibold mb-2 text-muted-foreground",
        !expanded && "text-center"
      )}>
        {expanded ? '导航菜单' : '菜单'}
      </div>
      <nav className="space-y-0.5">
        {filteredNavItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            title={item.title}
            icon={item.icon}
            path={item.path}
          />
        ))}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
