
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, FileText, Users, Search, MessageSquare } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: '思维导图创建与管理',
      description: '轻松创建和管理思维导图，整理知识结构和思路。',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: FileText,
      title: '学习资料分享',
      description: '上传和分享学习资料，添加标签便于分类和查找。',
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      icon: Search,
      title: '标签化思维导图搜索',
      description: '通过标签搜索学习资料，以思维导图形式呈现结果。',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      icon: MessageSquare,
      title: '讨论交流',
      description: '就学习话题展开讨论，与其他用户交流经验和想法。',
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      icon: Users,
      title: '社区互动',
      description: '加入学习社区，结交志同道合的朋友，共同进步。',
      color: 'bg-red-500/10 text-red-500',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center justify-center">
          <Brain className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">思维导图中心</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/app" className="text-sm font-medium hover:underline underline-offset-4">
            进入应用
          </Link>
          <Link to="#features" className="text-sm font-medium hover:underline underline-offset-4">
            功能介绍
          </Link>
          <Link to="#about" className="text-sm font-medium hover:underline underline-offset-4">
            关于我们
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  知识整理与学习分享平台
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  创建思维导图，分享学习资料，连接学习社区
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Link to="/app">
                  <Button size="lg" className="gap-1">
                    立即开始
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="#features">
                  <Button size="lg" variant="outline">
                    了解更多
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">主要功能</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  我们提供全面的知识管理和学习工具，帮助您更高效地学习和分享
                </p>
              </motion.div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="mt-4">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0], 
                    transition: { 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "loop", 
                      ease: "easeInOut" 
                    } 
                  }}
                >
                  <Brain className="h-16 w-16 text-primary mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                  准备好开始您的学习之旅了吗？
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
                  加入我们的平台，创建思维导图，分享学习资料，与学习社区交流互动
                </p>
                <Link to="/app">
                  <Button size="lg" className="gap-1">
                    立即开始
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 思维导图中心. 保留所有权利.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            条款和条件
          </Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            隐私政策
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Index;
