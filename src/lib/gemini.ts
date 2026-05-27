import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '' });

export async function getFoodRecommendations(mood: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a culinary expert. Based on the mood/craving: "${mood}", suggest 3 creative, high-end dishes. 
      Return only a JSON array of objects with fields: name, description, category, and a specific keyword for finding an image (e.g. "gourmet sushi", "fine dining steak").`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}
