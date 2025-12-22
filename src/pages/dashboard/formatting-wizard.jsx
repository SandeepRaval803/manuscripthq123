import React from "react";
import { MainSidebar } from "@/components/common/MainSidebar";
import { TopBar } from "@/components/common/TopBar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/common/SidebarProvider";
import MainFormattingWizard from "@/components/Dashboard/FormattingWizard/MainFormattingWizard";

function DashboardContent() {
  const { isExpanded } = useSidebar();

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
          <MainFormattingWizard />
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
