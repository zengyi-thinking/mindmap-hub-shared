import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/components/dashboard/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/overview/DashboardHeader";
import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import UsageReport from "@/components/dashboard/UsageReport";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    activeDataCard,
    setActiveDataCard,
    recentContent,
    starredItems,
    mindmapCount,
    materialCount,
    starredCount,
  } = useDashboardData();

  const createMindMap = () => {
    navigate("/my-mindmaps", { state: { openCreateDialog: true } });
  };

  const uploadMaterial = () => {
    navigate("/upload");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <DashboardHeader
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        createMindMap={createMindMap}
        uploadMaterial={uploadMaterial}
      />

      {activeSection === "overview" ? (
        <DashboardOverview
          mindmapCount={mindmapCount}
          materialCount={materialCount}
          starredCount={starredCount}
          activeDataCard={activeDataCard}
          setActiveDataCard={setActiveDataCard}
          recentContent={recentContent}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          starredItems={starredItems}
          user={user}
        />
      ) : (
        <UsageReport />
      )}
    </div>
  );
};

export default Dashboard;
