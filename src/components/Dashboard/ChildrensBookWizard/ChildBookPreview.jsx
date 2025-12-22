"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOTAL_PAGES = 32;
export function ChildBookPreview({ metadata, manuscriptData, getPreviewStyles, pageImages, setPageImages, readOnly=false }) {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);

  const generateTableOfContents = () => {
    if (!manuscriptData?.data) return [];
    return manuscriptData.data.map((item, index) => ({
      title: item.sectionTitle,
      page: index + 4, // Page shift due to new second page
    }));
  };

  const handleImageUpload = (file, pageIndex) => {
    if (!file || !file.type.startsWith("image/")) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      setPageImages((prev) => {
        const updated = [...prev];
        updated[pageIndex] = reader.result;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, pageIndex) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file, pageIndex);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  

  const styles = getPreviewStyles();
  const tableOfContents = generateTableOfContents();


  const pagesSource = readOnly
    ? pageImages
        .map((img, i) => ({ img, index: i }))
        .filter((p) => p.img) // ONLY uploaded images
    : Array.from({ length: TOTAL_PAGES }, (_, index) => ({
        img: pageImages[index] || null,
        index,
      }));

  const pages = pagesSource.map(({ img, index }) => ({
    content: (
      <div className="h-full flex flex-col gap-4">
        <div
          className={`rounded-md overflow-hidden flex items-center justify-center text-sm
            ${readOnly ? "h-[420px]" : "h-72 bg-gray-200 cursor-pointer"}
          `}
          onDrop={!readOnly ? (e) => handleDrop(e, index) : undefined}
          onDragOver={!readOnly ? handleDragOver : undefined}
          onClick={
            !readOnly
              ? () =>
                  document
                    .getElementById(`img-upload-${index}`)
                    ?.click()
              : undefined
          }
        >
          {img ? (
            <img
              src={img}
              alt="Page artwork"
              className="w-full h-full object-cover"
            />
          ) : (
            !readOnly && "Drop image here or click to upload"
          )}

          {!readOnly && (
            <input
              id={`img-upload-${index}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e.target.files[0], index)
              }
            />
          )}
        </div>
      </div>
    ),
  }));
  

  const currentPage = pages[currentPreviewPage];
  const totalPages = pages.length;

  if (readOnly && currentPreviewPage >= totalPages && totalPages > 0) {
    setCurrentPreviewPage(0);
  }

  if (totalPages === 0 && readOnly) {
    return (
      <div className="text-sm text-gray-500 italic text-center">
        No images uploaded yet.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="bg-white shadow-lg border rounded-lg p-8 mb-8 min-h-[380px] relative"
        style={styles}
      >
        {currentPage?.content}
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          Page {currentPreviewPage + 1} of {totalPages}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPreviewPage(Math.max(0, currentPreviewPage - 1))
          }
          disabled={currentPreviewPage === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-gray-600">
          {currentPreviewPage + 1} / {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPreviewPage(
              Math.min(totalPages - 1, currentPreviewPage + 1)
            )
          }
          disabled={currentPreviewPage === totalPages - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
