import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQ } from "./Tabs/FAQ";
import SettingsHeader from "./HelpHeader";
import Tutorials from "./Tabs/Tutorials";
import ContactSupport from "./Tabs/ContactSupport";

export default function MainHelp() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
        <SettingsHeader />

        <Tabs defaultValue="faq">
          <TabsList className="bg-[#eaa8f9]  mb-4">
            <TabsTrigger
              value="faq"
              className="  data-[state=active]:text-primary  cursor-pointer"
            >
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="tutorials"
              className="  data-[state=active]:text-primary  cursor-pointer"
            >
              Tutorials
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="  data-[state=active]:text-primary  cursor-pointer"
            >
              Contact Support
            </TabsTrigger>
          </TabsList>
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary ">
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to common questions aboutPRO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FAQ />
              </CardContent>
            </Card>
          </TabsContent>
          <Tutorials />
          <ContactSupport />
        </Tabs>
      </div>
    </>
  );
}
