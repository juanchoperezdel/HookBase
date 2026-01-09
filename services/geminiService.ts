
import { GoogleGenAI, Type } from "@google/genai";
import { HookIdea, ToneType } from "../types";

export const generateViralHooks = async (topic: string, tone: ToneType): Promise<HookIdea[]> => {
  // Always create a new instance with the latest key as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-3-pro-preview for high-quality marketing reasoning
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    Actúa como un estratega de contenido viral de clase mundial para plataformas como TikTok, Instagram Reels y YouTube Shorts.
    Genera 6 ideas de "hooks" (ganchos) distintas, altamente atractivas y diseñadas para detener el scroll, para un video sobre "${topic}".
    El tono debe ser: ${tone}.
    
    IMPORTANTE: Toda la respuesta debe estar en ESPAÑOL.

    Para cada hook:
    1. Escribe el texto exacto que se dirá o mostrará en pantalla (en español).
    2. Asigna una categoría psicológica específica (ej. "Miedo a perderse algo", "Valor instantáneo", "Interrupción de patrón").
    3. Explica brevemente por qué funciona (en español).

    Hazlos impactantes, cortos (menos de 15 palabras si es posible) y diseñados para alta retención.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  category: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["hook", "category", "explanation"]
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No se recibió respuesta del modelo.");
    }

    const data = JSON.parse(jsonText);
    return data.hooks || [];

  } catch (error) {
    console.error("Error generating hooks:", error);
    throw error;
  }
};
