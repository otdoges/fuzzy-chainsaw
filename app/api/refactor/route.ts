export const maxDuration = 60

export async function POST(req: Request) {
  const { model, code, language } = await req.json()

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "OpenRouter Coding Workspace",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: `Refactor this ${language} code to improve readability, performance, and follow best practices. Only respond with the refactored code, no explanations:\n\n\`\`\`${language}\n${code}\n\`\`\``,
          },
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify({ error: error.message || "Failed to fetch from OpenRouter API" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in refactor route:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

