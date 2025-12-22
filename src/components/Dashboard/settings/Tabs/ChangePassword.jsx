import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { updatePassword } from "@/apiCall/auth";
import { useAuth } from "@/context/userContext";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setIsLoading(true);
    const result = await updatePassword({ oldPassword, newPassword, token });
    if (result.status === "success") {
      toast.success(result.message || "Password updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.message || "Could not update password.");
    }
    setIsLoading(false);
  };

  return (
    <TabsContent value="changepassword" className="space-y-4">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Change Password</CardTitle>
            <CardDescription>Update your Password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Old Password */}
              <div className="relative">
                <Label className="mb-2" htmlFor="oldpassword">
                  Old Password
                </Label>
                <Input
                  id="oldpassword"
                  className="w-full pr-10"
                  type={showOld ? "text" : "password"}
                  placeholder="••••••••"
                  value={oldPassword}
                  required
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-10 -translate-y-1/2 text-primary"
                  onClick={() => setShowOld((v) => !v)}
                  tabIndex={-1}
                >
                  {showOld ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showOld ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {/* New Password */}
              <div className="relative">
                <Label className="mb-2" htmlFor="newpassword">
                  New Password
                </Label>
                <Input
                  id="newpassword"
                  className="w-full pr-10"
                  placeholder="••••••••"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-10 -translate-y-1/2 text-primary"
                  onClick={() => setShowNew((v) => !v)}
                  tabIndex={-1}
                >
                  {showNew ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showNew ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {/* Confirm Password */}
              <div className="relative">
                <Label className="mb-2" htmlFor="confirmpassword">
                  Confirm Password
                </Label>
                <Input
                  id="confirmpassword"
                  className="w-full pr-10"
                  placeholder="••••••••"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-10 -translate-y-1/2 text-primary"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirm ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                className="bg-primary cursor-pointer"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </TabsContent>
  );
}
