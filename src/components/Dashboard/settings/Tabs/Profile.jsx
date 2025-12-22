import { updateUserDetails } from "@/apiCall/auth";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/userContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProfileImage from "./ProfileImage";

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    profession: "",
    bio: "",
    dob: "",
    websiteUrl: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (!user) return;
    setUserDetails({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      profession: user.profession || "",
      bio: user.bio || "",
      dob: user.dob || "",
      websiteUrl: user.websiteUrl || "",
      linkedin: user.linkedin || "",
      facebook: user.facebook || "",
      instagram: user.instagram || "",
      profilePicture: user.profilePicture || "",
    });
  }, [user]);

  const formatDateYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const res = await updateUserDetails(userDetails, token);
      if (res.status !== "success") {
        toast.error(res.message);
      } else {
        updateUser(res.user);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="profile" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileImage
            profileUrl={userDetails.profilePicture}
            setLoading={setIsLoading}
            isLoading={isLoading}
          />

          <div className="flex space-x-4 mt-10">
            <div className="flex flex-col space-y-2 w-6/12">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={userDetails.firstName}
                className="w-full"
                onChange={(e) =>
                  setUserDetails({ ...userDetails, firstName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col space-y-2 w-6/12">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={userDetails.lastName}
                className="w-full"
                onChange={(e) =>
                  setUserDetails({ ...userDetails, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Profession</Label>
            <Input
              id="text"
              value={userDetails.profession}
              onChange={(e) =>
                setUserDetails({ ...userDetails, profession: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={userDetails.bio}
              onChange={(e) =>
                setUserDetails({ ...userDetails, bio: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              type="date"
              id="dob"
              className="w-full"
              value={userDetails.dob ? formatDateYYYYMMDD(userDetails.dob) : ""}
              onChange={(e) =>
                setUserDetails({ ...userDetails, dob: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={userDetails.websiteUrl}
              onChange={(e) =>
                setUserDetails({ ...userDetails, websiteUrl: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Social Links</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twitter">Linkedin</Label>
            <Input
              id="twitter"
              value={userDetails.linkedin}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  linkedin: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={userDetails.facebook}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  facebook: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={userDetails.instagram}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  instagram: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button
          className="bg-primary cursor-pointer"
          onClick={handleSaveChanges}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </TabsContent>
  );
}
