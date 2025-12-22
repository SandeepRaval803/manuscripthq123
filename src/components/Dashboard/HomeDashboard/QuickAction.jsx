import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, CheckSquare, PenTool } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

export default function QuickAction() {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-3">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/editor")}
            className="justify-start border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800/30 dark:text-purple-300 dark:hover:bg-purple-900/20"
          >
            <PenTool className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
            Continue Writing
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/publishing-checklist")}
            className="justify-start border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800/30 dark:text-teal-300 dark:hover:bg-teal-900/20"
          >
            <CheckSquare className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
            View Checklist
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/formatting-wizard")}
            className="justify-start border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800/30 dark:text-amber-300 dark:hover:bg-amber-900/20"
          >
            <BookOpen className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
