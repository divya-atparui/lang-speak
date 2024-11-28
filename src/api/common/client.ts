import axios from "axios";
import { OpenAI } from "openai";

// OpenAI client
export const createOpenAIClient = (apiKey: string) => {
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
};

// Axios client (if needed for other API calls)
export const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});