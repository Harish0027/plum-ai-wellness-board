import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import redis from "@/lib/redis";

// Safe JSON parse utility
function safeParseJSON(str: string) {
  try {
    const match = str.match(/\{[\s\S]*\}/); // extract JSON object
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("Safe parse error:", err);
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { user, tip } = await req.json();

    if (!user || !tip) {
      return NextResponse.json(
        { error: "Missing user or tip" },
        { status: 400 }
      );
    }

    const cacheKey = `user:${JSON.stringify(user)}:tip:${JSON.stringify(tip)}`;

    // Check Redis cache
    const cached: any = await redis.get(cacheKey);
    if (cached) return NextResponse.json(JSON.parse(cached));

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Strict JSON prompt
    const prompt = `
      User info: ${JSON.stringify(user)}
      Tip info: ${JSON.stringify(tip)}

      Provide a detailed explanation and step-by-step advice for this tip.
      Respond STRICTLY in JSON ONLY with this format:
      {
        "title": "${tip.title.replace(/"/g, '\\"')}",
        "icon": "${tip.icon ? tip.icon.replace(/"/g, '\\"') : "🌟"}",
        "explanation": "Short explanation of the tip",
        "fullAdvice": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]
      }
    `;

    let output: any = {
      title: tip.title,
      icon: tip.icon || "🌟",
      explanation: "Failed to generate explanation",
      fullAdvice: ["Unable to generate steps"],
    };

    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text().replace(/```/g, "").trim();
      console.log("Raw AI response:", rawText);

      const parsed = safeParseJSON(rawText);
      if (parsed && Array.isArray(parsed.fullAdvice)) output = parsed;
    } catch (aiErr) {
      console.error("AI service failed:", aiErr);
    }

    // Cache result for 1 day
    await redis.set(cacheKey, JSON.stringify(output), { ex: 60 * 60 * 24 });

    return NextResponse.json(output);
  } catch (err) {
    console.error("Error in /api/aitips/[id]:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
