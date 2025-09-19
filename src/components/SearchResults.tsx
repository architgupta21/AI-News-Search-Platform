import React from 'react';
import { NewsArticle } from '../types';
import ArticleCard from './ArticleCard';
import { Loader2, Search, Brain, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  articles: NewsArticle[];
  loading: boolean;
  query: string;
  onShare: (article: NewsArticle) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ articles, loading, query, onShare }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <Brain className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">AI is fetching latest news...</h3>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          Searching the internet for the most relevant and up-to-date news articles
        </p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your AI-Powered Search</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          Enter a search query above to discover the latest news articles from around the world
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-start space-x-2">
            <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-blue-800 font-medium">Live News Ready</p>
              <p className="text-xs text-blue-700 mt-1">
                Search for any topic to get real-time news articles from the internet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          No live news articles found for your search. Try adjusting your search query or check your internet connection.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-yellow-800 font-medium">Troubleshooting Tips</p>
              <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                <li>Check your internet connection</li>
                <li>Try different search terms</li>
                <li>Verify API keys are configured</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live News Results</h2>
          <p className="text-gray-600 mt-1">
            Found {articles.length} live articles for "{query}" • Sorted by AI relevance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live News</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Brain className="h-4 w-4 text-blue-600" />
            <span>AI-Enhanced Results</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onShare={onShare}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;