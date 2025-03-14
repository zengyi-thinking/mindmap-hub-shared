
import { SidebarProvider } from '@/contexts/SidebarContext';
import SidebarComponent from './sidebar/Sidebar';

const Sidebar = () => {
  return (
    <SidebarProvider>
      <SidebarComponent />
    </SidebarProvider>
  );
};

export default Sidebar;
