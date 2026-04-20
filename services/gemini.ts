import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are the Tunghai International Student Assistant. 
You help students with "How to" questions regarding university life, mailroom procedures, ARC renewals, and scholarships.
Keep responses concise, helpful, and friendly. 
Translate terms if necessary (Mandarin/English).
If you don't know the answer, suggest contacting the OIR (Office of International Relations).
Focus on:
- Mailroom: Located at OIR. Need Student ID for pickup.
- ARC: Renew 30 days before expiry.
- Scholarships: Usually open in April for Autumn and October for Spring.`;

export async function chatWithAI(
  messages: { role: "user" | "assistant"; content: string }[],
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The AI assistant is currently unavailable. Please try again later or contact OIR directly.";
  }
}
