/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import OpenAI from "openai";

export async function translateText(text: string, targetLanguage: string, apiKey: string) {
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the input directly to ${targetLanguage}. Respond only with the translated text without any explanations or additional content.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      stream: true,
    });

    return completion;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
