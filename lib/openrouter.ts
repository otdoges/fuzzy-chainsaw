export const models = [
  {
    id: "cognitivecomputations/dolphin3.0-mistral-24b:free",
    name: "Dolphin 3.0 Mistral 24B",
    description: "A powerful model for code generation and reasoning",
  },
  {
    id: "google/gemini-2.0-flash-lite-preview-02-05:free",
    name: "Gemini 2.0 Flash Lite",
    description: "Google's fast and efficient model",
  },
]

export async function generateCompletion(model: string, messages: { role: string; content: string }[], stream = true) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // Default fallback
        "X-Title": "OpenRouter Coding Workspace",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch from OpenRouter API")
    }

    return response
  } catch (error) {
    console.error("Error calling OpenRouter API:", error)
    throw error
  }
}

