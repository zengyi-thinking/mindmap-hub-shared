import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Globe, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaterialSearchTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onUploadClick: () => void;
}

const MaterialSearchTabs: React.FC<MaterialSearchTabsProps> = ({
  activeTab,
  onTabChange,
  onUploadClick,
  children
}) => {
  return (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <TabsList>
          <TabsTrigger value="search" className="flex items-center gap-1">
            <Search className="w-4 h-4" />
            资料搜索
          </TabsTrigger>
          <TabsTrigger value="mindmaps" className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            资料导图
          </TabsTrigger>
        </TabsList>
        
        <Button 
          onClick={onUploadClick}
          className="flex items-center gap-1 shrink-0"
        >
          <Upload className="w-4 h-4" />
          上传资料
        </Button>
      </div>
      
      {children}
    </Tabs>
  );
};

export default MaterialSearchTabs; 