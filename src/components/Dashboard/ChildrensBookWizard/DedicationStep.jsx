"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function DedicationStep({ dedication, setDedication }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Dedication</h3>
        <p className="text-sm text-muted-foreground">
          Add a dedication for your book (optional)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dedication">Dedication</Label>
        <Textarea
          id="dedication"
          rows={6}
          value={dedication}
          onChange={(e) => setDedication(e.target.value)}
          className="resize-y"
        />
      </div>
    </div>
  );
}
