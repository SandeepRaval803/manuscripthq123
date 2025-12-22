"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  ImageIcon,
  Undo,
  Redo,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LinkModal } from "./LinkModal"
import { ImageModal } from "./ImageModal"
import { ImageEditModal } from "./ImageEditModal"
import KeyboardShortcuts from "./KeyboardShortcuts"
import { useAuth } from "@/context/userContext"
import toast from "react-hot-toast"
import Loader from "@/components/common/Loader"

export function RichTextEditor({ selectedNodeId, onContentChange }) {
  const [selectedButton, setSelectedButton] = useState(null)
  const [content, setContent] = useState("")
  const [history, setHistory] = useState([""])
  const [historyIndex, setHistoryIndex] = useState(0)
  const editorRef = useRef(null)
  const typingTimeout = useRef(null)
  const isProgrammaticChange = useRef(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkValue, setLinkValue] = useState("")
  const [showImageModal, setShowImageModal] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const { token } = useAuth()
  const [showImageEditModal, setShowImageEditModal] = useState(false)
  const [selectedImageElement, setSelectedImageElement] = useState(null)

  // Load content when selectedNodeId changes
  useEffect(() => {
    const loadContent = async () => {
      if (!selectedNodeId || !token) {
        // Clear content if no section is selected
        setContent("")
        if (editorRef.current) {
          editorRef.current.innerHTML = ""
        }
        setIsContentLoaded(true)
        return
      }
      setIsLoadingContent(true)
      setIsContentLoaded(false)

      try {
        const response = await fetch(
          `https://apis.manuscripthq.com/api/editor/getContentBySectionId?sectionId=${selectedNodeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          },
        )

        const data = await response.json()
        if (data.status === "success") {
          const loadedContent = data.data || ""

          setContent(loadedContent)
          setHistory([loadedContent])
          setHistoryIndex(0)
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = loadedContent
              editorRef.current.focus()
              editorRef.current.blur()
              setIsContentLoaded(true)
            }
          }, 100)
        } else {
          setContent("")
          if (editorRef.current) {
            editorRef.current.innerHTML = ""
          }
          setHistory([""])
          setHistoryIndex(0)
          setIsContentLoaded(true)
        }
      } catch (error) {
        toast.error("Failed to load content for this section")

        // Clear content on error
        setContent("")
        if (editorRef.current) {
          editorRef.current.innerHTML = ""
        }
        setHistory([""])
        setHistoryIndex(0)
        setIsContentLoaded(true)
      } finally {
        setIsLoadingContent(false)
      }
    }

    loadContent()
  }, [selectedNodeId, token])

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  // Notify parent component when content changes
  useEffect(() => {
    if (onContentChange) {
      onContentChange(content)
    }
  }, [content, onContentChange])

  useEffect(() => {
    const handleImageClick = (e) => {
      if (e.target.tagName === "IMG" && editorRef.current?.contains(e.target)) {
        e.preventDefault()
        handleImageEdit(e.target)
      }
    }

    if (editorRef.current) {
      editorRef.current.addEventListener("click", handleImageClick)
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener("click", handleImageClick)
        }
      }
    }
  }, [isContentLoaded])

  // Add delete buttons to images
  useEffect(() => {
    if (isContentLoaded && editorRef.current) {
      const images = editorRef.current.querySelectorAll("img")
      images.forEach((img) => {
        // Remove existing delete button if any
        const existingButton = img.parentElement?.querySelector(".image-delete-btn")
        if (existingButton) {
          existingButton.remove()
        }

        // Create wrapper if image is not already wrapped
        if (!img.parentElement?.classList.contains("image-wrapper")) {
          const wrapper = document.createElement("div")
          wrapper.className = "image-wrapper relative inline-block group"
          img.parentNode.insertBefore(wrapper, img)
          wrapper.appendChild(img)

          // Create delete button
          const deleteBtn = document.createElement("button")
          deleteBtn.className =
            "image-delete-btn absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600 z-10"
          deleteBtn.innerHTML = "×"
          deleteBtn.title = "Delete image"

          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            e.preventDefault()
            if (window.confirm("Are you sure you want to delete this image?")) {
              wrapper.remove()
              const newContent = editorRef.current.innerHTML
              setContent(newContent)
              addToHistory(newContent)
              toast.success("Image deleted successfully")
            }
          })

          wrapper.appendChild(deleteBtn)
        }
      })
    }
  }, [isContentLoaded, content])

  const addToHistory = useCallback(
    (newContent) => {
      if (newContent === content) return
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex, content],
  )

  const formatText = useCallback(
    (command, value) => {
      if (editorRef.current) {
        editorRef.current.focus()
        if (command === "bold") {
          document.execCommand("bold")
        } else if (command === "italic") {
          document.execCommand("italic")
        } else if (command === "underline") {
          document.execCommand("underline")
        } else if (command === "strikeThrough") {
          document.execCommand("strikeThrough")
        } else if (command === "justifyLeft") {
          document.execCommand("justifyLeft")
        } else if (command === "justifyCenter") {
          document.execCommand("justifyCenter")
        } else if (command === "justifyRight") {
          document.execCommand("justifyRight")
        } else if (command === "formatBlock") {
          const selection = window.getSelection()
          if (selection && selection.rangeCount === 0) {
            const range = document.createRange()
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
          }

          const success = document.execCommand(command, false, value)
          if (!success && command === "formatBlock" && value) {
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0)
              const element = document.createElement(value.replace(/[<>]/g, ""))

              try {
                range.surroundContents(element)
              } catch (e) {
                element.appendChild(range.extractContents())
                range.insertNode(element)
              }

              selection.removeAllRanges()
              const newRange = document.createRange()
              newRange.setStartAfter(element)
              newRange.collapse(true)
              selection.addRange(newRange)
            }
          }
        } else if (command === "createLink" && value) {
          const selection = window.getSelection()
          if (selection && selection.toString().trim()) {
            document.execCommand("createLink", false, value)
          } else {
            const linkHtml = `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`
            document.execCommand("insertHTML", false, linkHtml)
          }
        } else if (command === "insertImage" && value) {
          const imgHtml = `<div class="image-wrapper relative inline-block group">
            <img src="${value}" alt="Inserted image" style="max-width: 100%; height: auto; margin: 10px 0;" />
            <button class="image-delete-btn absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600 z-10" title="Delete image">×</button>
          </div>`
          document.execCommand("insertHTML", false, imgHtml)
        }

        const newContent = editorRef.current.innerHTML
        setContent(newContent)
        addToHistory(newContent)
      }
    },
    [addToHistory],
  )

  const insertHTML = useCallback(
    (html) => {
      if (editorRef.current) {
        editorRef.current.focus()
        document.execCommand("insertHTML", false, html)
        const newContent = editorRef.current.innerHTML
        setContent(newContent)
        addToHistory(newContent)
      }
    },
    [addToHistory],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const newContent = history[newIndex]

      isProgrammaticChange.current = true // Prevent triggering content change handler
      setHistoryIndex(newIndex)
      setContent(newContent)

      if (editorRef.current) {
        editorRef.current.innerHTML = newContent
      }
    }
  }, [historyIndex, history])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const newContent = history[newIndex]

      isProgrammaticChange.current = true // Prevent triggering content change handler
      setHistoryIndex(newIndex)
      setContent(newContent)

      if (editorRef.current) {
        editorRef.current.innerHTML = newContent
      }
    }
  }, [historyIndex, history])

  const handleContentChange = useCallback(() => {
    if (editorRef.current && isContentLoaded && !isLoadingContent) {
      const newContent = editorRef.current.innerHTML

      if (isProgrammaticChange.current) {
        isProgrammaticChange.current = false
        return
      }

      setContent(newContent)

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }

      // Debounce history update: only push to history after 600ms of inactivity
      typingTimeout.current = setTimeout(() => {
        if (newContent !== history[historyIndex]) {
          addToHistory(newContent)
        }
      }, 600)
    }
  }, [isContentLoaded, isLoadingContent, history, historyIndex, addToHistory])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault()
            formatText("bold")
            break
          case "i":
            e.preventDefault()
            formatText("italic")
            break
          case "u":
            e.preventDefault()
            formatText("underline")
            break
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "y":
            e.preventDefault()
            redo()
            break
        }
      }
    },
    [formatText, undo, redo],
  )

  const getTextStats = () => {
    const textContent = editorRef.current?.textContent || ""
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0
    const charCount = textContent.length
    return { wordCount, charCount }
  }
  const { wordCount, charCount } = getTextStats()

  const handleLinkInsert = () => {
    if (linkValue.trim()) {
      let url = linkValue.trim()
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
      }

      formatText("createLink", url)
      setShowLinkModal(false)
      setLinkValue("")
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append("image", file)
    const res = await fetch("https://apis.manuscripthq.com/api/utility/upload-image", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    return data.imageUrl || null
  }

  const handleImageInsert = async (file) => {
    if (!file) return
    try {
      const imageUrl = await uploadFile(file)
      if (imageUrl) {
        formatText("insertImage", imageUrl)
        setShowImageModal(false)
      } else {
        toast.error("Failed to upload image. Please try again.")
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.")
    }
  }

  const handleImageEdit = (imageElement) => {
    setSelectedImageElement(imageElement)
    setShowImageEditModal(true)
  }

  const handleImageSave = (changes) => {
    if (!selectedImageElement) return

    // Apply the changes to the image element
    selectedImageElement.src = changes.src
    selectedImageElement.style.width = `${changes.width}px`
    selectedImageElement.style.height = `${changes.height}px`

    // Remove existing alignment styles
    selectedImageElement.style.float = ""
    selectedImageElement.style.display = ""
    selectedImageElement.style.margin = ""

    // Apply new alignment
    switch (changes.alignment) {
      case "left":
        selectedImageElement.style.float = "left"
        selectedImageElement.style.marginRight = "16px"
        selectedImageElement.style.marginBottom = "8px"
        break
      case "right":
        selectedImageElement.style.float = "right"
        selectedImageElement.style.marginLeft = "16px"
        selectedImageElement.style.marginBottom = "8px"
        break
      case "center":
        selectedImageElement.style.display = "block"
        selectedImageElement.style.margin = "16px auto"
        break
      default:
        // No special alignment
        break
    }

    // Update content and history
    const newContent = editorRef.current.innerHTML
    setContent(newContent)
    addToHistory(newContent)

    setShowImageEditModal(false)
    setSelectedImageElement(null)
    toast.success("Image updated successfully!")
  }

  const handleImageDelete = () => {
    if (selectedImageElement) {
      const wrapper = selectedImageElement.closest(".image-wrapper")
      if (wrapper) {
        wrapper.remove()
      } else {
        selectedImageElement.remove()
      }

      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      addToHistory(newContent)
      toast.success("Image deleted successfully!")
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-3">
      <KeyboardShortcuts />
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#eaa8f9]/20 to-transparent rounded-lg border border-primary">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-[#eaa8f9] text-primary font-medium">
            Words: {wordCount}
          </Badge>
          <Badge variant="outline" className="border-primary text-primary">
            Characters: {charCount}
          </Badge>
        </div>
      </div>

      <Card className="p-0 border-primary">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-primary">
            <div className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-lg border border-primary">
              <FileText className="w-4 h-4 mr-2" />
              Write
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="text-primary hover:bg-[#eaa8f9] disabled:opacity-50"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="text-primary hover:bg-[#eaa8f9] disabled:opacity-50"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-4 bg-gradient-to-r from-[#eaa8f9]/20 to-transparent border-b border-primary">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("bold")}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("italic")}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("underline")}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Underline (Ctrl+U)"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("strikeThrough")}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 bg-primary/30" />

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Button
                  key={n}
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("formatBlock", `h${n}`)}
                  className={`text-primary hover:bg-[#eaa8f9] hover:text-black text-xs font-bold ${
                    selectedButton === `formatBlock:h${n}` ? "bg-primary text-white" : ""
                  }`}
                  title={`Heading ${n}`}
                >
                  {`H${n}`}
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6 bg-primary/30" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("justifyLeft")}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("justifyCenter")}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("justifyRight")}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 bg-primary/30" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.focus()
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount === 0) {
                      const range = document.createRange()
                      range.selectNodeContents(editorRef.current)
                      range.collapse(false)
                      selection.removeAllRanges()
                      selection.addRange(range)
                    }
                    const success = document.execCommand("insertUnorderedList", false, null)
                    if (!success) {
                      insertHTML("<ul><li>List item</li></ul>")
                    } else {
                      const newContent = editorRef.current.innerHTML
                      setContent(newContent)
                      addToHistory(newContent)
                    }
                  }
                }}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.focus()
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount === 0) {
                      const range = document.createRange()
                      range.selectNodeContents(editorRef.current)
                      range.collapse(false)
                      selection.removeAllRanges()
                      selection.addRange(range)
                    }
                    const success = document.execCommand("insertOrderedList", false, null)
                    if (!success) {
                      insertHTML("<ol><li>List item</li></ol>")
                    } else {
                      const newContent = editorRef.current.innerHTML
                      setContent(newContent)
                      addToHistory(newContent)
                    }
                  }
                }}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  insertHTML(
                    '<blockquote style="border-left: 4px solid #CA24D6; padding-left: 16px; margin: 16px 0; font-style: italic;">Quote text here</blockquote>',
                  )
                }
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLinkModal(true)}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Insert Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageModal(true)}
                className="text-primary hover:bg-[#eaa8f9] hover:text-black"
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isLoadingContent ? (
            <div className="flex items-center justify-center my-4">
              <Loader />
            </div>
          ) : (
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[400px] p-6 focus:outline-none text-gray-800 leading-relaxed [&_img]:cursor-pointer [&_img]:transition-all [&_.image-wrapper]:relative [&_.image-wrapper]:inline-block"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
              data-placeholder={
                selectedNodeId
                  ? "Start writing your content here... Use the toolbar above or keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic, etc.)"
                  : "Please select a section from the outline to start writing..."
              }
            />
          )}
        </CardContent>
      </Card>

      <LinkModal
        open={showLinkModal}
        value={linkValue}
        onChange={setLinkValue}
        onClose={() => {
          setShowLinkModal(false)
          setLinkValue("")
        }}
        onInsert={handleLinkInsert}
      />

      <ImageModal open={showImageModal} onClose={() => setShowImageModal(false)} onInsert={handleImageInsert} />

      <ImageEditModal
        open={showImageEditModal}
        imageElement={selectedImageElement}
        onClose={() => {
          setShowImageEditModal(false)
          setSelectedImageElement(null)
        }}
        onSave={handleImageSave}
        onDelete={handleImageDelete}
      />
    </div>
  )
}

export default RichTextEditor
