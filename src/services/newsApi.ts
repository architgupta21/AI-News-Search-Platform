import axios from 'axios';
import { NewsArticle } from '../types';

// ============================================================================
// 1. HELPER FUNCTIONS (Preserved exactly from your original code)
//    These functions handle Sentiment, AI Scores, Images, and Keywords.
// ============================================================================

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

// Sentiment analysis simulation
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

// Extract keywords from text
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
  
  // Determine category based on content
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
    const urlKey = article.url;
    const titleKey = article.title.toLowerCase().trim();
    const titleSourceKey = `${article.title.toLowerCase().trim()}_${article.source.toLowerCase()}`;
    
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

// ============================================================================
// 2. MAIN API FETCHING FUNCTIONS (Updated for Vercel)
//    These functions now call your Vercel Proxy (/api/news) instead of NewsAPI
// ============================================================================

export const searchNews = async (query: string, category?: string, pageSize: number = 20): Promise<NewsArticle[]> => {
  if (!query.trim()) {
    throw new Error('Search query is required');
  }

  // Debug logging
  console.log(`Searching for: "${query}" via Vercel Proxy`);

  try {
    // -----------------------------------------------------------
    // CHANGE: We call our local Vercel API endpoint (/api/news)
    // This hides the API key from the browser and bypasses CORS.
    // -----------------------------------------------------------
    const response = await axios.get('/api/news', {
      params: { 
        q: query,
        pageSize: pageSize 
      },
      timeout: 15000 // 15 seconds timeout
    });
    
    // Check if the proxy returned data successfully
    if (response.data && response.data.articles && response.data.articles.length > 0) {
      
      // 1. Transform Raw Data to your App's format
      let articles = response.data.articles
        .filter((article: any) => 
          article.title && 
          article.description && 
          article.title !== '[Removed]' &&
          !article.title.toLowerCase().includes('removed')
        )
        .map((article: any) => transformArticle(article, query));
      
      // 2. Filter by Category (if needed)
      if (category && category !== 'general' && category !== 'all') {
        const filtered = articles.filter((a: NewsArticle) => a.category === category);
        if (filtered.length >= 2) {
           articles = filtered;
        }
      }

      // 3. Remove Duplicates & Sort
      articles = removeDuplicates(articles);
      
      // Sort: High AI Score first, then Newest first
      articles.sort((a, b) => {
        const scoreA = b.aiScore - a.aiScore;
        if (Math.abs(scoreA) < 0.1) {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        return scoreA;
      });

      return articles.slice(0, pageSize);
    }
    
    throw new Error('No articles found matching your criteria.');

  } catch (error: any) {
    console.error('Error fetching news:', error);
    
    // Handle Vercel/Server Errors
    if (error.response?.status === 500) {
       throw new Error('Server Error: Please check API Keys in Vercel Settings.');
    }
    
    if (error.message.includes('Network Error')) {
      throw new Error('Network error. Please check your internet connection.');
    }

    throw new Error('Failed to fetch news. Please try again later.');
  }
};

export const getTopHeadlines = async (category?: string, country: string = 'us', pageSize: number = 20): Promise<NewsArticle[]> => {
  // We reuse searchNews to keep the proxy simple.
  // If a category is provided, we search for that category name.
  // Otherwise we search for "latest technology news".
  const searchTerm = (category && category !== 'general') ? category : 'latest technology news';
  return searchNews(searchTerm, category, pageSize);
};
