
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { mindmapService } from '@/lib/mindmapStorage';
import { userFilesService } from '@/lib/storage';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("recent");
  const [activeSection, setActiveSection] = useState<"overview" | "usage">("overview");
  const [activeDataCard, setActiveDataCard] = useState<number | null>(null);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [starredItems, setStarredItems] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Load recent content
  useEffect(() => {
    const loadRecentContent = () => {
      const recentMindmaps = mindmapService.getRecent(3).map((mindmap) => ({
        id: mindmap.id,
        title: mindmap.title,
        type: "思维导图",
        date: mindmap.updatedAt,
        starred: mindmap.starred,
      }));

      const recentMaterials = userFilesService.getRecent(3).map((material) => ({
        id: material.id,
        title: material.title,
        type: "学习资料",
        date: material.uploadDate,
        starred: material.starred,
      }));

      const combined = [...recentMindmaps, ...recentMaterials]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentContent(combined);
    };

    loadRecentContent();
  }, []);

  // Load starred items
  useEffect(() => {
    if (user) {
      const loadUserFavorites = (userId: string) => {
        if (!userId) return [];
      
        const userFavorites = userFilesService.getUserFavorites(userId);
      
        return userFavorites.map((item: any) => {
          const favoriteRecord = item.favoriteByUsers?.find(
            (record: any) => record.userId === userId
          );
          return {
            ...item,
            favoriteTime: favoriteRecord?.favoriteTime,
            favoriteNote: favoriteRecord?.favoriteNote,
          };
        });
      };

      const starredMindmaps = mindmapService.getStarred().map((item) => ({
        ...item,
        type: "mindmap",
      }));

      const starredMaterials = loadUserFavorites(user.id).map((item) => ({
        ...item,
        type: "material",
      }));

      setStarredItems(
        [...starredMindmaps, ...starredMaterials].sort((a, b) => {
          const timeA = a.favoriteTime || a.updatedAt;
          const timeB = b.favoriteTime || b.updatedAt;
          return new Date(timeB).getTime() - new Date(timeA).getTime();
        })
      );
    }
  }, [user]);

  // Calculate counts
  const mindmapCount = mindmapService.getAll().length;
  const materialCount = userFilesService.getApprovedFiles().length;
  const starredCount =
    mindmapService.getStarred().length +
    userFilesService.getStarredFiles().length;

  return {
    user,
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    activeDataCard,
    setActiveDataCard,
    recentContent,
    setRecentContent,
    starredItems,
    isDarkMode,
    mindmapCount,
    materialCount,
    starredCount,
  };
};
