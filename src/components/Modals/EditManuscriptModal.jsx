import React, { useState, useEffect } from "react";
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
import { updateManuscriptDataByManuscriptId } from "@/apiCall/auth";
import { Textarea } from "../ui/textarea";

export default function EditManuscriptModal({
  isOpen,
  onClose,
  manuscript,
  refresh,
  setRefresh,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(manuscript?.title || "");
  const [subTitle, setsubTitle] = useState(manuscript?.subTitle || "");
  const [author, setAuthor] = useState(manuscript?.author || "");
  const [publisher, setPublisher] = useState(manuscript?.publisher || "");
  const [ISBN, setISBN] = useState(manuscript?.ISBN || "");
  const [genre, setGenre] = useState(manuscript?.genre || "");
  const [targetCount, setTargetCount] = useState(
    manuscript?.targetCount || 50000
  );
  const [description, setDescription] = useState(manuscript?.description || "");

  // ADDED FIELDS
  const [coverdesignby, setCoverDesignBy] = useState(
    manuscript?.coverdesignby || ""
  );
  const [coverillustrationby, setCoverIllustrationBy] = useState(
    manuscript?.coverillustrationby || ""
  );
  const [editedby, setEditedBy] = useState(manuscript?.editedby || "");
  const [edition, setEdition] = useState(manuscript?.edition || "");

  const { token, user } = useAuth();

  useEffect(() => {
    if (manuscript) {
      setTitle(manuscript.title);
      setsubTitle(manuscript.subTitle);
      setAuthor(manuscript.author);
      setPublisher(manuscript.publisher);
      setISBN(manuscript.ISBN);
      setGenre(manuscript.genre);
      setTargetCount(manuscript.targetCount || 50000);
      setDescription(manuscript.description);

      // ADDED FIELDS
      setCoverDesignBy(manuscript.coverdesignby || "");
      setCoverIllustrationBy(manuscript.coverillustrationby || "");
      setEditedBy(manuscript.editedby || "");
      setEdition(manuscript.edition || "");
    }
  }, [manuscript]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const updatedData = {
      title,
      subTitle,
      author,
      publisher,
      description,
      ISBN,
      genre,
      targetCount,
      // ADDED FIELDS
      coverdesignby,
      coverillustrationby,
      editedby,
      edition,
    };

    try {
      const success = await updateManuscriptDataByManuscriptId(
        user,
        token,
        updatedData,
        manuscript._id
      );
      if (success) {
        toast.success("Manuscript updated successfully");
        onClose();
        setRefresh(!refresh);
      } else {
        toast.error("Failed to update manuscript");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px]">
        <div className="max-h-[80vh] overflow-y-auto pr-1">
          <DialogHeader>
            <DialogTitle>Edit Manuscript</DialogTitle>
            <DialogDescription>
              Enter the details for your manuscript. You can edit them later.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    className="mt-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter manuscript title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subTitle">Sub Title (optional)</Label>
                  <Input
                    id="subTitle"
                    className="mt-2"
                    value={subTitle}
                    onChange={(e) => setsubTitle(e.target.value)}
                    placeholder="Enter manuscript sub-title"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    className="mt-2"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher (optional)</Label>
                  <Input
                    className="mt-2"
                    id="publisher"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Enter publisher name"
                  />
                </div>
              </div>

              {/* NEW ROW: Cover Design By & Cover Illustration By */}
              <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
                <div>
                  <Label htmlFor="coverdesignby">
                    Cover Design By (optional)
                  </Label>
                  <Input
                    className="mt-2"
                    id="coverdesignby"
                    value={coverdesignby}
                    onChange={(e) => setCoverDesignBy(e.target.value)}
                    placeholder="Enter designer's name"
                  />
                </div>
                <div>
                  <Label htmlFor="coverillustrationby">
                    Cover Illustration By (optional)
                  </Label>
                  <Input
                    className="mt-2"
                    id="coverillustrationby"
                    value={coverillustrationby}
                    onChange={(e) => setCoverIllustrationBy(e.target.value)}
                    placeholder="Enter illustrator's name"
                  />
                </div>
              </div>

              {/* NEW ROW: Edited By & Edition */}
              <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
                <div>
                  <Label htmlFor="editedby">Edited By (optional)</Label>
                  <Input
                    className="mt-2"
                    id="editedby"
                    value={editedby}
                    onChange={(e) => setEditedBy(e.target.value)}
                    placeholder="Enter editor's name"
                  />
                </div>
                <div>
                  <Label htmlFor="edition">Edition (optional)</Label>
                  <Input
                    className="mt-2"
                    id="edition"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="e.g. First Edition"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ISBN">ISBN (optional)</Label>
                <Input
                  className="mt-2"
                  id="ISBN"
                  value={ISBN}
                  onChange={(e) => setISBN(e.target.value)}
                  placeholder="e.g. 978-3-16-148410-0"
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

              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="space-y-2 sm:col-span-1 md:col-span-2">
                  <Label htmlFor="targetCount">Target Word Count</Label>
                  <Input
                    id="targetCount"
                    type="number"
                    min={1000}
                    value={targetCount}
                    onChange={(e) =>
                      setTargetCount(parseInt(e.target.value, 10))
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Common targets: Novel (50,000–100,000), Novella
                    (20,000–50,000), Short Story (1,000–20,000)
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-1 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Updating Manuscript..." : "Update Manuscript"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
