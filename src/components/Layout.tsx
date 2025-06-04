import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FileText, Settings, History, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { isApiKeyValid } = useApiKey();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <span className="font-bold text-xl">FileToText</span>
            </NavLink>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-grow">
        <nav className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:w-64 md:sticky md:top-0 md:h-screen">
          <div className="p-4 space-y-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <FileText size={20} />
              <span>Converter</span>
            </NavLink>

            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Settings size={20} />
              <span>Settings</span>
              {!isApiKeyValid && (
                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-error-500"></span>
              )}
            </NavLink>

            <NavLink 
              to="/history" 
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <History size={20} />
              <span>History</span>
            </NavLink>
          </div>
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;