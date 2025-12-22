"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useAuth } from "@/context/userContext";

const TYPE_LABELS = {
  part: "Add New Part",
  chapter: "Add New Chapter",
  scene: "Add New Scene",
};

export default function NewChapterModal({
  isOpen,
  onClose,
  onSubmit,
  parentOptions = [],
  initialType = "chapter",
  refresh,
  setRefresh,
  selectedParentId,
}) {
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    type: initialType,
    parent: selectedParentId || "",
  });
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [isFetchingParts, setIsFetchingParts] = useState(false);

  // Fetch parts when modal opens
  useEffect(() => {
    if (!user?.selectedManuscript || !token) return;
    const fetchParts = async () => {
      setIsFetchingParts(true);
      try {
        const response = await fetch(
          `https://apis.manuscripthq.com/api/section/get?manuscriptId=${user?.selectedManuscript._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setParts(data.data);
        } else {
          toast.error(data.message || "Failed to load parts.");
        }
      } catch (error) {
        toast.error("Failed to load parts.");
        console.error("Error fetching parts:", error);
      } finally {
        setIsFetchingParts(false);
      }
    };

    fetchParts();
  }, [isOpen, formData.type, token, user]);

  // Reset form data when modal is opened and selectedParentId is available
  useEffect(() => {
    if (isOpen) {
      const defaultType = selectedParentId ? "chapter" : "part";
      setFormData((prev) => ({
        ...prev,
        title: "",
        type: defaultType,
        parent: selectedParentId || "",
      }));
    }
  }, [isOpen, selectedParentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure parent is selected when adding a chapter
    // if (formData.type === "chapter" && !formData.parent) {
    //   toast.error("Please select a part for the chapter.");
    //   setLoading(false);
    //   return;
    // }

    try {
      const payload = {
        ...formData,
        parent: formData.type === "part" ? null : formData.parent,
        manuscriptId: user.selectedManuscript._id,
      };

      const response = await fetch(
        "https://apis.manuscripthq.com/api/section/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        onSubmit(data.data);
        toast.success("Created successfully!");
        onClose();
        setRefresh(!refresh);
      } else {
        toast.error(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to create the section. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {TYPE_LABELS[formData.type] || "Add New Chapter"}
          </DialogTitle>
          <DialogDescription>
            Create a new {formData.type} for your manuscript.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter title"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value, parent: "" })
                }
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="part">Part</SelectItem>
                  <SelectItem value="chapter">Chapter</SelectItem>
                  <SelectItem value="scene">Scene</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type !== "part" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent" className="text-right">
                  Parent
                </Label>
                <Select
                  value={formData.parent || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parent: value })
                  }
                  disabled={isFetchingParts || parts.length === 0}
                >
                  <SelectTrigger id="parent" className="col-span-3">
                    <SelectValue
                      placeholder={
                        isFetchingParts ? "Loading..." : "Select parent"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {parts.length > 0 &&
                      parts.map((option) => (
                        <SelectItem key={option._id} value={option._id}>
                          {option.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
