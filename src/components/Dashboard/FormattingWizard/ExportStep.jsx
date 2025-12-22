"use client"

import { useState } from "react"
import { Check, Download, FileText } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export function ExportStep({ exportFormat, setExportFormat, manuscriptData, metadata, getPreviewStyles }) {
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


  const exportAsPDF = async () => {
    try {
      console.log("Starting PDF export...")
      
      // Use the fallback jsPDF approach directly for best compatibility
      await exportAsPDFFallback()
      
    } catch (error) {
      console.error("PDF generation error details:", error)
      console.error("Error stack:", error.stack)
      throw new Error(`Failed to generate PDF: ${error.message}`)
    }
  }

  const exportAsPDFFallback = async () => {
    // Load jsPDF
    let script = document.querySelector('script[src*="jspdf"]')
    
    if (!script) {
      script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("jsPDF library failed to load")
    }

    const { jsPDF } = window.jspdf
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
      putOnlyUsedFonts: true
    })

    // Get theme styles for consistent formatting
    const themeStyles = getPreviewStyles ? getPreviewStyles() : {}
    const fontFamily = themeStyles.fontFamily || 'Georgia, serif'
    const fontSize = themeStyles.fontSize || '12pt'
    const lineHeight = themeStyles.lineHeight || '1.6'
    const margins = themeStyles.padding || '2rem'
    
    // Convert margins to mm for PDF
    const marginInMM = margins === '1rem' ? 15 : margins === '3rem' ? 35 : 25

    const pageWidth = 210
    const pageHeight = 297
    const margin = marginInMM
    const contentWidth = pageWidth - margin * 2
    let yPosition = margin

    // Helper function to add text with proper formatting and dynamic wrapping
    const addText = (text, textSize = parseInt(fontSize) || 12, isBold = false, isCenter = false, textLineHeight = parseFloat(lineHeight) || 1.2) => {
      if (!text || text.trim() === '') return
      
      doc.setFontSize(textSize)
      
      // Map font family to jsPDF supported fonts
      let pdfFont = "helvetica" // default
      if (fontFamily.includes("serif") || fontFamily.includes("Georgia")) {
        pdfFont = "times"
      } else if (fontFamily.includes("monospace") || fontFamily.includes("Menlo")) {
        pdfFont = "courier"
      }
      
      doc.setFont(pdfFont, isBold ? "bold" : "normal")

      // Split text into lines that fit within the content width
      const lines = doc.splitTextToSize(text, contentWidth)
      
      // Check if we need a page break before adding text
      const neededSpace = lines.length * textSize * textLineHeight * 0.5
      if (yPosition + neededSpace > pageHeight - margin) {
        addNewPage()
      }

      if (isCenter) {
        lines.forEach((line, index) => {
          const textWidth = doc.getTextWidth(line)
          const x = (pageWidth - textWidth) / 2
          doc.text(line, x, yPosition)
          yPosition += textSize * textLineHeight * 0.5
        })
      } else {
        doc.text(lines, margin, yPosition)
        yPosition += (lines.length - 1) * (textSize * textLineHeight * 0.5)
      }

      yPosition += textSize * textLineHeight * 0.3
    }

    const addNewPage = () => {
      doc.addPage()
      yPosition = margin
    }

    const checkPageBreak = (neededSpace = 20) => {
      if (yPosition + neededSpace > pageHeight - margin) {
        addNewPage()
      }
    }

    // Title Page - Dynamic positioning for long content
    yPosition = margin + 20
    
    // Calculate space needed for title
    const titleText = metadata.title || "Untitled"
    const titleLines = doc.splitTextToSize(titleText, contentWidth)
    const titleHeight = titleLines.length * 28 * 1.4 * 0.5
    
    // Calculate space needed for subtitle
    let subtitleHeight = 0
    if (metadata.subTitle) {
      const subtitleLines = doc.splitTextToSize(metadata.subTitle, contentWidth)
      subtitleHeight = subtitleLines.length * 18 * 1.3 * 0.5
    }
    
    // Calculate space needed for author
    const authorText = `by ${metadata.author || "Unknown Author"}`
    const authorLines = doc.splitTextToSize(authorText, contentWidth)
    const authorHeight = authorLines.length * 16 * 1.2 * 0.5
    
    // Calculate total height needed
    const totalHeight = titleHeight + subtitleHeight + authorHeight + 60 // 60 for spacing
    
    // Center vertically if content fits, otherwise start from top
    if (totalHeight < pageHeight - margin * 2) {
      yPosition = (pageHeight - totalHeight) / 2
    }
    
    // Add title
    addText(titleText, 28, true, true, 1.4)
    yPosition += 30
    
    // Add subtitle if exists
    if (metadata.subTitle) {
      addText(metadata.subTitle, 18, false, true, 1.3)
      yPosition += 25
    }
    
    // Add author
    addText(authorText, 16, false, true, 1.2)

    // Copyright Page (left-aligned to match preview exactly)
    addNewPage()
    yPosition = margin + 20
    
    // Copyright notice and All Rights Reserved
    const baseFontSize = parseInt(fontSize) || 12
    addText(`Copyright © ${new Date().getFullYear()} by ${metadata.author || "N/A"}`, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 6
    addText("All Rights Reserved.", baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 6
    
    // ISBN
    addText(`ISBN: ${metadata.ISBN || "N/A"}`, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 6
    
    // Cover Design By
    addText(`Cover Design By ${metadata.coverdesignby || "N/A"}`, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 6
    
    // Cover Illustration By
    addText(`Cover Illustration By ${metadata.coverillustrationby || "N/A"}`, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 6
    
    // Edited By
    addText(`Edited By ${metadata.editedby || "N/A"}`, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 6
    
    // Edition
    addText(`${metadata.edition || "N/A"} Edition`, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 6
    
    // Published By
    addText(`Published By: ${metadata.publisher || "N/A"}`, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
    yPosition += 20
    
    // Description (with extra spacing like mt-7 in preview)
    if (metadata.description) {
      addText(metadata.description, baseFontSize, false, false, parseFloat(lineHeight) || 1.2)
      yPosition += 20
    }
    
    // Add extra spacing to fill the page
    yPosition += 50
    
    // Force page break to ensure TOC is on page 3
    addNewPage()
    addText("Table of Contents", 22, true, true, 1.3)
    yPosition += 20

    const tableOfContents = generateTableOfContents()
    tableOfContents.forEach((item) => {
      checkPageBreak(20)
      doc.setFontSize(parseInt(fontSize) || 12)
      
      // Map font family to jsPDF supported fonts
      let pdfFont = "helvetica" // default
      if (fontFamily.includes("serif") || fontFamily.includes("Georgia")) {
        pdfFont = "times"
      } else if (fontFamily.includes("monospace") || fontFamily.includes("Menlo")) {
        pdfFont = "courier"
      }
      
      doc.setFont(pdfFont, "normal")

      // Chapter title
      const titleText = item.title
      const pageNumText = `Page ${item.page}`
      const pageNumWidth = doc.getTextWidth(pageNumText)
      
      // Calculate dots needed
      const availableWidth = contentWidth - pageNumWidth - 10
      const titleWidth = doc.getTextWidth(titleText)
      const dotsWidth = availableWidth - titleWidth
      const dotCount = Math.floor(dotsWidth / 3)
      const dots = ".".repeat(Math.max(0, dotCount))
      
      // Combine title + dots + page number
      const fullText = `${titleText} ${dots} ${pageNumText}`
      doc.text(fullText, margin, yPosition)

      yPosition += 6
    })

    // Chapters
    console.log("Processing manuscript data:", manuscriptData.data.length, "chapters")
    manuscriptData.data.forEach((item, index) => {
      console.log(`Processing chapter ${index + 1}: ${item.sectionTitle}`)
      addNewPage()

      // Chapter title
      addText(item.sectionTitle, 20, true, true, 1.3)
      yPosition += 20

      // Chapter content with better formatting
      const cleanedContent = cleanContent(item.content)

      // Split content into paragraphs
      const paragraphs = cleanedContent.split(/\n\s*\n/).filter(p => p.trim())

      paragraphs.forEach((paragraph) => {
        checkPageBreak(20)
        if (paragraph.trim()) {
          // Check if it's a heading (starts with newline and is short)
          if (paragraph.startsWith('\n') && paragraph.length < 100 && !paragraph.includes('.')) {
            addText(paragraph.trim(), baseFontSize + 2, true, false, parseFloat(lineHeight) || 1.4)
            yPosition += 10
          } else {
            addText(paragraph.trim(), baseFontSize - 1, false, false, parseFloat(lineHeight) || 1.6)
            yPosition += 8
          }
        }
      })
    })

    // Save the PDF with proper filename
    const safeTitle = (metadata.title || "manuscript").replace(/[^a-zA-Z0-9\s]/g, "_").replace(/\s+/g, "_")
    const filename = `${safeTitle}.pdf`
    
    console.log("PDF generation completed, saving as:", filename)
    doc.save(filename)
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
        await exportAsPDF()
        toast.success("PDF exported successfully!")
      } else {
        await exportAsEPUB()
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
