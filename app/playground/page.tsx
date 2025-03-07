"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { models } from "@/lib/openrouter"
import { Loader2 } from "lucide-react"

export default function Playground() {
  const [prompt, setPrompt] = useState("")
  const [model1, setModel1] = useState("cognitivecomputations/dolphin3.0-mistral-24b")
  const [model2, setModel2] = useState("anthropic/claude-3-opus")
  const [response1, setResponse1] = useState("")
  const [response2, setResponse2] = useState("")
  const [isLoading1, setIsLoading1] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading1(true)
    setIsLoading2(true)
    setResponse1("")
    setResponse2("")

    // Generate response from model 1
    try {
      const response = await fetch("/api/playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model1,
          prompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let result = ""

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
                result += content
                setResponse1(result)
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating response:", error)
    } finally {
      setIsLoading1(false)
    }

    // Generate response from model 2
    try {
      const response = await fetch("/api/playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model2,
          prompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let result = ""

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
                result += content
                setResponse2(result)
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating response:", error)
    } finally {
      setIsLoading2(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">AI Playground</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="min-h-[150px]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model 1</label>
              <Select value={model1} onValueChange={setModel1}>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Model 2</label>
              <Select value={model2} onValueChange={setModel2}>
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

          <Button onClick={handleGenerate} disabled={isLoading1 || isLoading2 || !prompt.trim()} className="w-full">
            {isLoading1 || isLoading2 ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Compare Models"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{models.find((m) => m.id === model1)?.name || model1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] max-h-[600px] overflow-auto">
              {response1 ? (
                <pre className="whitespace-pre-wrap font-sans">{response1}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {isLoading1 ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating response...
                    </div>
                  ) : (
                    "Response will appear here"
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{models.find((m) => m.id === model2)?.name || model2}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] max-h-[600px] overflow-auto">
              {response2 ? (
                <pre className="whitespace-pre-wrap font-sans">{response2}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {isLoading2 ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating response...
                    </div>
                  ) : (
                    "Response will appear here"
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

