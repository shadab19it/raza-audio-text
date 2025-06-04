import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApiKey } from '../contexts/ApiKeyContext';
import FileUploader from '../components/FileUploader';
import ResultDisplay from '../components/ResultDisplay';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { isApiKeyValid } = useApiKey();
  const navigate = useNavigate();

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">File to Text Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert audio files, PDFs, and document files to text using AI.
        </p>
      </motion.div>

      {!isApiKeyValid && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                API Key Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                <p>
                  You need to add your OpenAI API key before you can convert files.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/settings')}
                  className="btn btn-outline text-sm px-3 py-1.5 border border-yellow-600 dark:border-yellow-500 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                >
                  Go to Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="card"
      >
        <FileUploader />
      </motion.div>

      <ResultDisplay />
    </div>
  );
};

export default HomePage;