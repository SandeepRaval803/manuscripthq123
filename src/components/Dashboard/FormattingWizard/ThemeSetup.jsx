"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookPreview } from "./BookPreview";
import { themeOptions } from "./WizardConstants";

export function ThemeStep({
  selectedTheme,
  setSelectedTheme,
  customSettings,
  setCustomSettings,
  metadata,
  manuscriptData,
  getPreviewStyles,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select a Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose a formatting theme for your manuscript
        </p>
      </div>

      <RadioGroup
        value={selectedTheme}
        onValueChange={setSelectedTheme}
        className="grid gap-6 md:grid-cols-3"
      >
        {themeOptions?.map((theme) => (
          <div key={theme.value}>
            <RadioGroupItem
              value={theme.value}
              id={theme.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={theme.value}
              className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 peer-data-[state=checked]:border-[#eaa8f9] [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-4 rounded-md bg-[#eaa8f9] p-2 text-primary">
                <theme.icon className="h-6 w-6" />
              </div>
              <div className="font-medium">{theme.label}</div>
              <div className="text-center text-sm text-muted-foreground">
                {theme.description}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <BookPreview
              metadata={metadata}
              manuscriptData={manuscriptData}
              getPreviewStyles={getPreviewStyles}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customize</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={customSettings.fontFamily}
                  onValueChange={(value) =>
                    setCustomSettings({ ...customSettings, fontFamily: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="sans-serif">Sans-serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={customSettings.fontSize}
                  onValueChange={(value) =>
                    setCustomSettings({ ...customSettings, fontSize: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (10pt)</SelectItem>
                    <SelectItem value="medium">Medium (12pt)</SelectItem>
                    <SelectItem value="large">Large (14pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="line-spacing">Line Spacing</Label>
                <Select
                  value={customSettings.lineSpacing}
                  onValueChange={(value) =>
                    setCustomSettings({ ...customSettings, lineSpacing: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="1.5">1.5 lines</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="margins">Margins</Label>
                <Select
                  value={customSettings.margins}
                  onValueChange={(value) =>
                    setCustomSettings({ ...customSettings, margins: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow">Narrow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="wide">Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manuscript-size">Manuscript Size</Label>
                <Select
                  value={customSettings.manuscriptSize}
                  onValueChange={(value) =>
                    setCustomSettings({
                      ...customSettings,
                      manuscriptSize: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pocket">
                      {" "}
                      4.25 x 6.87 in (10.80 x 17.45 cm)
                    </SelectItem>
                    <SelectItem value="reedsy">
                      {" "}
                      5 x 8 in (12.7 x 20.32 cm)
                    </SelectItem>
                    <SelectItem value="digest">
                      {" "}
                      5.5 x 8.5 in (13.97 x 21.59 cm)
                    </SelectItem>
                    <SelectItem value="trade">
                      {" "}
                      6 x 9 in (15.24 x 22.86 cm)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle>Cover Designs</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0,1,2,3,4,5,6,7].map((i) => (
                <img
                  key={i}
                  src="/images/fantasy-book-cover-with-mystical-forest.jpg"
                  alt={`Cover design ${i + 1}`}
                  className="w-full h-auto rounded-md object-cover"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
