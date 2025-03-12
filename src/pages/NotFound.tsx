import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 顶部渐变光效 */}
        <div 
          className="absolute -top-[30%] -left-[10%] w-[120%] h-[50%] opacity-30 blur-3xl" 
          style={{ 
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.4) 0%, rgba(125, 211, 252, 0.1) 35%, rgba(125, 211, 252, 0) 70%)'
          }}
        />
        
        {/* 底部渐变光效 */}
        <div 
          className="absolute -bottom-[30%] right-[10%] w-[100%] h-[50%] opacity-30 blur-3xl" 
          style={{ 
            background: 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, rgba(192, 132, 252, 0.1) 35%, rgba(192, 132, 252, 0) 70%)'
          }}
        />
      </div>
      
      <div className="text-center z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold mb-4 text-primary">404</h1>
        </motion.div>
        
        <motion.p 
          className="text-2xl text-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Oops! Page not found
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link to="/">
              <Home size={18} />
              Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/dashboard">
              <ArrowLeft size={18} />
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
