import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ManuscriptTree } from "../Dashboard/Manuscript/ManuscriptTree";

export default function Structure({ refresh, setRefresh }) {
  const [userInfo, setUserInfo] = useState({
    title: "",
    author: "",
    genre: "",
  });

  return (
    <TabsContent value="structure" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{userInfo.title}</CardTitle>
          <CardDescription>
            {userInfo.title && userInfo.genre && userInfo.author
              ? `A ${userInfo.genre} novel by ${userInfo.author}`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ManuscriptTree
            refresh={refresh}
            setRefresh={setRefresh}
            setUserInfo={setUserInfo}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
