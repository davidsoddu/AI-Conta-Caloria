import { GoogleGenAI, Type } from "@google/genai";
import { type AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    dishName: { type: Type.STRING, description: "Un nome descrittivo per il piatto." },
    ingredients: {
      type: Type.ARRAY,
      description: "Un elenco di tutti gli ingredienti identificati nel piatto.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome dell'ingrediente." },
          estimatedWeight: { type: Type.STRING, description: "Peso stimato in grammi (es. '150g')." },
          calories: { type: Type.NUMBER, description: "Calorie (kcal) per la porzione di questo ingrediente." },
          protein: { type: Type.NUMBER, description: "Grammi di proteine." },
          carbohydrates: {
            type: Type.OBJECT,
            properties: {
              total: { type: Type.NUMBER, description: "Grammi totali di carboidrati." },
              sugars: { type: Type.NUMBER, description: "Grammi di zuccheri." },
            },
            required: ["total", "sugars"],
          },
          fat: {
            type: Type.OBJECT,
            properties: {
              total: { type: Type.NUMBER, description: "Grammi totali di grassi." },
              saturated: { type: Type.NUMBER, description: "Grammi di grassi saturi." },
            },
            required: ["total", "saturated"],
          },
          fiber: { type: Type.NUMBER, description: "Grammi di fibre." },
          sodium: { type: Type.NUMBER, description: "Milligrammi di sodio." },
          glycemicIndex: { type: Type.NUMBER, description: "L'indice glicemico (IG) dell'alimento. Un valore di 0 indica che non è applicabile." },
          glycemicLoad: { type: Type.NUMBER, description: "Il carico glicemico (CG) per la porzione." },
        },
        required: ["name", "estimatedWeight", "calories", "protein", "carbohydrates", "fat", "fiber", "sodium", "glycemicIndex", "glycemicLoad"],
      },
    },
    totals: {
      type: Type.OBJECT,
      description: "La somma di tutti i valori nutrizionali per l'intero piatto.",
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbohydrates: {
          type: Type.OBJECT,
          properties: { total: { type: Type.NUMBER }, sugars: { type: Type.NUMBER } },
          required: ["total", "sugars"],
        },
        fat: {
          type: Type.OBJECT,
          properties: { total: { type: Type.NUMBER }, saturated: { type: Type.NUMBER } },
          required: ["total", "saturated"],
        },
        fiber: { type: Type.NUMBER },
        sodium: { type: Type.NUMBER },
        totalGlycemicLoad: { type: Type.NUMBER, description: "Il carico glicemico totale per l'intero pasto." },
      },
      required: ["calories", "protein", "carbohydrates", "fat", "fiber", "sodium", "totalGlycemicLoad"],
    },
    expertComments: {
      type: Type.STRING,
      description: "Commenti brevi e approfonditi dal punto di vista di un nutrizionista esperto sulla salubrità, l'equilibrio e i potenziali miglioramenti del pasto."
    },
  },
  required: ["dishName", "ingredients", "totals", "expertComments"],
};

export async function analyzeMeal(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const prompt = `Agisci come un nutrizionista esperto. Analizza l'immagine del pasto fornita. Identifica ogni ingrediente e stima il suo peso in grammi. Per ogni ingrediente, fornisci un'analisi nutrizionale dettagliata (Calorie (kcal), Proteine (g), Carboidrati (g), di cui Zuccheri (g), Grassi (g), di cui Saturi (g), Fibre (g), Sodio (mg)). Per ogni ingrediente, includi anche il suo Indice Glicemico (IG) e calcola il Carico Glicemico (CG) per la porzione stimata. Se l'IG non è applicabile per un ingrediente (es. carne, olio), imposta il valore a 0. Quindi, calcola e fornisci i valori nutrizionali totali per l'intero piatto, incluso il Carico Glicemico Totale (la somma dei valori di CG di ogni ingrediente). Infine, fornisci brevi commenti da esperto sulla salubrità del pasto. Rispondi SOLO con l'oggetto JSON corrispondente allo schema fornito.`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing meal:", error);
    throw new Error("Analisi del pasto fallita. Il modello AI potrebbe non essere in grado di elaborare questa immagine. Prova con un'immagine più nitida.");
  }
}