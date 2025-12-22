"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewChapterModal from "@/components/Modals/NewChapterModal";
import { CreateSnapshotModal } from "@/components/Modals/CreateSnapshotModal";

import Structure from "@/components/Modals/Structure";
import Versions from "./Versions";
import Metadata from "./Metadata";

export default function MainManuscript() {
  const [newChapterModalOpen, setNewChapterModalOpen] = useState(false);
  const [newChapterType, setNewChapterType] = useState("chapter");
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [importManuscriptModalOpen, setImportManuscriptModalOpen] =
    useState(false);

  // Sample parentOptions; replace with your own data or remove if not needed
  const parentOptions = [
    { id: "1", title: "Part I" },
    { id: "2", title: "Part II" },
  ];

  const openNewChapterModal = (type) => {
    setNewChapterType(type);
    setNewChapterModalOpen(true);
  };

  const handleCreateChapter = (data) => {
    setNewChapterModalOpen(false);
  };

  const handleCreateSnapshot = (data) => {
    setSnapshotModalOpen(false);
  };
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-primary">
              Manuscript Manager
            </h1>
            <p className="text-muted-foreground">
              Organize your manuscript structure and track your progress.
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => openNewChapterModal("part")}>
                  New Part
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openNewChapterModal("chapter")}
                >
                  New Chapter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openNewChapterModal("scene")}>
                  New Scene
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="structure" className="mt-6">
          <TabsList className="bg-[#eaa8f9]">
            <TabsTrigger
              value="structure"
              className="data-[state=active]:text-primary cursor-pointer"
            >
              Structure
            </TabsTrigger>
            <TabsTrigger
              value="metadata"
              className="data-[state=active]:text-primary cursor-pointer"
            >
              Metadata
            </TabsTrigger>
          </TabsList>
          <Structure refresh={refresh} setRefresh={setRefresh} />
          <Versions />
          <Metadata />
        </Tabs>

        <NewChapterModal
          isOpen={newChapterModalOpen}
          onClose={() => setNewChapterModalOpen(false)}
          onSubmit={handleCreateChapter}
          parentOptions={parentOptions}
          initialType={newChapterType}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        <CreateSnapshotModal
          isOpen={snapshotModalOpen}
          onClose={() => setSnapshotModalOpen(false)}
          onSubmit={handleCreateSnapshot}
        />
      </div>
    </div>
  );
}
