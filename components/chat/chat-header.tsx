"use client"

import { motion } from "framer-motion"
import { ThemeToggle } from "../theme/theme-toggle"

export default function ChatHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4"
    >
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AI</span>
            </span>
            <h1 className="text-xl font-bold">OpenRouter Chat</h1>
          </div>
        </motion.div>
      </div>
      <ThemeToggle />
    </motion.header>
  )
}

