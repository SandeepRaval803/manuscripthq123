import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/userContext";
import { createManuscript } from "@/apiCall/auth";

export default function CreateForm() {
  const [data, setData] = useState({
    title: "",
    author: "",
    targetCount: "5000",
    genre: "",
  });
  const [loading, setLoading] = useState(false);
  const { token, updateUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.title || !data.author || !data.targetCount || !data.genre) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!token) {
      toast.error("Authentication token missing. Please login.");
      return;
    }

    try {
      setLoading(true);

      const result = await createManuscript(data, token);
      if (result.status === "success") {
        await updateUser(result.data);
        toast.success("Manuscript created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Failed to create manuscript");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter manuscript title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Your name"
                value={data.author}
                onChange={(e) => setData({ ...data, author: e.target.value })}
              />
            </div>

            <div className="grid gap-2 w-full">
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={data.genre}
                onValueChange={(value) => setData({ ...data, genre: value })}
              >
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
              <Label htmlFor="targetCount">Target Word Count</Label>
              <Input
                id="targetCount"
                type="number"
                min={1000}
                value={data.targetCount}
                onChange={(e) =>
                  setData({ ...data, targetCount: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Common targets: Novel (50,000–100,000), Novella (20,000–50,000),
                Short Story (1,000–20,000)
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-primary text-white font-medium py-3 rounded-lg"
          >
            {loading ? "Creating..." : "Create Manuscript"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
