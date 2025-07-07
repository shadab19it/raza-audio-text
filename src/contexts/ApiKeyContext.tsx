import React, { createContext, useState, useContext, useEffect } from "react";

type ApiKeyContextType = {
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeyValid: boolean;
  validateApiKey: (key: string) => boolean;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
    }
  }, [apiKey]);

  const validateApiKey = (key: string): boolean => {
    // Basic validation for OpenAI API key format (starts with "sk-" and has sufficient length)
    return key.startsWith("sk-") && key.length > 30;
  };

  const isApiKeyValid = validateApiKey(apiKey);

  return <ApiKeyContext.Provider value={{ apiKey, setApiKey, isApiKeyValid, validateApiKey }}>{children}</ApiKeyContext.Provider>;
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};
