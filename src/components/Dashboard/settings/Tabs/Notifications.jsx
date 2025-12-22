import { updateUserDetails } from "@/apiCall/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/userContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Notifications() {
  const { user, token, updateUser } = useAuth();
  const [data, setData] = useState({
    emailNotification: user?.emailNotification || false,
    notification: user?.notification || false,
  });

  const handleToggle = async (field) => {
    const newValue = !data[field];
    setData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    const updatePayload = {
      emailNotification: data.emailNotification,
      notification: data.notification,
    };
    updatePayload[field] = newValue;

    const res = await updateUserDetails(updatePayload, token);
    if (res.status !== "success") {
      toast.error(res.message);
    } else {
      updateUser(res.user);
      toast.success("Notification Settings Updated!");
    }
  };

  return (
    <TabsContent value="notifications" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Notification Settings</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications"> Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for important updates and actions related
                to your account.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={data.emailNotification}
              onCheckedChange={() => handleToggle("emailNotification")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="in-app-notifications">
                {" "}
                In-App Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get real-time alerts within the app for updates and actions
                relevant to your account.
              </p>
            </div>
            <Switch
              id="in-app-notifications"
              checked={data.notification}
              onCheckedChange={() => handleToggle("notification")}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
