import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { deleteManuscript } from "@/apiCall/auth";
import { useAuth } from "@/context/userContext";

function DeleteManuscriptModal({
  isOpen,
  onClose,
  manuscript,
  setRefresh,
  refresh,
}) {
  const { token } = useAuth();

  const handleDelete = async () => {
    try {
      const result = await deleteManuscript(manuscript._id, token);
      if (result.status === "success") {
        toast.success("Manuscript deleted successfully");
        setRefresh(!refresh); // Trigger a refresh to update the manuscript list
        onClose(); // Close the modal after successful deletion
      } else {
        toast.error(result.message || "Failed to delete manuscript");
      }
    } catch (error) {
      console.error("Error deleting manuscript:", error);
      toast.error("Network error, please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Manuscript</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this manuscript?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 text-primary">
          <p>{manuscript?.title}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className={"bg-primary"} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteManuscriptModal;
