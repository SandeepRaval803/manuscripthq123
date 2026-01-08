"use client"

import { useState } from "react"
import { Check, Download, FileText } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

const TRIM_PDF_SIZE = {
  "8x8": { w: 8, h: 8 },
  "8.5x8.5": { w: 8.5, h: 8.5 },
  "8x10": { w: 8, h: 10 },
  "10x8": { w: 10, h: 8 },
};
export function ExportStep({ exportFormat, setExportFormat, manuscriptData, metadata, getPreviewStyles, trimSize, pageImages }) {
  const [exporting, setExporting] = useState(false)

  const generateTableOfContents = () => {
    if (!manuscriptData?.data) return []
    return manuscriptData.data.map((item, index) => ({
      title: item.sectionTitle,
      page: index + 4, // Updated: Copyright page is page 2, TOC is page 3, chapters start from page 4
    }))
  }

  // Clean content while preserving HTML structure for better PDF formatting
  const cleanContent = (htmlContent) => {
    if (!htmlContent) return ""

    // Convert to plain text to completely avoid CSS issues
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    
    // Extract only text content and basic structure
    const processElement = (element) => {
      let result = ""
      
      for (let child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          result += child.textContent
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const tagName = child.tagName.toLowerCase()
          
          if (tagName === 'p' || tagName === 'div') {
            const text = processElement(child)
            if (text.trim()) {
              result += text.trim() + "\n\n"
            }
          } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
            const text = processElement(child)
            if (text.trim()) {
              result += "\n" + text.trim() + "\n\n"
            }
          } else if (tagName === 'br') {
            result += "\n"
          } else if (tagName === 'li') {
            const text = processElement(child)
            if (text.trim()) {
              result += "• " + text.trim() + "\n"
            }
          } else if (tagName === 'strong' || tagName === 'b') {
            const text = processElement(child)
            if (text.trim()) {
              result += text.trim()
            }
          } else if (tagName === 'em' || tagName === 'i') {
            const text = processElement(child)
            if (text.trim()) {
              result += text.trim()
            }
          } else {
            const text = processElement(child)
            if (text.trim()) {
              result += text.trim()
            }
          }
        }
      }
      
      return result
    }
    
    let cleanText = processElement(tempDiv)
    
    // Clean up whitespace
    cleanText = cleanText
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove multiple empty lines
      .replace(/[ \t]+/g, " ") // Normalize spaces
      .trim()
    
    return cleanText
  }


  const exportAsEPUB = async () => {
    const tableOfContents = generateTableOfContents()
    
    // Get theme styles for consistent formatting
    const themeStyles = getPreviewStyles ? getPreviewStyles() : {}
    const fontFamily = themeStyles.fontFamily || 'Georgia, serif'
    const fontSize = themeStyles.fontSize || '12pt'
    const lineHeight = themeStyles.lineHeight || '1.6'
    const margins = themeStyles.padding || '2rem'

    const epubContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  <style>
    body {
      font-family: ${fontFamily};
      font-size: ${fontSize};
      line-height: ${lineHeight};
      margin: 0;
      padding: ${margins};
      color: black;
      background: white;
    }
    .title-page {
      text-align: center;
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .title { 
      font-size: 2.5em; 
      font-weight: bold; 
      margin-bottom: 2rem; 
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    .genre { 
      font-size: 1.5em; 
      margin-bottom: 3rem; 
      font-style: italic; 
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    .author { 
      font-size: 1.3em; 
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    .chapter { 
      page-break-before: always; 
    }
    .chapter-title { 
      font-size: 1.8em; 
      font-weight: bold; 
      margin-bottom: 2rem; 
      text-align: center; 
    }
  </style>
</head>
<body>
  <div class="title-page">
    <div class="title">${metadata.title}</div>
    <div class="genre">${metadata.subTitle}</div>
    <div class="author">${metadata.author}</div>
  </div>
  
  <div style="text-align: left; padding: 40px 20px; word-wrap: break-word; overflow-wrap: break-word;">
    <div>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">Copyright © ${new Date().getFullYear()} by ${metadata.author || "N/A"}</p>
      <p>All Rights Reserved.</p>
    </div>
    
    <div style="margin-top: 8px;">
      <p style="word-wrap: break-word; overflow-wrap: break-word;">ISBN: ${metadata.ISBN || "N/A"}</p>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">Cover Design By ${metadata.coverdesignby || "N/A"}</p>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">Cover Illustration By ${metadata.coverillustrationby || "N/A"}</p>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">Edited By ${metadata.editedby || "N/A"}</p>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">${metadata.edition || "N/A"} Edition</p>
      <p style="word-wrap: break-word; overflow-wrap: break-word;">Published By: ${metadata.publisher || "N/A"}</p>
    </div>
    ${metadata.description ? `<div style="margin-top: 1.75rem; word-wrap: break-word; overflow-wrap: break-word;">${metadata.description}</div>` : ''}
  </div>
  
  <div style="page-break-after: always; padding: 20px;">
    <h1 style="text-align: center; font-size: 1.875rem; font-weight: bold; margin-bottom: 2rem;">Table of Contents</h1>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${tableOfContents
        .map(
          (item) => `
        <div style="font-size: 1.125rem; margin-bottom: 1rem;">
          ${item.title} ................................. Page ${item.page}
        </div>
      `,
        )
        .join("")}
    </div>
  </div>
  
  ${manuscriptData.data
    .map(
      (item) => `
    <div class="chapter">
      <h1 class="chapter-title">${item.sectionTitle}</h1>
      <div>${cleanContent(item.content || "")}</div>
    </div>
  `,
    )
    .join("")}
</body>
</html>`

    const blob = new Blob([epubContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const safeTitle = (metadata.title || "manuscript").replace(/[^a-zA-Z0-9\s]/g, "_").replace(/\s+/g, "_")
    a.download = `${safeTitle}.epub`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const addImageCover = (pdf, imgData, pageW, pageH) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgData;
  
      img.onload = () => {
        const imgW = img.width;
        const imgH = img.height;
  
        const imgRatio = imgW / imgH;
        const pageRatio = pageW / pageH;
  
        let drawW, drawH, offsetX, offsetY;
  
        if (imgRatio > pageRatio) {
          // Wider image
          drawH = pageH;
          drawW = pageH * imgRatio;
          offsetX = (pageW - drawW) / 2;
          offsetY = 0;
        } else {
          // Taller image
          drawW = pageW;
          drawH = pageW / imgRatio;
          offsetX = 0;
          offsetY = (pageH - drawH) / 2;
        }
  
        // 🔥 Detect format automatically
        const format = imgData.includes("png") ? "PNG" : "JPEG";
  
        pdf.addImage(
          imgData,
          format,
          offsetX,
          offsetY,
          drawW,
          drawH
        );
  
        resolve();
      };
  
      img.onerror = reject;
    });
  };
  
  
  const exportImagesAsPDF = async () => {
    if (!pageImages || pageImages.filter(Boolean).length === 0) {
      toast.error("No images to export");
      return;
    }
  
    if (!window.jspdf) {
      await new Promise((res) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = res;
        document.head.appendChild(script);
      });
    }
  
    const { jsPDF } = window.jspdf;
  
    const size = TRIM_PDF_SIZE[trimSize] || TRIM_PDF_SIZE["8x8"];
  
    const pdf = new jsPDF({
      orientation: size.w > size.h ? "landscape" : "portrait",
      unit: "in",
      format: [size.w, size.h],
    });
  
    const images = pageImages.filter(Boolean);
  
    for (let i = 0; i < images.length; i++) {
      if (i !== 0) pdf.addPage();
      await addImageCover(pdf, images[i], size.w, size.h);
    }
  
    const name = (metadata.title || "storybook")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
  
    pdf.save(`${name}.pdf`);
  }; 
  
  const exportImagesAsEPUB = async () => {
    if (!pageImages || pageImages.filter(Boolean).length === 0) {
      toast.error("No images to export");
      return;
    }
  
    const images = pageImages.filter(Boolean);
  
    // Build HTML pages
    const pagesHTML = images
      .map(
        (img, index) => `
        <section class="page">
          <img src="${img}" alt="Page ${index + 1}" />
        </section>
      `
      )
      .join("");
  
    const epubHTML = `<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  <title>${metadata.title || "Story Book"}</title>
  
  <style>
    body {
      margin: 0;
      padding: 0;
      background: white;
    }
  
    .page {
      page-break-after: always;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
    }
  
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  </style>
  </head>
  
  <body>
    ${pagesHTML}
  </body>
  </html>`;
  
    const blob = new Blob([epubHTML], { type: "application/epub+zip" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
  
    const safeTitle = (metadata.title || "storybook")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
  
    a.download = `${safeTitle}.epub`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  };
  
  const handleExport = async () => {
    if (!manuscriptData) {
      toast.error("No manuscript data to export")
      return
    }

    if (!manuscriptData.data || manuscriptData.data.length === 0) {
      toast.error("No content to export")
      return
    }

    setExporting(true)
    try {
      if (exportFormat === "PDF") {
        // await exportAsPDF()
        await exportImagesAsPDF()
        toast.success("PDF exported successfully!")
      } else {
        // await exportAsEPUB()
        await exportImagesAsEPUB();
        toast.success("EPUB exported successfully!")
      }
    } catch (error) {
      console.error("Export error:", error)
      toast.error(`Failed to export: ${error.message}`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Export Options</h3>
        <p className="text-sm text-muted-foreground">Choose your export format and options</p>
      </div>

      <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="grid gap-6 md:grid-cols-2">
        <div>
          <RadioGroupItem value="EPUB" id="EPUB" className="peer sr-only" />
          <Label
            htmlFor="EPUB"
            className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="mb-4 rounded-md bg-[#eaa8f9] p-2 text-primary">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="font-medium">EPUB</div>
            <div className="text-center text-sm text-muted-foreground">Electronic publication format for e-readers</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="PDF" id="PDF" className="peer sr-only" />
          <Label
            htmlFor="PDF"
            className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="mb-4 rounded-md bg-[#eaa8f9] p-2 text-primary">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="font-medium">PDF</div>
            <div className="text-center text-sm text-muted-foreground">Professional PDF format ready for printing</div>
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-8 space-y-4">
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <div className="font-medium text-green-700 dark:text-green-300">Validation Results</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            <span>Your manuscript is ready for export</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            <span>All formatting settings applied successfully</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            <span>Table of contents generated with page numbers</span>
          </div>
        </div>



        <div className="flex justify-start items-center">
          <Button onClick={handleExport} disabled={exporting || !manuscriptData}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
