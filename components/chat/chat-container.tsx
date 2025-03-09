"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ChatInput from "./chat-input"
import ChatMessage from "./chat-message"
import ChatHeader from "./chat-header"
import { Loader } from "../ui/loader"
import ImageUpload from "./image-upload"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  tps?: number // Add TPS property to messages
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Add refs for TPS calculation
  const tokenCountRef = useRef(0)
  const startTimeRef = useRef(0)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const addMessage = (role: "user" | "assistant", content: string, tps?: number) => {
    const id = Math.random().toString(36).substring(2, 11)
    setMessages((prev) => [...prev, { id, role, content, tps }])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() && images.length === 0) return

    // Add user message to chat
    addMessage("user", input)
    setIsLoading(true)

    try {
      // Reset token count and start time for TPS calculation
      tokenCountRef.current = 0
      startTimeRef.current = Date.now()
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
          images,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch response")
      }

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""

        // Process the stream
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim()
              if (data === "[DONE]") continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices[0]?.delta?.content || ""
                
                // Count tokens (roughly estimating 1 token per 4 characters)
                if (content) {
                  tokenCountRef.current += content.length / 4
                }
                
                assistantMessage += content

                // Calculate TPS
                const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000
                const tps = elapsedSeconds > 0 ? tokenCountRef.current / elapsedSeconds : 0
                
                // Update the assistant message in real-time with TPS
                if (!messages.some((m) => m.role === "assistant" && m.id === "current-response")) {
                  setMessages((prev) => [
                    ...prev,
                    { id: "current-response", role: "assistant", content: assistantMessage, tps: parseFloat(tps.toFixed(2)) },
                  ])
                } else {
                  setMessages((prev) =>
                    prev.map((m) => (m.id === "current-response" ? { ...m, content: assistantMessage, tps: parseFloat(tps.toFixed(2)) } : m)),
                  )
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }

        // Calculate final TPS
        const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000
        const finalTps = elapsedSeconds > 0 ? tokenCountRef.current / elapsedSeconds : 0

        // Finalize the assistant message with a permanent ID and TPS
        setMessages((prev) =>
          prev.map((m) =>
            m.id === "current-response" ? { 
              ...m, 
              id: Math.random().toString(36).substring(2, 11),
              tps: parseFloat(finalTps.toFixed(2))
            } : m,
          ),
        )
      }
    } catch (error) {
      console.error("Error:", error)
      addMessage("assistant", "Sorry, I encountered an error. Please try again.")
    } finally {
      setIsLoading(false)
      setInput("")
      setImages([])
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex h-full flex-col mx-auto w-full max-w-4xl px-4">
      <ChatHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 space-y-4 py-4 md:py-6 overflow-auto"
      >
        <div className="space-y-4 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center py-4"
            >
              <Loader />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      <ImageUpload onImageUpload={handleImageUpload} images={images} onRemoveImage={removeImage} />

      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        hasImages={images.length > 0}
      />
    </div>
  )
}

