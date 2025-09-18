import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GOOGLE_API_KEY as string;

if (!geminiApiKey) {
  throw new Error("Missing GOOGLE_API_KEY env var");
}

export const genAI = new GoogleGenerativeAI(geminiApiKey); 