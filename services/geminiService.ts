import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { HookIdea, ToneType } from "../types";

const apiKey = process.env.API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateViralHooks = async (topic: string, tone: ToneType): Promise<HookIdea[]> => {
  if (!genAI) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  // Prompt instructions updated to request Spanish output
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
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            hooks: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  hook: { type: SchemaType.STRING },
                  category: { type: SchemaType.STRING },
                  explanation: { type: SchemaType.STRING }
                },
                required: ["hook", "category", "explanation"]
              }
            }
          }
        }
      }
    });

    const result = await model.generateContent(prompt);
    const jsonText = result.response.text();

    if (!jsonText) {
      throw new Error("No text returned from Gemini.");
    }

    const data = JSON.parse(jsonText);
    return data.hooks || [];

  } catch (error) {
    console.error("Error generating hooks:", error);
    throw error;
  }
};