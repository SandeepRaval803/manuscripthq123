// src/components/FormattingWizard.js

import { useState, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/userContext";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import { steps, themes } from "./WizardConstants";
import { ThemeStep } from "./ThemeSetup";
import { PreviewStep } from "./PreviewStep";
import { ExportStep } from "./ExportStep";
import { MetadataStep } from "./MetadataStep";
import { fetchManuscriptData, updateManuscriptData } from "@/apiCall/auth";

const TOTAL_PAGES = 32;
export function ChildrensBookWizard() {
  const { user, token } = useAuth();
  const [currentStep, setCurrentStep] = useState("theme");
  const [loading, setLoading] = useState(false);
  const [manuscriptData, setManuscriptData] = useState(null);
  const [pageImages, setPageImages] = useState(
    Array(TOTAL_PAGES).fill(null)
  );

  // Theme and formatting settings
  const [selectedTheme, setSelectedTheme] = useState("fiction");
  const [customSettings, setCustomSettings] = useState({
    fontFamily: "serif",
    fontSize: "medium",
    lineSpacing: "1.5",
    margins: "normal",
    manuscriptSize: "trade",
  });

  // Metadata
  const [metadata, setMetadata] = useState({
    title: "",
    subTitle: "",
    author: "",
    publisher: "",
    description: "",
    ISBN: "",
    genre: "",
  });

  // Export settings
  const [exportFormat, setExportFormat] = useState("EPUB");
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const nextStep = steps[currentStepIndex + 1]?.id;
  const prevStep = steps[currentStepIndex - 1]?.id;

  // Fetch manuscript data
  useEffect(() => {
    const fetchManuscriptDataHandler = async () => {
      if (!user?.selectedManuscript || !token) return;

      setLoading(true);
      try {
        const data = await fetchManuscriptData(user, token);
        if (data) {
          setManuscriptData(data);
          setMetadata(data.manuscript);
        } else {
          toast.error("Failed to load manuscript data");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManuscriptDataHandler();
  }, [user?.selectedManuscript, token]);

  const handleContinue = async () => {
    if (currentStep === "metadata") {
      const updateSuccess = await updateManuscriptData(user, token, metadata);
      if (updateSuccess) {
        setCurrentStep(nextStep);
      }
    } else {
      setCurrentStep(nextStep);
    }
  };

  const getPreviewStyles = () => {
    const theme = themes[selectedTheme];

    const fontFamilyMap = {
      serif: "ui-serif, Georgia, serif",
      "sans-serif": "ui-sans-serif, system-ui, sans-serif",
      monospace: "ui-monospace, Menlo, monospace",
    };

    const fontSizeMap = {
      small: "10pt",
      medium: "12pt",
      large: "14pt",
    };

    const lineHeightMap = {
      single: "1.2",
      1.5: "1.5",
      double: "2.0",
    };

    const marginsMap = {
      narrow: "1rem",
      normal: "2rem",
      wide: "3rem",
    };

    return {
      fontFamily: fontFamilyMap[customSettings.fontFamily] || theme.fontFamily,
      fontSize: fontSizeMap[customSettings.fontSize] || theme.fontSize,
      lineHeight: lineHeightMap[customSettings.lineSpacing] || theme.lineHeight,
      padding: marginsMap[customSettings.margins] || theme.margins,
      firstLetterStyle: theme.firstLetterStyle,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader />
          <p className="text-muted-foreground">Loading manuscript data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold">Children&apos;s Book Wizard</h2>
          <p className="text-sm text-muted-foreground">
            Create a children&apos;s book
          </p>
        </div>
        <div className="hidden sm:flex">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2  ${
                  currentStep === step.id
                    ? "border-primary bg-primary text-white"
                    : index < currentStepIndex
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/25 bg-background text-muted-foreground"
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-10 ${
                    index < currentStepIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/25"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="block sm:hidden">
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          <div className="text-sm text-muted-foreground">
            {steps[currentStepIndex].name}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        {currentStep === "theme" && (
          <ThemeStep
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            customSettings={customSettings}
            setCustomSettings={setCustomSettings}
            metadata={metadata}
            manuscriptData={manuscriptData}
            getPreviewStyles={getPreviewStyles}
            pageImages={pageImages}
            setPageImages={setPageImages}
          />
        )}

        {currentStep === "metadata" && (
          <MetadataStep metadata={metadata} setMetadata={setMetadata} />
        )}

        {currentStep === "preview" && (
          <PreviewStep
            metadata={metadata}
            manuscriptData={manuscriptData}
            getPreviewStyles={getPreviewStyles}
            selectedTheme={selectedTheme}
            exportFormat={exportFormat}
            pageImages={pageImages}
          />
        )}

        {currentStep === "export" && (
          <ExportStep
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            manuscriptData={manuscriptData}
            metadata={metadata}
            getPreviewStyles={getPreviewStyles}
          />
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prevStep)}
          disabled={!prevStep}
          className="border-[#eaa8f9] text-primary cursor-pointer"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!nextStep}
          className="bg-primary"
        >
          {nextStep === "export" ? "Review & Export" : "Continue"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
