import { generateText } from 'ai'
import { xai } from '@ai-sdk/xai'

export async function generatePsDiaryAnalysis(slug: string, claims: any[], score: number) {
  const prompt = `You are an expert reputation analyst for PsDiary, a public reputation ledger.

Analyze the following claims made about "${slug}".

Current PsDiary Score: ${score}

Claims:
${claims.map((c, i) => `${i + 1}. [${c.category.toUpperCase()}] ${c.text} (Posted by ${c.poster_user_id ? 'verified' : 'guest'})`).join('\n')}

Provide a structured response with:
1. Overall probability (0-100) that the public record is currently accurate and fair.
2. Key supporting / defended points (max 3)
3. Key concerning / unrebutted points (max 3)
4. A short 2-3 sentence narrative analysis, explicitly calling out any signs of coordinated low-weight attacks.

Return ONLY valid JSON in this exact format:
{
  "probability": number,
  "pro": string[],
  "con": string[],
  "narrative": string
}`

  try {
    const { text } = await generateText({
      model: xai('grok-2-latest'),
      prompt,
      temperature: 0.3,
    })

    // Clean and parse
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (error) {
    console.error("Grok analysis failed:", error)
    return {
      probability: Math.max(40, Math.min(85, score)),
      pro: ["Community participation present"],
      con: ["Limited verified data"],
      narrative: "Unable to generate full Grok analysis at this time. Using statistical score only."
    }
  }
}
