"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Type, Bold, Italic, Underline, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BINDING_PREVIEW_TYPE, TRIM_ASPECT_RATIO } from "./WizardConstants";
import RichTextEditor from "../Editor/RichTextEditor";
import { Textarea } from "@/components/ui/textarea";

const TOTAL_PAGES = 32;
const AGE_GUIDELINES = {
  "0-3": {
    label: "Babies (0–3)",
    wordsPerPage: [0, 10],
    totalWords: [0, 150],
  },
  "3-5": {
    label: "Preschool (3–5)",
    wordsPerPage: [10, 40],
    totalWords: [200, 600],
  },
  "5-7": {
    label: "Early Reader (5–7)",
    wordsPerPage: [30, 100],
    totalWords: [500, 1500],
  },
};
export function ChildBookPreview({ metadata, dedication = "", manuscriptData, getPreviewStyles, pageImages, setPageImages, textOverlays, setTextOverlays, readOnly=false, ageGroup, trimSize, binding }) {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [editingTextId, setEditingTextId] = useState(null);
  const [newTextValue, setNewTextValue] = useState("");
  const imageContainerRef = useRef(null);
  const hasDedication = Boolean(dedication?.trim());
  const artworkPageOffset = 2 + (metadata?.description ? 1 : 0) + (hasDedication ? 1 : 0);

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

  const handleAddText = (pageIndex) => {
    if (!pageImages[pageIndex]) return;
    
    const newText = {
      id: Date.now().toString(),
      text: "",
      x: 50,
      y: 50,
      fontSize: 24,
      color: "#000000",
      fontFamily: "Arial",
      bold: false,
      italic: false,
      underline: false,
    };

    setTextOverlays((prev) => {
      const updated = [...prev];
      updated[pageIndex] = [...(updated[pageIndex] || []), newText];
      return updated;
    });
    setEditingTextId(newText.id);
    setNewTextValue(newText.text);
  };

  const handleTextMouseDown = (e, textId, pageIndex) => {
    if (editingTextId) return; // Don't drag if editing
    e.preventDefault();
    
    const handleMouseMove = (e) => {
      if (!imageContainerRef.current) return;
      const container = imageContainerRef.current;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setTextOverlays((prev) => {
        const updated = [...prev];
        const pageTexts = [...(updated[pageIndex] || [])];
        const textIndex = pageTexts.findIndex((t) => t.id === textId);
        if (textIndex !== -1) {
          pageTexts[textIndex] = {
            ...pageTexts[textIndex],
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
          };
          updated[pageIndex] = pageTexts;
        }
        return updated;
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTextDoubleClick = (textId) => {
    setEditingTextId(textId);
    const artworkIndex = currentPreviewPage >= artworkPageOffset ? currentPreviewPage - artworkPageOffset : -1;
    const pageTexts = (artworkIndex >= 0 && textOverlays && textOverlays[artworkIndex]) ? textOverlays[artworkIndex] : [];
    const text = pageTexts.find((t) => t.id === textId);
    if (text) {
      setNewTextValue(text.text ?? "");
    }
  };

  const toggleTextFormat = (textId, pageIndex, formatType) => {
    setTextOverlays((prev) => {
      const updated = [...prev];
      const pageTexts = [...(updated[pageIndex] || [])];
      const textIndex = pageTexts.findIndex((t) => t.id === textId);
      if (textIndex !== -1) {
        pageTexts[textIndex] = {
          ...pageTexts[textIndex],
          [formatType]: !pageTexts[textIndex][formatType],
        };
        updated[pageIndex] = pageTexts;
      }
      return updated;
    });
  };

  const handleTextUpdate = (textId, pageIndex) => {
    setTextOverlays((prev) => {
      const updated = [...prev];
      const pageTexts = [...(updated[pageIndex] || [])];
      const textIndex = pageTexts.findIndex((t) => t.id === textId);
      if (textIndex !== -1) {
        pageTexts[textIndex] = {
          ...pageTexts[textIndex],
          text: newTextValue,
        };
        updated[pageIndex] = pageTexts;
      }
      return updated;
    });
    setEditingTextId(null);
    setNewTextValue("");
  };

  const handleTextDelete = (textId, pageIndex) => {
    setTextOverlays((prev) => {
      const updated = [...prev];
      updated[pageIndex] = (updated[pageIndex] || []).filter((t) => t.id !== textId);
      return updated;
    });
  };

  const handleTextStyleChange = (textId, pageIndex, property, value) => {
    setTextOverlays((prev) => {
      const updated = [...prev];
      const pageTexts = [...(updated[pageIndex] || [])];
      const textIndex = pageTexts.findIndex((t) => t.id === textId);
      if (textIndex !== -1) {
        pageTexts[textIndex] = {
          ...pageTexts[textIndex],
          [property]: value,
        };
        updated[pageIndex] = pageTexts;
      }
      return updated;
    });
  };

  const styles = getPreviewStyles();
  const bindingType = BINDING_PREVIEW_TYPE[binding] || "";

  const pagesSource = readOnly
    ? pageImages
        .map((img, i) => ({ img, index: i }))
        .filter((p) => p.img) // ONLY uploaded images
    : Array.from({ length: TOTAL_PAGES }, (_, index) => ({
        img: pageImages[index] || null,
        index,
      }));

  const metadataPages = [
    {
      type: "title",
      content: (
        <div className="flex flex-col justify-center items-center h-full text-center w-full absolute inset-0 bg-white p-6">
          <div className="text-4xl font-bold mb-4">{metadata.title || "Untitled"}</div>
          {metadata.subTitle && <div className="text-2xl mb-8 italic text-gray-600">{metadata.subTitle}</div>}
          <div className="text-xl">by {metadata.author || "Unknown Author"}</div>
        </div>
      ),
    },
    {
      type: "info",
      content: (
        <div className="flex flex-col justify-center h-full text-left w-full px-8 py-10 bg-white overflow-y-auto">
          <div className="space-y-3 w-full max-w-md text-gray-700 text-sm">
            <div className="font-medium text-lg mb-4">Copyright Information</div>
            {(metadata.author?.trim()) && (
              <div>
                Copyright © {new Date().getFullYear()} by {metadata.author.trim()}
              </div>
            )}
            <div>All Rights Reserved.</div>
            {metadata.ISBN?.trim() && (
              <div className="pt-2">
                <span className="font-semibold">ISBN:</span> {metadata.ISBN.trim()}
              </div>
            )}
            {metadata.coverdesignby?.trim() && (
              <div>
                <span className="font-semibold">Cover Design By:</span> {metadata.coverdesignby.trim()}
              </div>
            )}
            {metadata.coverillustrationby?.trim() && (
              <div>
                <span className="font-semibold">Cover Illustration By:</span> {metadata.coverillustrationby.trim()}
              </div>
            )}
            {metadata.editedby?.trim() && (
              <div>
                <span className="font-semibold">Edited By:</span> {metadata.editedby.trim()}
              </div>
            )}
            {metadata.edition?.trim() && (
              <div>
                <span className="font-semibold">Edition:</span> {metadata.edition.trim()}
              </div>
            )}
            {metadata.publisher?.trim() && (
              <div>
                <span className="font-semibold">Published By:</span> {metadata.publisher.trim()}
              </div>
            )}
          </div>
        </div>
      ),
    },
    ...(metadata.description
      ? [
          {
            type: "about",
            content: (
              <div className="h-full text-left w-full px-8 py-10 bg-white overflow-y-auto">
                <div className="max-w-xl">
                  <div className="font-semibold mb-3 uppercase text-xs text-gray-500">
                    About this book
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {metadata.description}
                  </div>
                </div>
              </div>
            ),
          },
        ]
      : []),
    ...(hasDedication
      ? [
          {
            type: "dedication",
            content: (
              <div className="h-full text-left w-full px-8 py-10 bg-white overflow-y-auto">
                <div className="max-w-xl">
                  <div className="font-semibold mb-3 uppercase text-xs text-gray-500">
                    Dedication
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {dedication.trim()}
                  </div>
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const artworkPages = pagesSource.map(({ img, index }) => {
    const pageTexts = (textOverlays && textOverlays[index]) ? textOverlays[index] : [];
    return {
      type: "artwork",
      index: index,
      content: (
        <div className="h-full flex flex-col gap-4">
          <div
            ref={index + artworkPageOffset === currentPreviewPage ? imageContainerRef : null}
            className={img ? `w-full border rounded-md overflow-hidden bg-gray-100 relative ${bindingType === "hardcover" ? "shadow-lg" : "shadow-sm"}` : `rounded-md overflow-hidden flex items-center justify-center text-sm
              ${readOnly ? "h-[420px]" : "h-auto bg-gray-200 cursor-pointer"}
            `}
            style={{
              aspectRatio: TRIM_ASPECT_RATIO[trimSize] || "1 / 1",
            }}
            onDrop={(e) => {
              if (!readOnly) {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  handleImageUpload(file, index);
                }
              }
            }}
            onDragOver={(e) => {
              if (!readOnly) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            onClick={(e) => {
              if (!readOnly && !img) {
                e.stopPropagation();
                document.getElementById(`img-upload-${index}`)?.click();
              }
            }}
          >
            {img ? (
              <>
                <img
                  src={img}
                  alt="Page artwork"
                  className="w-full h-full object-cover"
                />
                {!readOnly && (index + artworkPageOffset) === currentPreviewPage && (
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddText(index);
                      }}
                      className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById(`img-upload-${index}`)?.click();
                      }}
                      className="absolute top-2 left-2 z-10 h-8 px-2 text-xs bg-white hover:bg-gray-100 border border-gray-300"
                      size="sm"
                      variant="outline"
                    >
                      Change Image
                    </Button>
                  </>
                )}
                {pageTexts.map((textOverlay) => (
                  <div key={textOverlay.id}>
                    {/* Edit Modal - positioned in center */}
                    {editingTextId === textOverlay.id && (index + artworkPageOffset) === currentPreviewPage && (
                      <div
                        className="absolute bg-white border-2 border-blue-500 rounded p-2 shadow-lg flex flex-col md:flex-row items-center gap-2 md:gap-2 z-30"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "14px",
                          width: "90%",
                          maxWidth: "95%",
                          boxSizing: "border-box",
                        }}
                      >
                        <div className="flex flex-col w-full md:w-auto" style={{ flex: 1 }}>
                          <Textarea
                            value={newTextValue}
                            placeholder="Double click to edit"
                            onChange={(e) => setNewTextValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                handleTextUpdate(textOverlay.id, index);
                              } else if (e.key === "Escape") {
                                setEditingTextId(null);
                                setNewTextValue("");
                              }
                            }}
                            className="w-full min-w-0 min-h-[clamp(4rem,12vh,10rem)] max-h-[25vh] resize-y"
                            autoFocus
                            style={{
                              fontWeight: textOverlay.bold ? "bold" : "normal",
                              fontStyle: textOverlay.italic ? "italic" : "normal",
                              textDecoration: textOverlay.underline ? "underline" : "none",
                              fontSize: `${textOverlay.fontSize}px`,
                              color: textOverlay.color,
                              fontFamily: textOverlay.fontFamily,
                            }}
                          />
                          <div className="flex justify-between items-center pt-4 me-2">
                            <div className="flex gap-1 flex-wrap justify-between md:justify-start mt-2 md:mt-0">
                              <Button
                                onClick={() => toggleTextFormat(textOverlay.id, index, "bold")}
                                size="sm"
                                variant={textOverlay.bold ? "default" : "outline"}
                                className="h-8 px-2"
                                title="Bold"
                              >
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => toggleTextFormat(textOverlay.id, index, "italic")}
                                size="sm"
                                variant={textOverlay.italic ? "default" : "outline"}
                                className="h-8 px-2"
                                title="Italic"
                              >
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => toggleTextFormat(textOverlay.id, index, "underline")}
                                size="sm"
                                variant={textOverlay.underline ? "default" : "outline"}
                                className="h-8 px-2"
                                title="Underline"
                              >
                                <Underline className="h-4 w-4" />
                              </Button>
                              {/* Font Family Selector */}
                              <select
                                value={textOverlay.fontFamily || "Arial"}
                                onChange={(e) =>
                                  handleTextStyleChange(
                                    textOverlay.id,
                                    index,
                                    "fontFamily",
                                    e.target.value
                                  )
                                }
                                className="h-8 px-2 rounded border text-xs"
                                style={{ minWidth: 80 }}
                              >
                                <option value="Arial" style={{ fontFamily: "Arial" }}>Arial</option>
                                <option value="Times New Roman" style={{ fontFamily: "Times New Roman" }}>Times New Roman</option>
                                <option value="Comic Sans MS" style={{ fontFamily: "Comic Sans MS" }}>Comic Sans MS</option>
                                <option value="Courier New" style={{ fontFamily: "Courier New" }}>Courier New</option>
                                <option value="Georgia" style={{ fontFamily: "Georgia" }}>Georgia</option>
                              </select>
                              <input
                                type="color"
                                value={textOverlay.color}
                                onChange={(e) =>
                                  handleTextStyleChange(
                                    textOverlay.id,
                                    index,
                                    "color",
                                    e.target.value
                                  )
                                }
                                className="w-8 h-8 cursor-pointer"
                              />
                              <input
                                type="number"
                                value={textOverlay.fontSize}
                                onChange={(e) =>
                                  handleTextStyleChange(
                                    textOverlay.id,
                                    index,
                                    "fontSize",
                                    parseInt(e.target.value) || 24
                                  )
                                }
                                min="12"
                                max="72"
                                className="w-16 px-1 border rounded"
                                style={{ fontSize: "14px" }}
                              />
                            </div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => handleTextUpdate(textOverlay.id, index)}
                                size="sm"
                                className="h-8 px-2"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleTextDelete(textOverlay.id, index)}
                                size="sm"
                                variant="destructive"
                                className="h-8 px-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Text Display */}
                    <div
                      onMouseDown={(e) => {
                        if (!readOnly && (index + (metadata.description ? 3 : 2)) === currentPreviewPage && !editingTextId) {
                          e.stopPropagation();
                          handleTextMouseDown(e, textOverlay.id, index);
                        }
                      }}
                      onDoubleClick={(e) => {
                        if (!readOnly && (index + (metadata.description ? 3 : 2)) === currentPreviewPage) {
                          e.stopPropagation();
                          handleTextDoubleClick(textOverlay.id);
                        }
                      }}
                      onDragOver={(e) => {
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute ${!readOnly && (index + (metadata.description ? 3 : 2)) === currentPreviewPage ? "cursor-move hover:ring-2 hover:ring-blue-400" : ""}`}
                      style={{
                        left: `${textOverlay.x}%`,
                        top: `${textOverlay.y}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: `${textOverlay.fontSize}px`,
                        color: textOverlay.color,
                        fontFamily: textOverlay.fontFamily,
                        fontWeight: textOverlay.bold ? "bold" : "normal",
                        fontStyle: textOverlay.italic ? "italic" : "normal",
                        textDecoration: textOverlay.underline ? "underline" : "none",
                        zIndex: 10,
                        pointerEvents: editingTextId === textOverlay.id ? "none" : "auto",
                        whiteSpace: "pre-wrap",
                        width: "max-content",
                      }}
                    >
                      {textOverlay.text}
                      {!readOnly && (index + (metadata.description ? 3 : 2)) === currentPreviewPage && editingTextId !== textOverlay.id && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTextDelete(textOverlay.id, index);
                          }}
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </>
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
    };
  });

  const pages = [...metadataPages, ...artworkPages];

  const getWordCount = (html = "") => {
    return html
      .replace(/<[^>]*>/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  };

  const artworkIndex = currentPreviewPage - (metadata.description ? 3 : 2);
  const currentPageText = artworkIndex >= 0 ? (manuscriptData?.data?.[artworkIndex]?.content || "") : "";
  const currentPageWords = getWordCount(currentPageText);
  

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

  const trimAspectRatio = trimSize ? (TRIM_ASPECT_RATIO[trimSize] || "1 / 1") : "1 / 1";

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="bg-white shadow-lg border rounded-lg p-8 mb-8 min-h-[380px] relative overflow-hidden"
        style={{
          ...styles,
          aspectRatio: trimAspectRatio,
        }}
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
      {
        !readOnly && (
          <div className="grid grid-cols-6 gap-3 mb-6 mt-6">
            {pages.map((page, index) => {
              const metadataCount = artworkPageOffset;
              if (index < metadataCount) {
                const labels = [
                  "Title",
                  "Copyright",
                  ...(metadata?.description ? ["About this book"] : []),
                  ...(hasDedication ? ["Dedication"] : []),
                ];
                const label = labels[index] || `Page ${index + 1}`;
                return (
                  <div
                    key={index}
                    onClick={() => setCurrentPreviewPage(index)}
                    className={`h-20 border rounded-md cursor-pointer overflow-hidden relative
                      flex flex-col items-center justify-center text-[10px] uppercase font-bold
                      ${currentPreviewPage === index
                        ? "border-black ring-1 ring-black bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-400"}
                    `}
                  >
                    <span>{label}</span>
                    <span className="text-[8px] mt-1">Page {index + 1}</span>
                  </div>
                );
              }

              const artworkPageIndex = index - artworkPageOffset;
              const hasImage = pageImages[artworkPageIndex] !== null && pageImages[artworkPageIndex] !== undefined;
              return (
                <div
                  key={index}
                  onClick={() => setCurrentPreviewPage(index)}
                  className={`h-20 border rounded-md cursor-pointer overflow-hidden relative
                    flex items-center justify-center text-xs
                    ${currentPreviewPage === index
                      ? "border-black ring-1 ring-black"
                      : "border-gray-300"}
                  `}
                >
                  {hasImage ? (
                    <>
                      <img
                        src={pageImages[artworkPageIndex]}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 py-0.5 text-center">
                        Page {index + 1}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">
                      Page {index + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
      {ageGroup && AGE_GUIDELINES[ageGroup] && !readOnly && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
          <strong>Layout guidance:</strong>{" "}
          This page has <b>{currentPageWords}</b> words.
          Typical for{" "}
          <b>{AGE_GUIDELINES[ageGroup].label}</b> is{" "}
          {AGE_GUIDELINES[ageGroup].wordsPerPage[0]}–
          {AGE_GUIDELINES[ageGroup].wordsPerPage[1]} words per page.
        </div>
      )}
      {trimSize && binding && (
        <div className="text-xs text-gray-600 mb-2 text-center">
          Previewing {trimSize} · {binding.replace("-", " ")}
        </div>
      )}
    </div>
  );
}