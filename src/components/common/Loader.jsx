import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center mx-auto">
      <Loader2 className="w-9 h-9 animate-spin text-primary" />
    </div>
  );
}
