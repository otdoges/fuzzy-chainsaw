export const maxDuration = 60

export async function POST(req: Request) {
  const { model, messages } = await req.json()

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
        messages,
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
    console.error("Error in chat route:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

