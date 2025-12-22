"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/userContext";
import { createManuscript } from "@/apiCall/auth";

export default function NewManuscriptModal({ isOpen, onClose, refresh, setRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(50000);

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !genre || !targetWordCount) {
      toast.error("All fields are required.");
      return;
    }

    const data = {
      title,
      author,
      genre,
      targetCount: targetWordCount,
    };

    setIsLoading(true);

    try {
      const result = await createManuscript(data, token);

      if (result) {
        toast.success("Manuscript created successfully");
        setTitle("");
        setAuthor("");
        setGenre("");
        setTargetWordCount(50000);
        setRefresh(!refresh);
        onClose();
      }
    } catch (error) {
      console.error("Error while creating manuscript:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Manuscript</DialogTitle>
          <DialogDescription>
            Enter the details for your new manuscript. You can edit these later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter manuscript title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="genre">Genre</Label>
              <Select value={genre} onValueChange={setGenre} required>
                <SelectTrigger id="genre" className="w-full">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="Thriller">Thriller</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Sci-Fi">Science Fiction</SelectItem>
                  <SelectItem value="Fantasy">Fantasy</SelectItem>
                  <SelectItem value="Horror">Horror</SelectItem>
                  <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                  <SelectItem value="Memoir">Memoir</SelectItem>
                  <SelectItem value="Biography">Biography</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="targetWordCount">Target Word Count</Label>
              <Input
                id="targetWordCount"
                type="number"
                min={1000}
                value={targetWordCount}
                onChange={(e) =>
                  setTargetWordCount(parseInt(e.target.value, 10))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Common targets: Novel (50,000–100,000), Novella (20,000–50,000),
                Short Story (1,000–20,000)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Creating Manuscript..." : "Create Manuscript"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
