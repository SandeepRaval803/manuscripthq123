import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontalIcon, Plus } from "lucide-react";
import NewManuscriptModal from "@/components/Modals/NewManuscriptModal";
import Loader from "@/components/common/Loader";
import { fetchManuscripts, updateUserDetails } from "@/apiCall/auth";
import { useAuth } from "@/context/userContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteManuscriptModal from "./DeleteManuscriptModal";
import EditManuscriptModal from "@/components/Modals/EditManuscriptModal";
import toast from "react-hot-toast";

export default function ManuScriptsTab({refresh, setRefresh}) {
  const { token, user, updateUser } = useAuth();
  const [newManuscriptModalOpen, setNewManuscriptModalOpen] = useState(false);
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedManuscriptToDelete, setSelectedManuscriptToDelete] =
    useState(null);
  const [selectedManuscriptToEdit, setSelectedManuscriptToEdit] = useState(
    user.selectedManuscript || null
  );

  useEffect(() => {
    if (!token) return;

    const getManuscripts = async () => {
      try {
        setLoading(true);
        const result = await fetchManuscripts(token);
        if (result.status === "success") {
          setManuscripts(result.data);
        } else {
          toast.error(result.message || "Failed to fetch manuscripts.");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getManuscripts();
  }, [token, refresh]);

  const handleSelectManuscript = async (manuscript) => {
  if (user.selectedManuscript._id === manuscript._id) {
    return; 
  }

  const res = await updateUserDetails(
    { selectedManuscript: manuscript._id },  
    token
  );
  if (res.status !== "success") {
    toast.error(res.message);
  } else {
    updateUser(res.user);
    toast.success("Manuscript Changed!");
  setSelectedManuscriptToEdit(manuscript);

    setRefresh(!refresh); 
  }
};


  return (
    <>
      <TabsContent value="manuscripts" className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center border-dashed border-[1px]">
            <div className=" text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-manuscript-purple-100 dark:bg-manuscript-purple-900/30">
                <Plus className="h-8 w-8 text-manuscript-purple-600 dark:text-manuscript-purple-300" />
              </div>
              <h3 className="text-lg font-medium">Create a new manuscript</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a new writing project or import an existing one
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button onClick={() => setNewManuscriptModalOpen(true)}>
                  New Manuscript
                </Button>
              </div>
            </div>
          </Card>

          {/* Manuscripts Listing */}
          {loading ? (
            <Card className="flex items-center justify-center min-h-[270px]">
              <span>
                <Loader />
              </span>
            </Card>
          ) : manuscripts.length === 0 ? (
            <Card className="flex items-center justify-center min-h-[270px]">
              <span className="text-muted-foreground">
                No manuscripts found
              </span>
            </Card>
          ) : (
            manuscripts.map((manuscript) => (
              <Card
                key={manuscript.id}
                className="flex flex-col justify-between border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm bg-gradient-to-br from-white to-manuscript-purple-50 dark:from-gray-950 dark:to-manuscript-purple-950/60"
              >
                <CardContent className="p-6 pb-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-manuscript-purple-700 dark:text-manuscript-purple-200 truncate max-w-[200px]" title={manuscript.title}>
                      {manuscript.title}
                    </h3>
                    <span className="bg-primary px-2 py-1 rounded-full text-white text-xs font-medium">
                      {manuscript.genre}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="text-primary">Word Count</span>
                    <span className="font-medium">
                      {manuscript.wordCount?.toLocaleString() || 0} /{" "}
                      {manuscript.targetCount?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div>
                    <Progress
                      value={manuscript.progress}
                      className="h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>
                        {manuscript.targetCount
                          ? Math.round(
                              (manuscript.wordCount / manuscript.targetCount) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    className={`flex-1 ${
                      selectedManuscriptToEdit?._id === manuscript._id
                        ? "bg-primary text-white"
                        : ""
                    }`}
                    onClick={() => handleSelectManuscript(manuscript)} 
                    disabled={selectedManuscriptToEdit?._id === manuscript._id}
                  >
                    Select Manuscript
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditModalOpen(true);
                          setSelectedManuscriptToEdit(manuscript);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      {selectedManuscriptToEdit?._id !== manuscript._id && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedManuscriptToDelete(manuscript);
                            setDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
      <NewManuscriptModal
        isOpen={newManuscriptModalOpen}
        onClose={() => setNewManuscriptModalOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <DeleteManuscriptModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        setRefresh={setRefresh}
        refresh={refresh}
        manuscript={selectedManuscriptToDelete}
      />
      <EditManuscriptModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        manuscript={selectedManuscriptToEdit}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </>
  );
}
