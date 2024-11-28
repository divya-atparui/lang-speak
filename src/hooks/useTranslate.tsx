import { useEffect, useState, useCallback } from "react";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface TranslationError {
    message: string;
    code?: string;
}

interface TranslationResult {
    text: string;
    setText: (text: string) => void;
    translatedText: string | null;
    setTranslatedText: (text: string | null) => void;
    isLoading: boolean;
    error: TranslationError | null;
    retry: () => void;
    isStreaming: boolean;
}

export const useTranslate = (
    sourceText: string, 
    selectedLanguage: string
): TranslationResult => {
    const [text, setText] = useState<string>("");
    const [translatedText, setTranslatedText] = useState<string | null>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [error, setError] = useState<TranslationError | null>(null);

    const handleTranslate = useCallback(async (textToTranslate: string) => {
        if (!textToTranslate.trim()) {
            setTranslatedText(null);
            return;
        }

        setIsLoading(true);
        setIsStreaming(true);
        setError(null);
        setTranslatedText("");

        try {
            const stream = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional translator. Provide accurate and natural-sounding translations.",
                    },
                    {
                        role: "user",
                        content: `Translate the following text to ${selectedLanguage}. Maintain the original tone and context: "${textToTranslate}"`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
                stream: true,
            });

            let fullTranslation = "";
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                fullTranslation += content;
                setTranslatedText(fullTranslation);
            }

            setIsStreaming(false);
        } catch (err) {
            const error = err as Error;
            setError({
                message: error.message || "Translation failed",
                code: "TRANSLATION_ERROR"
            });
            setTranslatedText(null);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    }, [selectedLanguage]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (sourceText.trim()) {
            timeoutId = setTimeout(() => {
                handleTranslate(sourceText);
            }, 1000);
        } else {
            setTranslatedText(null);
            setError(null);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [sourceText, handleTranslate]);

    const retry = useCallback(() => {
        if (sourceText.trim()) {
            handleTranslate(sourceText);
        }
    }, [sourceText, handleTranslate]);

    return {
        text,
        setText,
        translatedText,
        setTranslatedText,
        isLoading,
        error,
        retry,
        isStreaming
    };
};
