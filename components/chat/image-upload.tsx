"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  images: string[]
  onRemoveImage: (index: number) => void
}

export default function ImageUpload({ onImageUpload, images, onRemoveImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mb-4">
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Uploaded image ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" id="image-upload" accept="image/*" onChange={handleFileInput} className="hidden" />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag and drop an image, or click to select</p>
          </div>
        </label>
      </div>
    </div>
  )
}

