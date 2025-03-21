import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, UserCircle2, Users } from "lucide-react";

const QuickAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="glass-card overflow-hidden relative">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
        <CardTitle className="text-xl font-semibold tracking-tight">快速访问</CardTitle>
        <CardDescription>常用功能入口</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 relative">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 btn-effect group"
          onClick={() => navigate('/my-mindmaps')}
        >
          <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-300">
            <Brain className="h-4 w-4 text-blue-500" />
          </div>
          <span>思维导图</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 btn-effect group"
          onClick={() => navigate('/material-search')}
        >
          <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </div>
          <span>学习资料</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 btn-effect group"
          onClick={() => navigate('/personal')}
        >
          <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
            <UserCircle2 className="h-4 w-4 text-purple-500" />
          </div>
          <span className="font-medium">个人中心</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 btn-effect group"
          onClick={() => navigate('/discussion')}
        >
          <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 group-hover:scale-110 transition-transform duration-300">
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <span className="font-medium">讨论交流</span>
        </Button>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
