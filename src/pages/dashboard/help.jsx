import { MainSidebar } from "@/components/common/MainSidebar";
import { SidebarProvider, useSidebar } from "@/components/common/SidebarProvider";
import { TopBar } from "@/components/common/TopBar";
import MainHelp from "@/components/Dashboard/Help/MainHelp";
import React from "react";


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
        <MainHelp/>
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
