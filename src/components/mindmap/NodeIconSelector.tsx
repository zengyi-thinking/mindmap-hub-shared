
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { icons } from 'lucide-react';

interface NodeIconSelectorProps {
  onSelect: (iconName: string) => void;
}

const NodeIconSelector: React.FC<NodeIconSelectorProps> = ({ onSelect }) => {
  // Get all icon names from lucide-react
  const iconNames = Object.keys(icons);
  
  // Common icon categories for mind maps
  const recommendedIcons = [
    'Brain', 'Lightbulb', 'GraduationCap', 'Book', 'BookOpen', 
    'FileText', 'Files', 'FolderOpen', 'Folder', 'Landmark',
    'Library', 'MessagesSquare', 'Newspaper', 'PenTool', 'Presentation',
    'ScrollText', 'Search', 'Star', 'Target', 'Award',
    'BadgeCheck', 'Briefcase', 'Building', 'Calendar', 'Code',
    'Cpu', 'Database', 'Flag', 'Globe', 'Heart',
    'Home', 'Image', 'Info', 'Link', 'List',
    'Lock', 'Map', 'MapPin', 'User', 'Users'
  ];

  // Filter only recommended icons first
  const filteredIcons = iconNames.filter(name => 
    recommendedIcons.includes(name)
  );

  return (
    <div className="w-full p-2">
      <h3 className="text-sm font-medium mb-2">推荐图标</h3>
      <div className="grid grid-cols-5 gap-2">
        {filteredIcons.map(iconName => {
          const IconComponent = icons[iconName];
          return (
            <button
              key={iconName}
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => onSelect(iconName)}
            >
              <IconComponent className="h-6 w-6 mb-1" />
              <span className="text-xs text-center overflow-hidden text-ellipsis w-full">
                {iconName}
              </span>
            </button>
          );
        })}
      </div>
      
      <h3 className="text-sm font-medium mt-4 mb-2">所有图标</h3>
      <ScrollArea className="h-40">
        <div className="grid grid-cols-5 gap-2">
          {iconNames.map(iconName => {
            if (recommendedIcons.includes(iconName)) return null;
            const IconComponent = icons[iconName];
            return (
              <button
                key={iconName}
                className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => onSelect(iconName)}
              >
                <IconComponent className="h-6 w-6 mb-1" />
                <span className="text-xs text-center overflow-hidden text-ellipsis w-full">
                  {iconName}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NodeIconSelector;
