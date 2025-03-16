
import React from "react";
import { motion } from "framer-motion";
import DashboardStats from "./DashboardStats";
import RecentContent from "./RecentContent";
import StarredContent from "./StarredContent";
import QuickAccess from "./QuickAccess";

interface DashboardOverviewProps {
  mindmapCount: number;
  materialCount: number;
  starredCount: number;
  activeDataCard: number | null;
  setActiveDataCard: (index: number | null) => void;
  recentContent: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  starredItems: any[];
  user: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  mindmapCount,
  materialCount,
  starredCount,
  activeDataCard,
  setActiveDataCard,
  recentContent,
  activeTab,
  setActiveTab,
  starredItems,
  user,
}) => {
  return (
    <>
      <DashboardStats
        mindmapCount={mindmapCount}
        materialCount={materialCount}
        starredCount={starredCount}
        activeDataCard={activeDataCard}
        setActiveDataCard={setActiveDataCard}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentContent
          recentContent={recentContent}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <StarredContent starredItems={starredItems} user={user} />
          <QuickAccess />
        </motion.div>
      </div>
    </>
  );
};

export default DashboardOverview;
