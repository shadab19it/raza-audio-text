import React from 'react';
import { NavLink } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <AlertCircle className="w-20 h-20 text-error-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl font-medium mb-6">Page Not Found</p>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <NavLink to="/" className="btn btn-primary flex items-center">
        <Home size={16} className="mr-2" />
        <span>Back to Home</span>
      </NavLink>
    </motion.div>
  );
};

export default NotFoundPage;