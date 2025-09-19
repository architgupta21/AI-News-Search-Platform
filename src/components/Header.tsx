import React from 'react';
import { Search, Bot, Cloud, Slack } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI News Search</h1>
              <p className="text-sm text-gray-500">Intelligent News Discovery</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Cloud className="h-4 w-4 text-blue-600" />
              <span>IBM Watson</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Slack className="h-4 w-4 text-purple-600" />
              <span>Slack Bot</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;