import { useState, useCallback } from 'react';
import { NewsArticle, SearchFilters } from '../types';
import { searchNews, getTopHeadlines } from '../services/newsApi';

export const useNewsSearch = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchArticles = useCallback(async (filters: SearchFilters) => {
    if (!filters.query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let results: NewsArticle[] = [];
      
      // Search for specific query
      results = await searchNews(
        filters.query,
        filters.category || undefined,
        20
      );

      // Apply additional filters
      if (filters.sentiment) {
        results = results.filter(article => article.sentiment === filters.sentiment);
      }

      if (filters.dateRange) {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            filterDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        results = results.filter(article => 
          new Date(article.publishedAt) >= filterDate
        );
      }

      // Sort results
      if (filters.sortBy === 'date') {
        results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      } else if (filters.sortBy === 'relevance') {
        results.sort((a, b) => b.aiScore - a.aiScore);
      } else if (filters.sortBy === 'popularity') {
        // Sort by AI score as a proxy for popularity
        results.sort((a, b) => b.aiScore - a.aiScore);
      }

      // Ensure minimum 3 results
      if (results.length < 3) {
        throw new Error('Insufficient results found. Please try a different search term or check your API configuration.');
      }

      setArticles(results);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch news articles. Please try again.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    articles,
    loading,
    error,
    searchArticles
  };
};