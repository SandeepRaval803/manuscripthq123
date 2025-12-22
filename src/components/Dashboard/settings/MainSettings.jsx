"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsHeader from "./SettingsHeader";
import Profile from "./Tabs/Profile";
import Preferences from "./Tabs/Preferences";
import Notifications from "./Tabs/Notifications";
import ChangePassword from "./Tabs/ChangePassword";

const tabOptions = [
  "profile",
  "preferences",
  "notifications",
  "changepassword",
];

export default function MainSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get("tab");
  const initialTab = tabOptions.includes(urlTab) ? urlTab : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && urlTab !== activeTab && tabOptions.includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="space-y-6">
        <SettingsHeader />
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-[#eaa8f9] mb-5">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:text-primary  cursor-pointer"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:text-primary  cursor-pointer"
            >
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:text-primary  cursor-pointer"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="changepassword"
              className="data-[state=active]:text-primary  cursor-pointer"
            >
              Change Password
            </TabsTrigger>
          </TabsList>
          {activeTab === "profile" && <Profile />}
          {activeTab === "preferences" && <Preferences />}
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "changepassword" && <ChangePassword />}
        </Tabs>
      </div>
    </div>
  );
}
