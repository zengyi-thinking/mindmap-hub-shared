import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Activity as ActivityIcon, Shield, Settings } from 'lucide-react';
import InterfaceSettings from '@/components/profile/InterfaceSettings';
import PersonalInfo from '@/components/profile/PersonalInfo';
import AccountActivity from '@/components/profile/AccountActivity';
import DataPrivacy from '@/components/profile/DataPrivacy';

export default function ProfilePage() {
  const profileTabs = [
    {
      id: 'personal',
      icon: <User className="h-5 w-5" />,
      label: '个人资料'
    },
    {
      id: 'activity',
      icon: <ActivityIcon className="h-5 w-5" />,
      label: '账户活动'
    },
    {
      id: 'privacy',
      icon: <Shield className="h-5 w-5" />,
      label: '数据隐私'
    },
    {
      id: 'interface',
      icon: <Settings className="h-5 w-5" />,
      label: '界面设置'
    }
  ];

  return (
    <main className="container max-w-6xl py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">个人中心</h1>
          <p className="text-muted-foreground">管理您的个人资料和账户设置</p>
        </div>
        
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            {profileTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="personal">
            <PersonalInfo />
          </TabsContent>
          
          <TabsContent value="activity">
            <AccountActivity />
          </TabsContent>
          
          <TabsContent value="privacy">
            <DataPrivacy />
          </TabsContent>
          
          <TabsContent value="interface">
            <InterfaceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 