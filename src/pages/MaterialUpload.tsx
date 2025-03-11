
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaterialUploadForm from '@/components/materials/MaterialUploadForm';
import MaterialBrowser from '@/components/materials/MaterialBrowser';

const MaterialUpload: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            资料上传与分享
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="text-muted-foreground"
          >
            上传资料并与其他用户分享，通过标签归类整理
          </motion.p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">上传资料</TabsTrigger>
          <TabsTrigger value="browse">浏览资料</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MaterialUploadForm />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="browse">
          <MaterialBrowser />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialUpload;
