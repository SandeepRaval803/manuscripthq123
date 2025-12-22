"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-lg font-semibold">
            Confirm Manuscript Change
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to change the manuscript? This action cannot
            be undone and any unsaved changes will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onClose} className="mt-3 sm:mt-0">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-primary ">
            Yes, Change Manuscript
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
