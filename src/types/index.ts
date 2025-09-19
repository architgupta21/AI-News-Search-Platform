export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  aiScore: number;
  keywords: string[];
}

export interface SearchFilters {
  query: string;
  category: string;
  source: string;
  dateRange: string;
  sentiment: string;
  sortBy: string;
}

export interface IBMCloudConfig {
  apiKey: string;
  serviceUrl: string;
  version: string;
}

export interface SlackConfig {
  botToken: string;
  channelId: string;
  enabled: boolean;
}