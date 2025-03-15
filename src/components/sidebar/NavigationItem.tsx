
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ href, icon, label }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground"
      )}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};
