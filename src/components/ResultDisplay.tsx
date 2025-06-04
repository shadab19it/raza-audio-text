import React, { useRef } from 'react';
import { Copy, Download, Trash2 } from 'lucide-react';
import { useConversion } from '../contexts/ConversionContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ResultDisplay: React.FC = () => {
  const { convertedText, clearCurrentConversion } = useConversion();
  const textRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async () => {
    if (!convertedText) return;
    
    try {
      await navigator.clipboard.writeText(convertedText);
      toast.success('Text copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error('Failed to copy text to clipboard.');
    }
  };

  const downloadAsText = () => {
    if (!convertedText) return;
    
    const blob = new Blob([convertedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-text-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Text file downloaded!');
  };

  if (!convertedText) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">Converted Text</h2>
        <div className="flex space-x-2">
          <button 
            onClick={copyToClipboard} 
            className="btn btn-outline flex items-center text-sm px-3 py-1.5"
            title="Copy to clipboard"
          >
            <Copy size={16} className="mr-2" />
            <span>Copy</span>
          </button>
          <button 
            onClick={downloadAsText} 
            className="btn btn-outline flex items-center text-sm px-3 py-1.5"
            title="Download as .txt file"
          >
            <Download size={16} className="mr-2" />
            <span>Download</span>
          </button>
          <button 
            onClick={clearCurrentConversion} 
            className="btn btn-outline flex items-center text-sm px-3 py-1.5"
            title="Clear result"
          >
            <Trash2 size={16} className="mr-2" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div 
        ref={textRef}
        className="card min-h-[200px] max-h-[500px] overflow-y-auto"
      >
        <pre className="whitespace-pre-wrap break-words font-sans text-gray-800 dark:text-gray-200">
          {convertedText}
        </pre>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;