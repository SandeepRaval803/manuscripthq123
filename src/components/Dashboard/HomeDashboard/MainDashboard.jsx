"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PenBox, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AnalyticsTab from "./Tabs/AnalyticsTab";
import ManuScriptsTab from "./Tabs/ManuScriptsTab";
import DashboardHeader from "./DashboardHeader";
import { useAuth } from "@/context/userContext";
import { useApiGuard } from "@/hooks/useAuthenticatedApi";
import { ComponentLoading } from "@/components/common/PageLoading";
import { useRouter } from "next/router";
import moment from "moment";
import { fetchSelectedManuscript } from "@/apiCall/auth";
import ManuscriptSkeleton from "@/components/common/ManuscriptSkeleton";
import OverviewTab from "./Tabs/OverviewTab";
import EditManuscriptModal from "@/components/Modals/EditManuscriptModal";

export default function MainDashboard({ refresh, setRefresh }) {
  const router = useRouter();
  const { user, token } = useAuth();
  const { shouldMakeApiCall, isLoading: authLoading } = useApiGuard();
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    // Don't make API calls if authentication is not checked or not valid
    if (!shouldMakeApiCall) {
      setLoading(false);
      return;
    }

    // Check if user has selected manuscript
    if (!user?.selectedManuscript?._id) {
      setLoading(false);
      return;
    }

    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchSelectedManuscript(
          user.selectedManuscript._id,
          token
        );
        setManuscripts([data]);
      } catch (err) {
        console.error("Error fetching manuscript:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [token, refresh, user?.selectedManuscript, shouldMakeApiCall]);

  const selectedManuscript = manuscripts[0];

  // Progress value safety logic
  const progressValue =
    selectedManuscript &&
    selectedManuscript.wordCount &&
    selectedManuscript.targetCount
      ? Math.min(
          (selectedManuscript.wordCount / selectedManuscript.targetCount) * 100,
          100
        )
      : 0;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedManuscriptToEdit, setSelectedManuscriptToEdit] = useState(
    selectedManuscript || null
  );
  const handleEdit = () => {
    setSelectedManuscriptToEdit(selectedManuscript);
    setEditModalOpen(true);
  };

  // Show loading while authentication is being checked
  if (authLoading) {
    return <ComponentLoading message="Checking authentication..." showLogo={true} />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <DashboardHeader refresh={refresh} setRefresh={setRefresh} />

      {loading ? (
        <ComponentLoading message="Loading your manuscript..." showLogo={false} />
      ) : selectedManuscript ? (
        <Card className="border-manuscript-purple-200 dark:border-manuscript-purple-800/30">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                  {selectedManuscript.title}{" "}
                  <PenBox onClick={handleEdit} size={18} />
                </CardTitle>
                <CardDescription>
                  {selectedManuscript.genre} • Last edited{" "}
                  {selectedManuscript.updatedAt
                    ? moment(selectedManuscript.updatedAt).format(
                        "Do MMMM, YYYY"
                      )
                    : "—"}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-primary text-white border-none"
              >
                Current Project
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Word Count</span>
                  <span className="font-medium">
                    {selectedManuscript.wordCount?.toLocaleString() || 0} /{" "}
                    {selectedManuscript.targetCount?.toLocaleString() || 0}
                  </span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>

              <div className="flex items-center gap-4 md:justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Target Word Count
                  </p>
                  <p className="font-medium">
                    {selectedManuscript.targetCount?.toLocaleString() || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="font-medium">
                    {selectedManuscript.author || "Unknown Author"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 items-center">
            <Button
              onClick={() => router.push("/dashboard/editor")}
              className="bg-primary"
            >
              Continue Writing
            </Button>
            <Button
              onClick={() => router.push("/dashboard/manuscript")}
              variant="outline"
              className="border-[#eaa8f9] text-primary"
            >
              View Structure
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Show message to select manuscript if one is already added but not selected
        <div className="text-center mt-6">
          <p className="text-primary">
            {user?.selectedManuscript?._id
              ? "Please select a manuscript to continue."
              : "Please add a new manuscript to continue."}
          </p>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="bg-[#eaa8f9]">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:text-primary cursor-pointer"
          >
            Overview
          </TabsTrigger>
          {/* <TabsTrigger
            value="analytics"
            className="data-[state=active]:text-primary cursor-pointer"
          >
            Analytics
          </TabsTrigger> */}
          <TabsTrigger
            value="manuscripts"
            className="data-[state=active]:text-primary cursor-pointer"
          >
            Manuscripts
          </TabsTrigger>
        </TabsList>

        {tab === "overview" && <OverviewTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "manuscripts" && (
          <ManuScriptsTab refresh={refresh} setRefresh={setRefresh} />
        )}
      </Tabs>
      <EditManuscriptModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        manuscript={selectedManuscriptToEdit}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
}
