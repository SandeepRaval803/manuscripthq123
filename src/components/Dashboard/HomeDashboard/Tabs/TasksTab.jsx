import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { CheckSquare, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TasksTab() {
  return (
    <TabsContent value="tasks" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Writing Tasks</CardTitle>
          <CardDescription>
            Track your writing tasks and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-md bg-manuscript-purple-50 dark:bg-manuscript-purple-900/20">
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-manuscript-purple-600 dark:text-manuscript-purple-300" />
                <div>
                  <p className="font-medium">Complete character profiles</p>
                  <p className="text-xs text-muted-foreground">
                    The Silent Echo • Due May 15
                  </p>
                </div>
              </div>
              <Badge>High Priority</Badge>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md">
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Research historical setting</p>
                  <p className="text-xs text-muted-foreground">
                    Beyond the Stars • Due May 20
                  </p>
                </div>
              </div>
              <Badge variant="outline">Medium</Badge>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md">
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Outline final chapter</p>
                  <p className="text-xs text-muted-foreground">
                    Whispers in the Dark • Due May 25
                  </p>
                </div>
              </div>
              <Badge variant="outline">Medium</Badge>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md">
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Review editor feedback</p>
                  <p className="text-xs text-muted-foreground">
                    The Silent Echo • Due May 30
                  </p>
                </div>
              </div>
              <Badge variant="outline">Low</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
