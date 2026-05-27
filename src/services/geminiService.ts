import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || ''
});

export interface FoodInspiration {
  title: string;
  description: string;
  category: string;
  imageKeyword: string;
}

export async function exploreFood(query: string, count: number = 4): Promise<FoodInspiration[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} highly creative and appetizing plant-based meat dish ideas related to the search query: "${query}". 
      Each dish should sound like it belongs on an "Impossible Foods" menu.
      Return the results as a JSON array of objects with keys: title, description, category, imageKeyword (a short, descriptive 2-word keyword for a food photo).
      Return ONLY the JSON array.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini exploration failed:", error);
    return [];
  }
}

export async function getProductInsights(productName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a punchy, bold, 1-sentence marketing pitch for "${productName}" meat from plants. High impact, lowercase style preferred if it fits the vibe.`,
    });
    return response.text || "Unbelievably delicious.";
  } catch (error) {
    return "The future of meat, made from plants.";
  }
}
