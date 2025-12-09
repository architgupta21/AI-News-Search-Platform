import axios from 'axios';
import { NewsArticle } from '../types';

// NewsAPI configuration - using environment variables
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// Alternative free news APIs for fallback
const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4';
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

// Debug logging
console.log('API Keys loaded:', {
  newsApi: NEWS_API_KEY ? `${NEWS_API_KEY.substring(0, 8)}...` : 'Not found',
  gnews: GNEWS_API_KEY ? `${GNEWS_API_KEY.substring(0, 8)}...` : 'Not found',
  newsApiLength: NEWS_API_KEY?.length,
  gnewsApiLength: GNEWS_API_KEY?.length
});

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: any[];
  code?: string;
  message?: string;
}

interface GNewsAPIResponse {
  totalArticles: number;
  articles: any[];
}

// Fallback images for different categories
const getFallbackImage = (category: string): string => {
  const fallbackImages = {
    technology: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
    business: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800',
    health: 'https://images.pexels.com/photos/3825538/pexels-photo-3825538.jpeg?auto=compress&cs=tinysrgb&w=800',
    science: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=800',
    sports: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    entertainment: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    general: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800'
  };
  
  return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.general;
};

// Validate image URL
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check if it has image extension or is from known image domains
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const imageDomains = ['images.', 'img.', 'cdn.', 'static.', 'media.'];
  
  const lowerUrl = url.toLowerCase();
  const hasImageExtension = imageExtensions.some(ext => lowerUrl.includes(ext));
  const hasImageDomain = imageDomains.some(domain => lowerUrl.includes(domain));
  
  return hasImageExtension || hasImageDomain;
};

// Sentiment analysis simulation (in real app, this would use IBM Watson)
const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['breakthrough', 'success', 'achievement', 'growth', 'positive', 'win', 'advance', 'improve', 'victory', 'progress', 'innovation', 'solution', 'boost', 'rise', 'gain'];
  const negativeWords = ['crisis', 'problem', 'decline', 'loss', 'negative', 'fail', 'concern', 'threat', 'danger', 'risk', 'conflict', 'disaster', 'crash', 'fall', 'drop'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Extract keywords from text (simplified version)
const extractKeywords = (text: string): string[] => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those'];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  // Get unique words and return top 5
  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, 5);
};

// Calculate AI relevance score based on various factors
const calculateAIScore = (article: any, query: string): number => {
  let score = 0.5; // Base score
  
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const queryLower = query.toLowerCase();
  
  // Title relevance (40% weight)
  if (title.includes(queryLower)) score += 0.4;
  else if (queryLower.split(' ').some(word => title.includes(word))) score += 0.2;
  
  // Description relevance (30% weight)
  if (description.includes(queryLower)) score += 0.3;
  else if (queryLower.split(' ').some(word => description.includes(word))) score += 0.15;
  
  // Recency bonus (20% weight)
  const publishedDate = new Date(article.publishedAt);
  const now = new Date();
  const daysDiff = (now.getTime() - publishedDate.getTime()) / (1000 * 3600 * 24);
  
  if (daysDiff < 1) score += 0.2;
  else if (daysDiff < 7) score += 0.15;
  else if (daysDiff < 30) score += 0.1;
  
  // Source credibility (10% weight)
  const credibleSources = ['reuters', 'bbc', 'cnn', 'associated press', 'npr', 'guardian', 'washington post', 'new york times'];
  if (credibleSources.some(source => article.source?.name?.toLowerCase().includes(source))) {
    score += 0.1;
  }
  
  return Math.min(score, 1); // Cap at 1.0
};

// Create unique ID from article content
const createUniqueId = (article: any): string => {
  // Use URL as primary identifier, fallback to title + source
  if (article.url) {
    return btoa(article.url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }
  
  const titleSource = (article.title || '') + (article.source?.name || '');
  return btoa(titleSource).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

// Transform API response to our NewsArticle format
const transformArticle = (article: any, query: string = ''): NewsArticle => {
  const sentiment = analyzeSentiment((article.title || '') + ' ' + (article.description || ''));
  const keywords = extractKeywords((article.title || '') + ' ' + (article.description || ''));
  const aiScore = calculateAIScore(article, query);
  
  // Determine category based on content (simplified)
  const categorizeArticle = (title: string, description: string): string => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('technology') || text.includes('ai') || text.includes('tech') || text.includes('digital') || text.includes('software') || text.includes('computer')) return 'technology';
    if (text.includes('health') || text.includes('medical') || text.includes('medicine') || text.includes('hospital') || text.includes('doctor')) return 'health';
    if (text.includes('business') || text.includes('economy') || text.includes('market') || text.includes('finance') || text.includes('company')) return 'business';
    if (text.includes('science') || text.includes('research') || text.includes('study') || text.includes('discovery') || text.includes('experiment')) return 'science';
    if (text.includes('sports') || text.includes('game') || text.includes('player') || text.includes('team') || text.includes('match')) return 'sports';
    if (text.includes('entertainment') || text.includes('movie') || text.includes('music') || text.includes('celebrity') || text.includes('film')) return 'entertainment';
    
    return 'general';
  };
  
  const category = categorizeArticle(article.title || '', article.description || '');
  
  // Use article's own image or category-specific fallback
  let imageUrl = '';
  if (article.urlToImage && isValidImageUrl(article.urlToImage)) {
    imageUrl = article.urlToImage;
  } else if (article.image && isValidImageUrl(article.image)) {
    imageUrl = article.image;
  } else {
    imageUrl = getFallbackImage(category);
  }
  
  return {
    id: createUniqueId(article),
    title: article.title || 'No title available',
    description: article.description || 'No description available',
    content: article.content || article.description || 'Content not available',
    author: article.author || 'Unknown Author',
    source: article.source?.name || 'Unknown Source',
    publishedAt: article.publishedAt || new Date().toISOString(),
    url: article.url || '#',
    imageUrl,
    category,
    sentiment,
    aiScore,
    keywords
  };
};

