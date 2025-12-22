import React, { useState } from "react";
import MainDashboard from "@/components/Dashboard/HomeDashboard/MainDashboard";
import { MainSidebar } from "@/components/common/MainSidebar";
import { TopBar } from "@/components/common/TopBar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/common/SidebarProvider";

function Index() {
  const { isExpanded } = useSidebar();
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      <div
        className={`flex flex-col flex-1 w-0 ${
          isExpanded ? "md:ml-64" : "md:ml-20"
        }`}
        style={{ paddingTop: 64 }} // Push content below fixed TopBar (16*4 = 64px)
      >
        <TopBar refresh={refresh} setRefresh={setRefresh} />
        <main className="flex-1 overflow-auto">
          <MainDashboard setRefresh={setRefresh} refresh={refresh} />
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <Index />
    </SidebarProvider>
  );
}
