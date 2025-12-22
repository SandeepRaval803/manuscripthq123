import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/userContext";

export default function ContactSupport() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const { token } = useAuth();
  const handleFileChange = (e) => {
    const fileObj = e.target.files[0];
    if (fileObj) {
      setFile(fileObj);
      setFilePreview(URL.createObjectURL(fileObj));
    }
  };

  const uploadFile = async () => {
    if (!file) return null;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        "https://apis.manuscripthq.com/api/utility/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.imageUrl) {
        setAttachmentUrl(data.imageUrl);
        return data.imageUrl;
      } else {
        toast.error(data.message || "Upload failed");
        setAttachmentUrl(null);
        return null;
      }
    } catch {
      toast.error("Error uploading file");
      setAttachmentUrl(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("All fields are required!");
      return;
    }
    setLoading(true);

    let uploadedAttachment = attachmentUrl;
    if (file && !attachmentUrl) {
      uploadedAttachment = await uploadFile();
      if (!uploadedAttachment) {
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(
        "https://apis.manuscripthq.com/api/support/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "auth-token": token } : {}),
          },
          body: JSON.stringify({
            subject,
            message,
            attachments: uploadedAttachment,
          }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Support request sent!");
        setSubject("");
        setMessage("");
        setFile(null);
        setFilePreview(null);
        setAttachmentUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch {
      toast.error("Submission failed, try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabsContent value="contact" className="space-y-4">
      <Toaster position="top-right" />
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Get help from our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Subject of your inquiry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question in detail"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="attachments" className="text-sm font-medium">
                Attachments (optional)
              </label>
              <Input
                id="attachments"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                ref={fileInputRef}
              />
              {filePreview && (
                <div className="mt-2">
                  <img
                    src={filePreview}
                    alt="Attachment Preview"
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2 mt-3 bg-primary text-white border-0 hover:text-none"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                      setAttachmentUrl(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary cursor-pointer"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Send Message"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Ways to Reach Us</CardTitle>
          <CardDescription>Alternative contact methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Email Support</h3>
              <p className="text-sm text-muted-foreground mt-1">
                For general inquiries and support
              </p>
              <p className="text-sm mt-2">support@manuscripthq.com</p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Phone Support</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Available Monday-Friday, 9am-5pm EST
              </p>
              <p className="text-sm mt-2">+1 (555) 123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
