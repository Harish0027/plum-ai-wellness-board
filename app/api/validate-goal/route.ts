// app/api/validate-goal/route.ts (or pages/api/validate-goal.ts)
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();

    if (!goal || typeof goal !== "string") {
      return NextResponse.json({
        valid: false,
        reason: "Goal must be a non-empty string",
        icon: "Plus",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Treat the following text as a personal goal:
"${goal}"

If this is a realistic personal goal (like "lose weight", "learn guitar", "meditate"), return:
{
  "valid": true,
  "icon": "Dumbbell | Brain | Heart | Star | Sun | Moon | Zap | Plus"
}

If this is not a valid goal (like a name, random word, or something vague), return:
{
  "valid": false,
  "reason": "Explain why this is not a valid goal",
  "icon": "Plus"
}

Respond ONLY in JSON, NO markdown, NO backticks.
    `;

    const result = await model.generateContent(prompt);

    // Get raw text response
    const rawText = (await result.response.text()).replace(/```/g, "").trim();

    let output;
    try {
      output = JSON.parse(rawText);

      // Ensure icon is one of the allowed options
      const allowedIcons = [
        "Dumbbell",
        "Brain",
        "Heart",
        "Star",
        "Sun",
        "Moon",
        "Zap",
        "Plus",
      ];

      if (!allowedIcons.includes(output.icon)) {
        output.icon = "Plus";
      }

      // If AI did not provide reason for invalid goal, add default
      if (output.valid === false && !output.reason) {
        output.reason = "This is not a valid personal goal";
      }
    } catch (err) {
      console.error("JSON parse error:", err, rawText);
      // Fallback if AI response is invalid
      output = {
        valid: false,
        reason: "Could not parse AI response",
        icon: "Plus",
      };
    }

    return NextResponse.json(output);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { valid: false, reason: "Server error", icon: "Plus" },
      { status: 500 }
    );
  }
}
