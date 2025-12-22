"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookPreview({ metadata, manuscriptData, getPreviewStyles }) {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);

  const generateTableOfContents = () => {
    if (!manuscriptData?.data) return [];
    return manuscriptData.data.map((item, index) => ({
      title: item.sectionTitle,
      page: index + 4, // Page shift due to new second page
    }));
  };

  const styles = getPreviewStyles();
  const tableOfContents = generateTableOfContents();

  const pages = [
    // Title page
    {
      type: "title",
      content: (
        <div className="flex flex-col justify-center items-center h-full text-center w-full absolute inset-0">
          <div className="text-4xl font-bold mb-8">{metadata.title}</div>
          <div className="text-2xl mb-12 italic">{metadata.subTitle}</div>
          <div className="text-xl">by {metadata.author}</div>
        </div>
      ),
    },

    // ➕ New Metadata Info Page
    {
      type: "info",
      content: (
        <div className="flex flex-col justify-center  h-full text-left w-full px-6 py-8">
          <div className="space-y-2 w-full max-w-md text-gray-700">
            <div>
              Copyright © {new Date().getFullYear()} by{" "}
              {metadata.author?.trim() || "N/A"}
            </div>
            <div>
              <span>All Rights Reserved.</span>
            </div>
            <div>
              <span>ISBN:</span> {metadata.ISBN || "N/A"}
            </div>

            <div>
              <span>Cover Design By</span> {metadata.coverdesignby || "N/A"}
            </div>
            <div>
              <span>Cover Illustration By</span>{" "}
              {metadata.coverillustrationby || "N/A"}
            </div>
            <div>
              <span>Edited By</span> {metadata.editedby || "N/A"}
            </div>
            <div>
              {metadata.edition || "N/A"} <span>Edition</span>
            </div>
            <div>
              <span>Published By:</span> {metadata.publisher || "N/A"}
            </div>
          </div>
          <div className="mt-7">{metadata.description}</div>
        </div>
      ),
    },

    // Table of Contents
    {
      type: "toc",
      content: (
        <div>
          <h1 className="text-3xl font-bold text-center mb-8">
            Table of Contents
          </h1>
          <div className="space-y-4">
            {tableOfContents.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-dotted border-gray-400 pb-2"
              >
                <span className="text-lg">{item.title}</span>
                <span className="text-lg">Page {item.page}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // Chapter pages
    ...(manuscriptData?.data || []).map((item, index) => ({
      type: "chapter",
      title: item.sectionTitle,
      content: (
        <div>
          <div className="text-center text-sm italic text-gray-600 mb-4">
            {item.sectionTitle}
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">
            {item.sectionTitle}
          </h1>
          <div
            className="text-justify leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>
      ),
    })),
  ];

  const currentPage = pages[currentPreviewPage];
  const totalPages = pages.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="bg-white shadow-lg border rounded-lg p-8 min-h-[600px] relative"
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
