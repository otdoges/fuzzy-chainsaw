"use client"

import { useEffect, useRef, useState } from "react"  // Add useRef to imports
import { Loader2 } from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
}

export default function CodeEditor({ value, onChange, language = "typescript", readOnly = false }: CodeEditorProps) {
  const [editor, setEditor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let monaco: any

    const loadMonaco = async () => {
      if (!editorRef.current) return  // Add this check
      setLoading(true)

      const { default: monacoEditor } = await import("monaco-editor")
      monaco = monacoEditor

      const editorInstance = monaco.editor.create(editorRef.current, {  // Use editorRef instead of getElementById
        value: value,
        language: language,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        readOnly: readOnly,
        fontSize: 14,
        fontFamily: "'Fira Code', monospace",
        lineNumbers: "on",
        roundedSelection: true,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: true,
          horizontalHasArrows: true,
          vertical: "visible",
          horizontal: "visible",
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12,
        },
      })

      if (!readOnly) {
        editorInstance.onDidChangeModelContent(() => {
          if (onChange) {
            onChange(editorInstance.getValue())
          }
        })
      }

      setEditor(editorInstance)
      setLoading(false)
    }

    loadMonaco()

    return () => {
      if (editor) {
        editor.dispose()
      }
    }
  }, [language])

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={editorRef} className="code-editor" />  {/* Add ref here */}
    </div>
  )
}

