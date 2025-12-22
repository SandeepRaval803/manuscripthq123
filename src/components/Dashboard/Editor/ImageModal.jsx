"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ImageModal({ open, onClose, onInsert }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreview(null);
    }
  }, [open]);

  const onFileChange = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleInsert = () => {
    if (selectedFile) {
      onInsert(selectedFile);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-5 w-[500px]">
        <div className="text-lg font-bold mb-2 text-primary">
          Insert Image
        </div>
        <div
          className="border-2 border-dashed border-primary rounded-xl flex flex-col items-center justify-center p-5 mb-4 cursor-pointer transition hover:bg-[#eaa8f9]/10"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("image-file-input")?.click()}
        >
          {preview ? (
            <img
              src={preview || "/placeholder.svg"}
              alt="preview"
              className="max-h-52 mb-2 rounded"
            />
          ) : (
            <div className="flex flex-col items-center">
              <svg
                height="48"
                width="48"
                className="mb-2 text-primary"
                viewBox="0 0 48 48"
              >
                <circle cx="24" cy="24" r="22" fill="#eaa8f9" />
                <path
                  d="M24 16v12m0 0l-5-5m5 5l5-5"
                  stroke="#CA24D6"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="font-semibold text-primary">
                Drop your files here
              </div>
              <div className="text-gray-600">
                or{" "}
                <span className="text-black underline">browse for files</span>.
              </div>
              <div className="text-xs text-gray-400">Select up to 1 file</div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            id="image-file-input"
            className="hidden"
            onChange={handleInput}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} size="sm" variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleInsert}
            size="sm"
            disabled={!preview}
            className="bg-primary text-white"
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
}
