import React from 'react';
import { motion } from 'framer-motion';
import ApiKeyForm from '../components/ApiKeyForm';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your API keys and application preferences.
        </p>
      </motion.div>

      <ApiKeyForm />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card mt-6"
      >
        <h2 className="text-lg font-medium mb-4">About API Keys</h2>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            To use the file conversion features of this application, you'll need an OpenAI API key.
            Your API key allows us to process your files using OpenAI's powerful Whisper and document processing APIs.
          </p>
          
          <p>
            Your API key is stored locally in your browser and is never sent to our servers.
            You can get an API key by signing up for an account at{' '}
            <a 
              href="https://platform.openai.com/signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              OpenAI
            </a>.
          </p>
          
          <p>
            <strong>Note:</strong> Using the OpenAI API will incur costs based on your usage.
            Check OpenAI's pricing page for current rates.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;