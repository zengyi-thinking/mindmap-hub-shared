
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Info, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ReflectionTabProps = {
  reflection: string;
  setReflection: (value: string) => void;
  saveReflection: () => void;
};

const ReflectionTab: React.FC<ReflectionTabProps> = ({ 
  reflection, 
  setReflection, 
  saveReflection 
}) => {
  return (
    <div className="mt-0 space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <MessageSquare className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-lg">学习反思</CardTitle>
              <CardDescription>记录您的学习心得和总结</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Info className="h-4 w-4 mr-1" />
            <span>您的反思将被保存，并且只有您能看到</span>
          </div>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="在这里记录您的学习反思和总结..."
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={saveReflection} className="gap-2">
              <Save className="h-4 w-4" />
              保存反思
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReflectionTab;
