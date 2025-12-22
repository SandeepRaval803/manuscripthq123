import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/userContext";
import { fetchManuscriptDetails } from "@/apiCall/auth";
import moment from "moment";

export default function Metadata() {
  const [manuscript, setManuscript] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!user?.selectedManuscript) return;

    const getManuscript = async () => {
      try {
        const data = await fetchManuscriptDetails(
          user.selectedManuscript._id,
          token
        );
        setManuscript(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getManuscript();
  }, [user?.selectedManuscript, token]);

  return (
    <TabsContent value="metadata" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manuscript Details</CardTitle>
          <CardDescription>Information about your manuscript</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Title
                </div>
                <div>{manuscript?.title || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Author
                </div>
                <div>{manuscript?.author || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Genre
                </div>
                <div>{manuscript?.genre || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Target Word Count
                </div>
                <div>{manuscript?.targetCount ?? "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Current Word Count
                </div>
                <div>{manuscript?.currentCount ?? "0"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Status
                </div>
                <div>{manuscript?.status || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Created
                </div>
                <div>
                  {manuscript?.createdAt
                    ? moment(manuscript.createdAt).format("Do MMMM, YYYY")
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
