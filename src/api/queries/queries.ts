"use server"

import { createOpenAIClient } from "../common/client";

export type TranslateVariables = {
    text: string;
    targetLanguage: string;
    apiKey: string;
};

export const translateText = async ({ text, targetLanguage, apiKey }: TranslateVariables) => {
    const openaiClient = createOpenAIClient(apiKey);
    const stream = await openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are a translator. Translate the input directly to ${targetLanguage}. Respond only with the translated text without any explanations or additional content.`,
            },
            {
                role: "user",
                content: `${text}`,
            },
        ],
        temperature: 0.3,
        stream: true,
    });
    return stream;
};