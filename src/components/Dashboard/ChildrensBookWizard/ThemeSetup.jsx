"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ChildBookPreview } from "./ChildBookPreview";
import { useState } from "react";


export function ThemeStep({
  metadata,
  manuscriptData,
  getPreviewStyles,
  pageImages,
  setPageImages,
}) {
  const uploadedImages = pageImages.filter(Boolean);

  return (
    <div className="space-y-6">
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
            />
          </CardContent>
        </Card>

        <Card>
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
                <img
                  key={i}
                  src={image}
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
