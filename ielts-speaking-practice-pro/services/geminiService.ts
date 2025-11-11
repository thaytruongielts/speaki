import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getEvaluation = async (question: string, answer: string): Promise<EvaluationResult> => {
  const prompt = `
    IELTS Speaking Question: "${question}"

    Student's Answer: "${answer}"

    Based on the student's answer, please provide:
    1. An estimated IELTS band score (a single number between 1 and 9).
    2. A detailed justification for the score, considering Fluency and Coherence, Lexical Resource, and Grammatical Range and Accuracy. Note that pronunciation cannot be assessed from text.
    3. A band 7 model answer for the original question.

    Return your response in a JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            band: { 
              type: Type.NUMBER, 
              description: "The estimated IELTS band score as a single number from 1 to 9." 
            },
            justification: { 
              type: Type.STRING, 
              description: "A detailed justification for the score, covering key IELTS criteria." 
            },
            sampleAnswer: { 
              type: Type.STRING, 
              description: "A Band 7 model answer for the question." 
            },
          },
          required: ["band", "justification", "sampleAnswer"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result: EvaluationResult = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get evaluation from Gemini API.");
  }
};
