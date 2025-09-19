import React from 'react';
import { Calendar, User, ExternalLink, Heart, Share, MessageCircle, TrendingUp, Brain } from 'lucide-react';
import { NewsArticle } from '../types';
import { format } from 'date-fns';

interface ArticleCardProps {
  article: NewsArticle;
  onShare?: (article: NewsArticle) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onShare }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const handleReadFull = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    
    // Category-specific fallback images
    const fallbackImages = {
      technology: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
      business: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800',
      health: 'https://images.pexels.com/photos/3825538/pexels-photo-3825538.jpeg?auto=compress&cs=tinysrgb&w=800',
      science: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=800',
      sports: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
      entertainment: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
      general: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    
    const fallbackImage = fallbackImages[article.category as keyof typeof fallbackImages] || fallbackImages.general;
    
    // Only set fallback if current src is not already a fallback
    if (!target.src.includes('pexels.com')) {
      target.src = fallbackImage;
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
              {getSentimentIcon(article.sentiment)} {article.sentiment}
            </div>
            <div className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>{Math.round(article.aiScore * 100)}%</span>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-1 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm truncate max-w-32">{article.source}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(article.publishedAt), 'MMM dd, HH:mm')}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <User className="h-4 w-4" />
            <span className="truncate max-w-32">{article.author}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>AI Match</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.keywords.slice(0, 3).map((keyword, index) => (
            <span
              key={`${article.id}-keyword-${index}`}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {keyword}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Save</span>
            </button>
            <button
              onClick={() => onShare?.(article)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            >
              <Share className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors duration-200">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">Slack</span>
            </button>
          </div>
          
          <button
            onClick={handleReadFull}
            disabled={!article.url || article.url === '#'}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm">Read Full</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;