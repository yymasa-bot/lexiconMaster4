import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LexiconData } from "../types";

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

const lexiconSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "The word being analyzed" },
    phonetics: {
      type: Type.OBJECT,
      properties: {
        ipa: { type: Type.STRING, description: "International Phonetic Alphabet transcription" },
        syllables: { type: Type.STRING, description: "Syllable breakdown (e.g., am-BIG-yu-us)" },
        tip: { type: Type.STRING, description: "Pronunciation tip in Chinese (sounds like/rhymes with)" },
      },
      required: ["ipa", "syllables", "tip"],
    },
    etymology: {
      type: Type.OBJECT,
      properties: {
        rootAnalysis: { type: Type.STRING, description: "Prefix + Root + Suffix breakdown" },
        backstory: { type: Type.STRING, description: "The engaging origin story in Chinese." },
      },
      required: ["rootAnalysis", "backstory"],
    },
    cognates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          connection: { type: Type.STRING, description: "Brief explanation of connection in Chinese" },
        },
        required: ["word", "connection"],
      },
    },
    nuance: {
      type: Type.OBJECT,
      properties: {
        synonyms: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              context: { type: Type.STRING, description: "Usage context in Chinese" },
            },
            required: ["word", "context"],
          },
        },
        antonym: { type: Type.STRING },
        examples: {
          type: Type.ARRAY,
          items: { type: Type.STRING, description: "Quotes from literature, speeches, movies" },
        },
      },
      required: ["synonyms", "antonym", "examples"],
    },
  },
  required: ["word", "phonetics", "etymology", "cognates", "nuance"],
};

export const fetchWordAnalysis = async (word: string): Promise<LexiconData> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Role: You are LexiconMaster, an engaging English tutor specializing in etymology and phonetics.
    Task: Analyze the English word: "${word}".
    
    Requirements:
    1. Tone: Enthusiastic, storytelling, yet academic.
    2. Language: Explanations MUST be in Chinese (Simplified). Examples and IPA must be in English.
    3. Phonetics: Provide standard IPA and a helpful tip.
    4. Etymology: Tell a mini-story about the word's journey from ancient roots to modern meaning.
    5. Examples: Provide exactly 5 distinct quotes from literature, famous speeches, or popular movies/TV shows.
    
    Return the result strictly as JSON matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lexiconSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as LexiconData;
    } else {
      throw new Error("No response text received from Gemini.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
