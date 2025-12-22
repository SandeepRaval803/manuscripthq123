import { Card, CardContent } from "@/components/ui/card";
import { ChildrensBookWizard } from "./ChildrensBookWizard";

export default function MainChildrensBookWizard() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-primary">
                Children&apos;s Book Wizard
              </h1>
              <p className="text-muted-foreground">
                Create a children&apos;s book
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <ChildrensBookWizard />
            </CardContent>  
          </Card>
        </div>
      </div>
    </>
  );
}
