"use client"

import { createContext, useContext, useEffect, useState } from 'react';

type ApiKeyContextType = {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for saved API key
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKeyState(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKeyState(null);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
