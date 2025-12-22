"use client"

import { ChildBookPreview } from "./ChildBookPreview"


export function PreviewStep({ metadata, manuscriptData, getPreviewStyles, selectedTheme, exportFormat, pageImages }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preview Your Book</h3>
        <p className="text-sm text-muted-foreground">
          Navigate through your book pages to see how it will look when exported
        </p>
      </div>

      <ChildBookPreview metadata={metadata} manuscriptData={manuscriptData} getPreviewStyles={getPreviewStyles} pageImages={pageImages} readOnly={true} />

      {manuscriptData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Manuscript Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sections:</span>
              <span className="ml-2 font-medium">{manuscriptData.count}</span>
            </div>
            <div>
              <span className="text-gray-600">Theme:</span>
              <span className="ml-2 font-medium capitalize">{selectedTheme}</span>
            </div>
            <div>
              <span className="text-gray-600">Format:</span>
              <span className="ml-2 font-medium">{exportFormat.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Pages:</span>
              <span className="ml-2 font-medium">{manuscriptData.count + 2}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
