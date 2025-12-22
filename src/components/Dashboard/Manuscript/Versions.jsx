import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
export default function Versions() {
  return (
    <TabsContent value="versions" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>
            Previous snapshots of your manuscript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">First Draft Complete</div>
                <div className="text-sm text-muted-foreground">
                  May 5, 2025 at 2:30 PM
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Restore
                </Button>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">Midpoint Revision</div>
                <div className="text-sm text-muted-foreground">
                  April 28, 2025 at 11:15 AM
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Restore
                </Button>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Initial Outline</div>
                <div className="text-sm text-muted-foreground">
                  April 15, 2025 at 9:45 AM
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Restore
                </Button>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
