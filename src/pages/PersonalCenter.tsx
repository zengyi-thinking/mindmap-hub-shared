import React from 'react';
import UserProfileForm from '@/components/profile/UserProfileForm';
import UserActivityLogs from '@/components/profile/UserActivityLogs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, ActivityIcon, FileIcon, ShieldIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import styles from './PersonalCenter.module.css';
import ThemeSettings from '@/components/theme/ThemeSettings';

const PersonalCenter = () => {
  const { user } = useAuth();
  
  return (
    <div className={`space-y-6 ${styles.pageBackground}`}>
      <div className={styles.gradientOverlay}></div>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">个人中心</h1>
        <p className="text-muted-foreground mt-1">
          管理您的个人资料和账户设置
        </p>
      </motion.div>
      
      <Tabs defaultValue="profile" className={`w-full ${styles.tabsContainer}`}>
        <TabsList className={`grid grid-cols-3 mb-8 ${styles.tabsList}`}>
          <TabsTrigger value="profile" className={`flex items-center gap-1.5 ${styles.tabTrigger} data-[state=active]:${styles.activeTab}`}>
            <User className="h-4 w-4" />
            个人资料
          </TabsTrigger>
          <TabsTrigger value="activity" className={`flex items-center gap-1.5 ${styles.tabTrigger} data-[state=active]:${styles.activeTab}`}>
            <ActivityIcon className="h-4 w-4" />
            账户活动
          </TabsTrigger>
          <TabsTrigger value="security" className={`flex items-center gap-1.5 ${styles.tabTrigger} data-[state=active]:${styles.activeTab}`}>
            <ShieldIcon className="h-4 w-4" />
            数据隐私
          </TabsTrigger>
          <TabsTrigger value="appearance" className={`flex items-center gap-1.5 ${styles.tabTrigger} data-[state=active]:${styles.activeTab}`}>
            <User className="h-4 w-4" />
            界面设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className={styles.contentFadeIn}>
          <UserProfileForm />
        </TabsContent>

        <TabsContent value="activity" className={styles.contentFadeIn}>
          <UserActivityLogs />
        </TabsContent>

        <TabsContent value="security" className={styles.contentFadeIn}>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <div className={`${styles.securityCard} bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-6`}>
                  <div className={`${styles.securityHeader} flex items-center gap-3 mb-4`}>
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <ShieldIcon className="h-6 w-6 text-green-700 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
                      数据隔离状态: <span className="text-green-600 dark:text-green-400">已激活</span>
                    </h3>
                  </div>
                  
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    您的账户当前处于受保护状态，所有个人数据均已隔离，确保您的隐私安全。
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">数据访问控制</h4>
                      <p className="text-sm text-green-700 dark:text-green-400">仅您本人可以访问您的个人文件和资料，其他用户无法查看或修改。</p>
                    </div>
                    
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">实时同步保护</h4>
                      <p className="text-sm text-green-700 dark:text-green-400">您在一处所做的更改会安全地同步到您的所有设备，无需担心数据泄露。</p>
                  </div>
                    
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">完整的隐私保护</h4>
                      <p className="text-sm text-green-700 dark:text-green-400">所有跟踪和日志记录仅限于您的账户内，确保活动历史的私密性。</p>
                    </div>
                    
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">严格的权限隔离</h4>
                      <p className="text-sm text-green-700 dark:text-green-400">即使是管理员也无法直接查看您的私人数据，除非您明确分享。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </motion.div>
            </TabsContent>
            
        <TabsContent value="appearance" className={styles.contentFadeIn}>
          <ThemeSettings />
            </TabsContent>
          </Tabs>
    </div>
  );
};

export default PersonalCenter;
