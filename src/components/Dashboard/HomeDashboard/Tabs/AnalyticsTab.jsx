import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { BarChart3, LineChart } from "lucide-react";

export default function AnalyticsTab() {
  return (
    <TabsContent value="analytics" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Writing Patterns</CardTitle>
            <CardDescription>
              Your most productive writing times
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">
                Writing patterns visualization would appear here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Word Count Progress</CardTitle>
            <CardDescription>
              Your progress towards your word count goals
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">
                Word count progress chart would appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
