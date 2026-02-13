import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_RESTAURANTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });


export const getSmartRecommendation = async (prompt: string) => {
  // Flatten all menu items for the AI to choose from
  const allDishes = MOCK_RESTAURANTS.flatMap(res =>
    res.menu.map(item => ({
      id: item.id,
      name: item.name,
      restaurant: res.name,
      description: item.description,
      price: item.price
    }))
  );

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this user craving: "${prompt}", pick the best matching dish from this menu: ${JSON.stringify(allDishes)}. Explain why.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishId: { type: Type.STRING, description: 'The ID of the chosen dish' },
          reason: { type: Type.STRING, description: 'Short catchy reason why this dish was picked' }
        },
        required: ['dishId', 'reason']
      }
    }
  });

  try {
    // ✅ SAFETY CHECK ADDED
    if (!response.text) {
      console.error("Gemini response text is undefined");
      return null;
    }

    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};
