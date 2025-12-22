import ImportManuscriptModal from "@/components/Modals/import-manuscript-modal";
import NewManuscriptModal from "@/components/Modals/NewManuscriptModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function DashboardHeader({ refresh, setRefresh }) {
  const [newManuscriptModalOpen, setNewManuscriptModalOpen] = useState(false);
  const [importManuscriptModalOpen, setImportManuscriptModalOpen] =
    useState(false);
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
        <div className="mb-2 md:mb-0">
          <h2 className="text-3xl font-bold text-primary md:mb-1 mb-2">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome back to ManuscriptPRO. Here's an overview of your writing
            progress.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="cursor-pointer bg-primary text-white font-medium py-3 rounded-lg "
            onClick={() => setNewManuscriptModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Manuscript
          </Button>
        </div>
      </div>
      <NewManuscriptModal
        isOpen={newManuscriptModalOpen}
        onClose={() => setNewManuscriptModalOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <ImportManuscriptModal
        isOpen={importManuscriptModalOpen}
        onClose={() => setImportManuscriptModalOpen(false)}
      />
    </>
  );
}
