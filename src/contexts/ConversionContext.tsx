import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

interface FileConversion {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  convertedText: string;
  timestamp: string;
}

interface ConversionContextType {
  convertedText: string;
  setConvertedText: React.Dispatch<React.SetStateAction<string>>;
  isConverting: boolean;
  setIsConverting: React.Dispatch<React.SetStateAction<boolean>>;
  conversionProgress: number;
  setConversionProgress: React.Dispatch<React.SetStateAction<number>>;
  conversionHistory: FileConversion[];
  addToHistory: (conversion: Omit<FileConversion, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  clearCurrentConversion: () => void;
}

const ConversionContext = createContext<ConversionContextType | undefined>(undefined);

export const ConversionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [convertedText, setConvertedText] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [conversionHistory, setConversionHistory] = useState<FileConversion[]>(() => {
    const saved = localStorage.getItem('conversionHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (conversion: Omit<FileConversion, 'id' | 'timestamp'>) => {
    const newConversion: FileConversion = {
      ...conversion,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newConversion, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
    toast.success(`Added "${conversion.fileName}" to conversion history!`);
  };

  const clearHistory = () => {
    setConversionHistory([]);
    localStorage.removeItem('conversionHistory');
    toast.info('Conversion history cleared!');
  };

  const clearCurrentConversion = () => {
    setConvertedText('');
    setConversionProgress(0);
  };

  return (
    <ConversionContext.Provider
      value={{
        convertedText,
        setConvertedText,
        isConverting,
        setIsConverting,
        conversionProgress,
        setConversionProgress,
        conversionHistory,
        addToHistory,
        clearHistory,
        clearCurrentConversion
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
};

export const useConversion = (): ConversionContextType => {
  const context = useContext(ConversionContext);
  if (context === undefined) {
    throw new Error('useConversion must be used within a ConversionProvider');
  }
  return context;
};