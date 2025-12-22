"use client";

import { useState, useEffect } from "react";
import { X, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

export const PersonalNoteModal = ({
  visible,
  onClose,
  manuscriptId,
  checklistTaskId,
  token,
  reload,
  setReload,
}) => {
  // Set initial state using the props passed (ensure manuscriptId and checklistTaskId are not empty)
  const [data, setData] = useState({
    note: "",
    checklistTaskId: checklistTaskId || "", // Ensure it's assigned
    manuscriptId: manuscriptId || "", // Ensure it's assigned
  });

  const [loading, setLoading] = useState(false);

  // Update state when manuscriptId or checklistTaskId changes
  useEffect(() => {
    if (visible) {
      setData({
        note: "",
        checklistTaskId: checklistTaskId || "", // Ensure it's assigned
        manuscriptId: manuscriptId || "", // Ensure it's assigned
      });
    }
  }, [visible, manuscriptId, checklistTaskId]);

  const handleNoteChange = (text) => {
    setData((prev) => ({ ...prev, note: text }));
  };

  const handlePersonalNote = async () => {
    // Ensure manuscriptId and checklistTaskId are not empty before submission
    if (!data.note.trim() || !data.manuscriptId || !data.checklistTaskId) {
      toast.error("Note, manuscript ID, and checklist task ID are required.");
      return;
    }

    setLoading(true);

    const createNoteUrl = "https://apis.manuscripthq.com/api/notes/create";

    try {
      const response = await fetch(createNoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      toast.dismiss("creating-note");

      if (result.status === "success") {
        toast.success("📝 Note created successfully!");
        setData({
          note: "",
          checklistTaskId,
          manuscriptId,
        });
        setReload(!reload);
        onClose();
      } else {
        toast.error(result.message || "Error creating note. Please try again.");
      }
    } catch (error) {
      toast.dismiss("creating-note");
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData({
      note: "",
      checklistTaskId,
      manuscriptId,
    });
    onClose();
  };

  const wordCount = data.note
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = data.note.length;

  return (
    <Dialog open={visible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Add Personal Note
          </DialogTitle>
          <p className="text-slate-600">
            Capture your thoughts, ideas, and important information about this task.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="note" className="text-sm font-semibold text-slate-700">
              Your Note
            </Label>
            <div className="relative">
              <Textarea
                id="note"
                placeholder="e.g., 'Remember to check the formatting before submitting...'"
                value={data.note}
                onChange={(e) => handleNoteChange(e.target.value)}
                className="min-h-[120px] max-h-[200px] p-4 border-2 border-slate-200 rounded-xl resize-none"
                rows={5}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">{charCount}/1000</div>
            </div>
            {wordCount > 0 && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 border-2 border-slate-200 hover:bg-slate-50 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePersonalNote}
              disabled={loading || !data.note.trim()}
              className="flex-1 h-12 bg-primary text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Note</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
