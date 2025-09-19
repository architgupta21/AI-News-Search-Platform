import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import IntegrationPanel from './components/IntegrationPanel';
import { useNewsSearch } from './hooks/useNewsSearch';
import { SearchFilters, NewsArticle } from './types';
import { MessageCircle, Zap, TrendingUp, Users, Globe } from 'lucide-react';

function App() {
  const { articles, loading, error, searchArticles } = useNewsSearch();
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = (filters: SearchFilters) => {
    setCurrentQuery(filters.query);
    searchArticles(filters);
  };

  const handleShare = (article: NewsArticle) => {
    // In a real app, this would integrate with Slack API
    console.log('Sharing article to Slack:', article.title);
    alert(`Article "${article.title}" would be shared to Slack channel #news-ai`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI-Powered News Discovery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Leverage IBM Watson's natural language understanding to find, analyze, and share the most relevant news articles with intelligent sentiment analysis and semantic search capabilities.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-3 bg-blue-100 rounded-lg mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600 text-center">Semantic search with context understanding</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-3 bg-green-100 rounded-lg mb-3">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live News</h3>
              <p className="text-sm text-gray-600 text-center">Real-time articles from the internet</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-3 bg-purple-100 rounded-lg mb-3">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Slack Integration</h3>
              <p className="text-sm text-gray-600 text-center">Share findings with your team instantly</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-3 bg-orange-100 rounded-lg mb-3">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Collaborative</h3>
              <p className="text-sm text-gray-600 text-center">Team-based news discovery and sharing</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Search Section */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Results Section */}
        <SearchResults
          articles={articles}
          loading={loading}
          query={currentQuery}
          onShare={handleShare}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-4">AI News Search Platform</h3>
              <p className="text-gray-400 mb-4">
                Advanced news discovery powered by IBM Watson AI and integrated with Slack for seamless team collaboration.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live News Active</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Slack Bot Ready</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Live News Fetching</li>
                <li>Semantic Search</li>
                <li>Sentiment Analysis</li>
                <li>AI Relevance Scoring</li>
                <li>Auto-Categorization</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Integrations</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>NewsAPI.org</li>
                <li>GNews.io</li>
                <li>IBM Watson NLU</li>
                <li>Slack Workspace</li>
                <li>Team Collaboration</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>AI-Powered News Discovery Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;