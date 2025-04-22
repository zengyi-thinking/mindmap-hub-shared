
import React from 'react';
import { 
  Brain, 
  BookOpen, 
  FileText, 
  Globe, 
  Star, 
  Users, 
  Target, 
  Settings, 
  Home, 
  Layers, 
  Image, 
  Video, 
  Music, 
  Film, 
  Book, 
  BarChart, 
  Calendar, 
  Cloud, 
  Code, 
  Coffee, 
  Database, 
  Flag, 
  Folder, 
  Gift, 
  Heart, 
  Info, 
  Key, 
  LucideIcon,
  Mail, 
  Map, 
  MessageSquare, 
  Phone, 
  Search, 
  Shield, 
  ShoppingCart, 
  Tag, 
  Truck, 
  User, 
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NodeIconSelectorProps {
  onSelect: (iconName: string) => void;
}

const NodeIconSelector: React.FC<NodeIconSelectorProps> = ({ onSelect }) => {
  // Define available icons with their components and names
  const icons: { icon: React.ReactNode; name: string }[] = [
    { icon: <Brain />, name: 'Brain' },
    { icon: <BookOpen />, name: 'BookOpen' },
    { icon: <FileText />, name: 'FileText' },
    { icon: <Globe />, name: 'Globe' },
    { icon: <Star />, name: 'Star' },
    { icon: <Users />, name: 'Users' },
    { icon: <Target />, name: 'Target' },
    { icon: <Settings />, name: 'Settings' },
    { icon: <Home />, name: 'Home' },
    { icon: <Layers />, name: 'Layers' },
    { icon: <Image />, name: 'Image' },
    { icon: <Video />, name: 'Video' },
    { icon: <Music />, name: 'Music' },
    { icon: <Film />, name: 'Film' },
    { icon: <Book />, name: 'Book' },
    { icon: <BarChart />, name: 'BarChart' },
    { icon: <Calendar />, name: 'Calendar' },
    { icon: <Cloud />, name: 'Cloud' },
    { icon: <Code />, name: 'Code' },
    { icon: <Coffee />, name: 'Coffee' },
    { icon: <Database />, name: 'Database' },
    { icon: <Flag />, name: 'Flag' },
    { icon: <Folder />, name: 'Folder' },
    { icon: <Gift />, name: 'Gift' },
    { icon: <Heart />, name: 'Heart' },
    { icon: <Info />, name: 'Info' },
    { icon: <Key />, name: 'Key' },
    { icon: <Mail />, name: 'Mail' },
    { icon: <Map />, name: 'Map' },
    { icon: <MessageSquare />, name: 'MessageSquare' },
    { icon: <Phone />, name: 'Phone' },
    { icon: <Search />, name: 'Search' },
    { icon: <Shield />, name: 'Shield' },
    { icon: <ShoppingCart />, name: 'ShoppingCart' },
    { icon: <Tag />, name: 'Tag' },
    { icon: <Truck />, name: 'Truck' },
    { icon: <User />, name: 'User' },
    { icon: <Zap />, name: 'Zap' }
  ];
  
  return (
    <div className="grid grid-cols-4 gap-3 p-1">
      {icons.map((item, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex flex-col items-center justify-center h-20 p-2 hover:bg-primary/10"
          onClick={() => onSelect(item.name)}
        >
          <div className="h-8 w-8 flex items-center justify-center">
            {item.icon}
          </div>
          <span className="text-xs mt-1 truncate w-full text-center">{item.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default NodeIconSelector;
