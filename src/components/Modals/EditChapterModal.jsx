"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/userContext"
import toast from "react-hot-toast"

export function EditChapterModal({ isOpen, onClose, onSubmit, chapter }) {
  const { token } = useAuth()
  const [title, setTitle] = useState(chapter?.title || "")
  const [status, setStatus] = useState(chapter?.status || "draft")
  const [loading, setLoading] = useState(false)

  // Update form fields when chapter prop changes
  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title || "")
      setStatus(chapter.status || "draft")
    }
  }, [chapter])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!chapter?._id) {
      toast.error("Chapter ID is missing")
      return
    }

    setLoading(true)

    try {
      const payload = {
        title,
        status,
      }

      const response = await fetch(`https://apis.manuscripthq.com/api/section/update/${chapter._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Call the onSubmit callback with updated data
        onSubmit({
          ...chapter,
          title,
          status,
          _id: chapter._id,
        })
        toast.success("Updated successfully!")
        onClose()
      } else {
        toast.error(data.message || "Failed to update. Please try again.")
      }
    } catch (error) {
      console.error("Error updating section:", error)
      toast.error("Failed to update. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!chapter) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {chapter.type?.charAt(0).toUpperCase() + chapter.type?.slice(1)}</DialogTitle>
          <DialogDescription>Update the details of this {chapter.type}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder={`${chapter.type} title`}
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 w-full">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus} disabled={loading}>
                <SelectTrigger id="status" className="col-span-3 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="editing">Editing</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
