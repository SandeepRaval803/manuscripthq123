import React from "react";
import { MainSidebar } from "@/components/common/MainSidebar";
import { TopBar } from "@/components/common/TopBar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/common/SidebarProvider";
import MainManuscript from "@/components/Dashboard/Manuscript/MainManuscript";
import { usePremiumGuard } from "@/hooks/usePremiumGuard";
import { ComponentLoading } from "@/components/common/PageLoading";

function DashboardContent() {
  const { isExpanded } = useSidebar();
  const { isPremiumUser, isLoading } = usePremiumGuard();

  // Show loading while checking premium status
  if (isLoading) {
    return <ComponentLoading message="Checking subscription..." />;
  }

  // Don't render content if not premium (will be redirected by hook)
  if (!isPremiumUser) {
    return <ComponentLoading message="Redirecting to subscription..." />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      <div
        className={`flex flex-col flex-1 w-0 ${
          isExpanded ? "md:ml-64" : "md:ml-20"
        }`}
        style={{ paddingTop: 64 }} // Push content below fixed TopBar (16*4 = 64px)
      >
        <TopBar />
        <main className="flex-1 overflow-auto">
          <MainManuscript />
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
