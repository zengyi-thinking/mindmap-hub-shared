import React from 'react';
import { Layout, Upload, FolderArchive, Search, Globe, Brain, Edit, MessageSquare, Users, UserCircle, FileText } from 'lucide-react';
import { NavigationItem } from '@/components/sidebar/NavigationItem';
import { SidebarGroup } from '@/components/sidebar/SidebarGroup';
import { useAuth } from '@/lib/auth';

const SidebarNavigation: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="space-y-1">
      <NavigationItem href="/dashboard" icon={<Layout />} label="仪表盘" />
      
      <SidebarGroup title="资料管理">
        <NavigationItem 
          href="/material-upload" 
          icon={<Upload />} 
          label="资料上传" 
        />
        <NavigationItem 
          href="/material-management" 
          icon={<FolderArchive />} 
          label="我的资料" 
        />
        <NavigationItem 
          href="/material-search" 
          icon={<Search />} 
          label="资料搜索" 
        />
        <NavigationItem 
          href="/file-map" 
          icon={<FileText />} 
          label="文件地图" 
        />
        <NavigationItem 
          href="/global-material-map" 
          icon={<Globe />} 
          label="全局资料图谱" 
        />
      </SidebarGroup>
      
      <SidebarGroup title="思维导图">
        <NavigationItem 
          href="/my-mindmaps" 
          icon={<Brain />} 
          label="我的思维导图" 
        />
        <NavigationItem 
          href="/mindmap-editor/new" 
          icon={<Edit />} 
          label="创建思维导图" 
        />
      </SidebarGroup>
      
      <SidebarGroup title="社区">
        <NavigationItem 
          href="/discussion-center" 
          icon={<MessageSquare />} 
          label="讨论中心" 
        />
      </SidebarGroup>
      
      {isAdmin && (
        <SidebarGroup title="管理员">
          <NavigationItem 
            href="/user-management" 
            icon={<Users />} 
            label="用户管理" 
          />
        </SidebarGroup>
      )}
      
      <NavigationItem 
        href="/personal-center" 
        icon={<UserCircle />} 
        label="个人中心" 
      />
    </div>
  );
};

export default SidebarNavigation;
