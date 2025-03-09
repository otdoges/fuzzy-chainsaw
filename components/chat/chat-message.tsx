"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    tps?: number
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg",
        isUser ? "bg-primary/10 ml-auto max-w-[80%]" : "bg-muted max-w-[80%]",
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className={isUser ? "bg-primary" : "bg-secondary"}>{isUser ? "U" : "AI"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="prose prose-sm dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
          {!isUser && message.tps !== undefined && (
            <div className="text-xs text-muted-foreground mt-2 flex items-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {message.tps} tokens/sec
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