// Remove duplicate articles based on multiple criteria
const removeDuplicates = (articles: NewsArticle[]): NewsArticle[] => {
  const seen = new Set<string>();
  const uniqueArticles: NewsArticle[] = [];
  
  for (const article of articles) {
    // Create multiple identifiers to catch duplicates
    const urlKey = article.url;
    const titleKey = article.title.toLowerCase().trim();
    const titleSourceKey = `${article.title.toLowerCase().trim()}_${article.source.toLowerCase()}`;
    
    // Check if we've seen this article before using any of the keys
    const isDuplicate = seen.has(urlKey) || 
                       seen.has(titleKey) || 
                       seen.has(titleSourceKey) ||
                       uniqueArticles.some(existing => 
                         existing.title.toLowerCase().trim() === titleKey ||
                         (existing.url === urlKey && urlKey !== '#')
                       );
    
    if (!isDuplicate) {
      seen.add(urlKey);
      seen.add(titleKey);
      seen.add(titleSourceKey);
      uniqueArticles.push(article);
    }
  }
  
  return uniqueArticles;
};

export const searchNews = async (query: string, category?: string, pageSize: number = 20): Promise<NewsArticle[]> => {
  if (!query.trim()) {
    throw new Error('Search query is required');
  }

  console.log(`Searching for: "${query}" with category: ${category || 'all'}`);

  try {
    let articles: NewsArticle[] = [];
    let apiUsed = 'none';
    
    // Try NewsAPI first if API key is available
    if (NEWS_API_KEY && NEWS_API_KEY.length > 10) {
      try {
        console.log('Trying NewsAPI...');
        const params: any = {
          q: query,
          apiKey: NEWS_API_KEY,
          language: 'en',
          sortBy: 'relevancy',
          pageSize: Math.min(pageSize * 2, 100) // Get more articles to filter duplicates
        };
        
        const response = await axios.get<NewsAPIResponse>(`${NEWS_API_BASE_URL}/everything`, { 
          params,
          timeout: 10000 // 10 second timeout
        });
        
        console.log('NewsAPI Response:', response.data.status, response.data.totalResults);
        
        if (response.data.status === 'ok' && response.data.articles && response.data.articles.length > 0) {
          const filteredArticles = response.data.articles
            .filter(article => 
              article.title && 
              article.description && 
              article.title !== '[Removed]' &&
              article.url &&
              article.source?.name &&
              !article.title.toLowerCase().includes('removed') &&
              article.title.length > 10 && // Ensure meaningful titles
              article.description.length > 20 // Ensure meaningful descriptions
            )
            .map(article => transformArticle(article, query));
          
          articles = removeDuplicates(filteredArticles);
          apiUsed = 'NewsAPI';
          console.log(`Found ${articles.length} unique articles from NewsAPI`);
        } else if (response.data.code) {
          console.warn('NewsAPI Error:', response.data.code, response.data.message);
        }
      } catch (newsApiError: any) {
        console.warn('NewsAPI failed:', newsApiError.response?.data || newsApiError.message);
      }
    } else {
      console.warn('NewsAPI key not configured or invalid');
    }
    
    // If NewsAPI didn't work or returned insufficient results, try GNews
    if (articles.length < 3 && GNEWS_API_KEY && GNEWS_API_KEY.length > 10) {
      try {
        console.log('Trying GNews API...');
        const params: any = {
          q: query,
          token: GNEWS_API_KEY,
          lang: 'en',
          max: Math.min(pageSize, 10)
        };
        
        if (category && category !== 'general') {
          params.category = category;
        }
        
        const response = await axios.get<GNewsAPIResponse>(`${GNEWS_API_BASE_URL}/search`, { 
          params,
          timeout: 10000 // 10 second timeout
        });
        
        console.log('GNews Response:', response.data.totalArticles);
        
        if (response.data.articles && response.data.articles.length > 0) {
          const gNewsArticles = response.data.articles
            .filter(article => 
              article.title && 
              article.description && 
              article.url &&
              article.source?.name &&
              article.title.length > 10 &&
              article.description.length > 20
            )
            .map(article => transformArticle(article, query));
          
          // Merge with existing articles and remove duplicates
          const combinedArticles = [...articles, ...gNewsArticles];
          articles = removeDuplicates(combinedArticles);
          
          if (apiUsed === 'none') apiUsed = 'GNews';
          else apiUsed += ' + GNews';
          
          console.log(`Total unique articles after GNews: ${articles.length}`);
        }
      } catch (gNewsError: any) {
        console.warn('GNews API failed:', gNewsError.response?.data || gNewsError.message);
      }
    } else if (!GNEWS_API_KEY || GNEWS_API_KEY.length <= 10) {
      console.warn('GNews API key not configured or invalid');
    }
    
    // If still insufficient results, try a broader search with NewsAPI
    if (articles.length < 3 && NEWS_API_KEY && NEWS_API_KEY.length > 10) {
      try {
        console.log('Trying broader search with NewsAPI...');
        const broadQuery = query.split(' ')[0]; // Use first word only
        const params: any = {
          q: broadQuery,
          apiKey: NEWS_API_KEY,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 30
        };
        
        const response = await axios.get<NewsAPIResponse>(`${NEWS_API_BASE_URL}/everything`, { 
          params,
          timeout: 10000
        });
        
        if (response.data.status === 'ok' && response.data.articles && response.data.articles.length > 0) {
          const broaderArticles = response.data.articles
            .filter(article => 
              article.title && 
              article.description && 
              article.title !== '[Removed]' &&
              article.url &&
              article.source?.name &&
              !article.title.toLowerCase().includes('removed') &&
              article.title.length > 10 &&
              article.description.length > 20
            )
            .map(article => transformArticle(article, query));
          
          // Merge and remove duplicates
          const combinedArticles = [...articles, ...broaderArticles];
          articles = removeDuplicates(combinedArticles);
          
          console.log(`Total unique articles after broader search: ${articles.length}`);
        }
      } catch (broadSearchError) {
        console.warn('Broader search failed:', broadSearchError);
      }
    }
    
    // Apply category filter if specified
    if (category && category !== 'general') {
      const filteredByCategory = articles.filter(article => article.category === category);
      if (filteredByCategory.length >= 3) {
        articles = filteredByCategory;
      }
    }
    
    // Sort by AI score (relevance) and recency
    articles.sort((a, b) => {
      const scoreA = b.aiScore - a.aiScore;
      if (Math.abs(scoreA) < 0.1) {
        // If scores are similar, prefer more recent articles
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return scoreA;
    });
    
    // Limit results
    articles = articles.slice(0, pageSize);
    
    console.log(`Final result: ${articles.length} unique articles using ${apiUsed}`);
    
    if (articles.length === 0) {
      throw new Error('No articles found. Please check your API keys and internet connection.');
    }
    
    if (articles.length < 3) {
      throw new Error(`Only found ${articles.length} articles. Try a different search term or check your API configuration.`);
    }
    
    return articles;
    
  } catch (error: any) {
    console.error('Error fetching news:', error);
    
    // Provide specific error messages
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your news API configuration.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    if (error.message.includes('timeout')) {
      throw new Error('Request timeout. Please try again.');
    }
    
    // Re-throw our custom errors
    if (error.message.includes('No articles found') || error.message.includes('Only found')) {
      throw error;
    }
    
    throw new Error('Failed to fetch live news articles. Please check your internet connection and API keys.');
  }
};

export const getTopHeadlines = async (category?: string, country: string = 'us', pageSize: number = 20): Promise<NewsArticle[]> => {
  try {
    let articles: NewsArticle[] = [];
    
    if (NEWS_API_KEY && NEWS_API_KEY.length > 10) {
      const params: any = {
        apiKey: NEWS_API_KEY,
        country,
        pageSize: Math.min(pageSize * 2, 100)
      };
      
      if (category && category !== 'general') {
        params.category = category;
      }
      
      const response = await axios.get<NewsAPIResponse>(`${NEWS_API_BASE_URL}/top-headlines`, { 
        params,
        timeout: 10000
      });
      
      if (response.data.status === 'ok' && response.data.articles && response.data.articles.length > 0) {
        const filteredArticles = response.data.articles
          .filter(article => 
            article.title && 
            article.description && 
            article.title !== '[Removed]' &&
            article.url &&
            article.source?.name &&
            article.title.length > 10 &&
            article.description.length > 20
          )
          .map(article => transformArticle(article, ''));
        
        articles = removeDuplicates(filteredArticles);
      }
    }
    
    // Apply category filter if specified
    if (category && category !== 'general') {
      const filteredByCategory = articles.filter(article => article.category === category);
      if (filteredByCategory.length > 0) {
        return filteredByCategory.slice(0, pageSize);
      }
    }
    
    return articles.slice(0, pageSize);
    
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw new Error('Failed to fetch top headlines. Please check your API configuration.');
  }
};