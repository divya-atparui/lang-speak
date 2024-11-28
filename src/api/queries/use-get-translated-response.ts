/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { translateText } from "@/app/actions";

type TranslateVariables = {
  text: string;
  targetLanguage: string;
  apiKey: string | null;
  enabled?: boolean;
};

export function useTranslatedResponse({
  text,
  targetLanguage,
  apiKey,
  enabled = true,
}: TranslateVariables) {
  return useQuery({
    queryKey: ["translate", text, targetLanguage],
    queryFn: async () => {
      if (!apiKey) {
        throw new Error("API key is required");
      }

      try {
        const stream = await translateText(text, targetLanguage, apiKey);
        let translatedText = "";

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          translatedText += content;
        }

        return { translatedText };
      } catch (error: any) {
        throw new Error(error.message || "Translation failed");
      }
    },
    enabled: enabled && !!text && !!targetLanguage && !!apiKey,
  });
}