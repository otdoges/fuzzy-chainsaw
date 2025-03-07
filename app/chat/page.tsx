"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { models } from "@/lib/openrouter"
import { Loader2, Send } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [model, setModel] = useState("cognitivecomputations/dolphin3.0-mistral-24b:free")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""
        const messageId = "temp-" + Date.now().toString()

        // Add empty assistant message
        setMessages((prev) => [...prev, { id: messageId, role: "assistant", content: "" }])

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
                assistantMessage += content

                // Update the assistant message in real-time
                setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, content: assistantMessage } : m)))
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Chat</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="flex flex-col h-[calc(100vh-16rem)]">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Start a conversation by sending a message</div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="min-h-[60px]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

