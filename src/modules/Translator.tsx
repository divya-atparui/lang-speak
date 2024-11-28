"use client";
import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  MdContentCopy,
  MdDelete,
  MdSwapHoriz,
  MdVolumeUp,
  MdError,
} from "react-icons/md";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BiSolidArrowFromBottom } from "react-icons/bi";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslatedResponse } from "@/api/queries/use-get-translated-response";
import { Loader2 } from "lucide-react";
import cn from "classnames";
import { useApiKey } from '@/context/ApiKeyContext';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
];

export default function Translator() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [sourceText, setSourceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { apiKey } = useApiKey();

  const {
    data: translatedResponse,
    isLoading,
    error,
    refetch
  } = useTranslatedResponse({
    text: sourceText,
    targetLanguage: targetLang,
    apiKey,
    enabled: !!apiKey && sourceText.trim().length > 0,
  });

  useEffect(() => {
    if (error) {
      console.error("Translation error:", error);
      // You can add a toast notification here if you want
    }
  }, [error]);

  useEffect(() => {
    if (sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        refetch();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [sourceText, targetLang, refetch]);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
    }
  }, [transcript]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const startListening = () => {
    setIsListening(true);
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: sourceLang,
    });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <ApiKeyInput />
        </div>
        <div className="bg-card dark:bg-card rounded-xl shadow-sm ring-1 ring-border p-8">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <MdError className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Speech Recognition Not Available
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
                Your browser doesn't support speech recognition. Try using a modern browser like Chrome, Edge, or Safari for the best experience.
              </p>
            </div>
            <div className="mt-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <BiSolidArrowFromBottom className="w-4 h-4 rotate-180" />
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <ApiKeyInput />
      </div>
      <div className="relative grid md:grid-cols-2 gap-4 md:gap-8">
        {/* Source Language */}
        <div className="relative bg-card dark:bg-card rounded-xl shadow-sm ring-1 ring-border p-4">
          <div className="flex items-center justify-between mb-4">
            <Select value={sourceLang} onValueChange={setSourceLang} disabled={!apiKey}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isListening && "text-destructive hover:text-destructive"
                )}
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? (
                  <FaMicrophoneSlash className="w-5 h-5" />
                ) : (
                  <FaMicrophone className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSourceText("");
                  resetTranscript();
                }}
                disabled={!sourceText}
              >
                <MdDelete className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[10rem] text-lg bg-background"
            placeholder={apiKey ? "Type or paste your text here..." : "Please add your OpenAI API key to use the translation feature"}
            disabled={!apiKey}
          />
          <div className="absolute bottom-6 right-6 flex items-center gap-3 text-sm text-muted-foreground">
            {isListening && (
              <span className="flex items-center gap-2 bg-destructive/10 text-destructive px-2.5 py-1 rounded-md">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Listening...
              </span>
            )}
            <span>{sourceText.length} characters</span>
          </div>
        </div>

        {/* Swap Languages Button */}
        <Button
          onClick={handleSwapLanguages}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 rounded-full transform transition-transform hover:scale-110 md:flex hidden"
          size="icon"
          variant="default"
          disabled={isLoading}
        >
          <MdSwapHoriz className="w-5 h-5" />
        </Button>

        {/* Mobile Swap Button */}
        <Button
          onClick={handleSwapLanguages}
          className="mx-auto md:hidden flex items-center gap-2"
          variant="default"
          disabled={isLoading}
        >
          <BiSolidArrowFromBottom className="w-5 h-5 rotate-90" />
          <span>Swap Languages</span>
        </Button>

        {/* Target Language */}
        <div className="relative bg-card dark:bg-card rounded-xl shadow-sm ring-1 ring-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select value={targetLang} onValueChange={setTargetLang} disabled={!apiKey || isLoading}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Translating...</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                disabled={isLoading || !translatedResponse?.translatedText}
              >
                <MdVolumeUp className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => handleCopyText(translatedResponse?.translatedText || "")}
                disabled={isLoading || !translatedResponse?.translatedText}
              >
                <MdContentCopy className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Textarea
              readOnly
              value={translatedResponse?.translatedText || ""}
              className={cn(
                "min-h-[10rem] text-lg bg-background transition-opacity duration-200",
                isLoading && "opacity-50"
              )}
              placeholder="Translation will appear here..."
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {!sourceText && (
                <div className="flex flex-col items-center text-muted-foreground">
                  <BiSolidArrowFromBottom className="w-16 h-16 mb-3" />
                  <span className="text-lg">Ready to translate</span>
                </div>
              )}
              {isLoading && sourceText && (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Translating...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
