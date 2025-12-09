// api/news.js
export default async function handler(request, response) {
  // 1. Get query parameters from the frontend request
  const { q, pageSize } = request.query;
  const searchQuery = q || 'technology';
  const size = pageSize || 20;

  // 2. Get API Key from Vercel Environment Variables
  // Note: We use the same name you already added in Vercel settings
  const apiKey = process.env.VITE_NEWS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: "API Key is missing in Vercel Settings" });
  }

  try {
    // 3. Fetch data from NewsAPI (Server-side request)
    const url = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}&pageSize=${size}&language=en&sortBy=relevancy`;
    
    const apiRes = await fetch(url);
    const data = await apiRes.json();

    if (data.status === 'error') {
      return response.status(500).json({ error: data.message });
    }

    // 4. Send the raw data back to your frontend
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: "Failed to fetch news data" });
  }
}
