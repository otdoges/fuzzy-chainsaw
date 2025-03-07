import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Code, MessageSquare, FileCode, Braces } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">OpenRouter Coding Workspace</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Generation
            </CardTitle>
            <CardDescription>Generate code in various languages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Use AI to generate code snippets, functions, or entire components.</p>
            <Button asChild className="w-full">
              <Link href="/code-generation">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat Interface
            </CardTitle>
            <CardDescription>Chat with AI about coding problems</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Discuss programming concepts and get help with debugging.</p>
            <Button asChild className="w-full">
              <Link href="/chat">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Code Explanation
            </CardTitle>
            <CardDescription>Get explanations for complex code</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Paste code and get detailed explanations of how it works.</p>
            <Button asChild className="w-full">
              <Link href="/code-explanation">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Braces className="h-5 w-5" />
              Code Refactoring
            </CardTitle>
            <CardDescription>Improve and optimize your code</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get suggestions to refactor and improve your existing code.</p>
            <Button asChild className="w-full">
              <Link href="/code-refactoring">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

