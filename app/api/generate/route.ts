import { GoogleGenerativeAI } from "@google/generative-ai";
import redis from "@/lib/redis"; // import your Redis client

export async function POST(req: Request) {
  try {
    const { age, gender, goal } = await req.json();

    if (!age || !gender || !goal) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userKey = `tips:${age}:${gender}:${goal}`;

    // Check Redis cache
    const cached: any = await redis.get(userKey);
    if (cached) {
      console.log("Returning cached tips");
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a professional health & wellness assistant.
Your task is to create a **personalized board of health tips** for the user.

User details:
- Age: ${age}
- Gender: ${gender}
- Goal: ${goal}

Rules:
1. Generate exactly 5 unique health tips.
2. Focus only on: Fitness, Nutrition, Sleep, Hydration, Stress, or Lifestyle.
3. Adapt advice to the user's age, gender, and goal (make it personal but concise).
4. Each tip must include:
   - A short 2–5 word title
   - One relevant emoji as the icon
   - A category (Nutrition | Fitness | Sleep | Stress | Hydration | Lifestyle)
   - A 1–2 sentence explanation (clear, professional, and easy to scan)
5. Output must be valid JSON in this exact format:

[
  {
    "id": 1,
    "title": "Short title",
    "icon": "emoji",
    "category": "Category",
    "explanation": "1–2 sentence explanation."
  },
  {
    "id": 2,
    "title": "Short title",
    "icon": "emoji",
    "category": "Category",
    "explanation": "1–2 sentence explanation."
  },
  {
    "id": 3,
    "title": "Short title",
    "icon": "emoji",
    "category": "Category",
    "explanation": "1–2 sentence explanation."
  },
  {
    "id": 4,
    "title": "Short title",
    "icon": "emoji",
    "category": "Category",
    "explanation": "1–2 sentence explanation."
  },
  {
    "id": 5,
    "title": "Short title",
    "icon": "emoji",
    "category": "Category",
    "explanation": "1–2 sentence explanation."
  }
]

Return ONLY valid JSON. No commentary, no markdown, no extra text.
`;
    // your same prompt

    const result = await model.generateContent(prompt);

    let output;
    try {
      output = JSON.parse(result.response.text());
    } catch (err) {
      console.error("JSON parsing error:", err);
      return new Response(
        JSON.stringify({ error: "Invalid JSON response from AI" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Cache for 10 minutes
    await redis.set(userKey, JSON.stringify(output), { ex: 60 * 10 });

    return new Response(JSON.stringify(output), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
