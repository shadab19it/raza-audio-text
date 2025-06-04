import React, { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { useApiKey } from "../contexts/ApiKeyContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ApiKeyForm: React.FC = () => {
  const { apiKey, setApiKey, validateApiKey } = useApiKey();
  const [showApiKey, setShowApiKey] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);
  const [validationError, setValidationError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(e.target.value);
    setValidationError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputKey.trim()) {
      setValidationError("API key is required");
      return;
    }

    if (!validateApiKey(inputKey)) {
      setValidationError('Invalid API key format. It should start with "sk-" and be at least 30 characters long.');
      return;
    }

    setApiKey(inputKey);
    toast.success("API key saved successfully!");
  };

  console.log("Current API Key:", apiKey, inputKey); // Debugging line

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className='card'>
      <div className='flex items-center mb-4'>
        <Key className='w-5 h-5 text-primary-500 mr-2' />
        <h2 className='text-lg font-medium'>OpenAI API Key</h2>
      </div>

      <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
        Enter your OpenAI API key to use the conversion features. Your key will be stored securely in your browser's local storage.
      </p>

      <form onSubmit={handleSubmit}>
        <div className='input-group'>
          <label htmlFor='apiKey' className='input-label'>
            API Key
          </label>
          <div className='relative'>
            <input
              id='apiKey'
              type={showApiKey ? "text" : "password"}
              className='input pr-10'
              value={inputKey}
              onChange={handleInputChange}
              placeholder='sk-...'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => setShowApiKey(!showApiKey)}
              tabIndex={-1}>
              {showApiKey ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
            </button>
          </div>
          {validationError && <p className='mt-1 text-sm text-error-500'>{validationError}</p>}
        </div>

        <button type='submit' className='btn btn-primary'>
          Save API Key
        </button>
      </form>
    </motion.div>
  );
};

export default ApiKeyForm;
