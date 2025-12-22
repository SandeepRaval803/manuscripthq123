"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Palette, Download, RefreshCw, Eye, Sparkles, BookOpen, ImageIcon, Wand2, Info, X } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "@/context/userContext"
import { Switch } from "@/components/ui/switch"
import jsPDF from "jspdf"

export default function MainCoverDesign() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCover, setGeneratedCover] = useState(null)
  const [selectedCoverType, setSelectedCoverType] = useState("full-wrap-cover")
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [keywordInput, setKeywordInput] = useState("")
  const { user, token } = useAuth()
  
  // User input data state
  const [formData, setFormData] = useState({
    manuscriptId: user?.selectedManuscript._id,
    title: "",
    author: "",
    subtitle: "",
    blurb: "",
    genre: "",
    mood: "",
    keywords: "",
    artStyle: null,
    colorPalette: null,
  })

  // API Response data - stores full-wrap cover from API
  const [apiResponse, setApiResponse] = useState({
    "full-wrap-cover": null,
  })
  const hasAnyCover = Boolean(apiResponse["full-wrap-cover"]) 


  // Helper function to update user input data
  const updateUserInput = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Keyword management functions
  const addKeyword = (keyword) => {
    if (selectedKeywords.length >= 5) {
      toast.error("Maximum 5 keywords allowed")
      return
    }
    if (!selectedKeywords.includes(keyword)) {
      const newKeywords = [...selectedKeywords, keyword]
      setSelectedKeywords(newKeywords)
      updateUserInput('keywords', newKeywords.join(', '))
      setKeywordInput("")
    }
  }

  const removeKeyword = (keywordToRemove) => {
    const newKeywords = selectedKeywords.filter(keyword => keyword !== keywordToRemove)
    setSelectedKeywords(newKeywords)
    updateUserInput('keywords', newKeywords.join(', '))
  }

  // State for API suggestions
  const [apiSuggestions, setApiSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  // Fetch suggestions from Datamuse API (completely free)
  const fetchDatamuseSuggestions = async (query) => {
    try {
      const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=10`)
      const data = await response.json()
      return data.map(item => ({
        word: item.word,
        score: item.score || 0,
        source: 'datamuse'
      }))
    } catch (error) {
      console.error('Datamuse API error:', error)
      return []
    }
  }

  // Fetch synonyms from Datamuse API
  const fetchSynonyms = async (query) => {
    try {
      const response = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(query)}&max=8`)
      const data = await response.json()
      return data.map(item => ({
        word: item.word,
        score: item.score || 0,
        source: 'datamuse-synonyms'
      }))
    } catch (error) {
      console.error('Datamuse synonyms API error:', error)
      return []
    }
  }

  // Fetch related words from Datamuse API
  const fetchRelatedWords = async (query) => {
    try {
      const response = await fetch(`https://api.datamuse.com/words?rel_trg=${encodeURIComponent(query)}&max=6`)
      const data = await response.json()
      return data.map(item => ({
        word: item.word,
        score: item.score || 0,
        source: 'datamuse-related'
      }))
    } catch (error) {
      console.error('Datamuse related words API error:', error)
      return []
    }
  }

  // Combined API suggestions fetch
  const fetchApiSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) return []

    setIsLoadingSuggestions(true)
    try {
      const [meanings, synonyms, related] = await Promise.all([
        fetchDatamuseSuggestions(query),
        fetchSynonyms(query),
        fetchRelatedWords(query)
      ])

      // Combine and deduplicate suggestions
      const allSuggestions = [...meanings, ...synonyms, ...related]
      const uniqueSuggestions = allSuggestions.reduce((acc, current) => {
        const existing = acc.find(item => item.word === current.word)
        if (!existing) {
          acc.push(current)
        } else if (current.score > existing.score) {
          // Replace with higher scoring version
          acc[acc.indexOf(existing)] = current
        }
        return acc
      }, [])

      // Sort by score and limit results
      const sortedSuggestions = uniqueSuggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .filter(item => 
          !selectedKeywords.includes(item.word) &&
          item.word.length > 2 &&
          /^[a-zA-Z\s]+$/.test(item.word) // Only alphabetic words
        )

      setApiSuggestions(sortedSuggestions)
    } catch (error) {
      console.error('Error fetching API suggestions:', error)
      setApiSuggestions([])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // Get API suggestions only
  const getApiSuggestions = () => {
    return apiSuggestions.map(item => ({
      word: item.word,
      category: 'Suggestion',
      description: `Related to "${keywordInput}"`,
      source: item.source
    }))
  }

  // Debounced API call
  const debouncedFetchSuggestions = useCallback(
    debounce((query) => {
      if (query.trim().length >= 2) {
        fetchApiSuggestions(query)
      } else {
        setApiSuggestions([])
      }
    }, 300),
    []
  )

  // Effect to trigger API calls when input changes
  useEffect(() => {
    debouncedFetchSuggestions(keywordInput)
  }, [keywordInput, debouncedFetchSuggestions])

  // Debounce utility function
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const payload = {
        manuscriptId: formData.manuscriptId,
        title: formData.title,
        author: formData.author,
        subtitle: formData.subtitle,
        blurb: formData.blurb,
        genre: formData.genre,
        mood: formData.mood,
        keywords: formData.keywords,
        artStyle: formData.artStyle,
        colorPalette: formData.colorPalette,
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/geminiImage/generate-covers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "auth-token": token 
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.status === "success") {
        const responseData = data?.data || {}
        const fullWrap = responseData?.["full-wrap-cover"] || responseData?.fullWrapCover || responseData?.fullWrap || null

        const nextApiResponse = {
          "full-wrap-cover": fullWrap,
        }
        setApiResponse(nextApiResponse)

        setGeneratedCover(fullWrap)
        toast.success(data.message || "Full-wrap cover generated successfully")
      } else {
        toast.error(data.message || "Failed to generate covers")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getSelectedUrl = () => apiResponse?.[selectedCoverType] || null
  const getProxiedUrl = (rawUrl) => {
    if (!rawUrl) return null
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      return `${origin}/api/proxy-image?url=${encodeURIComponent(rawUrl)}`
    } catch {
      return rawUrl
    }
  }

  const handleDownloadPNG = async () => {
    const url = getSelectedUrl()
    if (!url) return
    try {
      const resp = await fetch(getProxiedUrl(url))
      const blob = await resp.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = `${selectedCoverType}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {}
  }

  const handleDownloadPDF = async () => {
    const url = getSelectedUrl()
    if (!url) return
    
    try {
      // Fetch the image as a blob to avoid CORS issues
      const response = await fetch(getProxiedUrl(url))
      const imageBlob = await response.blob()
      
      // Convert image blob to base64
      const reader = new FileReader()
      reader.onload = () => {
        const base64Image = reader.result
        
        // Create a new PDF document
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })
        
        // Get PDF page dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        
        // Create an image element to get dimensions
        const img = new Image()
        img.onload = () => {
          // Calculate dimensions to fit the image on the page while maintaining aspect ratio
          const imgAspectRatio = img.width / img.height
          const pdfAspectRatio = pdfWidth / pdfHeight
          
          let imgWidth, imgHeight, x, y
          
          if (imgAspectRatio > pdfAspectRatio) {
            // Image is wider than PDF page
            imgWidth = pdfWidth
            imgHeight = pdfWidth / imgAspectRatio
            x = 0
            y = (pdfHeight - imgHeight) / 2
          } else {
            // Image is taller than PDF page
            imgHeight = pdfHeight
            imgWidth = pdfHeight * imgAspectRatio
            x = (pdfWidth - imgWidth) / 2
            y = 0
          }
          
          // Add the image to the PDF
          pdf.addImage(base64Image, 'PNG', x, y, imgWidth, imgHeight)
          
          // Save the PDF
          pdf.save(`${selectedCoverType}.pdf`)
          
          toast.success('PDF downloaded successfully!')
        }
        
        img.src = base64Image
      }
      
      reader.readAsDataURL(imageBlob)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    }
  }

  // Print Ready removed per request

  return (
    <TooltipProvider>
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Cover Design Studio
          </h1>
          <p className="text-muted-foreground mt-1">Create professional book covers with AI-powered design tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Book Info
              </CardTitle>
              <CardDescription>Provide details about your book to generate the perfect cover</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter your book title" 
                  value={formData.title}
                  onChange={(e) => updateUserInput('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input 
                  id="author" 
                  placeholder="Your name" 
                  value={formData.author}
                  onChange={(e) => updateUserInput('author', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input 
                  id="subtitle" 
                  placeholder="Book subtitle" 
                  value={formData.subtitle}
                  onChange={(e) => updateUserInput('subtitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blurb">Book Description</Label>
                <Textarea 
                  id="blurb" 
                  placeholder="Brief description of your book's plot or theme" 
                  rows={3}
                  value={formData.blurb}
                  onChange={(e) => updateUserInput('blurb', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={formData.genre} onValueChange={(value) => updateUserInput('genre', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="scifi">Sci-Fi</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="literary">Literary Fiction</SelectItem>
                      <SelectItem value="nonfiction">Non-Fiction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={formData.mood} onValueChange={(value) => updateUserInput('mood', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="bright">Bright</SelectItem>
                      <SelectItem value="mysterious">Mysterious</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                      <SelectItem value="adventurous">Adventurous</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                <Label htmlFor="keywords">Imagery Keywords</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Add up to 5 keywords that describe the visual elements you want in your cover. 
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {/* Selected Keywords Display */}
                {selectedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedKeywords.map((keyword) => (
                      <Badge key={keyword} variant="" className="flex items-center gap-1 pr-1">
                        <span className="text-xs">{keyword}</span>
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Inline Search Input */}
                <div className="relative">
                <Input 
                  id="keywords" 
                    placeholder={selectedKeywords.length >= 5 ? "Maximum 5 keywords reached" : "Type to search keywords..."}
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    disabled={selectedKeywords.length >= 5}
                    className="pr-8"
                  />
                  
                  {/* Inline Suggestions */}
                  {keywordInput.trim() && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {isLoadingSuggestions ? (
                        <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Finding suggestions...
                          </div>
                        </div>
                      ) : getApiSuggestions().length > 0 ? (
                        getApiSuggestions().map((suggestion) => (
                          <button
                            key={suggestion.word}
                            onClick={() => addKeyword(suggestion.word)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between group"
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{suggestion.word}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {suggestion.category} • {suggestion.description}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              Add
                            </Badge>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                          No suggestions found. Try a different word.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {selectedKeywords.length >= 5 && (
                  <p className="text-xs text-muted-foreground">
                    You've reached the maximum of 5 keywords. Remove a keyword to add a new one.
                  </p>
                )}
                
                {selectedKeywords.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Start typing to see keyword suggestions. Choose up to 5 keywords that describe your cover's visual elements.
                  </p>
                )}
              </div>

              {/* Cover Specifications */}
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="cover-ratio">Cover Ratio</Label>
                  <Select 
                    value={formData.coverRatio} 
                    onValueChange={(value) => updateUserInput('coverRatio', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select cover ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.25:6.87">Pocket (4.25 x 6.87 in)</SelectItem>
                      <SelectItem value="5:8">Reedsy (5 x 8 in)</SelectItem>
                      <SelectItem value="5.5:8.5">Digest (5.5 x 8.5 in)</SelectItem>
                      <SelectItem value="6:9">Trade Paperback (6 x 9 in)</SelectItem>
                      <SelectItem value="8.5:11">Letter (8.5 x 11 in)</SelectItem>
                      <SelectItem value="8.27:11.69">A4 (8.27 x 11.69 in)</SelectItem>
                      <SelectItem value="custom">Custom Ratio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.coverRatio === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-width">Width (inches)</Label>
                      <Input 
                        id="custom-width" 
                        type="number" 
                        step="0.1" 
                        placeholder="6.0"
                        value={formData.customWidth || ""}
                        onChange={(e) => updateUserInput('customWidth', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-height">Height (inches)</Label>
                      <Input 
                        id="custom-height" 
                        type="number" 
                        step="0.1" 
                        placeholder="9.0"
                        value={formData.customHeight || ""}
                        onChange={(e) => updateUserInput('customHeight', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Style Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Style & Art Direction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Art Style (Select One)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Choose the visual style that best represents your book's genre and tone. 
                        Digital Painting offers rich, detailed artwork; Illustration provides clean, 
                        stylized graphics; Photography uses real images; Vector Art gives crisp, 
                        scalable designs; Minimalist focuses on simplicity; Detailed emphasizes 
                        intricate elements; Vintage creates a classic, aged appearance.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Digital Painting", "Illustration", "Photography", "Vector Art", "Minimalist", "Detailed", "Vintage"].map((style) => (
                    <Button 
                      key={style} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateUserInput('artStyle', style)}
                      className={`justify-start text-xs transition-all ${
                        formData.artStyle === style 
                          ? "bg-primary text-white border-primary" 
                          : "bg-transparent border-primary text-primary  hover:text-white"
                      }`}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Color Palette (Select One)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Select a color scheme that matches your book's mood and genre. 
                        Dark Gothic uses deep, mysterious tones; Pink Theme offers romantic, 
                        warm colors; Monochrome provides elegant black and white contrast; 
                        Classic uses traditional, professional colors; Minimal focuses on 
                        clean, neutral tones that emphasize simplicity and elegance.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Dark Gothic", "Pink Theme", "Monochrome", "Classic", "Minimal"].map((palette) => (
                    <Button 
                      key={palette} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateUserInput('colorPalette', palette)}
                      className={`text-xs transition-all ${
                        formData.colorPalette === palette 
                          ? "bg-primary text-white border-primary" 
                          : "border-primary text-primary  hover:text-white"
                      }`}
                    >
                      {palette}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary /90"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating Cover...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Cover
              </>
            )}
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Preview Cover</span>
                </div>
                {apiResponse[selectedCoverType] && (
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:text-white"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Regenerate
                  </Button>
                )}
              </div>
              <CardDescription>
                <div className="flex items-center justify-between">
                  <span>
                    {selectedCoverType === "full-wrap-cover" && "Your generated full-wrap cover will appear here"}
                  </span>
                  
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {generatedCover ? (
                <img
                  src={generatedCover}
                  alt="Generated full-wrap cover"
                  className="h-auto object-contain rounded-lg mx-auto max-w-3xl w-full"
                />
              ) : isGenerating ? (
                <div className="aspect-[3/4] max-h-[28rem] w-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex flex-col items-center justify-center text-center">
                    <RefreshCw className="h-8 w-8 text-primary mb-2 animate-spin" />
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Generating cover...</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] max-h-[28rem] w-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex flex-col items-center justify-center text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">Your cover will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Export Options */}
          {generatedCover && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Export & Download
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleDownloadPNG} disabled={!apiResponse[selectedCoverType]} variant="outline" className="border-primary text-primary  hover:text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button onClick={handleDownloadPDF} disabled={!apiResponse[selectedCoverType]} variant="outline" className="border-primary text-primary  hover:text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}
