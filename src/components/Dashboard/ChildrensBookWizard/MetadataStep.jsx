"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MetadataStep({ metadata, setMetadata }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Book Metadata</h3>
        <p className="text-sm text-muted-foreground">
          Enter information about your book
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={metadata.title}
            onChange={(e) =>
              setMetadata({ ...metadata, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subTitle">Sub Title (optional)</Label>
          <Input
            id="subTitle"
            value={metadata.subTitle}
            onChange={(e) =>
              setMetadata({ ...metadata, subTitle: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={metadata.author}
            onChange={(e) =>
              setMetadata({ ...metadata, author: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher (optional)</Label>
          <Input
            id="publisher"
            value={metadata.publisher}
            onChange={(e) =>
              setMetadata({ ...metadata, publisher: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ISBN">ISBN (optional)</Label>
          <Input
            id="ISBN"
            value={metadata.ISBN}
            onChange={(e) => setMetadata({ ...metadata, ISBN: e.target.value })}
            placeholder="e.g. 978-3-16-148410-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input
            id="genre"
            value={metadata.genre}
            onChange={(e) =>
              setMetadata({ ...metadata, genre: e.target.value })
            }
            placeholder="e.g. Fiction, Science, Biography"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverdesignby">Cover Design By</Label>
          <Input
            id="coverdesignby"
            value={metadata.coverdesignby}
            onChange={(e) =>
              setMetadata({ ...metadata, coverdesignby: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverillustrationby">Cover Illustration By</Label>
          <Input
            id="coverillustrationby"
            value={metadata.coverillustrationby}
            onChange={(e) =>
              setMetadata({ ...metadata, coverillustrationby: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="editedby">Edited By</Label>
          <Input
            id="editedby"
            value={metadata.editedby}
            onChange={(e) =>
              setMetadata({ ...metadata, editedby: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edition">Edition</Label>
          <Input
            id="edition"
            value={metadata.edition}
            onChange={(e) =>
              setMetadata({ ...metadata, edition: e.target.value })
            }
            placeholder="e.g. First Edition, 2nd Revised"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={metadata.description}
            onChange={(e) =>
              setMetadata({ ...metadata, description: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
