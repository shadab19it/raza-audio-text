import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileAudio, FileArchive, Trash2, Copy, Download } from 'lucide-react';
import { useConversion } from '../contexts/ConversionContext';
import { toast } from 'react-toastify';

interface HistoryItemProps {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
  convertedText: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  fileName,
  fileType,
  fileSize,
  timestamp,
  convertedText
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(convertedText);
      toast.success('Text copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text to clipboard.');
    }
  };

  const downloadText = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const blob = new Blob([convertedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    link.download = `${nameWithoutExtension}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Text file downloaded!');
  };

  const getFileIcon = () => {
    if (fileType.includes('audio')) {
      return <FileAudio className="w-6 h-6 text-primary-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-error-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileArchive className="w-6 h-6 text-secondary-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <motion.div
      layout
      className="card mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={toggleExpand}
    >
      <div className="flex items-start">
        <div className="mr-3">
          {getFileIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h3 className="font-medium truncate max-w-[200px] sm:max-w-xs">{fileName}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(timestamp)}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatSize(fileSize)}
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-end space-x-2 mb-2">
            <button 
              onClick={copyToClipboard} 
              className="btn btn-outline flex items-center text-xs px-2 py-1"
              title="Copy to clipboard"
            >
              <Copy size={14} className="mr-1" />
              <span>Copy</span>
            </button>
            <button 
              onClick={downloadText} 
              className="btn btn-outline flex items-center text-xs px-2 py-1"
              title="Download as .txt file"
            >
              <Download size={14} className="mr-1" />
              <span>Download</span>
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 max-h-60 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap break-words font-sans text-gray-800 dark:text-gray-200">
              {convertedText}
            </pre>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const HistoryPage: React.FC = () => {
  const { conversionHistory, clearHistory } = useConversion();

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold mb-2">Conversion History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your previously converted files.
          </p>
        </div>
        
        {conversionHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="btn btn-danger flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            <span>Clear History</span>
          </button>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {conversionHistory.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mb-3" />
            <h3 className="font-medium text-lg mb-2">No conversion history yet</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              When you convert files, they'll appear here so you can easily access them later.
            </p>
          </div>
        ) : (
          <div>
            {conversionHistory.map((item) => (
              <HistoryItem key={item.id} {...item} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HistoryPage;