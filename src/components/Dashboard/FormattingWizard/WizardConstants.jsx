import { Palette, FileText, Info, Settings, Baby, Book, BookOpen, GraduationCap, PenLine } from "lucide-react"

export const steps = [
  {
    id: "theme",
    name: "Theme",
    icon: Palette,
  },
  {
    id: "metadata",
    name: "Metadata",
    icon: FileText,
  },
  {
    id: "preview",
    name: "Preview",
    icon: Info,
  },
  {
    id: "export",
    name: "Export",
    icon: Settings,
  },
]

export const themes = {
  fiction: {
    fontFamily: "ui-serif, Georgia, serif",
    fontSize: "12pt",
    lineHeight: "1.6",
    margins: "2rem",
    firstLetterStyle: true,
  },
  "non-fiction": {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "11pt",
    lineHeight: "1.5",
    margins: "1.5rem",
    firstLetterStyle: false,
  },
  children: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "14pt",
    lineHeight: "1.8",
    margins: "2.5rem",
    firstLetterStyle: false,
  },
  textbooks: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "10pt",
    lineHeight: "1.4",
    margins: "1rem",
    firstLetterStyle: false,
  },
  memoir: {
    fontFamily: "ui-serif, Georgia, serif",
    fontSize: "12pt",
    lineHeight: "1.7",
    margins: "2rem",
    firstLetterStyle: true,
  },
}

export const themeOptions = [
  {
    value: "fiction",
    label: "Fiction",
    description: "Perfect for storytelling and creative writing",
    icon: BookOpen,
  },
  {
    value: "non-fiction",
    label: "Non-Fiction",
    description: "Based on facts, real events, and people",
    icon: Book,
  },
  {
    value: "children",
    label: "Children's",
    description: "Illustrated stories for kids and early readers",
    icon: Baby,
  },
  {
    value: "textbooks",
    label: "Textbooks",
    description: "Educational content for students and learning",
    icon: GraduationCap,
  },
  {
    value: "memoir",
    label: "Memoir",
    description: "Personal life experiences and reflections",
    icon: PenLine,
  },
]
