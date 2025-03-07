"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { models } from "@/lib/openrouter"
import { Loader2 } from "lucide-react"
import CodeEditor from "@/components/code-editor"

export default function CodeExplanation() {
  const [code, setCode] = useState("")
  const [model, setModel] = useState("cognitivecomputations/dolphin3.0-mistral-24b:free")
  const [language, setLanguage] = useState("typescript")
  const [explanation, setExplanation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleExplain = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    setExplanation("")

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          code,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to explain code")
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
                setExplanation(result)
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error explaining code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Code Explanation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Code Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="editor-container">
              <CodeEditor value={code} onChange={setCode} language={language} />
            </div>

            <Button onClick={handleExplain} disabled={isLoading || !code.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Explaining...
                </>
              ) : (
                "Explain Code"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-full overflow-auto">
              {explanation ? (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{explanation}</pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating explanation...
                    </div>
                  ) : (
                    "Explanation will appear here"
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

