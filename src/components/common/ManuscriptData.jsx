import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/userContext";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { fetchManuscripts, updateUserDetails } from "@/apiCall/auth";
import ConfirmationModal from "./ConfirmationModal";
import Loader from "./Loader";
import NewManuscriptModal from "../Modals/NewManuscriptModal";

export default function ManuscriptData({ refresh, setRefresh }) {
  const { user, token, updateUser } = useAuth();
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingManuscriptId, setPendingManuscriptId] = useState(null);
  const [newManuscriptModalOpen, setNewManuscriptModalOpen] = useState(false);

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

  const confirmManuscriptChange = async () => {
    if (user.selectedManuscript._id === pendingManuscriptId) {
      setIsModalOpen(false);
      return;
    }

    const res = await updateUserDetails(
      { selectedManuscript: pendingManuscriptId },
      token
    );
    if (res.status !== "success") {
      toast.error(res.message);
    } else {
      updateUser(res.user);
      toast.success("Manuscript Changed!");
    }
    setIsModalOpen(false);
  };

  const cancelManuscriptChange = () => setIsModalOpen(false);

  const handleManuscriptSelect = (manuscriptId) => {
    setPendingManuscriptId(manuscriptId);
    setIsModalOpen(true);
  };

  return (
    <div>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel>Your Manuscripts</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <DropdownMenuItem>
            <Loader />
          </DropdownMenuItem>
        ) : manuscripts.length === 0 ? (
          <DropdownMenuItem>No manuscripts available</DropdownMenuItem>
        ) : (
          manuscripts.map((manuscript) => (
            <DropdownMenuItem
              key={manuscript._id}
              className={`flex flex-col items-start py-2 cursor-pointer ${
                user?.selectedManuscript?._id === manuscript._id
                  ? "bg-[#eaa8f9]"
                  : "text-black"
              }`}
              onClick={() => handleManuscriptSelect(manuscript._id)}
            >
              <div className="flex w-full justify-between items-center">
                <span className="font-medium truncate max-w-[180px]" title={manuscript.title}>{manuscript.title}</span>
                <Badge
                  variant="outline"
                  className="ml-2 border-0 bg-primary text-white"
                >
                  {manuscript.genre}
                </Badge>
              </div>
              <div className="w-full mt-1">
                <div className="flex justify-between text-xs text-black mb-1">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="text-primary">Word Count</span>
                    <span className="font-medium">
                      {manuscript.wordCount?.toLocaleString() || 0} /{" "}
                      {manuscript.targetCount?.toLocaleString() || 0}
                    </span>
                  </div>
                  <span>
                    {manuscript.targetCount
                      ? Math.round(
                          (manuscript.wordCount / manuscript.targetCount) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    manuscript.targetCount
                      ? (manuscript.wordCount / manuscript.targetCount) * 100
                      : 0
                  }
                  className="h-1"
                />
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setNewManuscriptModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span>New Manuscript</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <NewManuscriptModal
        isOpen={newManuscriptModalOpen}
        onClose={() => setNewManuscriptModalOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelManuscriptChange}
        onConfirm={confirmManuscriptChange}
      />
    </div>
  );
}
