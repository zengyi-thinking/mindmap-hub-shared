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
      color: 'bg-gradient-primary text-white',
    },
    {
      icon: FileText,
      title: '学习资料分享',
      description: '上传和分享学习资料，添加标签便于分类和查找。',
      color: 'bg-gradient-success text-white',
    },
    {
      icon: Search,
      title: '标签化思维导图搜索',
      description: '通过标签搜索学习资料，以思维导图形式呈现结果。',
      color: 'bg-gradient-accent text-white',
    },
    {
      icon: MessageSquare,
      title: '讨论交流',
      description: '就学习话题展开讨论，与其他用户交流经验和想法。',
      color: 'bg-gradient-warning text-white',
    },
    {
      icon: Users,
      title: '社区互动',
      description: '加入学习社区，结交志同道合的朋友，共同进步。',
      color: 'bg-gradient-info text-white',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-opacity-80 backdrop-blur-sm fixed w-full z-50">
        <Link to="/" className="flex items-center justify-center">
          <motion.div 
            className="h-9 w-9 rounded-full bg-gradient-primary text-white flex items-center justify-center"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Brain className="h-5 w-5" />
          </motion.div>
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
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-accent opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-primary">
                  知识整理与学习分享平台
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  创建思维导图，分享学习资料，连接学习社区
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Link to="/app">
                  <Button size="lg" className="gap-1 bg-gradient-primary bg-gradient-animate hover:shadow-lg">
                    立即开始
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="#features">
                  <Button size="lg" variant="outline" className="btn-enhanced">
                    了解更多
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute h-56 w-56 rounded-full bg-gradient-primary blur-3xl top-0 left-1/4 opacity-20"></div>
            <div className="absolute h-64 w-64 rounded-full bg-gradient-accent blur-3xl bottom-1/3 right-1/4 opacity-20"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-clip-text text-transparent bg-gradient-secondary">主要功能</h2>
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
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full glass-card card-3d">
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${feature.color}`}>
                          <feature.icon className="h-7 w-7" />
                        </div>
                        <CardTitle className="mt-4">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute h-[500px] w-[500px] rounded-full bg-gradient-primary blur-3xl top-1/4 -left-1/4 opacity-20 animate-pulse"></div>
            <div className="absolute h-[400px] w-[400px] rounded-full bg-gradient-accent blur-3xl bottom-1/4 -right-1/4 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="floating"
                >
                  <div className="h-20 w-20 rounded-full bg-gradient-primary text-white flex items-center justify-center mx-auto mb-6 breathing-glow">
                    <Brain className="h-10 w-10" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-primary">
                  准备好开始您的学习之旅了吗？
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
                  加入我们的平台，创建思维导图，分享学习资料，与学习社区交流互动
                </p>
                <Link to="/app">
                  <Button size="lg" className="gap-1 bg-gradient-primary bg-gradient-animate hover:shadow-lg">
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
