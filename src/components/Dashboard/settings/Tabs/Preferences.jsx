import { updateUserDetails } from "@/apiCall/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/userContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Preferences() {
  const { user, token, updateUser } = useAuth();

  const [data, setData] = useState({
    defaultTheme: user?.defaultTheme || false,
    defaultExportFormat: user?.defaultExportFormat || "PDF",
    autoValidateExports: user?.autoValidateExports || false,
    includeTableOfContents: user?.includeTableOfContents || false,
    includeCopyrightPage: user?.includeCopyrightPage || false,
    autoSave: user?.autoSave || false,
    spellCheck: user?.spellCheck || false,
    grammarCheck: user?.grammarCheck || false,
  });

  const handleToggle = async (field) => {
    const newValue = !data[field];
    setData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    const updatePayload = {
      defaultTheme: data.defaultTheme,
      defaultExportFormat: data.defaultExportFormat,
      autoValidateExports: data.autoValidateExports,
      includeTableOfContents: data.includeTableOfContents,
      includeCopyrightPage: data.includeCopyrightPage,
      autoSave: data.autoSave,
      spellCheck: data.spellCheck,
      grammarCheck: data.grammarCheck,
    };
    updatePayload[field] = newValue;

    const res = await updateUserDetails(updatePayload, token);
    if (res.status !== "success") {
      toast.error(res.message);
    } else {
      updateUser(res.user);
      toast.success("Preferences Updated!");
    }
  };

  const handleSelectChange = async (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));

    const updatePayload = {
      defaultTheme: data.defaultTheme,
      defaultExportFormat: data.defaultExportFormat,
      autoValidateExports: data.autoValidateExports,
      includeTableOfContents: data.includeTableOfContents,
      includeCopyrightPage: data.includeCopyrightPage,
      autoSave: data.autoSave,
      spellCheck: data.spellCheck,
      grammarCheck: data.grammarCheck,
    };
    updatePayload[field] = value;

    const res = await updateUserDetails(updatePayload, token);
    if (res.status !== "success") {
      toast.error(res.message);
    } else {
      updateUser(res.user);
      toast.success("Preferences Updated!");
    }
  };

  return (
    <TabsContent value="preferences" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Export Defaults</CardTitle>
          <CardDescription>Set your default export preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="default-format">Default Format</Label>
              <select
                id="default-format"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={data.defaultExportFormat}
                onChange={(e) =>
                  handleSelectChange("defaultExportFormat", e.target.value)
                }
              >
                <option value="EPUB">EPUB</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-theme">Default Theme</Label>
              <select
                id="default-theme"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={data.defaultTheme}
                onChange={(e) =>
                  handleSelectChange("defaultTheme", e.target.value)
                }
              >
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
              </select>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-validate">Auto-validate exports</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically check for formatting issues before export
                </p>
              </div>
              <Switch
                id="auto-validate"
                checked={data.autoValidateExports}
                onCheckedChange={() => handleToggle("autoValidateExports")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="include-toc">Include table of contents</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate a table of contents
                </p>
              </div>
              <Switch
                id="include-toc"
                checked={data.includeTableOfContents}
                onCheckedChange={() => handleToggle("includeTableOfContents")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="include-copyright">
                  Include copyright page
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate a copyright page
                </p>
              </div>
              <Switch
                id="include-copyright"
                checked={data.includeCopyrightPage}
                onCheckedChange={() => handleToggle("includeCopyrightPage")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Editor Preferences</CardTitle>
          <CardDescription>Customize your writing experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto-save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save your work every 30 seconds
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={data.autoSave}
                onCheckedChange={() => handleToggle("autoSave")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="spell-check">Spell check</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight spelling errors as you type
                </p>
              </div>
              <Switch
                id="spell-check"
                checked={data.spellCheck}
                onCheckedChange={() => handleToggle("spellCheck")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="grammar-check">Grammar check</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight grammar errors as you type
                </p>
              </div>
              <Switch
                id="grammar-check"
                checked={data.grammarCheck}
                onCheckedChange={() => handleToggle("grammarCheck")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
