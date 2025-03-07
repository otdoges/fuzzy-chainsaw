import { generateCompletion } from "@/lib/openrouter"

export const maxDuration = 60

export async function POST(req: Request) {
  const { model, prompt } = await req.json()

  try {
    const response = await generateCompletion(model, [{ role: "user", content: prompt }], true)

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in playground route:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

