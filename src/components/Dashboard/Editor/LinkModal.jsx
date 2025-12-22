"use client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function LinkModal({ open, value, onChange, onClose, onInsert }) {
  if (!open) return null;

  const handleInsert = () => {
    const isValidLink = value.trim().startsWith("https://");
    if (!isValidLink) {
      toast.error("Please Enter a Valid Link ");
      return;
    }

    if (value.trim()) {
      onInsert();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
        <div className="text-lg font-bold mb-2 text-primary">Insert Link</div>
        <input
          className="w-full p-2 mb-4 border border-primary rounded"
          placeholder="https://your-link.com"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInsert();
            if (e.key === "Escape") onClose();
          }}
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} size="sm" variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleInsert}
            size="sm"
            className="bg-primary text-white"
            disabled={!value.trim()}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
}
