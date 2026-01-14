
import { GoogleGenAI, Type } from "@google/genai";
import { Suggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSuggestionInsights = async (suggestions: Suggestion[]) => {
  if (!process.env.API_KEY) return "AI Insights unavailable: API Key not configured.";
  
  const prompt = `Analyze the following suggestion logs and provide a 3-point summary of key trends, most frequent issues, and a recommendation for process improvement.
  
  Logs: ${JSON.stringify(suggestions.map(s => ({
    desc: s.suggestion_description,
    benefit: s.benefit,
    area: s.area_to_work_on,
    status: s.current_status
  })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an operations efficiency expert. Provide concise, actionable insights based on internal employee suggestions."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI insights at this time.";
  }
};

export const polishSuggestion = async (description: string) => {
  if (!process.env.API_KEY) return description;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve the clarity and professionalism of this process enhancement suggestion: "${description}"`,
      config: {
        systemInstruction: "Rewrite the suggestion to be formal, clear, and focused on operational benefits."
      }
    });
    return response.text || description;
  } catch (error) {
    return description;
  }
};
