# AI News Search Platform

A modern, AI-powered news discovery application built with React, TypeScript, and Tailwind CSS. This platform leverages advanced search capabilities to find, analyze, and share the most relevant news articles with intelligent sentiment analysis and semantic search.

## 🚀 Features

- **AI-Powered Search**: Semantic search with context understanding
- **Live News**: Real-time articles from multiple news sources
- **Sentiment Analysis**: Automatic sentiment detection for articles
- **Smart Categorization**: AI-based article categorization
- **Relevance Scoring**: AI-driven relevance scoring for search results
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Multiple News Sources**: Integration with NewsAPI and GNews
- **Advanced Filters**: Filter by category, date, sentiment, and more

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Animations**: Framer Motion

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-news-search-platform.git
cd ai-news-search-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your API keys to the `.env` file:
```env
# Get your free API key from https://newsapi.org/
VITE_NEWS_API_KEY=your_newsapi_key_here

# Get your free API key from https://gnews.io/
VITE_GNEWS_API_KEY=your_gnews_key_here
```

5. Start the development server:
```bash
npm run dev
```

## 🔑 API Keys Setup

### NewsAPI
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### GNews API
1. Visit [GNews.io](https://gnews.io/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

## 🚀 Deployment

The application is configured for easy deployment on various platforms:

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header
│   ├── SearchBar.tsx   # Search interface
│   ├── SearchResults.tsx # Results display
│   ├── ArticleCard.tsx # Individual article cards
│   └── IntegrationPanel.tsx # Integration settings
├── hooks/              # Custom React hooks
│   └── useNewsSearch.ts # News search logic
├── services/           # API services
│   └── newsApi.ts      # News API integration
├── types/              # TypeScript type definitions
│   └── index.ts        # Type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎯 Usage

1. **Search**: Enter any topic in the search bar
2. **Filter**: Use advanced filters to refine results
3. **Analyze**: View AI-generated sentiment and relevance scores
4. **Read**: Click "Read Full" to view complete articles
5. **Share**: Use sharing features for team collaboration

## 🤖 AI Features

- **Semantic Search**: Understanding context beyond keywords
- **Sentiment Analysis**: Automatic positive/negative/neutral classification
- **Relevance Scoring**: AI-calculated relevance percentages
- **Smart Categorization**: Automatic article categorization
- **Keyword Extraction**: Important terms identification

## 🔧 Configuration

The application supports various configuration options through environment variables:

- `VITE_NEWS_API_KEY`: NewsAPI key for news fetching
- `VITE_GNEWS_API_KEY`: GNews API key for additional sources

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org/) for news data
- [GNews](https://gnews.io/) for additional news sources
- [Pexels](https://pexels.com/) for fallback images
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Live Demo**: [https://chic-pavlova-572f5a.netlify.app](https://chic-pavlova-572f5a.netlify.app)