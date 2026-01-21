"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChildBookPreview } from "./ChildBookPreview";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BINDING_PREVIEW_TYPE, TRIM_ASPECT_RATIO } from "./WizardConstants";


export function ThemeStep({
  metadata,
  manuscriptData,
  getPreviewStyles,
  pageImages,
  setPageImages,
  ageGroup,
  trimSize,
  binding,
  setAgeGroup,
  setTrimSize,
  setBinding,
}) {
  const uploadedImages = pageImages.filter(Boolean);
  const isPreviewLocked = !ageGroup || ageGroup === "0";


  const bindingType = BINDING_PREVIEW_TYPE[binding] || "";
  return (
    <div className="space-y-6">
      {isPreviewLocked ? (
        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-[320px] rounded-lg border bg-white p-4 shadow-lg space-y-3">
          <h3 className="text-sm font-semibold text-center">
            Select Age Group to Unlock Preview
          </h3>
  
          <div className="space-y-2">
            <Label>Age Group</Label>
            <Select
              value={ageGroup}
              onValueChange={(value) => setAgeGroup(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-3">Babies (0–3)</SelectItem>
                <SelectItem value="3-5">Preschool (3–5)</SelectItem>
                <SelectItem value="5-7">Early Reader (5–7)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      ) : 
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChildBookPreview
              metadata={metadata}
              manuscriptData={manuscriptData}
              getPreviewStyles={getPreviewStyles}
              pageImages={pageImages}
              setPageImages={setPageImages}
              readOnly={false}
              ageGroup={ageGroup}
              trimSize={trimSize}
              binding={binding}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age-group">Age Group</Label>
                  <Select
                    value={ageGroup}
                    onValueChange={(value) =>
                      setAgeGroup(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Select age group</SelectItem>
                      <SelectItem value="0-3">Babies (0–3)</SelectItem>
                      <SelectItem value="3-5">Preschool (3–5)</SelectItem>
                      <SelectItem value="5-7">Early Reader (5–7)</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trim-size">Trim Size</Label>
                  <Select
                    value={trimSize}
                    onValueChange={(value) =>
                      setTrimSize(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Select trim size</SelectItem>
                      <SelectItem value="8x8">8 × 8 (Square)</SelectItem>
                      <SelectItem value="8.5x8.5">8.5 × 8.5 (Square)</SelectItem>
                      <SelectItem value="8x10">8 × 10 (Portrait)</SelectItem>
                      <SelectItem value="10x8">10 × 8 (Landscape)</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="binding">Binding</Label>
                  <Select
                    value={binding}
                    onValueChange={(value) =>
                      setBinding(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Select binding</SelectItem>
                      <SelectItem value="hardcover-kdp">Hardcover (KDP)</SelectItem>
                      <SelectItem value="hardcover-ingram">Hardcover (Ingram)</SelectItem>
                      <SelectItem value="paperback-kdp">Paperback (KDP)</SelectItem>
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
              {uploadedImages.length === 0 ? 
              <div className="text-sm text-gray-500 italic">
                No images uploaded yet
              </div>
              :uploadedImages.map((image, i) => (
                <div
                  className={`w-full border rounded-md overflow-hidden bg-gray-100 ${bindingType === "hardcover" ? "shadow-lg" : "shadow-sm"}`}
                  style={{
                    aspectRatio: TRIM_ASPECT_RATIO[trimSize] || "1 / 1",
                  }}
                >
                  <img
                    src={image}
                    alt={`Cover design ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      }
    </div>
  );
}
