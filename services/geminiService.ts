import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  // In a real app, handle missing key gracefully. 
  // Here we assume it might be missing and return null to prevent crashes if not set.
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateItemDescription = async (itemName: string, category: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "請設定 API Key 以啟用 AI 描述生成功能。";
  }

  try {
    const prompt = `
      You are a copywriter for an Animal Crossing style item shop.
      Write a short, cute, and funny description (max 2 sentences) for an item.
      The item is "${itemName}" and category is "${category}".
      Tone: Playful, cozy, maybe referencing Bells or Nook Inc. slightly.
      Language: Traditional Chinese (Taiwan).
      Return ONLY the description text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "無法生成描述，請稍後再試。";
  }
};