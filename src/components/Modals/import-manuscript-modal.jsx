// File: src/components/Modals/import-manuscript-modal.jsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ImportManuscriptModal({ isOpen, onClose, onSubmit }) {
  const [method, setMethod] = useState("paste");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleImport = () => {
    if (!title) return;
    if (method === "paste") {
      onSubmit({ title, content });
    } else if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onSubmit({ title, content: e.target.result });
      };
      reader.readAsText(file);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => o || onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Manuscript</DialogTitle>
          <DialogDescription>Select import method</DialogDescription>
        </DialogHeader>

        <Tabs value={method} onValueChange={setMethod}>
          <TabsList>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="paste">
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full h-40 p-2 border rounded"
                placeholder="Paste content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="file">
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="file"
                accept=".txt,.md"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
