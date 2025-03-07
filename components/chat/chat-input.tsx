"use client"

import type React from "react"

import { motion } from "framer-motion"
import { SendIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  hasImages?: boolean
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  hasImages = false,
}: ChatInputProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4"
    >
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="relative flex-1">
          {hasImages && (
            <div className="absolute left-3 top-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
              >
                <ImageIcon size={12} />
                <span>Images attached</span>
              </motion.div>
            </div>
          )}
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder={hasImages ? "Ask about the images or type a message..." : "Type your message..."}
            className={`min-h-[60px] resize-none ${hasImages ? "pl-32" : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (input.trim() || hasImages) {
                  handleSubmit(e as any)
                }
              }
            }}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || (!input.trim() && !hasImages)}
          className="h-[60px] w-[60px]"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <SendIcon className="h-5 w-5" />
          </motion.div>
        </Button>
      </form>
    </motion.div>
  )
}

