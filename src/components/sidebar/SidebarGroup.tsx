
import React from 'react';

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({ title, children }) => {
  return (
    <div className="py-2">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2">{title}</h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};
