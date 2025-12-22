"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Crop,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Scissors,
  Trash2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"

export function ImageEditModal({ open, imageElement, onClose, onSave, onDelete }) {
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 })
  const [alignment, setAlignment] = useState("none")
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [originalSrc, setOriginalSrc] = useState("")
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("resize")
  const [corsError, setCorsError] = useState(false)

  useEffect(() => {
    if (open && imageElement) {
      const currentWidth = Number.parseInt(imageElement.style.width) || imageElement.width || 300
      const currentHeight = Number.parseInt(imageElement.style.height) || imageElement.height || 200

      setDimensions({ width: currentWidth, height: currentHeight })
      setOriginalSrc(imageElement.src)
      setCorsError(false)

      // Get current alignment
      const float = imageElement.style.float || "none"
      const textAlign = imageElement.parentElement?.style.textAlign || "none"

      if (float === "left") setAlignment("left")
      else if (float === "right") setAlignment("right")
      else if (textAlign === "center") setAlignment("center")
      else setAlignment("none")

      setImageLoaded(false)
    }
  }, [open, imageElement])

  const handleImageLoad = () => {
    setImageLoaded(true)
    if (imageRef.current) {
      const img = imageRef.current
      setCropData({
        x: 0,
        y: 0,
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
  }

  const handleImageError = () => {
    setCorsError(true)
    toast.error("Unable to load image for cropping due to CORS restrictions")
  }

  const uploadCroppedImage = async (canvas) => {
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
      const formData = new FormData()
      formData.append("image", blob, "cropped-image.png")

      const response = await fetch("https://apis.manuscripthq.com/api/utility/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      console.error("Error uploading cropped image:", error)
      throw error
    }
  }

  const handleCrop = async () => {
    if (!imageRef.current || !canvasRef.current) return null

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = imageRef.current

    canvas.width = cropData.width
    canvas.height = cropData.height

    try {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0, cropData.width, cropData.height)

      try {
        return canvas.toDataURL("image/png")
      } catch (corsError) {
        const uploadedUrl = await uploadCroppedImage(canvas)
        return uploadedUrl
      }
    } catch (error) {
      console.error("Error cropping image:", error)
      toast.error("Failed to crop image. Please try again.")
      return null
    }
  }

  const handleSave = async () => {
    if (!imageElement) return

    let newSrc = originalSrc

    if (activeTab === "crop" && !corsError) {
      try {
        const croppedSrc = await handleCrop()
        if (croppedSrc) {
          newSrc = croppedSrc
        } else {
          toast.error("Failed to crop image")
          return
        }
      } catch (error) {
        toast.error("Failed to crop image due to CORS restrictions")
        return
      }
    }

    const changes = {
      src: newSrc,
      width: dimensions.width,
      height: dimensions.height,
      alignment: alignment,
    }

    onSave(changes)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      onDelete()
      onClose()
    }
  }

  // Simplified crop presets - much more user-friendly
  const applyCropPreset = (preset) => {
    if (!imageRef.current) return

    const img = imageRef.current
    const { naturalWidth: w, naturalHeight: h } = img

    switch (preset) {
      case "crop-top-20":
        setCropData({ x: 0, y: h * 0.2, width: w, height: h * 0.8 })
        toast.success("Cropped top 20% of the image")
        break
      case "crop-bottom-20":
        setCropData({ x: 0, y: 0, width: w, height: h * 0.8 })
        toast.success("Cropped bottom 20% of the image")
        break
      case "crop-left-20":
        setCropData({ x: w * 0.2, y: 0, width: w * 0.8, height: h })
        toast.success("Cropped left 20% of the image")
        break
      case "crop-right-20":
        setCropData({ x: 0, y: 0, width: w * 0.8, height: h })
        toast.success("Cropped right 20% of the image")
        break
      case "crop-center-80":
        const margin = 0.1
        setCropData({
          x: w * margin,
          y: h * margin,
          width: w * (1 - 2 * margin),
          height: h * (1 - 2 * margin),
        })
        toast.success("Cropped to center 80% of the image")
        break
      case "crop-square":
        const size = Math.min(w, h)
        setCropData({
          x: (w - size) / 2,
          y: (h - size) / 2,
          width: size,
          height: size,
        })
        toast.success("Cropped to center square")
        break
      default:
        setCropData({ x: 0, y: 0, width: w, height: h })
        toast.success("Reset to original size")
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Edit Image</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Image
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {corsError && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">CORS Restriction</h4>
                  <p className="text-sm text-yellow-700">
                    This image cannot be cropped due to cross-origin restrictions. You can still resize and align it.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-gray-50">
                {originalSrc && (
                  <div className="relative">
                    <div className="relative inline-block">
                      <img
                        ref={imageRef}
                        src={originalSrc || "/placeholder.svg"}
                        alt="Preview"
                        crossOrigin="anonymous"
                        style={{
                          width: `${Math.min(dimensions.width, 400)}px`,
                          height: `${Math.min(dimensions.height, 300)}px`,
                          objectFit: "cover",
                        }}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        className={`
                          ${alignment === "left" ? "float-left mr-4" : ""}
                          ${alignment === "right" ? "float-right ml-4" : ""}
                          ${alignment === "center" ? "mx-auto block" : ""}
                        `}
                      />

                      {/* Crop preview overlay */}
                      {activeTab === "crop" && imageLoaded && !corsError && (
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Dimmed areas */}
                          <div
                            className="absolute bg-black/40"
                            style={{
                              left: 0,
                              top: 0,
                              width: `${(cropData.x / imageRef.current?.naturalWidth) * 100}%`,
                              height: "100%",
                            }}
                          />
                          <div
                            className="absolute bg-black/40"
                            style={{
                              right: 0,
                              top: 0,
                              width: `${((imageRef.current?.naturalWidth - cropData.x - cropData.width) / imageRef.current?.naturalWidth) * 100}%`,
                              height: "100%",
                            }}
                          />
                          <div
                            className="absolute bg-black/40"
                            style={{
                              left: `${(cropData.x / imageRef.current?.naturalWidth) * 100}%`,
                              top: 0,
                              width: `${(cropData.width / imageRef.current?.naturalWidth) * 100}%`,
                              height: `${(cropData.y / imageRef.current?.naturalHeight) * 100}%`,
                            }}
                          />
                          <div
                            className="absolute bg-black/40"
                            style={{
                              left: `${(cropData.x / imageRef.current?.naturalWidth) * 100}%`,
                              bottom: 0,
                              width: `${(cropData.width / imageRef.current?.naturalWidth) * 100}%`,
                              height: `${((imageRef.current?.naturalHeight - cropData.y - cropData.height) / imageRef.current?.naturalHeight) * 100}%`,
                            }}
                          />

                          {/* Crop area border */}
                          <div
                            className="absolute border-2 border-green-500"
                            style={{
                              left: `${(cropData.x / imageRef.current?.naturalWidth) * 100}%`,
                              top: `${(cropData.y / imageRef.current?.naturalHeight) * 100}%`,
                              width: `${(cropData.width / imageRef.current?.naturalWidth) * 100}%`,
                              height: `${(cropData.height / imageRef.current?.naturalHeight) * 100}%`,
                            }}
                          >
                            <div className="absolute -top-8 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Keep: {Math.round(cropData.width)} × {Math.round(cropData.height)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {alignment !== "none" && alignment !== "center" && (
                      <div className="text-sm text-gray-500 mt-2 clear-both">
                        Sample text will wrap around the image when aligned {alignment}. This is how your text will flow
                        alongside the image in your document.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls Section */}
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resize">Resize</TabsTrigger>
                  <TabsTrigger value="align">Align</TabsTrigger>
                  <TabsTrigger value="crop" disabled={corsError}>
                    Crop {corsError && "🚫"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="resize" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Width (px)</label>
                      <Input
                        type="number"
                        value={dimensions.width}
                        onChange={(e) =>
                          setDimensions((prev) => ({ ...prev, width: Number.parseInt(e.target.value) || 0 }))
                        }
                        className="mt-2"
                        min="50"
                        max="800"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Height (px)</label>
                      <Input
                        type="number"
                        value={dimensions.height}
                        onChange={(e) =>
                          setDimensions((prev) => ({ ...prev, height: Number.parseInt(e.target.value) || 0 }))
                        }
                        className="mt-2"
                        min="50"
                        max="600"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        if (imageRef.current) {
                          const img = imageRef.current
                          const aspectRatio = img.naturalWidth / img.naturalHeight
                          setDimensions({
                            width: Math.round(dimensions.height * aspectRatio),
                            height: dimensions.height,
                          })
                        }
                      }}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Maintain Aspect Ratio
                    </Button>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Tip:</strong> Use the aspect ratio button to maintain image proportions while
                        resizing.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="align" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Image Alignment</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant={alignment === "left" ? "default" : "outline"}
                        onClick={() => setAlignment("left")}
                        className="flex items-center justify-center"
                      >
                        <AlignLeft className="h-4 w-4 mr-2" />
                        Left
                      </Button>
                      <Button
                        variant={alignment === "center" ? "default" : "outline"}
                        onClick={() => setAlignment("center")}
                        className="flex items-center justify-center"
                      >
                        <AlignCenter className="h-4 w-4 mr-2" />
                        Center
                      </Button>
                      <Button
                        variant={alignment === "right" ? "default" : "outline"}
                        onClick={() => setAlignment("right")}
                        className="flex items-center justify-center"
                      >
                        <AlignRight className="h-4 w-4 mr-2" />
                        Right
                      </Button>
                      <Button
                        variant={alignment === "none" ? "default" : "outline"}
                        onClick={() => setAlignment("none")}
                        className="flex items-center justify-center"
                      >
                        None
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Alignment Guide:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        <strong>Left:</strong> Image floats left, text wraps on the right
                      </li>
                      <li>
                        <strong>Right:</strong> Image floats right, text wraps on the left
                      </li>
                      <li>
                        <strong>Center:</strong> Image is centered, text above and below
                      </li>
                      <li>
                        <strong>None:</strong> Image follows normal document flow
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="crop" className="space-y-4">
                  {imageLoaded && !corsError && (
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✂️ <strong>Simple Cropping:</strong> Click the buttons below to remove parts of your image. The
                          green area shows what you'll keep!
                        </p>
                      </div>

                      {/* Simple Crop Buttons */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Quick Crop Options</label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            onClick={() => applyCropPreset("crop-top-20")}
                            className="flex items-center justify-center h-12"
                          >
                            <Scissors className="h-4 w-4 mr-2" />
                            Remove Top 20%
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => applyCropPreset("crop-bottom-20")}
                            className="flex items-center justify-center h-12"
                          >
                            <Scissors className="h-4 w-4 mr-2" />
                            Remove Bottom 20%
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => applyCropPreset("crop-left-20")}
                            className="flex items-center justify-center h-12"
                          >
                            <Scissors className="h-4 w-4 mr-2" />
                            Remove Left 20%
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => applyCropPreset("crop-right-20")}
                            className="flex items-center justify-center h-12"
                          >
                            <Scissors className="h-4 w-4 mr-2" />
                            Remove Right 20%
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => applyCropPreset("crop-center-80")}
                            className="flex items-center justify-center h-12"
                          >
                            <Crop className="h-4 w-4 mr-2" />
                            Keep Center 80%
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => applyCropPreset("crop-square")}
                            className="flex items-center justify-center h-12"
                          >
                            <Crop className="h-4 w-4 mr-2" />
                            Make Square
                          </Button>
                        </div>
                      </div>

                      {/* Manual Controls */}
                      <details className="border rounded-lg p-3">
                        <summary className="cursor-pointer font-medium text-sm">Advanced Manual Controls</summary>
                        <div className="mt-3 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs">X Position</label>
                              <Input
                                type="number"
                                value={Math.round(cropData.x)}
                                onChange={(e) =>
                                  setCropData((prev) => ({ ...prev, x: Number.parseInt(e.target.value) || 0 }))
                                }
                                min="0"
                                max={imageRef.current?.naturalWidth || 0}
                              />
                            </div>
                            <div>
                              <label className="text-xs">Y Position</label>
                              <Input
                                type="number"
                                value={Math.round(cropData.y)}
                                onChange={(e) =>
                                  setCropData((prev) => ({ ...prev, y: Number.parseInt(e.target.value) || 0 }))
                                }
                                min="0"
                                max={imageRef.current?.naturalHeight || 0}
                              />
                            </div>
                            <div>
                              <label className="text-xs">Width</label>
                              <Input
                                type="number"
                                value={Math.round(cropData.width)}
                                onChange={(e) =>
                                  setCropData((prev) => ({ ...prev, width: Number.parseInt(e.target.value) || 0 }))
                                }
                                min="10"
                                max={imageRef.current?.naturalWidth || 0}
                              />
                            </div>
                            <div>
                              <label className="text-xs">Height</label>
                              <Input
                                type="number"
                                value={Math.round(cropData.height)}
                                onChange={(e) =>
                                  setCropData((prev) => ({ ...prev, height: Number.parseInt(e.target.value) || 0 }))
                                }
                                min="10"
                                max={imageRef.current?.naturalHeight || 0}
                              />
                            </div>
                          </div>
                        </div>
                      </details>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <Crop className="h-4 w-4 inline mr-1" />
                          Original: {imageRef.current?.naturalWidth} × {imageRef.current?.naturalHeight} px | Will keep:{" "}
                          {Math.round(cropData.width)} × {Math.round(cropData.height)} px
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary text-white">
              <Check className="h-4 w-4 mr-2" />
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
